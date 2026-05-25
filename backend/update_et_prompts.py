import json
import os

backend_dir = r'c:\Users\iwand\.antigravity\Projects\PunFiction\backend'
posters_state_file = os.path.join(backend_dir, 'poster_prompts_state.json')

with open(posters_state_file, 'r', encoding='utf-8') as f:
    prompts = json.load(f)

updated = 0
for p in prompts:
    if "E.T." in p.get("original_movie", "") or "Extra-Terrestrial" in p.get("original_movie", ""):
        if "DO NOT use the E.T. character likeness" not in p["prompt"]:
            # Insert the constraint before "CRITICAL INSTRUCTION"
            parts = p["prompt"].split("CRITICAL INSTRUCTION:")
            if len(parts) == 2:
                new_prompt = parts[0] + "CRITICALLY IMPORTANT: Absolutely DO NOT use the E.T. character likeness. The alien must look completely different from the copyrighted E.T. design. CRITICAL INSTRUCTION:" + parts[1]
                p["prompt"] = new_prompt
                updated += 1
                
                # If it was rejected, we definitely want it to regenerate cleanly, so maybe we keep it as rejected so the dashboard sees it.
                # Actually, if it's in the queue, we just update the prompt so the next generation uses it.

with open(posters_state_file, 'w', encoding='utf-8') as f:
    json.dump(prompts, f, indent=2)

print(f"Updated {updated} prompts for E.T. parodies.")
