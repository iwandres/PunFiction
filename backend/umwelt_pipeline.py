"""
UMWELT: Animal Optics — Gemini Wildlife Plate Synthesis, Pillow BioDepth RGBA Map Builder,
Gemini Vision Semantic Grounding & Field Mystery Verification Pipeline.
"""
import io
import json
import math
import os
import threading
import time

from PIL import Image, ImageFilter

try:
    from backend import umwelt_data
    from backend import umwelt_database as udb
except ImportError:
    import umwelt_data
    import umwelt_database as udb

PROMPT_VERSION = 1
PLATE_WIDTH = 1280
PLATE_HEIGHT = 720
BIO_WIDTH = 480
BIO_HEIGHT = 270

IMAGE_MODEL_CANDIDATES = (
    "gemini-3.1-flash-image",
)
VISION_MODEL_CANDIDATES = (
    "gemini-3.8-flash",
    "gemini-flash-latest",
)

LIGHTING_MODIFIERS = {
    "Alpine Noon": "Crisp high-altitude Rocky Mountain midday sun, deep sapphire sky, clear natural contrast.",
    "Golden Hour": "Warm low-angle golden hour alpine sunset rays skimming across meadow grasses, rich amber highlights and long cool blue shadows.",
    "Misty Dawn": "Cool atmospheric alpine sunrise mist drifting softly across wet wildflowers and cold snowmelt water, soft pastel dawn glow.",
    "Tropical Zenith Caustics": "Bright overhead tropical midday sun slicing down through crystal water with dancing refracted caustic light nets across coral and sand.",
    "Turbid Plankton Bloom": "Greenish-teal plankton-rich tropical lagoon water with soft atmospheric suspended marine snow and diffused scatter.",
    "Twilight Blue-Hour Fluorescence": "Deep electric cobalt blue-hour twilight underwater reef lighting where ambient red is gone and subtle coral fluorescence glimmers.",
    "Moonlit Mist": "Silvery cool blue-grey moonlight filtering softly through swirling high-elevation tropical cloud forest mist.",
    "Bioluminescent Rain": "Humid misty rainforest twilight shower with glistening wet moss, raindrops, and faint emerald-green glowing Mycena forest fungi.",
    "Deep Starlight Canopy": "Very dim deep indigo starlight filtering through emergent cloud forest treetops, high contrast atmospheric silhouette depth.",
}

_inflight_guard = threading.Lock()
_inflight_events = {}
_inflight_results = {}


def _get_genai_client():
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return None, None
    try:
        from google import genai
        from google.genai import types
        return genai.Client(api_key=api_key), types
    except Exception as exc:
        print(f"[Umwelt Pipeline] google-genai import/init error: {exc}")
        return None, None


def _fit_16_9(img, target_w=PLATE_WIDTH, target_h=PLATE_HEIGHT):
    """Center-crops and resizes any PIL image cleanly to 16:9."""
    img = img.convert("RGB")
    src_w, src_h = img.size
    target_ratio = target_w / float(target_h)
    src_ratio = src_w / float(max(1, src_h))

    if src_ratio > target_ratio + 0.01:
        new_w = int(round(src_h * target_ratio))
        left = max(0, (src_w - new_w) // 2)
        img = img.crop((left, 0, left + new_w, src_h))
    elif src_ratio < target_ratio - 0.01:
        new_h = int(round(src_w / target_ratio))
        top = max(0, (src_h - new_h) // 2)
        img = img.crop((0, top, src_w, top + new_h))

    return img.resize((target_w, target_h), Image.Resampling.LANCZOS)


def build_bio_depth_map(rgb_image, biome_id, species_slug):
    """
    Computes a compact 480x270 RGBA PNG BioDepth map using pure Pillow:
      R = inverse depth d in [0..255] (255 = close foreground, 0 = distant sky/open water)
      G = bioSignalA (UV floral petals / biofluorescent reef coral / polarized sheen)
      B = windAndMotion (foliage, grass, petal, soft coral, liana displacement mask)
      A = mediumMask (sky dome, cold snowmelt creek, sandy seabed, or water column)
    """
    small = rgb_image.convert("RGB").resize((BIO_WIDTH, BIO_HEIGHT), Image.Resampling.BILINEAR)
    blur = small.filter(ImageFilter.GaussianBlur(radius=3))
    edges = small.convert("L").filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(radius=1.5))

    px_rgb = small.load()
    px_blur = blur.load()
    px_edge = edges.load()

    bio_img = Image.new("RGBA", (BIO_WIDTH, BIO_HEIGHT))
    px_out = bio_img.load()

    steep_down = species_slug in ("kestrel", "hammerhead")
    vertical_bark = species_slug in ("gecko", "sea_turtle")
    sky_heavy = species_slug in ("honeybee", "thrush", "human_meadow", "deer")

    for y in range(BIO_HEIGHT):
        ny = y / float(BIO_HEIGHT - 1)  # 0 top, 1 bottom
        for x in range(BIO_WIDTH):
            nx = x / float(BIO_WIDTH - 1)
            r, g, b = px_rgb[x, y]
            br, bg, bb = px_blur[x, y]
            edge_val = px_edge[x, y] / 255.0

            rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
            luma = 0.299 * rf + 0.587 * gf + 0.114 * bf
            maxc = max(rf, gf, bf)
            minc = min(rf, gf, bf)
            sat = (maxc - minc) / (maxc + 1e-4)

            # --- Channel A: Medium Mask (sky, water, snowmelt stream, sand) ---
            if biome_id == "meadow":
                is_sky = 1.0 if (ny < 0.42 and bf > rf * 1.04 and luma > 0.36) else 0.0
                is_cold_water = max(0.0, min(1.0, (bf - rf * 0.92) * 2.8 + (0.25 if (ny > 0.42 and bf > gf and bf > rf) else 0.0)))
                if species_slug == "kestrel":
                    medium = max(0.0, min(1.0, (bf - rf * 0.96) * 3.0))
                else:
                    medium = max(is_sky * (1.0 - ny * 1.4), is_cold_water * (1.0 if ny > 0.36 else 0.3))
            elif biome_id == "reef":
                # Open blue water column + pale sand flats
                blue_water = max(0.0, min(1.0, (bf - rf * 1.15) * 2.2 + (0.45 if ny < 0.35 else 0.0)))
                pale_sand = max(0.0, min(1.0, (luma - 0.52) * 2.6 * (1.0 - sat * 1.4) * (1.0 if ny > 0.48 else 0.2)))
                medium = max(blue_water, pale_sand if species_slug == "hammerhead" else blue_water)
            else:  # cloudforest
                mist_sky = max(0.0, min(1.0, (1.0 - ny * 1.35) * (0.45 + 0.55 * luma) + max(0.0, bf - rf) * 0.8))
                medium = mist_sky

            # --- Channel R: Inverse Depth (1.0 close foreground -> 0.0 sky/far) ---
            if steep_down:
                # Center-bottom closer, upper edge farther, modulated by local structure
                base_d = 0.28 + 0.58 * ny + 0.12 * (1.0 - abs(nx - 0.5) * 1.6)
                depth = base_d * 0.78 + edge_val * 0.22
            elif vertical_bark:
                # Left/center coral wall or mossy trunk foreground vs right open space
                side_bias = (1.0 - nx * 0.55) if species_slug == "sea_turtle" else (0.55 + 0.35 * (1.0 - abs(nx - 0.46)))
                depth = side_bias * 0.68 + edge_val * 0.22 + (1.0 - luma) * 0.12
            else:
                # Standard natural perspective: bottom close, top far, sky pushed to 0
                base_d = pow(ny, 0.82)
                depth = base_d * 0.74 + edge_val * 0.18 + (1.0 - medium) * 0.14
                if sky_heavy and ny < 0.38 and medium > 0.55:
                    depth *= 0.18

            depth = max(0.02, min(0.98, depth))

            # --- Channel G: BioSignalA (UV / Biofluorescence / Polarization / Specular) ---
            if biome_id == "meadow":
                # Yellow/white flowers strong UV bullseye cue; red poppies suppressed in UV
                yellow_floral = max(0.0, min(1.0, (rf + gf - 1.45 * bf) * 1.35))
                red_poppy = max(0.0, min(1.0, (rf - gf * 1.25) * 2.2))
                bio_sig = max(0.0, min(1.0, yellow_floral * 0.92 - red_poppy * 0.55 + edge_val * 0.12))
            elif biome_id == "reef":
                # Biofluorescent greens/oranges + specular polarized highlights on crustaceans/fish
                green_fluor = max(0.0, min(1.0, (gf - bf * 0.78) * 2.1 + max(0.0, rf - bf * 0.85) * 1.4))
                spec_pol = max(0.0, min(1.0, edge_val * 0.75 + max(0.0, luma - 0.65) * 1.2))
                bio_sig = max(green_fluor, spec_pol * 0.75)
            else:  # cloudforest
                emerald_bio = max(0.0, min(1.0, (gf - rf * 0.85) * 1.9 + max(0.0, rf - gf * 1.1) * 1.3))
                bio_sig = max(0.0, min(1.0, emerald_bio * 0.8 + edge_val * 0.35))

            # --- Channel B: Wind & Motion Displacement Weight ---
            if biome_id == "meadow":
                greenness = max(0.0, min(1.0, (gf - rf * 0.72) * 2.2 + (gf - bf * 0.78) * 1.2))
                floral = max(0.0, min(1.0, (rf + gf - 1.3 * bf) * 1.2))
                wind = max(greenness, floral * 0.8) * (1.0 - medium * 0.75) * (0.3 + 0.7 * ny)
            elif biome_id == "reef":
                # Soft coral / fronds / water surface ripple surge
                wind = max(0.15, min(1.0, (1.0 - medium * 0.4) * (0.25 + 0.65 * edge_val) + 0.15 * (1.0 - ny)))
            else:  # cloudforest
                # Hanging lianas, wet ferns, drifting mist layers
                foliage = max(0.0, min(1.0, (gf - rf * 0.75) * 2.0 + edge_val * 0.45))
                wind = max(0.12, min(1.0, foliage * 0.85 + (0.22 if ny < 0.45 else 0.0)))

            px_out[x, y] = (
                int(round(max(0.0, min(1.0, depth)) * 255)),
                int(round(max(0.0, min(1.0, bio_sig)) * 255)),
                int(round(max(0.0, min(1.0, wind)) * 255)),
                int(round(max(0.0, min(1.0, medium)) * 255)),
            )

    # Smooth R (depth) & A (medium) slightly to eliminate blockiness in 2.5D parallax
    r_ch, g_ch, b_ch, a_ch = bio_img.split()
    r_ch = r_ch.filter(ImageFilter.GaussianBlur(radius=4.5))
    b_ch = b_ch.filter(ImageFilter.GaussianBlur(radius=2.0))
    a_ch = a_ch.filter(ImageFilter.GaussianBlur(radius=3.5))
    smoothed = Image.merge("RGBA", (r_ch, g_ch, b_ch, a_ch))

    out_buf = io.BytesIO()
    smoothed.save(out_buf, format="PNG", optimize=True)
    return out_buf.getvalue()


def _clamp_ellipse(raw_obj, fallback_obj):
    if not isinstance(raw_obj, dict):
        return dict(fallback_obj)
    out = dict(fallback_obj)
    out["present"] = bool(raw_obj.get("present", fallback_obj.get("present", True)))
    if "label" in fallback_obj:
        out["label"] = str(raw_obj.get("label") or fallback_obj["label"])[:64]
    try:
        out["x"] = round(max(0.08, min(0.92, float(raw_obj.get("x", fallback_obj["x"])))), 4)
        out["y"] = round(max(0.08, min(0.92, float(raw_obj.get("y", fallback_obj["y"])))), 4)
        out["rx"] = round(max(0.05, min(0.35, float(raw_obj.get("rx", fallback_obj["rx"])))), 4)
        out["ry"] = round(max(0.05, min(0.35, float(raw_obj.get("ry", fallback_obj["ry"])))), 4)
    except (TypeError, ValueError):
        return dict(fallback_obj)
    return out


def ground_plate_semantics(rgb_bytes, biome, species):
    """
    Calls Gemini Vision (`gemini-3.8-flash`) with structured JSON output to ground
    exact normalized [0..1] ellipses for ecological targets inside the generated plate.
    """
    fallback = species["defaultSemantics"]
    client, types = _get_genai_client()
    if not client or not types:
        return fallback

    primary_label = fallback["primaryTarget"]["label"]
    secondary_label = fallback["secondaryTarget"]["label"]
    env_label = fallback["environmentFeature"]["label"]

    prompt = (
        f"You are a wildlife vision coordinate grounder for an interactive ecology simulation.\n"
        f"Biome: {biome['name']}. POV: {species['name']} ({species['vantageLabel']}).\n"
        f"Inspect this 16:9 photograph and return STRICT JSON locating these 4 regions in normalized coordinates "
        f"(x from 0.0 left to 1.0 right, y from 0.0 top to 1.0 bottom, rx/ry ellipse half-widths between 0.06 and 0.30):\n"
        f"- primaryTarget: '{primary_label}' (pick the most plausible real visual location in the photo where this subject/phenomenon sits)\n"
        f"- secondaryTarget: '{secondary_label}'\n"
        f"- environmentFeature: '{env_label}'\n"
        f"- skyOrWaterRegion: open sky or open water background region.\n"
        f"Return ONLY valid JSON matching:\n"
        f'{{"primaryTarget":{{"present":true,"label":"{primary_label}","x":0.5,"y":0.5,"rx":0.1,"ry":0.1}},'
        f'"secondaryTarget":{{"present":true,"label":"{secondary_label}","x":0.3,"y":0.6,"rx":0.12,"ry":0.12}},'
        f'"environmentFeature":{{"present":true,"label":"{env_label}","x":0.5,"y":0.7,"rx":0.2,"ry":0.15}},'
        f'"skyOrWaterRegion":{{"present":true,"x":0.5,"y":0.18,"rx":0.45,"ry":0.18}}}}'
    )

    for model_name in VISION_MODEL_CANDIDATES:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=rgb_bytes, mime_type="image/webp"),
                    prompt,
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1,
                ),
            )
            raw_text = (response.text or "").strip()
            if not raw_text:
                continue
            parsed = json.loads(raw_text)
            return {
                "primaryTarget": _clamp_ellipse(parsed.get("primaryTarget"), fallback["primaryTarget"]),
                "secondaryTarget": _clamp_ellipse(parsed.get("secondaryTarget"), fallback["secondaryTarget"]),
                "environmentFeature": _clamp_ellipse(parsed.get("environmentFeature"), fallback["environmentFeature"]),
                "skyOrWaterRegion": _clamp_ellipse(parsed.get("skyOrWaterRegion"), fallback["skyOrWaterRegion"]),
            }
        except Exception as exc:
            print(f"[Umwelt Vision] Grounding warning on {model_name}: {exc}")
            continue

    return fallback


def synthesize_wildlife_plate(biome, species, lighting_preset):
    """
    Calls gemini-3.1-flash-image with exponential backoff to generate a 16:9
    photorealistic wildlife plate, converts to 1280x720 WebP, builds 4-channel BioDepth PNG,
    and runs Gemini Vision coordinate grounding.
    Returns (rgb_webp_bytes, bio_png_bytes, semantics, generation_ms).
    """
    client, types = _get_genai_client()
    if not client or not types:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server.")

    lighting_desc = LIGHTING_MODIFIERS.get(lighting_preset, f"{lighting_preset} natural lighting.")
    full_prompt = (
        f"{species['imagePrompt']} "
        f"STRICT FIRST-PERSON POV RULE: This camera is positioned inside the eyes of the {species['name']} looking outward at the habitat; "
        f"NEVER depict a {species['name']} (or any member of {species['scientificName']}) anywhere inside the photograph. "
        f"Lighting & Atmosphere: {lighting_desc} "
        f"Compose strictly in widescreen 16:9 cinematic aspect ratio. Pure documentary photography—no frames, no borders, no captions, no text."
    )

    t0 = time.time()
    last_exc = None
    raw_img_bytes = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=IMAGE_MODEL_CANDIDATES[0],
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=[types.Modality.IMAGE],
                ),
            )
            for candidate in (response.candidates or []):
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        if part.inline_data and part.inline_data.data:
                            raw_img_bytes = part.inline_data.data
                            break
                if raw_img_bytes:
                    break
            if raw_img_bytes:
                break
            raise RuntimeError("No image bytes returned from gemini-3.1-flash-image")
        except Exception as exc:
            last_exc = exc
            wait_s = min(6.0, (1.5 ** attempt))
            print(f"[Umwelt Image] Attempt {attempt + 1} failed for {species['slug']}: {exc} (retry in {wait_s:.1f}s)")
            if attempt < 2:
                time.sleep(wait_s)

    if not raw_img_bytes:
        raise RuntimeError(f"Plate synthesis failed: {last_exc}")

    pil_img = _fit_16_9(Image.open(io.BytesIO(raw_img_bytes)))
    rgb_buf = io.BytesIO()
    pil_img.save(rgb_buf, format="WEBP", quality=84, method=4)
    rgb_bytes = rgb_buf.getvalue()

    bio_bytes = build_bio_depth_map(pil_img, biome["id"], species["slug"])
    semantics = ground_plate_semantics(rgb_bytes, biome, species)
    gen_ms = int((time.time() - t0) * 1000)

    return rgb_bytes, bio_bytes, semantics, gen_ms


def resolve_plate(biome_id, species_slug, lighting_preset=None, force_regenerate=False, client_ip="anon"):
    """
    Resolves a plate from MongoDB/GridFS cache or synthesizes once via in-flight lock.
    Returns (status_code, payload_dict).
    """
    biome, species = umwelt_data.get_species_config(biome_id, species_slug)
    if not biome or not species:
        return 400, {"error": f"Unknown biome '{biome_id}' or species '{species_slug}'."}

    valid_presets = [p["id"] for p in biome["lightingPresets"]]
    preset = lighting_preset if lighting_preset in valid_presets else valid_presets[0]
    plate_key = udb.sanitize_plate_key(biome["id"], species["slug"], preset, version=PROMPT_VERSION)

    if not force_regenerate:
        cached = udb.get_plate_metadata(plate_key)
        if cached:
            return 200, _format_plate_response(cached, cache_hit=True)

    # Rate limit generation / forceRegenerate
    bucket = "regen" if force_regenerate else "generate"
    limit = 4 if force_regenerate else 14
    if not udb.check_rate_limit(client_ip, bucket_name=bucket, max_per_minute=limit):
        return 429, {"error": "Rate limit reached for plate synthesis. Please wait a moment and try again."}

    # In-flight coalescing lock per plateKey
    owner = False
    with _inflight_guard:
        ev = _inflight_events.get(plate_key)
        if ev is None:
            ev = threading.Event()
            _inflight_events[plate_key] = ev
            owner = True

    if not owner:
        ev.wait(timeout=45.0)
        res = _inflight_results.get(plate_key)
        if res:
            return res
        cached = udb.get_plate_metadata(plate_key)
        if cached:
            return 200, _format_plate_response(cached, cache_hit=True)
        return 503, {"error": "Plate synthesis timed out while waiting for shared job."}

    try:
        rgb_bytes, bio_bytes, semantics, gen_ms = synthesize_wildlife_plate(biome, species, preset)
        saved = udb.save_plate_asset(
            plate_key=plate_key,
            biome_id=biome["id"],
            species_slug=species["slug"],
            lighting_preset=preset,
            rgb_bytes=rgb_bytes,
            bio_bytes=bio_bytes,
            semantics=semantics,
            generation_ms=gen_ms,
            prompt_version=PROMPT_VERSION,
        )
        result = (200, _format_plate_response(saved, cache_hit=False))
        _inflight_results[plate_key] = result
        return result
    except Exception as exc:
        print(f"[Umwelt Resolve] Synthesis error for {plate_key}: {exc}")
        err_result = (
            503,
            {
                "error": "Photorealistic plate synthesis unavailable right now; using live procedural renderer.",
                "plateKey": plate_key,
                "semantics": species["defaultSemantics"],
                "fallback": True,
            },
        )
        _inflight_results[plate_key] = err_result
        return err_result
    finally:
        with _inflight_guard:
            done_ev = _inflight_events.pop(plate_key, None)
            if done_ev:
                done_ev.set()


def _format_plate_response(doc, cache_hit=True):
    plate_key = doc["plateKey"]
    return {
        "ok": True,
        "plateKey": plate_key,
        "biomeId": doc["biomeId"],
        "speciesSlug": doc["speciesSlug"],
        "lightingPreset": doc["lightingPreset"],
        "rgbUrl": f"/api/umwelt/plates/{plate_key}/rgb.webp",
        "bioUrl": f"/api/umwelt/plates/{plate_key}/bio.png",
        "semantics": doc.get("semantics"),
        "generationMs": doc.get("generationMs", 0),
        "cacheHit": cache_hit,
    }


def verify_mystery_discovery(payload):
    """
    Validates a player's click (clickX, clickY) against the grounded semantic ellipse
    for the active Field Mystery, checks species & optical mechanic state, logs progress,
    and returns scientific codex unlock + global solve rate.
    """
    client_uuid = str(payload.get("clientUuid") or "anonymous").strip()
    mystery_id = str(payload.get("mysteryId") or "").strip()
    biome_id = str(payload.get("biomeId") or "").strip()
    species_slug = str(payload.get("speciesSlug") or "").strip()
    lighting_preset = str(payload.get("lightingPreset") or "").strip()
    mechanic_state = payload.get("mechanicState") or {}
    time_to_solve_ms = int(payload.get("timeToSolveMs") or 0)

    try:
        click_x = float(payload.get("clickX", -1.0))
        click_y = float(payload.get("clickY", -1.0))
    except (TypeError, ValueError):
        return 400, {"solved": False, "error": "Invalid click coordinates."}

    mystery = umwelt_data.get_mystery_by_id(mystery_id)
    if not mystery:
        return 404, {"solved": False, "error": "Unknown field mystery."}

    biome, species = umwelt_data.get_species_config(mystery["biomeId"], mystery["requiredSpeciesSlug"])
    if not biome or not species:
        return 500, {"solved": False, "error": "Mystery configuration mismatch."}

    if biome_id != mystery["biomeId"] or species_slug != mystery["requiredSpeciesSlug"]:
        return 200, {
            "solved": False,
            "reason": "wrong_species",
            "hint": f"Switch to the {species['name']} in {biome['shortName']} to reveal this phenomenon.",
        }

    # Resolve grounded semantics (explicit client-passed static semantics > cached DB > default)
    semantics = None
    if lighting_preset:
        pk = udb.sanitize_plate_key(biome_id, species_slug, lighting_preset, version=PROMPT_VERSION)
        cached = udb.get_plate_metadata(pk)
        if cached and cached.get("semantics"):
            semantics = cached["semantics"]
    if not semantics and isinstance(payload.get("semantics"), dict):
        semantics = payload["semantics"]
    if not semantics:
        semantics = species["defaultSemantics"]

    target_key = mystery.get("targetSemanticKey", "primaryTarget")
    target = semantics.get(target_key) or species["defaultSemantics"]["primaryTarget"]

    # Generous accessibility tolerance: 1.5x grounded radius, minimum 0.135
    rx = max(0.135, float(target.get("rx", 0.10)) * 1.5)
    ry = max(0.135, float(target.get("ry", 0.10)) * 1.5)
    tx = float(target.get("x", 0.5))
    ty = float(target.get("y", 0.5))

    dx = (click_x - tx) / rx
    dy = (click_y - ty) / ry
    elliptic_dist = math.sqrt(dx * dx + dy * dy)

    # Contextual mechanic check for Cuttlefish polarization & Vampire Bat sonar
    req_mech = mystery.get("requiredMechanic")
    if req_mech == "polarization_align":
        pol_deg = float(mechanic_state.get("polarizationDeg", 42.0))
        # Target glass shrimp alignment ~42 deg (mod 180)
        ang_diff = abs(((pol_deg - 42.0 + 90.0) % 180.0) - 90.0)
        if ang_diff > 48.0 and elliptic_dist <= 1.25:
            return 200, {
                "solved": False,
                "reason": "mechanic_unaligned",
                "hint": "Almost! Rotate your linear polarization analyzer (scroll / Q & E / dial) until the glass shrimp pops in electric contrast, then click it.",
            }
    elif req_mech == "sonar_ping":
        if not mechanic_state.get("sonarPinged", True):
            return 200, {
                "solved": False,
                "reason": "mechanic_unaligned",
                "hint": "Emit an ultrasonic sonar ping (Key E or Sonar button) first to illuminate the resting tapir's silhouette and warm capillaries!",
            }

    if elliptic_dist <= 1.0:
        global_rate = udb.record_mystery_attempt(mystery_id, solved=True)
        journal = udb.save_solved_mystery(client_uuid, mystery, time_to_solve_ms=time_to_solve_ms)
        return 200, {
            "solved": True,
            "mysteryId": mystery_id,
            "title": mystery["title"],
            "codexEntry": mystery["scientificReveal"],
            "points": mystery["points"],
            "globalSolveRate": global_rate,
            "target": target,
            "journal": journal,
        }

    udb.record_mystery_attempt(mystery_id, solved=False)
    # Directional warm/cold field clue
    dist_raw = math.hypot(click_x - tx, click_y - ty)
    warmth = "Very close!" if dist_raw < 0.22 else ("Getting warmer — scan nearby." if dist_raw < 0.38 else "Keep scanning the scene with your sensory instrument.")
    return 200, {
        "solved": False,
        "reason": "missed_target",
        "distance": round(dist_raw, 3),
        "hint": warmth,
    }
