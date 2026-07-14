#!/usr/bin/env python3
"""Validation du contenu pédagogique MyLittleQuest.

Vérifie, pour chaque dossier de certification sous content/ :
  - JSON valide et schéma respecté par format (voir CLAUDE.md §3)
  - intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant,
    0 concept sans asset, 0 id d'asset dupliqué, 0 id de concept dupliqué,
    1 mapping par asset au maximum (pas de mapping dupliqué)

Sortie : code retour 0 si tout est valide, 1 sinon (avec la liste des erreurs).
Destiné à tourner en local avant une PR et dans la GitHub Action
`.github/workflows/validate-content.yml`.

En plus de la validation (qui seule pilote le code retour), le script imprime
un **rapport de couverture** informatif par certification : concepts et assets
par domaine, répartition des formats, répartition des difficultés (globale et
croisée domaine × difficulté), et concepts à couverture faible. Ce rapport
n'échoue jamais le build — il sert à objectiver le choix des prochaines
missions de génération (quels domaines / difficultés / formats sont
sous-couverts). Utiliser `--no-report` pour le supprimer (sortie CI concise).
"""
import glob
import json
import os
import sys
from collections import Counter, defaultdict

CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "content")
GAME_TYPES = ["qcm", "flashcard", "scenario", "swipe", "match"]

# Seuil informatif de couverture : un concept avec moins d'assets que ce seuil
# est signalé dans le rapport comme candidat prioritaire pour une génération
# future. Purement indicatif — n'échoue jamais la validation.
THIN_COVERAGE_THRESHOLD = 2

DIFFICULTY_LABELS = {1: "facile", 2: "moyen", 3: "avancé"}


def _err(errors, cert, msg):
    errors.append(f"[{cert}] {msg}")


def validate_concept(cert, c, errors):
    cid = c.get("id", "<sans id>")
    for field in ("id", "domain", "title", "core_explanation", "difficulty", "source_url", "generated_at"):
        if field not in c:
            _err(errors, cert, f"concept {cid}: champ manquant '{field}'")
    if "source_url" in c:
        url = c["source_url"]
        if not isinstance(url, str) or not url.startswith("http"):
            _err(errors, cert, f"concept {cid}: source_url invalide")
    if "difficulty" in c and not isinstance(c["difficulty"], int):
        _err(errors, cert, f"concept {cid}: difficulty doit être un entier")


def validate_asset(cert, a, game_type, errors):
    aid = a.get("id", "<sans id>")
    for field in ("id", "game_type", "difficulty", "payload"):
        if field not in a:
            _err(errors, cert, f"asset {aid}: champ manquant '{field}'")
    if a.get("game_type") != game_type:
        _err(errors, cert, f"asset {aid}: game_type '{a.get('game_type')}' != fichier '{game_type}'")
    p = a.get("payload", {})
    if game_type == "qcm":
        choices = p.get("choices", [])
        if not isinstance(choices, list) or len(choices) < 2:
            _err(errors, cert, f"asset {aid}: qcm doit avoir >= 2 choices")
        ci = p.get("correct_index")
        if not isinstance(ci, int) or not (0 <= ci < len(choices)):
            _err(errors, cert, f"asset {aid}: qcm correct_index hors bornes")
        for k in ("question", "explanation"):
            if not p.get(k):
                _err(errors, cert, f"asset {aid}: qcm champ '{k}' manquant/vide")
    elif game_type == "flashcard":
        for k in ("front", "back"):
            if not p.get(k):
                _err(errors, cert, f"asset {aid}: flashcard champ '{k}' manquant/vide")
    elif game_type == "swipe":
        if not isinstance(p.get("is_true"), bool):
            _err(errors, cert, f"asset {aid}: swipe is_true doit être un booléen")
        for k in ("statement", "explanation"):
            if not p.get(k):
                _err(errors, cert, f"asset {aid}: swipe champ '{k}' manquant/vide")
    elif game_type == "scenario":
        choices = p.get("choices", [])
        if not p.get("intro"):
            _err(errors, cert, f"asset {aid}: scenario intro manquant/vide")
        if not isinstance(choices, list) or len(choices) < 2:
            _err(errors, cert, f"asset {aid}: scenario doit avoir >= 2 choices")
        n_correct = sum(1 for ch in choices if ch.get("is_correct") is True)
        if n_correct != 1:
            _err(errors, cert, f"asset {aid}: scenario doit avoir exactement 1 choix correct (trouvé {n_correct})")
        for ch in choices:
            if not ch.get("text") or not ch.get("feedback"):
                _err(errors, cert, f"asset {aid}: scenario choix incomplet (text/feedback)")
    elif game_type == "match":
        pairs = p.get("pairs", [])
        if not isinstance(pairs, list) or len(pairs) < 2:
            _err(errors, cert, f"asset {aid}: match doit avoir >= 2 paires")
        for pr in pairs:
            if not pr.get("left") or not pr.get("right"):
                _err(errors, cert, f"asset {aid}: match paire incomplète (left/right)")


def _bar(count, total, width=24):
    """Petite barre ASCII proportionnelle, pour lisibilité du rapport."""
    if total <= 0:
        return ""
    filled = int(round(width * count / total))
    return "█" * filled + "·" * (width - filled)


def print_coverage_report(cert, concepts, asset_meta, mappings):
    """Imprime un rapport de couverture informatif (n'échoue jamais le build).

    - concepts   : liste des concepts (dicts) du dossier.
    - asset_meta : {asset_id: {"game_type": str, "difficulty": int|autre}}.
    - mappings   : liste des mappings asset_id <-> concept_ids.
    """
    concept_domain = {c.get("id"): c.get("domain", "<sans domaine>") for c in concepts}

    # Nombre d'assets rattachés à chaque concept (via les mappings).
    assets_per_concept = Counter()
    # Assets distincts touchant chaque domaine (un asset multi-concepts peut
    # compter pour plusieurs domaines — dédupliqué par (domaine)).
    assets_by_domain = defaultdict(set)
    # Assets par (domaine, difficulté), dédupliqués par asset.
    diff_by_domain = defaultdict(lambda: Counter())
    for m in mappings:
        aid = m.get("asset_id")
        meta = asset_meta.get(aid, {})
        diff = meta.get("difficulty")
        domains_hit = set()
        for cid in m.get("concept_ids", []):
            assets_per_concept[cid] += 1
            dom = concept_domain.get(cid)
            if dom is not None:
                domains_hit.add(dom)
        for dom in domains_hit:
            assets_by_domain[dom].add(aid)
            if isinstance(diff, int):
                diff_by_domain[dom][diff] += 1

    concepts_by_domain = Counter(concept_domain.get(c.get("id")) for c in concepts)
    fmt_dist = Counter(meta.get("game_type") for meta in asset_meta.values())
    diff_dist = Counter(
        meta.get("difficulty")
        for meta in asset_meta.values()
        if isinstance(meta.get("difficulty"), int)
    )

    domains = sorted(concepts_by_domain)
    total_assets = len(asset_meta)
    label_w = max((len(d) for d in domains), default=10)

    print(f"\n── Rapport de couverture : {cert} ──")

    print("\nConcepts par domaine :")
    for dom in domains:
        n = concepts_by_domain[dom]
        print(f"  {dom:<{label_w}}  {n:>3}")

    print("\nAssets par domaine (un asset multi-concepts compte pour chaque domaine touché) :")
    for dom in domains:
        n = len(assets_by_domain.get(dom, ()))
        print(f"  {dom:<{label_w}}  {n:>3}  {_bar(n, total_assets)}")

    print("\nRépartition des assets par format :")
    for gt in GAME_TYPES:
        n = fmt_dist.get(gt, 0)
        print(f"  {gt:<10}  {n:>3}  {_bar(n, total_assets)}")

    print("\nRépartition des assets par difficulté :")
    for d in sorted(diff_dist):
        n = diff_dist[d]
        lbl = DIFFICULTY_LABELS.get(d, "?")
        print(f"  {d} ({lbl:<7})  {n:>3}  {_bar(n, total_assets)}")

    print("\nRépartition difficulté × domaine (assets) :")
    all_diffs = sorted(diff_dist)
    for dom in domains:
        cells = "  ".join(f"d{d}:{diff_by_domain[dom].get(d, 0):>3}" for d in all_diffs)
        print(f"  {dom:<{label_w}}  {cells}")

    thin = sorted(
        (assets_per_concept.get(c.get("id"), 0), c.get("id"), concept_domain.get(c.get("id")))
        for c in concepts
        if assets_per_concept.get(c.get("id"), 0) < THIN_COVERAGE_THRESHOLD
    )
    print(
        f"\nConcepts à couverture faible (< {THIN_COVERAGE_THRESHOLD} assets) : "
        f"{len(thin)}"
    )
    for count, cid, dom in thin:
        print(f"  - {cid} [{dom}] : {count} asset(s)")


def validate_cert(cert_dir, errors, report=True):
    cert = os.path.basename(cert_dir.rstrip("/"))

    # concepts
    concepts = json.load(open(os.path.join(cert_dir, "concepts.json"), encoding="utf-8"))
    concept_ids = set()
    for c in concepts:
        validate_concept(cert, c, errors)
        cid = c.get("id")
        if cid in concept_ids:
            _err(errors, cert, f"concept id dupliqué: {cid}")
        concept_ids.add(cid)

    # assets
    asset_ids = set()
    asset_meta = {}
    for game_type in GAME_TYPES:
        path = os.path.join(cert_dir, "assets", f"{game_type}.json")
        if not os.path.exists(path):
            continue
        for a in json.load(open(path, encoding="utf-8")):
            validate_asset(cert, a, game_type, errors)
            aid = a.get("id")
            if aid in asset_ids:
                _err(errors, cert, f"asset id dupliqué: {aid}")
            asset_ids.add(aid)
            asset_meta[aid] = {"game_type": game_type, "difficulty": a.get("difficulty")}

    # mappings + intégrité référentielle
    mappings = json.load(open(os.path.join(cert_dir, "asset_concepts.json"), encoding="utf-8"))
    mapped_assets = set()
    concepts_with_asset = set()
    for m in mappings:
        aid = m.get("asset_id")
        if aid in mapped_assets:
            _err(errors, cert, f"mapping dupliqué pour asset: {aid}")
        mapped_assets.add(aid)
        if aid not in asset_ids:
            _err(errors, cert, f"mapping référence un asset inexistant: {aid}")
        for cid in m.get("concept_ids", []):
            if cid not in concept_ids:
                _err(errors, cert, f"mapping {aid} référence un concept inexistant: {cid}")
            concepts_with_asset.add(cid)

    orphan_assets = asset_ids - mapped_assets
    if orphan_assets:
        _err(errors, cert, f"assets orphelins (sans mapping): {sorted(orphan_assets)}")
    concepts_without_asset = concept_ids - concepts_with_asset
    if concepts_without_asset:
        _err(errors, cert, f"concepts sans aucun asset: {sorted(concepts_without_asset)}")

    print(f"[{cert}] {len(concept_ids)} concepts, {len(asset_ids)} assets, {len(mappings)} mappings")

    if report:
        print_coverage_report(cert, concepts, asset_meta, mappings)


def main():
    report = "--no-report" not in sys.argv[1:]
    errors = []
    cert_dirs = sorted(
        d for d in glob.glob(os.path.join(CONTENT_DIR, "*")) if os.path.isdir(d)
    )
    if not cert_dirs:
        print("Aucun dossier de certification trouvé sous content/", file=sys.stderr)
        return 1
    for cert_dir in cert_dirs:
        try:
            validate_cert(cert_dir, errors, report=report)
        except Exception as exc:  # noqa: BLE001
            errors.append(f"[{os.path.basename(cert_dir)}] exception: {exc}")

    if errors:
        print(f"\n❌ {len(errors)} erreur(s) de validation :")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("\n✅ Validation OK : schéma et intégrité référentielle respectés.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
