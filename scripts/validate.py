#!/usr/bin/env python3
"""Validation du contenu pédagogique MyLittleQuest.

Vérifie, pour chaque dossier de certification sous content/ :
  - JSON valide et schéma respecté par format (voir CLAUDE.md §3)
  - intégrité référentielle : 0 asset orphelin, 0 concept_id inexistant,
    0 concept sans asset, 0 id d'asset dupliqué, 0 id de concept dupliqué,
    1 mapping par asset au maximum (pas de mapping dupliqué)

Sortie : code retour 0 si tout est valide, 1 sinon (avec la liste des erreurs).
Destiné à tourner en local avant une PR et, à terme, dans une GitHub Action.
"""
import glob
import json
import os
import sys

CONTENT_DIR = os.path.join(os.path.dirname(__file__), "..", "content")
GAME_TYPES = ["qcm", "flashcard", "scenario", "swipe", "match"]


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


def validate_cert(cert_dir, errors):
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


def main():
    errors = []
    cert_dirs = sorted(
        d for d in glob.glob(os.path.join(CONTENT_DIR, "*")) if os.path.isdir(d)
    )
    if not cert_dirs:
        print("Aucun dossier de certification trouvé sous content/", file=sys.stderr)
        return 1
    for cert_dir in cert_dirs:
        try:
            validate_cert(cert_dir, errors)
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
