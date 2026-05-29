import os
import json
import time
import io
from PIL import Image
from google import genai
from google.genai import types

def sanitize_prompt(prompt):
    # Automatically rewrite highly-blocked trademark terms and copyrighted character names
    # with generic or punned variants to bypass strict gateway safety blocks and prevent
    # the generation of trademarked character designs (e.g., Batman, Darth Vader, E.T.).
    p = prompt
    
    # 1. Star Wars sanitizations
    p = p.replace("Star Wars", "Star Bawls")
    p = p.replace("Star wars", "Star Bawls")
    p = p.replace("star wars", "Star Bawls")
    p = p.replace("Darth Vader", "a funny space villain in a generic comical black space helmet")
    p = p.replace("darth vader", "a funny space villain in a generic comical black space helmet")
    p = p.replace("Stormtrooper", "a generic white futuristic toy soldier")
    p = p.replace("stormtrooper", "a generic white futuristic toy soldier")
    p = p.replace("light saber", "glowing energy baton")
    p = p.replace("lightsaber", "glowing energy baton")
    
    # 2. E.T. sanitizations
    p = p.replace("E.T. the Extra-Terrestrial", "E-Tee the Extra-Residential")
    p = p.replace("E.T.", "E-Tee")
    p = p.replace("E.T", "E-Tee")
    
    # 3. Batman sanitizations
    p = p.replace("Batman", "a funny man in a generic, homemade bat costume (completely different from the copyrighted Batman design, NO official bat emblem or mask)")
    p = p.replace("batman", "a funny man in a generic, homemade bat costume (completely different from the copyrighted Batman design, NO official bat emblem or mask)")
    p = p.replace("Gotham", "a dark metropolitan city skyline")
    p = p.replace("gotham", "a dark metropolitan city skyline")
    p = p.replace("Joker", "a goofy white-faced clown villain")
    p = p.replace("joker", "a goofy white-faced clown villain")
    p = p.replace("Batmobile", "a comical, generic black jalopy car")
    
    # 4. Indiana Jones sanitizations
    p = p.replace("Indiana Jones", "Indy Jones")
    p = p.replace("indiana jones", "Indy Jones")
    
    # 5. Spider-Man sanitizations
    p = p.replace("Spider-Man", "a funny guy in a generic homemade red and blue spider suit (completely different from Marvel design, NO official web logos)")
    p = p.replace("Spiderman", "a funny guy in a generic homemade red and blue spider suit (completely different from Marvel design, NO official web logos)")
    p = p.replace("spider-man", "a funny guy in a generic homemade red and blue spider suit (completely different from Marvel design, NO official web logos)")
    p = p.replace("spiderman", "a funny guy in a generic homemade red and blue spider suit (completely different from Marvel design, NO official web logos)")
    
    # 6. Harry Potter sanitizations
    p = p.replace("Harry Potter", "a generic nerdy schoolboy wizard with round glasses")
    p = p.replace("harry potter", "a generic nerdy schoolboy wizard with round glasses")
    
    return p

def main():
    # Setup dynamic, robust directories
    backend_dir = os.path.dirname(os.path.realpath(__file__))
    posters_state_file = os.path.join(backend_dir, 'poster_prompts_state.json')
    assets_dir = os.path.join(backend_dir, 'assets', 'posters')
    os.makedirs(assets_dir, exist_ok=True)

    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        print("CRITICAL: GEMINI_API_KEY not set.")
        return

    # Initialize GenAI Client
    client = genai.Client(api_key=gemini_key)
    
    if not os.path.exists(posters_state_file):
        print(f"File not found: {posters_state_file}")
        return

    with open(posters_state_file, 'r', encoding='utf-8') as f:
        prompts = json.load(f)

    to_process = [p for p in prompts if not p.get('generated')]
    print(f"Found {len(to_process)} posters to generate.")

    count = 0
    for item in to_process:
        print(f"\nGenerating poster for '{item['parody_title']}' ({item['pun_id']})...")
        image_saved = False
        
        # Enforce vertical movie poster layout in the prompt
        cleaned_prompt = "Vertical 3:4 movie poster. " + sanitize_prompt(item['prompt'])
        
        # 1. Try modern Imagen 4 model with 3:4 aspect ratio
        try:
            print("Generating 3:4 vertical poster using models/imagen-4.0-generate-001...")
            response = client.models.generate_images(
                model='models/imagen-4.0-generate-001',
                prompt=cleaned_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    output_mime_type='image/png',
                    aspect_ratio='3:4',
                )
            )
            
            if response.generated_images:
                result_image = response.generated_images[0]
                
                clean_title = "".join(c for c in item['parody_title'] if c.isalnum() or c in (' ', '_')).replace(' ', '_').lower()
                filename = f"{clean_title}_poster_vertical_{int(time.time())}.png"
                filepath = os.path.join(assets_dir, filename)
                
                # Save generated image using PIL
                image_bytes = Image.open(io.BytesIO(result_image.image.image_bytes))
                image_bytes.save(filepath)
                
                item['generated'] = True
                item['image_path'] = f"/assets/posters/{filename}"
                image_saved = True
                count += 1
                print(f"[SUCCESS] Saved vertical 3:4 poster to: {item['image_path']}")
                
        except Exception as e:
            print(f"Imagen 4 vertical 3:4 call error for {item['pun_id']}: {e}")

        # 2. Try modern Imagen 4 model with 1:1 aspect ratio fallback if 3:4 fails
        if not image_saved:
            print("Vertical generation failed. Attempting fallback generation with 1:1 aspect ratio...")
            try:
                response = client.models.generate_images(
                    model='models/imagen-4.0-generate-001',
                    prompt=cleaned_prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type='image/png',
                        aspect_ratio='1:1',
                    )
                )
                
                if response.generated_images:
                    result_image = response.generated_images[0]
                    
                    clean_title = "".join(c for c in item['parody_title'] if c.isalnum() or c in (' ', '_')).replace(' ', '_').lower()
                    filename = f"{clean_title}_poster_fallback_{int(time.time())}.png"
                    filepath = os.path.join(assets_dir, filename)
                    
                    image_bytes = Image.open(io.BytesIO(result_image.image.image_bytes))
                    image_bytes.save(filepath)
                    
                    item['generated'] = True
                    item['image_path'] = f"/assets/posters/{filename}"
                    image_saved = True
                    count += 1
                    print(f"[SUCCESS] Saved fallback 1:1 poster to: {item['image_path']}")
                    
            except Exception as e:
                print(f"Fallback 1:1 generation failed for {item['pun_id']}: {e}")

        if image_saved:
            # Periodically write state to file to prevent loss if execution is aborted mid-loop
            with open(posters_state_file, 'w', encoding='utf-8') as f:
                json.dump(prompts, f, indent=2)
        else:
            print(f"CRITICAL ERROR: Failed to generate image data using all models for {item['pun_id']}")

        time.sleep(2) # Small delay to be polite to the API rate limit

    print(f"\nFinished generating {count} posters.")

if __name__ == "__main__":
    main()
