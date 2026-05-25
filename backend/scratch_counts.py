import json
import os

backend = r'c:\Users\iwand\.antigravity\Projects\PunFiction\backend'

try:
    with open(os.path.join(backend, 'punned_quotes.json'), 'r', encoding='utf-8') as f:
        puns = json.load(f)
        print("punned_quotes.json:", len(puns))
except Exception as e: print("punned_quotes.json Error:", e)

try:
    with open(os.path.join(backend, 'reviewed_parodies.json'), 'r', encoding='utf-8') as f:
        revs = json.load(f)
        approved = sum(1 for r in revs if r.get('status') == 'approved')
        print("reviewed_parodies.json: total", len(revs), "approved", approved)
except Exception as e: print("reviewed_parodies.json Error:", e)

try:
    with open(os.path.join(backend, 'poster_prompts_state.json'), 'r', encoding='utf-8') as f:
        posters = json.load(f)
        generated = sum(1 for p in posters if p.get('generated') == True)
        print("poster_prompts_state.json: total", len(posters), "generated", generated)
except Exception as e: print("poster_prompts_state.json Error:", e)
