import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel('models/gemini-3-pro-image-preview')
try:
    print("Testing models/gemini-3-pro-image-preview...")
    response = model.generate_content("Generate a small placeholder movie poster for a comedy parody called 'Sherry Harry'. Just return the image.")
    print("Response parts length:", len(response.parts))
    for part in response.parts:
        if part.inline_data:
            print("Got inline_data with mime_type:", part.inline_data.mime_type)
        else:
            print("Got text:", part.text[:200])
except Exception as e:
    print("Error with gemini-3-pro-image-preview:", e)

model_31_pro = genai.GenerativeModel('models/gemini-3.1-pro-preview')
try:
    print("\nTesting models/gemini-3.1-pro-preview...")
    response = model_31_pro.generate_content("Generate a small placeholder movie poster for a comedy parody called 'Sherry Harry'. Just return the image.")
    print("Response parts length:", len(response.parts))
    for part in response.parts:
        if part.inline_data:
            print("Got inline_data with mime_type:", part.inline_data.mime_type)
        else:
            print("Got text:", part.text[:200])
except Exception as e:
    print("Error with gemini-3.1-pro-preview:", e)

