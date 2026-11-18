"""
The 8.3 Billionth — Calibrated Gemini Structured-Output Trait Estimator & Anti-Cheat Guardrails
"""
import json
import os
import re
import urllib.error
import urllib.request

try:
    from backend import billionth_database as bdb
except ImportError:
    import billionth_database as bdb

WORLD_POPULATION = 8_300_000_000
DEFAULT_MIN_PREVALENCE = 1e-7
EXTREME_MIN_PREVALENCE = 1e-9

CLOSED_CATEGORIES = [
    "sports_movement",
    "genetics_physiology",
    "skills_craft",
    "niche_hobbies",
    "daily_quirks",
    "food_palate",
    "household_companions",
    "travel_geography",
    "media_games",
    "life_randomness"
]

CLOSED_CLUSTER_TAGS = [
    "athletic", "team_sport", "court_sport", "endurance_sport", "water_sport",
    "winter_sport", "outdoor_mountain", "cycling_wheeled", "horticulture",
    "indoor_hobby", "culinary_diy", "craft_maker", "coding_tech", "automotive_mech",
    "vintage_gear", "collectors", "musical", "live_music_audio", "polyglot",
    "daily_puzzle_games", "board_tabletop", "book_reader", "visual_arts",
    "genetic_quirk", "sensory_trait", "handedness", "medical_history",
    "spicy_palate", "dietary_restriction", "caffeine_habit", "sleep_habit",
    "pet_owner", "high_altitude", "world_traveler", "home_energy_diy", "family_structure"
]

SYSTEM_PROMPT = """You are the demographic & statistical estimation engine for "THE 8.3 BILLIONTH — what makes you one-of-one?", a web experience where a player narrows 8,300,000,000 living humans down to 1 by entering true personal traits.

Evaluate the user's input statement and return strict JSON matching the schema.

1. VALIDATION & ANTI-CHEAT RULES:
- "rejected_pii": Reject personal names, street addresses, emails, phone numbers, license plates, SSNs, exact employer + job title pairs, usernames/handles, or exact birth dates (YYYY-MM-DD / Month Day Year). Note: Birth month alone (~8.3%) or birth decade alone (~12-16%) IS allowed.
- "rejected_ephemeral": Reject temporary micro-states ("I am sitting down", "wearing a blue sock right now", "just sneezed", "playing this game"). Traits must be durable habits, skills, biology, possessions, geography, or life milestones.
- "rejected_implausible": Reject physically impossible, supernatural, or fictional claims ("I live on Mars", "I am 300 years old", "I can turn invisible").
- "compound_split": If the input bundles 2+ distinct independent traits ("I'm a left-handed indie game dev who scuba dives"), DO NOT score them together. Set status to "compound_split" and return 2 to 4 clean atomic first-person statements in compoundSplit.

2. GLOBAL FERMI CALIBRATION (ANTI-WESTERN-BIAS):
- Denominator is ALL 8,300,000,000 living humans across all ages (including infants/elderly) and all income/geographic regions (Asia ~60%, Africa ~18%, Europe ~9%, Americas ~13%).
- Do NOT overestimate hobbies common in Western tech cities. Account for global internet/wealth/climate access.
- Complete the `fermi` object FIRST when status is "accepted":
  a) `baseGroup`: Identify the relevant global sub-population and approximate headcount (e.g. "~180M home picklers & fermenters globally").
  b) `conditionalRate`: Estimate the realistic share of that baseGroup matching the specific trait (e.g. "~7% making small-batch chili relishes").
  c) `estimatedGlobalHumans`: Compute integer headcount out of 8,300,000,000 (minimum 830 unless a genuine established extreme medical/historical rarity such as lightning strike survivor, Olympic medalist, or commercial astronaut, in which case set `isVerifiedExtremeRarity: true`).
- Set `prevalence` = estimatedGlobalHumans / 8300000000.

3. CALIBRATION ANCHORS (Out of 8.3B):
- Never broken a bone: 0.69 (~5.7B)
- Drinks coffee regularly: 0.27 (~2.2B)
- Owns a dog: 0.33 (~2.7B) | Owns a golden retriever: 0.006 (~50M)
- Plays volleyball (rec or competitive): 0.12 (~1.0B)
- Left-handed: 0.106 (~880M)
- Writes software / codes: 0.006 (~50M) | Indie game developer: 0.00012 (~1.0M)
- PADI / open-water scuba certified: 0.0035 (~29M)
- Grows carnivorous plants indoors: 0.00018 (~1.5M)
- Makes homemade pickled/fermented condiments: 0.022 (~182M) | Specific niche chili relish/hot sauce maker: 0.0015 (~12.5M)
- Struck by lightning survivor: 0.000003 (~25,000, isVerifiedExtremeRarity: true)

4. CANONICAL NORMALIZATION & TONE:
- Normalize `canonicalSlug` in snake_case so equivalent phrasings ("I make cold-brine pickles" / "homemade refrigerator pickle maker") map to consistent slugs while preserving genuine specificity.
- Write `label` in clean first-person ("I make homemade jalapeño relish") and `shortBadge` in 2-4 crisp words ("Jalapeño relish maker").
- Pick 1 to 3 `clusterTags` strictly from the allowed enum.
- Write `snarkNote` (max 150 chars) — or `rejectionReason` when rejected — in a crisp, witty, lightly sarcastic data-journalist voice referencing the estimated global headcount. Never be cruel; poke gentle fun at human habits."""

RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "required": ["status", "rejectionReason", "compoundSplit", "fermi", "trait"],
    "properties": {
        "status": {
            "type": "STRING",
            "enum": [
                "accepted",
                "compound_split",
                "rejected_pii",
                "rejected_ephemeral",
                "rejected_implausible"
            ]
        },
        "rejectionReason": {"type": "STRING", "nullable": True},
        "compoundSplit": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        },
        "fermi": {
            "type": "OBJECT",
            "nullable": True,
            "required": ["baseGroup", "conditionalRate", "estimatedGlobalHumans"],
            "properties": {
                "baseGroup": {"type": "STRING"},
                "conditionalRate": {"type": "STRING"},
                "estimatedGlobalHumans": {"type": "INTEGER"}
            }
        },
        "trait": {
            "type": "OBJECT",
            "nullable": True,
            "required": [
                "canonicalSlug",
                "label",
                "shortBadge",
                "emoji",
                "category",
                "prevalence",
                "clusterTags",
                "snarkNote",
                "isVerifiedExtremeRarity"
            ],
            "properties": {
                "canonicalSlug": {"type": "STRING"},
                "label": {"type": "STRING"},
                "shortBadge": {"type": "STRING"},
                "emoji": {"type": "STRING"},
                "category": {"type": "STRING", "enum": CLOSED_CATEGORIES},
                "prevalence": {"type": "NUMBER"},
                "clusterTags": {
                    "type": "ARRAY",
                    "items": {"type": "STRING", "enum": CLOSED_CLUSTER_TAGS}
                },
                "snarkNote": {"type": "STRING"},
                "isVerifiedExtremeRarity": {"type": "BOOLEAN"}
            }
        }
    }
}

# Pre-LLM instant deterministic guardrails (0ms, $0)
_RE_EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
_RE_SSN = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
_RE_PHONE = re.compile(r"\b(?:\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b")
_RE_GPS = re.compile(r"[-+]?\d{1,2}\.\d{3,}\s*,\s*[-+]?\d{1,3}\.\d{3,}")
_RE_EXACT_DATE_ISO = re.compile(r"\b(?:19|20)\d{2}[-/.](?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])\b")
_RE_EXACT_DATE_TEXT = re.compile(
    r"\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+(?:19|20)\d{2}\b",
    re.IGNORECASE
)
_RE_STREET = re.compile(
    r"\b\d{1,5}\s+[A-Za-z0-9.\s]{2,28}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way)\b",
    re.IGNORECASE
)
_RE_MY_NAME = re.compile(r"^(?:my\s+(?:full\s+|first\s+|last\s+)?name\s+is|i\s+am\s+named)\b", re.IGNORECASE)
_RE_EPHEMERAL = re.compile(
    r"\b(?:right\s+now|at\s+this\s+exact\s+moment|currently\s+(?:sitting|standing|blinking|breathing|typing|wearing|reading\s+this)|playing\s+this\s+game)\b",
    re.IGNORECASE
)


def run_pre_guardrails(raw_input):
    text = str(raw_input or "").strip()
    if len(text) < 2:
        return {
            "status": "rejected_ephemeral",
            "rejectionReason": "Give us at least a couple words — even a sneeze has more letters.",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }
    if len(text) > 220:
        return {
            "status": "compound_split",
            "rejectionReason": "That reads like a full autobiography. Try entering one crisp trait at a time.",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }

    if (
        _RE_EMAIL.search(text)
        or _RE_SSN.search(text)
        or _RE_PHONE.search(text)
        or _RE_GPS.search(text)
        or _RE_STREET.search(text)
        or _RE_MY_NAME.search(text)
    ):
        return {
            "status": "rejected_pii",
            "rejectionReason": "Using your government ID or contact info is speedrunning on easy mode. Give us traits, not your mail.",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }

    if _RE_EXACT_DATE_ISO.search(text) or _RE_EXACT_DATE_TEXT.search(text):
        return {
            "status": "rejected_pii",
            "rejectionReason": "Exact birth dates are basically serial numbers. Try your birth month (~8.3%) or birth decade instead!",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }

    if _RE_EPHEMERAL.search(text):
        return {
            "status": "rejected_ephemeral",
            "rejectionReason": "Momentary micro-states evaporate in five minutes. Give us a durable habit, skill, quirk, or milestone.",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }

    return None


def _sanitize_slug(slug, fallback_text):
    base = str(slug or fallback_text or "custom_trait").lower().strip()
    base = re.sub(r"[^a-z0-9]+", "_", base).strip("_")
    return (base[:64] or "custom_trait")


def _sanitize_accepted_payload(parsed, raw_input):
    trait_in = parsed.get("trait") or {}
    fermi_in = parsed.get("fermi") or {}

    is_extreme = bool(trait_in.get("isVerifiedExtremeRarity", False))
    min_floor = EXTREME_MIN_PREVALENCE if is_extreme else DEFAULT_MIN_PREVALENCE
    min_humans = max(8, int(round(WORLD_POPULATION * min_floor)))

    est_humans = int(fermi_in.get("estimatedGlobalHumans") or 0)
    raw_prev = float(trait_in.get("prevalence") or 0.0)

    if est_humans <= 0 and raw_prev > 0:
        est_humans = int(round(raw_prev * WORLD_POPULATION))
    est_humans = max(min_humans, min(int(WORLD_POPULATION * 0.95), est_humans))

    clamped_prev = max(min_floor, min(0.95, est_humans / float(WORLD_POPULATION)))

    raw_tags = trait_in.get("clusterTags") or []
    valid_tag_set = set(CLOSED_CLUSTER_TAGS)
    clean_tags = []
    for tag in raw_tags:
        t_str = str(tag).strip()
        if t_str in valid_tag_set and t_str not in clean_tags:
            clean_tags.append(t_str)
            if len(clean_tags) == 3:
                break
    if not clean_tags:
        clean_tags = ["indoor_hobby"]

    cat = str(trait_in.get("category") or "daily_quirks").strip()
    if cat not in CLOSED_CATEGORIES:
        cat = "daily_quirks"

    label = str(trait_in.get("label") or raw_input).strip()
    if len(label) > 95:
        label = label[:92].rstrip() + "..."

    short_badge = str(trait_in.get("shortBadge") or label).strip()
    if len(short_badge) > 36:
        short_badge = short_badge[:33].rstrip() + "..."

    snark = str(trait_in.get("snarkNote") or "").strip()
    if len(snark) > 160:
        snark = snark[:157].rstrip() + "..."

    emoji = str(trait_in.get("emoji") or "✨").strip()[:4] or "✨"
    slug = _sanitize_slug(trait_in.get("canonicalSlug"), short_badge)

    clean_trait = {
        "id": slug,
        "canonicalSlug": slug,
        "label": label,
        "shortBadge": short_badge,
        "emoji": emoji,
        "category": cat,
        "prevalence": clamped_prev,
        "clusterTags": clean_tags,
        "snarkNote": snark,
        "isCustom": True,
        "isVerifiedExtremeRarity": is_extreme
    }

    clean_fermi = {
        "baseGroup": str(fermi_in.get("baseGroup") or "Global living population (8.3B)").strip()[:160],
        "conditionalRate": str(fermi_in.get("conditionalRate") or f"~{clamped_prev * 100:.4g}%").strip()[:120],
        "estimatedGlobalHumans": est_humans
    }

    return {
        "status": "accepted",
        "rejectionReason": None,
        "compoundSplit": [],
        "fermi": clean_fermi,
        "trait": clean_trait,
        "cached": False
    }


def _call_gemini_structured(raw_input, active_slugs):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not configured on the server.")

    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip() or "gemini-2.5-flash"
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    context_note = ""
    if active_slugs and isinstance(active_slugs, list):
        trimmed = [str(s)[:48] for s in active_slugs[:12]]
        context_note = f"\nUser's currently active trait slugs (for canonical normalization awareness only; still estimate unconditional global prevalence out of 8.3B): {trimmed}"

    user_prompt = f'Evaluate this user statement: "{raw_input.strip()}"{context_note}'

    body = {
        "systemInstruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json",
            "responseSchema": RESPONSE_SCHEMA,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=10) as resp:
        resp_data = json.loads(resp.read().decode("utf-8"))

    candidates = resp_data.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini returned no candidates.")
    parts = ((candidates[0].get("content") or {}).get("parts")) or []
    if not parts or "text" not in parts[0]:
        raise RuntimeError("Gemini candidate contained no JSON text.")

    return json.loads(parts[0]["text"])


def estimate_custom_trait(raw_input, active_slugs=None, client_ip="anon"):
    """
    Full Layer-3 Pipeline:
      1. Deterministic pre-guardrails (PII, exact dates, ephemeral micro-states, length)
      2. Persistent Cache Flywheel lookup (MongoDB Atlas / Local JSON, <30ms, $0)
      3. Sliding-window IP rate limit check
      4. Gemini 2.5 Flash structured Fermi estimation + schema clamp + persistent cache write
    """
    guardrail_hit = run_pre_guardrails(raw_input)
    if guardrail_hit is not None:
        return guardrail_hit, 200

    cached = bdb.lookup_cached_trait(raw_input)
    if cached is not None:
        return cached, 200

    if not bdb.check_rate_limit(client_ip, max_per_minute=25):
        return {
            "status": "rejected_ephemeral",
            "rejectionReason": "Whoa, rapid-fire typer! Give the census terminal 30 seconds to cool down or pick a suggestion chip.",
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }, 429

    try:
        parsed = _call_gemini_structured(raw_input, active_slugs or [])
    except urllib.error.HTTPError as http_err:
        err_body = ""
        try:
            err_body = http_err.read().decode("utf-8")[:240]
        except Exception:
            pass
        print(f"[Billionth Estimator] Gemini HTTP {http_err.code}: {err_body}")
        return {
            "error": "Live custom estimator is momentarily busy. Try one of the 5,000+ instant traits or retry in a few seconds!"
        }, 503
    except Exception as exc:
        print(f"[Billionth Estimator] Error calling Gemini: {exc}")
        return {
            "error": "Custom trait estimator is offline locally (missing GEMINI_API_KEY) or temporarily unreachable. Built-in & parametric traits still work at full speed!"
        }, 503

    status = str(parsed.get("status") or "").strip()

    if status == "compound_split":
        splits = [str(s).strip() for s in (parsed.get("compoundSplit") or []) if str(s).strip()][:4]
        return {
            "status": "compound_split",
            "rejectionReason": parsed.get("rejectionReason") or "Whoa, one flex at a time! Click to add each trait individually:",
            "compoundSplit": splits,
            "fermi": None,
            "trait": None
        }, 200

    if status in ("rejected_pii", "rejected_ephemeral", "rejected_implausible"):
        default_reasons = {
            "rejected_pii": "Using personal identifiers is speedrunning on easy mode. Give us durable traits, not your ID card.",
            "rejected_ephemeral": "Momentary states vanish in minutes — enter a lasting habit, skill, quirk, or milestone.",
            "rejected_implausible": "Our census strictly covers the 8.3 billion humans currently obeying the laws of physics on Earth."
        }
        return {
            "status": status,
            "rejectionReason": str(parsed.get("rejectionReason") or default_reasons[status]).strip()[:180],
            "compoundSplit": [],
            "fermi": None,
            "trait": None
        }, 200

    if status == "accepted" and parsed.get("trait"):
        sanitized = _sanitize_accepted_payload(parsed, raw_input)
        bdb.store_cached_trait(raw_input, sanitized["trait"], sanitized["fermi"])
        return sanitized, 200

    return {
        "status": "rejected_implausible",
        "rejectionReason": "Could not pin a reliable global headcount on that phrasing — try stating it as a clear 'I ...' fact!",
        "compoundSplit": [],
        "fermi": None,
        "trait": None
    }, 200
