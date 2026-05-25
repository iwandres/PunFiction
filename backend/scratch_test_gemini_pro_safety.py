import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel('models/gemini-3-pro-image-preview')
try:
    print("Testing models/gemini-3-pro-image-preview safety...")
    response = model.generate_content("Generate a movie poster illustration for a comedy spoof movie called 'Star Wars: A New Mope' in a retro space style.")
    print("Response parts length:", len(response.parts))
    for part in response.parts:
        if part.inline_data:
            print("Got inline_data with mime_type:", part.inline_data.mime_type)
        else:
            print("Got text:", part.text[:200])
except Exception as e:
    print("Error with safety test:", e)

