import os
import google.generativeai as genai
import json

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel('models/nano-banana-pro-preview')
try:
    response = model.generate_content("Generate an image of a banana.")
    print("Response parts length:", len(response.parts))
    for part in response.parts:
        if part.inline_data:
            print("Got inline_data with mime_type:", part.inline_data.mime_type)
        else:
            print("Got text:", part.text[:100])
except Exception as e:
    print("Error with nano-banana:", e)
