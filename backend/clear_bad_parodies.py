import json
import os

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
PUNNED_QUOTES_FILE = os.path.join(DIR_PATH, 'punned_quotes.json')
REVIEWED_PARODIES_FILE = os.path.join(DIR_PATH, 'reviewed_parodies.json')

def load_json(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def main():
    print("Loading data...")
    punned_quotes = load_json(PUNNED_QUOTES_FILE)
    reviewed_parodies = load_json(REVIEWED_PARODIES_FILE)
    
    # Get approved IDs to preserve
    approved_ids = {r['pun_id'] for r in reviewed_parodies if r.get('status') == 'approved'}
    print(f"Found {len(approved_ids)} approved parodies to preserve.")
    
    cleared_count = 0
    preserved_count = 0
    
    for pun in punned_quotes:
        if 'parody_title' in pun:
            if pun['pun_id'] in approved_ids:
                preserved_count += 1
            else:
                # Clear the generated fields
                pun.pop('parody_title', None)
                pun.pop('parody_pitch', None)
                pun.pop('thought_process', None)
                pun.pop('target_guess_words', None)
                cleared_count += 1
                
    if cleared_count > 0:
        save_json(PUNNED_QUOTES_FILE, punned_quotes)
        print(f"Successfully scrubbed {cleared_count} unapproved parodies.")
        print(f"Preserved {preserved_count} approved parodies.")
    else:
        print("No parodies needed scrubbing.")

if __name__ == "__main__":
    main()
