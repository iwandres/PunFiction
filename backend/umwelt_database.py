"""
UMWELT: Animal Optics — MongoDB Atlas + GridFS Persistence Layer (with Local Fallback)
Stores generated photorealistic wildlife plates, 4-channel BioDepth maps, grounded
semantic coordinates, Researcher Journals, and global ecological discovery telemetry.
"""
import json
import os
import re
import threading
import time
from datetime import datetime, timezone

try:
    from pymongo import MongoClient, ASCENDING
    import gridfs
    from bson import ObjectId
except ImportError:
    MongoClient = None
    gridfs = None
    ObjectId = None
    ASCENDING = 1

try:
    from backend import umwelt_data
except ImportError:
    import umwelt_data

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
LOCAL_CACHE_DIR = os.path.join(DIR_PATH, ".umwelt_local_cache")
LOCAL_PLATES_META = os.path.join(LOCAL_CACHE_DIR, "plates_meta.json")
LOCAL_JOURNALS_FILE = os.path.join(LOCAL_CACHE_DIR, "journals.json")
LOCAL_STATS_FILE = os.path.join(LOCAL_CACHE_DIR, "stats.json")

_lock = threading.Lock()
_rate_buckets = {}

_client = None
_db = None
_fs = None
_plates_col = None
_journals_col = None
_mysteries_col = None
_stats_col = None
_mongo_ready = False
_indexes_ensured = False


def _init_mongo():
    global _client, _db, _fs, _plates_col, _journals_col, _mysteries_col, _stats_col, _mongo_ready
    mongo_uri = os.environ.get("MONGO_URI") or os.environ.get("MONGODB_URI")
    if not (MongoClient and gridfs and mongo_uri):
        return
    try:
        _client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        _db = _client["umwelt_db"]
        _fs = gridfs.GridFS(_db, collection="plate_buckets")
        _plates_col = _db["plates"]
        _journals_col = _db["journals"]
        _mysteries_col = _db["mysteries"]
        _stats_col = _db["stats"]
        _mongo_ready = True
    except Exception as exc:
        print(f"[Umwelt DB] MongoDB init deferred/offline ({exc}). Using local cache fallback.")
        _mongo_ready = False


_init_mongo()


def _ensure_indexes_and_seed():
    global _indexes_ensured, _mongo_ready
    if _indexes_ensured or not _mongo_ready or _plates_col is None:
        return
    try:
        _plates_col.create_index([("plateKey", ASCENDING)], unique=True, background=True)
        _journals_col.create_index([("clientUuid", ASCENDING)], unique=True, background=True)
        _mysteries_col.create_index([("mysteryId", ASCENDING)], unique=True, background=True)
        _stats_col.create_index([("statKey", ASCENDING)], unique=True, background=True)

        # Seed canonical mysteries idempotently
        for m in umwelt_data.MYSTERIES:
            _mysteries_col.update_one(
                {"mysteryId": m["mysteryId"]},
                {"$set": m},
                upsert=True,
            )
        _indexes_ensured = True
    except Exception as exc:
        print(f"[Umwelt DB] MongoDB unreachable during index/seed ({exc}); falling back to local cache.")
        _mongo_ready = False


def is_mongo_connected():
    if not _mongo_ready:
        return False
    _ensure_indexes_and_seed()
    return _mongo_ready


def sanitize_plate_key(biome_id, species_slug, lighting_preset, version=1):
    raw = f"{biome_id}_{species_slug}_{lighting_preset}_v{version}"
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", raw)


def check_rate_limit(client_ip, bucket_name="resolve", max_per_minute=18):
    now = time.time()
    key = f"{bucket_name}:{client_ip or 'anon'}"
    with _lock:
        entries = [ts for ts in _rate_buckets.get(key, []) if ts > now - 60.0]
        if len(entries) >= max_per_minute:
            _rate_buckets[key] = entries
            return False
        entries.append(now)
        _rate_buckets[key] = entries
        return True


def _ensure_local_dir():
    os.makedirs(LOCAL_CACHE_DIR, exist_ok=True)


def _read_local_json(path, default):
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception:
        return default


def _write_local_json(path, data):
    _ensure_local_dir()
    try:
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
    except Exception as exc:
        print(f"[Umwelt DB] Local JSON write warning ({path}): {exc}")


# ---------------- PLATES & GRIDFS ----------------

def count_cached_plates():
    if is_mongo_connected() and _plates_col is not None:
        try:
            return int(_plates_col.count_documents({}))
        except Exception:
            pass
    meta = _read_local_json(LOCAL_PLATES_META, {})
    return len(meta)


def get_plate_metadata(plate_key):
    if is_mongo_connected() and _plates_col is not None:
        try:
            doc = _plates_col.find_one({"plateKey": plate_key})
            if doc:
                return _serialize_plate_doc(doc)
        except Exception as exc:
            print(f"[Umwelt DB] Plate lookup fallback ({exc})")

    meta = _read_local_json(LOCAL_PLATES_META, {})
    return meta.get(plate_key)


def _serialize_plate_doc(doc):
    out = dict(doc)
    out.pop("_id", None)
    if "rgbGridFsId" in out and out["rgbGridFsId"] is not None:
        out["rgbGridFsId"] = str(out["rgbGridFsId"])
    if "bioGridFsId" in out and out["bioGridFsId"] is not None:
        out["bioGridFsId"] = str(out["bioGridFsId"])
    if isinstance(out.get("createdAt"), datetime):
        out["createdAt"] = out["createdAt"].isoformat()
    return out


def save_plate_asset(
    plate_key,
    biome_id,
    species_slug,
    lighting_preset,
    rgb_bytes,
    bio_bytes,
    semantics,
    generation_ms=0,
    prompt_version=1,
):
    now_dt = datetime.now(timezone.utc)
    if is_mongo_connected() and _plates_col is not None and _fs is not None:
        try:
            existing = _plates_col.find_one({"plateKey": plate_key})
            rgb_id = _fs.put(
                rgb_bytes,
                filename=f"{plate_key}_rgb.webp",
                content_type="image/webp",
            )
            bio_id = _fs.put(
                bio_bytes,
                filename=f"{plate_key}_bio.png",
                content_type="image/png",
            )
            doc = {
                "plateKey": plate_key,
                "biomeId": biome_id,
                "speciesSlug": species_slug,
                "lightingPreset": lighting_preset,
                "rgbGridFsId": rgb_id,
                "bioGridFsId": bio_id,
                "aspectRatio": 1.7778,
                "semantics": semantics,
                "promptVersion": prompt_version,
                "generationMs": int(generation_ms),
                "createdAt": now_dt,
            }
            _plates_col.update_one({"plateKey": plate_key}, {"$set": doc}, upsert=True)
            # Clean up replaced GridFS blobs if regenerating
            if existing:
                for old_field in ("rgbGridFsId", "bioGridFsId"):
                    old_id = existing.get(old_field)
                    if old_id and old_id not in (rgb_id, bio_id):
                        try:
                            _fs.delete(old_id)
                        except Exception:
                            pass
            return _serialize_plate_doc(doc)
        except Exception as exc:
            print(f"[Umwelt DB] GridFS save fallback ({exc})")

    # Local fallback storage
    with _lock:
        _ensure_local_dir()
        rgb_path = os.path.join(LOCAL_CACHE_DIR, f"{plate_key}_rgb.webp")
        bio_path = os.path.join(LOCAL_CACHE_DIR, f"{plate_key}_bio.png")
        with open(rgb_path, "wb") as f_rgb:
            f_rgb.write(rgb_bytes)
        with open(bio_path, "wb") as f_bio:
            f_bio.write(bio_bytes)

        meta = _read_local_json(LOCAL_PLATES_META, {})
        record = {
            "plateKey": plate_key,
            "biomeId": biome_id,
            "speciesSlug": species_slug,
            "lightingPreset": lighting_preset,
            "aspectRatio": 1.7778,
            "semantics": semantics,
            "promptVersion": prompt_version,
            "generationMs": int(generation_ms),
            "createdAt": now_dt.isoformat(),
        }
        meta[plate_key] = record
        _write_local_json(LOCAL_PLATES_META, meta)
        return record


def read_plate_binary(plate_key, asset_kind):
    """Returns (bytes, content_type) for asset_kind in ('rgb', 'bio'), or (None, None)."""
    if asset_kind not in ("rgb", "bio"):
        return None, None
    content_type = "image/webp" if asset_kind == "rgb" else "image/png"
    id_field = "rgbGridFsId" if asset_kind == "rgb" else "bioGridFsId"

    if is_mongo_connected() and _plates_col is not None and _fs is not None:
        try:
            doc = _plates_col.find_one({"plateKey": plate_key})
            if doc and doc.get(id_field):
                grid_out = _fs.get(doc[id_field])
                return grid_out.read(), content_type
        except Exception as exc:
            print(f"[Umwelt DB] GridFS read fallback ({exc})")

    ext = "rgb.webp" if asset_kind == "rgb" else "bio.png"
    local_path = os.path.join(LOCAL_CACHE_DIR, f"{plate_key}_{ext}")
    if os.path.exists(local_path):
        try:
            with open(local_path, "rb") as fh:
                return fh.read(), content_type
        except Exception:
            pass
    return None, None


# ---------------- RESEARCHER JOURNAL & STATS ----------------

def _empty_journal(client_uuid):
    return {
        "clientUuid": client_uuid,
        "callsign": None,
        "solvedMysteries": [],
        "completedMissions": [],
        "unlockedCodexEntries": [],
        "favoriteSpecies": None,
        "totalPoints": 0,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }


def get_journal(client_uuid):
    clean_id = re.sub(r"[^a-zA-Z0-9_\-]", "", str(client_uuid or ""))[:64]
    if not clean_id:
        return _empty_journal("anonymous")

    if is_mongo_connected() and _journals_col is not None:
        try:
            doc = _journals_col.find_one({"clientUuid": clean_id})
            if doc:
                doc.pop("_id", None)
                if isinstance(doc.get("updatedAt"), datetime):
                    doc["updatedAt"] = doc["updatedAt"].isoformat()
                return doc
            return _empty_journal(clean_id)
        except Exception as exc:
            print(f"[Umwelt DB] Journal read fallback ({exc})")

    journals = _read_local_json(LOCAL_JOURNALS_FILE, {})
    return journals.get(clean_id, _empty_journal(clean_id))


def record_mystery_attempt(mystery_id, solved):
    """Increments global attempt/solve counters and returns globalSolveRate (0..1)."""
    stat_key = f"mystery:{mystery_id}"
    if is_mongo_connected() and _stats_col is not None:
        try:
            inc_fields = {"attempts": 1}
            if solved:
                inc_fields["solves"] = 1
            _stats_col.update_one(
                {"statKey": stat_key},
                {"$inc": inc_fields, "$set": {"updatedAt": datetime.now(timezone.utc)}},
                upsert=True,
            )
            doc = _stats_col.find_one({"statKey": stat_key}) or {}
            attempts = max(1, int(doc.get("attempts", 1)))
            solves = int(doc.get("solves", 1 if solved else 0))
            return round(min(1.0, solves / attempts), 4)
        except Exception as exc:
            print(f"[Umwelt DB] Stats update fallback ({exc})")

    with _lock:
        stats = _read_local_json(LOCAL_STATS_FILE, {})
        entry = stats.get(stat_key, {"attempts": 0, "solves": 0})
        entry["attempts"] = int(entry.get("attempts", 0)) + 1
        if solved:
            entry["solves"] = int(entry.get("solves", 0)) + 1
        stats[stat_key] = entry
        _write_local_json(LOCAL_STATS_FILE, stats)
        return round(min(1.0, entry["solves"] / max(1, entry["attempts"])), 4)


def save_solved_mystery(client_uuid, mystery, time_to_solve_ms=0):
    clean_id = re.sub(r"[^a-zA-Z0-9_\-]", "", str(client_uuid or ""))[:64] or "anonymous"
    now_iso = datetime.now(timezone.utc).isoformat()
    journal = get_journal(clean_id)

    already = any(item.get("mysteryId") == mystery["mysteryId"] for item in journal.get("solvedMysteries", []))
    if not already:
        journal.setdefault("solvedMysteries", []).append({
            "mysteryId": mystery["mysteryId"],
            "biomeId": mystery["biomeId"],
            "speciesSlug": mystery["requiredSpeciesSlug"],
            "solvedAt": now_iso,
            "timeToSolveMs": int(max(0, time_to_solve_ms)),
        })
        if mystery["mysteryId"] not in journal.get("unlockedCodexEntries", []):
            journal.setdefault("unlockedCodexEntries", []).append(mystery["mysteryId"])
        journal["totalPoints"] = int(journal.get("totalPoints", 0)) + int(mystery.get("points", 150))

    journal["updatedAt"] = now_iso
    _persist_journal(clean_id, journal)
    return journal


def save_completed_mission(client_uuid, mission, score=0, elapsed_ms=0):
    clean_id = re.sub(r"[^a-zA-Z0-9_\-]", "", str(client_uuid or ""))[:64] or "anonymous"
    now_iso = datetime.now(timezone.utc).isoformat()
    journal = get_journal(clean_id)

    missions_list = journal.setdefault("completedMissions", [])
    existing = next((m for m in missions_list if m.get("missionId") == mission["missionId"]), None)
    if existing:
        existing["bestScore"] = max(int(existing.get("bestScore", 0)), int(score))
        if elapsed_ms > 0:
            prev_best = int(existing.get("bestTimeMs", 0))
            existing["bestTimeMs"] = int(elapsed_ms) if prev_best <= 0 else min(prev_best, int(elapsed_ms))
        existing["completions"] = int(existing.get("completions", 1)) + 1
        existing["lastCompletedAt"] = now_iso
    else:
        missions_list.append({
            "missionId": mission["missionId"],
            "biomeId": mission["biomeId"],
            "speciesSlug": mission["speciesSlug"],
            "bestScore": int(score),
            "bestTimeMs": int(max(0, elapsed_ms)),
            "completions": 1,
            "firstCompletedAt": now_iso,
            "lastCompletedAt": now_iso,
        })
        journal["totalPoints"] = int(journal.get("totalPoints", 0)) + 200

    journal["updatedAt"] = now_iso
    _persist_journal(clean_id, journal)
    return journal


def _persist_journal(client_uuid, journal):
    if is_mongo_connected() and _journals_col is not None:
        try:
            doc = dict(journal)
            doc["clientUuid"] = client_uuid
            _journals_col.update_one({"clientUuid": client_uuid}, {"$set": doc}, upsert=True)
            return
        except Exception as exc:
            print(f"[Umwelt DB] Journal persist fallback ({exc})")

    with _lock:
        journals = _read_local_json(LOCAL_JOURNALS_FILE, {})
        journals[client_uuid] = journal
        _write_local_json(LOCAL_JOURNALS_FILE, journals)
