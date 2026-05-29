import json
import os
import requests
import time
import sys

def get_usable_rhymes(target_word):
    """Fetches exact rhymes and filters out obscure words, spaces, and hyphens."""
    if not target_word:
        return []
        
    url = f"https://api.datamuse.com/words?rel_rhy={target_word}&md=f"
    try:
        response = requests.get(url, timeout=5)
        rhymes = response.json()
        
        valid_rhymes = []
        for item in rhymes:
            tags = item.get("tags", [])
            freq = 0
            for tag in tags:
                if tag.startswith("f:"):
                    freq = float(tag.split(":")[1])
            
            # Only keep words with frequency > 1.0 AND explicitly filter out spaces and hyphens
            if freq > 1.0 and " " not in item['word'] and "-" not in item['word']:
                valid_rhymes.append(item['word'].capitalize())
                
                # Cap at 20
                if len(valid_rhymes) >= 20:
                    break
                
        return valid_rhymes
    except Exception as e:
        print(f"Datamuse API Error for '{target_word}': {e}", flush=True)
        return []

def main():
    quotes_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'backend', 'phase2_quotes.json')
    
    with open(quotes_file, 'r', encoding='utf-8') as f:
        quotes = json.load(f)

    print(f"Processing {len(quotes)} quotes...", flush=True)
    
    updated = False
    for i, q in enumerate(quotes):
        if 'rhyme1_candidates' not in q:
            q['rhyme1_candidates'] = get_usable_rhymes(q.get('rhyme1', ''))
            updated = True
            time.sleep(0.05) # Rate limit politely
            
        if 'rhyme2_candidates' not in q:
            q['rhyme2_candidates'] = get_usable_rhymes(q.get('rhyme2', ''))
            updated = True
            time.sleep(0.05)
            
        if (i + 1) % 50 == 0:
            print(f"Processed {i + 1}/{len(quotes)} quotes...", flush=True)
            if updated:
                with open(quotes_file, 'w', encoding='utf-8') as f:
                    json.dump(quotes, f, indent=2)
                updated = False

    if updated:
        with open(quotes_file, 'w', encoding='utf-8') as f:
            json.dump(quotes, f, indent=2)
            
    print("Done generating rhymes!", flush=True)

if __name__ == '__main__':
    main()
