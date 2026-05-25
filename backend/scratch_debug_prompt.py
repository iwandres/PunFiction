import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

with open("poster_prompts_state.json", "r", encoding="utf-8") as f:
    prompts = json.load(f)

item = [p for p in prompts if p['pun_id'] == 'quote_007_1778210562551'][0]
print("Prompt to debug:")
print(item['prompt'])

model = genai.GenerativeModel('models/gemini-3.1-flash-image-preview')
try:
    print("\nCalling gemini-3.1-flash-image-preview...")
    response = model.generate_content(item['prompt'])
    print("Response parts length:", len(response.parts))
    for idx, part in enumerate(response.parts):
        if part.inline_data:
            print(f"Part {idx}: Got inline_data with mime_type:", part.inline_data.mime_type)
        else:
            print(f"Part {idx}: Got text: {part.text}")
except Exception as e:
    print("Error during call:", e)

