import os
import json
import time
from google import genai
from google.genai import types

# Setup Gemini
gemini_key = os.environ.get("GEMINI_API_KEY")
if not gemini_key:
    print("CRITICAL: GEMINI_API_KEY environment variable not set.")
    exit(1)

client = genai.Client(api_key=gemini_key)

def fetch_quotes_batch(blacklist, amount=50):
    prompt = f"""
    You are an expert movie historian building a trivia database.
    Your goal is to provide exactly {amount} highly memorable, famous, or iconic movie quotes from movies released between 1970 and today.
    
    Rules:
    1. Only use movies released between 1970 and today.
    2. Multiple quotes from the same movie are ALLOWED, provided they are genuinely iconic.
    3. DO NOT include any quotes that exactly match the text in this blacklist: {json.dumps(list(blacklist))}
    4. Provide EXACT quotes as they are spoken in the movie.
    5. Return the result strictly as a JSON array of objects.
    
    Format:
    [
      {{
        "movie": "string",
        "year": 1999,
        "character": "string",
        "original_quote": "string"
      }}
    ]
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"API Error: {e}")
        return []

def generate_all_quotes():
    total_target = 500
    batch_size = 50
    all_quotes = []
    quote_text_blacklist = set()
    
    for i in range(total_target // batch_size):
        print(f"Fetching batch {i+1} of {total_target // batch_size}...")
        
        # Retry logic for the batch
        retries = 3
        batch_success = False
        while retries > 0 and not batch_success:
            batch = fetch_quotes_batch(list(quote_text_blacklist), amount=batch_size)
            if batch and len(batch) > 0:
                for q in batch:
                    # Very simple deduplication check
                    if q.get('original_quote') not in quote_text_blacklist:
                        quote_text_blacklist.add(q['original_quote'])
                        # Assign ID
                        q['id'] = f"quote_{(len(all_quotes) + 1):03d}"
                        all_quotes.append(q)
                
                batch_success = True
                print(f"  -> Successfully added {len(batch)} quotes. Total so far: {len(all_quotes)}")
            else:
                retries -= 1
                print(f"  -> Batch failed. Retrying... ({retries} left)")
                time.sleep(2)
        
        # Pause to avoid rate limits
        time.sleep(3)
        
    print(f"\nFinished! Total unique quotes collected: {len(all_quotes)}")
    
    dir_path = os.path.dirname(os.path.realpath(__file__))
    output_file = os.path.join(dir_path, 'phase2_quotes.json')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_quotes, f, indent=2)
        
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    generate_all_quotes()
