#!/usr/bin/env python3
"""Fusion sûre des PR de contenu « append-only » de MyLittleQuest.

## Pourquoi ce script

Le pipeline de génération nocturne produit chaque nuit une PR qui **ajoute** des
éléments à la fin des mêmes tableaux JSON (`concepts.json`, `assets/*.json`,
`asset_concepts.json`). Quand plusieurs de ces PR restent ouvertes en parallèle
et que `main` avance entre-temps, Git ne sait plus que les deux côtés n'ont fait
qu'ajouter : il signale un **conflit sur *tous* les fichiers de contenu**, même
si aucune ligne existante n'a été modifiée. L'interface web GitHub ne peut alors
pas fusionner en un clic, et une résolution manuelle risque de dupliquer ou de
perdre des éléments.

Ce script résout ce cas précis de façon déterministe : pour chaque fichier de
contenu, il calcule l'**union par identifiant** de la base et de la (des)
branche(s) de PR. La sémantique « append-only » garantit que cette union est la
bonne résolution : on garde tous les éléments uniques des deux côtés.

Sécurité :
  - Un même `id` présent des deux côtés **avec un contenu différent** est une
    vraie collision → le script s'arrête sans rien écrire (code retour 2).
  - Un même `id` présent des deux côtés **avec un contenu identique** (rare, ex.
    un asset produit deux fois à l'identique) est dédupliqué sans erreur.
  - En cas de collision, AUCUN fichier n'est modifié (résolution atomique).

Ce script **n'engage (`commit`) ni ne pousse (`push`) rien** et ne merge aucune
PR : il prépare l'arbre de travail, à charge de l'humain de relire, committer et
merger. Il ne remplace pas la revue — il supprime seulement la friction
mécanique du conflit d'append.

## Usage typique (résorber le backlog de PR de contenu)

    git fetch origin
    git checkout -B integration origin/main
    python3 scripts/merge_content_pr.py \
        origin/claude/content-aws-clf-c02-domain-3-lot-c \
        origin/claude/loving-curie-d74pqn
    python3 scripts/validate.py          # vérifie le résultat combiné
    # relire le diff, puis committer / ouvrir la PR d'intégration

Options :
  --base <ref>   Référence de base à réinitialiser avant l'union (ex. origin/main).
                 Si omis, l'union part de l'arbre de travail courant (permet
                 d'empiler plusieurs appels).
  --check        N'écrit rien : rapporte seulement ce que l'union produirait et
                 les collisions éventuelles. Code retour 2 si collision.
  --no-validate  N'exécute pas `validate.py` à la fin (par défaut il est lancé
                 quand des fichiers ont été écrits).

Les branches sont unies dans l'ordre donné (utile pour respecter l'ordre de
production des PR).
"""
import argparse
import glob
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
CONTENT_DIR = os.path.join(REPO, "content")
GAME_TYPES = ["qcm", "flashcard", "scenario", "swipe", "match"]


def content_files():
    """Liste (chemin_relatif_repo, clé_d_unicité) des fichiers de contenu de
    chaque dossier de certification présent sous content/."""
    files = []
    for cert_dir in sorted(glob.glob(os.path.join(CONTENT_DIR, "*"))):
        if not os.path.isdir(cert_dir):
            continue
        rel = os.path.relpath(cert_dir, REPO)
        if os.path.exists(os.path.join(cert_dir, "concepts.json")):
            files.append((f"{rel}/concepts.json", "id"))
        if os.path.exists(os.path.join(cert_dir, "asset_concepts.json")):
            files.append((f"{rel}/asset_concepts.json", "asset_id"))
        for gt in GAME_TYPES:
            p = os.path.join(cert_dir, "assets", f"{gt}.json")
            if os.path.exists(p):
                files.append((f"{rel}/assets/{gt}.json", "id"))
    return files


def load_worktree(relpath):
    p = os.path.join(REPO, relpath)
    if not os.path.exists(p):
        return []
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def load_ref(ref, relpath):
    """Charge relpath depuis une réf Git ; [] si le fichier n'existe pas sur la réf."""
    try:
        out = subprocess.check_output(
            ["git", "show", f"{ref}:{relpath}"], cwd=REPO, text=True,
            stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        return []
    return json.loads(out)


def canonical(item):
    return json.dumps(item, sort_keys=True, ensure_ascii=False)


def union(base_items, new_items, key):
    """Union par clé. Retourne (liste_fusionnée, nb_ajouts, liste_collisions)."""
    by_key = {}
    order = []
    for it in base_items:
        by_key[it[key]] = it
        order.append(it[key])
    added = 0
    collisions = []
    for it in new_items:
        k = it[key]
        if k in by_key:
            if canonical(by_key[k]) != canonical(it):
                collisions.append(k)
        else:
            by_key[k] = it
            order.append(k)
            added += 1
    return [by_key[k] for k in order], added, collisions


def main():
    ap = argparse.ArgumentParser(description="Fusion sûre des PR de contenu append-only.")
    ap.add_argument("branches", nargs="+", help="Réfs de branche de PR à unir (dans l'ordre).")
    ap.add_argument("--base", help="Réf de base à recharger avant l'union (ex. origin/main).")
    ap.add_argument("--check", action="store_true", help="Ne rien écrire, rapporter seulement.")
    ap.add_argument("--no-validate", action="store_true", help="Ne pas lancer validate.py.")
    args = ap.parse_args()

    files = content_files()
    # État de départ : la base demandée, sinon l'arbre de travail courant.
    state = {}
    for relpath, key in files:
        state[relpath] = load_ref(args.base, relpath) if args.base else load_worktree(relpath)

    all_collisions = {}
    added_by_branch = {}
    for branch in args.branches:
        added_by_branch[branch] = 0
        for relpath, key in files:
            new_items = load_ref(branch, relpath)
            merged, added, collisions = union(state[relpath], new_items, key)
            state[relpath] = merged
            added_by_branch[branch] += added
            if collisions:
                all_collisions.setdefault(relpath, []).extend(
                    f"{c} (via {branch})" for c in collisions
                )

    # Rapport
    print("Fichiers de contenu :", len(files))
    for branch in args.branches:
        print(f"  + {branch}: {added_by_branch[branch]} nouveaux éléments")
    for relpath, key in files:
        print(f"  {relpath:52} -> {len(state[relpath]):4} éléments")

    if all_collisions:
        print("\n⚠️  COLLISIONS D'ID À CONTENU DIVERGENT — aucune écriture effectuée :")
        for relpath, cs in all_collisions.items():
            for c in cs:
                print(f"    - {relpath}: id={c}")
        print("\nRésolvez ces collisions à la main (les deux côtés ont modifié le même id).")
        return 2

    if args.check:
        print("\n[--check] Union sûre (aucune collision divergente). Rien écrit.")
        return 0

    for relpath, key in files:
        p = os.path.join(REPO, relpath)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(state[relpath], f, ensure_ascii=False, indent=2)
            f.write("\n")
    print("\n✅ Union écrite dans l'arbre de travail (non committée).")

    if not args.no_validate:
        print("\n── validate.py ──")
        rc = subprocess.call([sys.executable, os.path.join(HERE, "validate.py"), "--no-report"], cwd=REPO)
        if rc != 0:
            print("\n⚠️  validate.py a échoué sur le résultat fusionné — à investiguer.")
            return rc
    return 0


if __name__ == "__main__":
    sys.exit(main())
