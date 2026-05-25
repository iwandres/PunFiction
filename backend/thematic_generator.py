import json
import os
import time
import csv
from api_clients import generate_thematic_parody

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
PHASE2_QUOTES_FILE = os.path.join(DIR_PATH, 'phase2_quotes.json')
PUNNED_QUOTES_FILE = os.path.join(DIR_PATH, 'punned_quotes.json')
BOSS_WORD_POOL_FILE = os.path.join(DIR_PATH, 'boss_word_pool.csv')

def load_json(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def append_to_csv(filepath, words):
    # Determine if we need to write a header
    file_exists = os.path.exists(filepath)
    with open(filepath, 'a', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(["target_guess_word"])
        for word in words:
            writer.writerow([word])

def main():
    print("Loading datasets...")
    quotes = load_json(PHASE2_QUOTES_FILE)
    punned_quotes = load_json(PUNNED_QUOTES_FILE)
    
    # Create a lookup for quotes by ID
    quote_lookup = {q['id']: q for q in quotes}
    
    processed_count = 0
    new_words_to_append = []
    
    for pun in punned_quotes:
            
        # Check if we already processed this pun
        if 'parody_title' in pun and 'parody_pitch' in pun:
            continue
            
        original_quote_data = quote_lookup.get(pun['quote_id'])
        if not original_quote_data:
            print(f"Warning: Could not find original quote data for {pun['quote_id']}")
            continue
            
        movie_title = original_quote_data.get('movie', 'Unknown Movie')
        original_quote_text = original_quote_data.get('original_quote', '')
        
        print(f"Processing {pun['pun_id']} for movie: {movie_title}")
        
        # Call Gemini
        result = generate_thematic_parody(
            movie_title=movie_title,
            original_quote=original_quote_text,
            punned_quote=pun['text'],
            replaced_word=pun['replaced_word'],
            rhyme_word=pun['rhyme_used']
        )
        
        if result:
            print(f"  -> Generated Parody: {result.get('parody_title')}")
            
            # Update the pun object
            pun['parody_title'] = result.get('parody_title')
            pun['parody_pitch'] = result.get('parody_pitch')
            pun['thought_process'] = result.get('thought_process')
            pun['target_guess_words'] = result.get('target_guess_words', [pun['rhyme_used']])
            
            # Collect guess words for CSV
            new_words_to_append.extend(pun['target_guess_words'])
            
            processed_count += 1
            
            # Save progress periodically
            if processed_count % 5 == 0:
                print(f"Saving progress... ({processed_count} processed)")
                save_json(PUNNED_QUOTES_FILE, punned_quotes)
                if new_words_to_append:
                    append_to_csv(BOSS_WORD_POOL_FILE, new_words_to_append)
                    new_words_to_append = []
        
        # 1-second delay to avoid rate limiting
        time.sleep(1)
        
    # Final save
    if processed_count > 0:
        print("Saving final results...")
        save_json(PUNNED_QUOTES_FILE, punned_quotes)
        if new_words_to_append:
            append_to_csv(BOSS_WORD_POOL_FILE, new_words_to_append)
            
    print(f"Done! Processed {processed_count} new puns.")

if __name__ == "__main__":
    main()
