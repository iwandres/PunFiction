import json
import os
import re

STYLES = {
    "mythic_epic": "mythic and epic illustrative style, hand-painted character collages, dramatic lighting, action scenes that evoke 1930s pulp adventure serials, Drew Struzan style, central floating head composition, vibrant colors, detailed airbrush work, nostalgic romantic feel",
    "pop_art": "Roy Lichtenstein pop art style, bold primary colors, heavy halftone dots, comic book aesthetic",
    "mid_century": "1950s UPA animation style, geometric shapes, flat colors, minimalist mid-century modern illustration",
    "woodcut": "medieval woodcut print style, intricate linework, monochromatic ink on parchment texture",
    "wpa_poster": "1930s WPA National Park poster style, muted earthy colors, flat vector shapes, screen-printed texture",
    "stained_glass": "intricate stained glass window design, vibrant backlit colors, heavy black lead lines separating shapes",
    "saul_bass": "1960s Saul Bass minimalist poster design, jagged paper-cutout shapes, abstract symbolism, stark contrasting colors (heavy red, black, and white)",
    "synthwave": "1980s Cyberpunk / Synthwave poster, neon magenta and cyan colors, glowing wireframe grids, chrome reflections, dark futuristic cityscapes",
    "ghibli": "1990s Studio Ghibli anime style, lush meticulously detailed watercolor backgrounds, expressive characters, vibrant pastoral colors, soft nostalgic lighting",
    "grindhouse": "1970s Grindhouse B-Movie Exploitation poster, gritty, hyper-saturated, intentionally distressed texture like folded/torn paper, lurid and sensationalist composition",
    "art_deco": "1920s Art Deco Golden Age poster, streamlined geometry, metallic golds on deep blacks, elegant symmetry, and luxurious architectural elements",
    "propaganda": "1930s Soviet Constructivist Propaganda poster, bold diagonal compositions, stark red/black/beige palettes, heroic stylized poses, and heavy industrial themes"
}

KEYWORDS = {
    "mythic_epic": ["epic", "adventure", "hero", "quest", "legend", "myth", "journey", "rebel", "empire", "galaxy", "star"],
    "woodcut": ["medieval", "sword", "king", "knight", "magic", "castle", "ancient", "spell"],
    "wpa_poster": ["nature", "animal", "shark", "ocean", "bear", "forest", "tree", "mountain", "park"],
    "pop_art": ["action", "gun", "cop", "detective", "explode", "fight", "punch", "villain", "comic", "crime"],
    "mid_century": ["office", "business", "money", "manager", "boss"],
    "saul_bass": ["mystery", "thriller", "psychological", "murder", "spy", "secret", "vertigo", "anatomy", "corporate", "law", "insane", "madness"],
    "synthwave": ["future", "cyber", "neon", "hacker", "robot", "tech", "computer", "sci-fi", "alien", "space", "data", "server"],
    "ghibli": ["spirit", "girl", "boy", "sky", "wind", "water", "farm", "fantasy", "pastoral"],
    "grindhouse": ["horror", "blood", "zombie", "monster", "kill", "dead", "gore", "slasher", "cheap", "trash", "dark", "creepy", "spooky"],
    "art_deco": ["luxury", "rich", "city", "gold", "jazz", "society", "noir", "mansion", "wealth"],
    "propaganda": ["war", "dictator", "soviet", "communist", "leader", "strike", "worker", "bureaucrat", "government", "system", "control"]
}

def assign_style(pitch, used_styles_for_movie):
    pitch_lower = pitch.lower()
    scores = {k: 0 for k in STYLES.keys()}
    
    # Heuristic scoring
    for style, words in KEYWORDS.items():
        for w in words:
            if re.search(r'\b' + w + r'\b', pitch_lower):
                scores[style] += 1
                
    # Sort styles by score
    sorted_styles = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    
    # Pick the best style that hasn't been used for this movie
    for style_key, score in sorted_styles:
        if style_key not in used_styles_for_movie:
            return style_key
            
    # If all scored styles are used or scores are 0, just pick the first unused one
    for style_key in STYLES.keys():
        if style_key not in used_styles_for_movie:
            return style_key
            
    # If a movie somehow has >7 parodies, we have to reuse styles. Pick the highest scored one.
    return sorted_styles[0][0]

def main():
    backend_dir = os.path.dirname(os.path.realpath(__file__))
    parodies_file = os.path.join(backend_dir, 'reviewed_parodies.json')
    quotes_file = os.path.join(backend_dir, 'phase2_quotes.json')
    output_file = os.path.join(backend_dir, 'poster_prompts_state.json')

    with open(parodies_file, 'r', encoding='utf-8') as f:
        parodies = json.load(f)
        
    with open(quotes_file, 'r', encoding='utf-8') as f:
        quotes_data = json.load(f)
        
    # Load existing state if any, to preserve generated ones
    existing_state = {}
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            for item in json.load(f):
                existing_state[item['pun_id']] = item
                
    # Map quote_id to original movie
    quote_to_movie = {q['id']: q['movie'] for q in quotes_data}

    prompts_state = []
    movie_used_styles = {} # movie_name -> set of used style keys
    
    # First pass: register styles of already generated items so we don't reuse them unnecessarily
    for item in parodies:
        if item.get('status') != 'approved' or not item.get('data'):
            continue
        data = item['data']
        pun_id = data['pun_id']
        original_movie = quote_to_movie.get(data['quote_id'], "Unknown Movie")
        if original_movie not in movie_used_styles:
            movie_used_styles[original_movie] = set()
        
        if pun_id in existing_state and existing_state[pun_id].get('generated'):
            style_key = existing_state[pun_id].get('style_key')
            if style_key in STYLES: # Might be retro_gaming which was removed
                movie_used_styles[original_movie].add(style_key)

    for item in parodies:
        if item.get('status') != 'approved' or not item.get('data'):
            continue
            
        data = item['data']
        pun_id = data['pun_id']
        quote_id = data['quote_id']
        original_movie = quote_to_movie.get(quote_id, "Unknown Movie")
        parody_title = data['parody_title']
        pitch = data['parody_pitch']
        
        # If it was already generated, keep the existing item exactly as is.
        if pun_id in existing_state and existing_state[pun_id].get('generated'):
            prompts_state.append(existing_state[pun_id])
            continue
        
        if original_movie not in movie_used_styles:
            movie_used_styles[original_movie] = set()
            
        chosen_style_key = assign_style(pitch, movie_used_styles[original_movie])
        movie_used_styles[original_movie].add(chosen_style_key)
        
        style_prompt = STYLES[chosen_style_key]
        
        extra_constraints = ""
        if "E.T." in original_movie or "Extra-Terrestrial" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT use the E.T. character likeness. The alien must look completely different from the copyrighted E.T. design. "
        elif "Batman" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT draw the copyrighted Batman costume, mask, cowl, or Bat-logo. The character must be a generic, funny person in a homemade, cartoonish bat-themed suit with completely different features and colors (e.g., a silly purple cowl or a generic cloth mask). "
        elif "Star Wars" in original_movie or "Jedi" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT draw Darth Vader, Stormtroopers, Yoda, or any official Star Wars character designs or light sabers. Any space knights must use generic glowing swords or silly laser beams, and space villains must wear comical, custom space helmets. "
        elif "Indiana Jones" in original_movie or "Raiders of the Lost Ark" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT copy the likeness of Harrison Ford's Indiana Jones. The explorer must be a funny, generic cartoon caricature in a generic explorer outfit. "
        elif "Spider-Man" in original_movie or "Spiderman" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT use the official Marvel Spider-Man suit design or web pattern. The character must wear a comical, homemade, poorly fitting spider outfit in different colors (e.g. green and yellow) with a cartoonish look. "
        elif "Harry Potter" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT use the copyrighted Harry Potter likeness or Gryffindor scar/uniform. Show a comical generic nerdy wizard boy. "
        elif "Lord of the Rings" in original_movie or "Hobbit" in original_movie:
            extra_constraints = "CRITICALLY IMPORTANT: Absolutely DO NOT use the film likenesses of Frodo, Gandalf, Gollum, or Sauron. All fantasy characters must look like generic, highly exaggerated cartoon/comic illustrations. "
            
        full_prompt = (
            f"Generate a vertical 3:4 movie poster illustration for a spoof movie called '{parody_title}' "
            f"(Parodying a famous classic film). "
            f"Create this entirely in the style of: {style_prompt}. It must look like an illustration, NOT a photograph or a cinematic movie still. "
            f"The central focus should be: {pitch}. "
            f"Constraints: Characters must be generic, exaggerated caricatures. Do NOT make them look like the actors or any copyrighted, original characters (e.g. iconic masked villains or specific aliens) from the original film. {extra_constraints}"
            f"CRITICAL INSTRUCTION: You must prominently feature the exact text \"{parody_title}\" as the movie title on the poster in a stylized, bold font matching the artwork. "
            f"Do not include any generic studio shields, globes, or branding."
        )
        
        prompts_state.append({
            "pun_id": data['pun_id'],
            "parody_title": parody_title,
            "original_movie": original_movie,
            "style_key": chosen_style_key,
            "prompt": full_prompt,
            "generated": False,
            "image_path": None
        })
        
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(prompts_state, f, indent=2)
        
    print(f"Successfully prepared {len(prompts_state)} poster prompts!")
    
if __name__ == "__main__":
    main()
