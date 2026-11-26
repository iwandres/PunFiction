"""
Pre-generates the 15 default-lighting National Geographic photorealistic 16:9 wildlife plates,
their 4-channel BioDepth RGBA maps, Gemini Vision grounded semantic coordinates manifest,
and the 1200x630 Open Graph preview image into `umwelt/assets/plates/`.
"""
import concurrent.futures
import io
import json
import os
import sys
import time

from PIL import Image, ImageDraw, ImageFont

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
PROJECT_ROOT = os.path.dirname(DIR_PATH)
if DIR_PATH not in sys.path:
    sys.path.insert(0, DIR_PATH)

import umwelt_data
import umwelt_database as udb
import umwelt_pipeline as upipe

PLATES_OUT_DIR = os.path.join(PROJECT_ROOT, "umwelt", "assets", "plates")
MANIFEST_PATH = os.path.join(PLATES_OUT_DIR, "manifest.json")
OG_OUT_PATH = os.path.join(PROJECT_ROOT, "umwelt", "og-preview.png")


def generate_single_plate(biome, species, preset, force=False):
    plate_key = udb.sanitize_plate_key(biome["id"], species["slug"], preset, version=upipe.PROMPT_VERSION)
    rgb_path = os.path.join(PLATES_OUT_DIR, f"{plate_key}_rgb.webp")
    bio_path = os.path.join(PLATES_OUT_DIR, f"{plate_key}_bio.png")

    if not force and os.path.exists(rgb_path) and os.path.exists(bio_path):
        print(f"[SKIP] {plate_key} already exists", flush=True)
        return plate_key, None

    t0 = time.time()
    print(f"[GEN ] Starting {plate_key} ({species['name']} @ {biome['shortName']})...", flush=True)
    rgb_bytes, bio_bytes, semantics, gen_ms = upipe.synthesize_wildlife_plate(biome, species, preset)
    with open(rgb_path, "wb") as f_rgb:
        f_rgb.write(rgb_bytes)
    with open(bio_path, "wb") as f_bio:
        f_bio.write(bio_bytes)

    elapsed = time.time() - t0
    print(
        f"[DONE] {plate_key} | rgb={len(rgb_bytes)//1024}KB bio={len(bio_bytes)//1024}KB "
        f"({elapsed:.1f}s) primary=({semantics['primaryTarget']['x']:.2f},{semantics['primaryTarget']['y']:.2f})",
        flush=True,
    )
    return plate_key, {
        "plateKey": plate_key,
        "biomeId": biome["id"],
        "speciesSlug": species["slug"],
        "lightingPreset": preset,
        "rgbPath": f"assets/plates/{plate_key}_rgb.webp",
        "bioPath": f"assets/plates/{plate_key}_bio.png",
        "semantics": semantics,
        "generationMs": gen_ms,
    }


def generate_og_preview(force=False):
    if not force and os.path.exists(OG_OUT_PATH):
        print("[SKIP] og-preview.png already exists", flush=True)
        return
    client, types = upipe._get_genai_client()
    if not client or not types:
        print("[WARN] Cannot generate og-preview.png without GEMINI_API_KEY", flush=True)
        return
    print("[GEN ] Generating 1200x630 og-preview.png...", flush=True)
    prompt = (
        "National Geographic museum exhibition widescreen key art banner showing a dramatic seamless vertical optical split "
        "across three photorealistic wildlife ecosystems: left third Rocky Mountain alpine meadow with glowing ultraviolet wildflowers "
        "and soaring kestrel eye detail, center third Indo-Pacific coral reef with biofluorescent emerald coral and glowing cyan "
        "electroreception ripples, right third misty nocturnal tropical cloud forest with luminous emerald gecko eye and subtle "
        "ultrasonic blue sonar rings. Rich dark obsidian atmospheric vignette, cinema-grade macro photography, zero text, no words, no watermarks."
    )
    response = client.models.generate_content(
        model=upipe.IMAGE_MODEL_CANDIDATES[0],
        contents=prompt,
        config=types.GenerateContentConfig(response_modalities=[types.Modality.IMAGE]),
    )
    raw = None
    for cand in (response.candidates or []):
        if cand.content and cand.content.parts:
            for part in cand.content.parts:
                if part.inline_data and part.inline_data.data:
                    raw = part.inline_data.data
                    break
        if raw:
            break
    if not raw:
        print("[WARN] No image returned for og-preview.png", flush=True)
        return
    img = upipe._fit_16_9(Image.open(io.BytesIO(raw)), target_w=1200, target_h=630)
    # Add crisp museum-grade editorial dark gradient & clean title badge at bottom-left
    overlay = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(360, 630):
        alpha = int(215 * ((y - 360) / 270.0) ** 1.25)
        draw.line([(0, y), (1200, y)], fill=(6, 10, 18, alpha))

    # Subtle optical reticle accent circle on right
    draw.ellipse([(920, 90), (1120, 290)], outline=(52, 211, 153, 145), width=2)
    draw.ellipse([(950, 120), (1090, 260)], outline=(168, 85, 247, 130), width=1)
    draw.line([(1020, 74), (1020, 114)], fill=(52, 211, 153, 170), width=2)
    draw.line([(1020, 266), (1020, 306)], fill=(52, 211, 153, 170), width=2)
    draw.line([(904, 190), (944, 190)], fill=(52, 211, 153, 170), width=2)
    draw.line([(1096, 190), (1136, 190)], fill=(52, 211, 153, 170), width=2)

    try:
        font_title = ImageFont.truetype("georgiab.ttf", 64)
        font_sub = ImageFont.truetype("arialbd.ttf", 24)
        font_pill = ImageFont.truetype("consolab.ttf", 18)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_pill = ImageFont.load_default()

    draw.rounded_rectangle([(56, 412), (416, 446)], radius=17, fill=(7, 15, 26, 215), outline=(52, 211, 153, 180), width=1)
    draw.text((74, 420), "PUNFICTION.IO  ·  WEBGL2 OPTICS", fill=(110, 231, 183, 255), font=font_pill)
    draw.text((56, 462), "UMWELT: Animal Optics", fill=(248, 250, 252, 255), font=font_title)
    draw.text((58, 542), "3 Biomes · 15 Ecological POVs · UV, Thermal IR, Polarization, Electroreception & Sonar", fill=(203, 213, 225, 255), font=font_sub)

    composed = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    os.makedirs(os.path.dirname(OG_OUT_PATH), exist_ok=True)
    composed.save(OG_OUT_PATH, format="PNG", optimize=True)
    print(f"[DONE] Saved og-preview.png ({os.path.getsize(OG_OUT_PATH)//1024}KB)", flush=True)


def main():
    force = "--force" in sys.argv
    os.makedirs(PLATES_OUT_DIR, exist_ok=True)

    manifest = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as fh:
                manifest = json.load(fh)
        except Exception:
            manifest = {}

    jobs = []
    for biome in umwelt_data.BIOMES:
        default_preset = biome["lightingPresets"][0]["id"]
        for species in biome["species"]:
            jobs.append((biome, species, default_preset))

    print(f"=== Umwelt Launch Plate Generator: {len(jobs)} POVs ===", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futs = [pool.submit(generate_single_plate, b, s, p, force) for (b, s, p) in jobs]
        for fut in concurrent.futures.as_completed(futs):
            try:
                pk, entry = fut.result()
                if entry is not None:
                    manifest[pk] = entry
                    with open(MANIFEST_PATH, "w", encoding="utf-8") as fh:
                        json.dump(manifest, fh, indent=2, ensure_ascii=False)
            except Exception as exc:
                print(f"[ERR ] Plate job failed: {exc}", flush=True)

    try:
        generate_og_preview(force=force)
    except Exception as exc:
        print(f"[ERR ] OG preview failed: {exc}", flush=True)

    print(f"=== Complete! Manifest has {len(manifest)} plates at {MANIFEST_PATH} ===", flush=True)


if __name__ == "__main__":
    main()
