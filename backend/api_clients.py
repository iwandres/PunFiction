import os
import requests
import json
import google.generativeai as genai

# Configure Gemini securely
gemini_key = os.environ.get("GEMINI_API_KEY")
if gemini_key:
    genai.configure(api_key=gemini_key)

def get_usable_rhymes(target_word):
    """Fetches exact rhymes and filters out obscure words, spaces, and hyphens."""
    url = f"https://api.datamuse.com/words?rel_rhy={target_word}&md=f"
    try:
        response = requests.get(url)
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
                
        return valid_rhymes
    except Exception as e:
        print(f"Datamuse API Error for '{target_word}': {e}")
        return []

def evaluate_permutations_batch(permutations_batch):
    """
    Sends a batch of permutations to Gemini to filter for logic and humor, 
    and generates a pitch for the approved ones.
    """
    if not gemini_key:
        print("CRITICAL: GEMINI_API_KEY not set.")
        return []
        
    model = genai.GenerativeModel('gemini-3.1-pro-preview')
    
    prompt = f"""
    System: You are a comedy writer evaluating potential movie-title puns for a trivia game. 
    You will be provided with a JSON array of auto-generated rhyming movie titles. 
    Your job is to filter this list based on two rules:
    1. Does the pun make grammatical and logical sense?
    2. Is it actually funny?
    For the ones that pass, write a one-sentence comedic pitch explaining the plot of this new fake movie. 
    For the ones that fail, discard them entirely.
    
    INPUT:
    {json.dumps(permutations_batch)}
    
    Return a JSON array of the approved titles matching exactly this schema:
    [{{
      "pun_title_generated": "string",
      "llm_pitch": "string"
    }}]
    """
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        approved_puns = json.loads(response.text)
        return approved_puns
    except Exception as e:
        print(f"Gemini Batch Evaluation Error: {e}")
        return []

def generate_mini_puzzle(target_word, blacklist):
    """Asks the API to build a single puzzle around a target word."""
    if not gemini_key:
        print("CRITICAL: GEMINI_API_KEY not set.")
        return None
        
    model = genai.GenerativeModel('gemini-3.1-pro-preview')
    
    prompt = f"""
    You are a strict logic engine building a trivia game. 
    You will be given a TARGET WORD. 
    Your goal is to find a highly recognizable, famous movie title where changing ONE word to the TARGET WORD creates a perfect phonetic rhyme.
    
    Rules:
    1. The original movie MUST be universally recognizable.
    2. The original quote MUST be an iconic line from that specific movie.
    3. You must alter 1-2 words in the original quote so that it contextually hints at the new TARGET WORD. 
    4. DO NOT use any movies in the provided BLACKLIST.
    
    TARGET WORD: {target_word}
    BLACKLIST: {blacklist}
    
    EXAMPLE:
    Target Word: "RAIDING"
    Thought Process: "Raiding" rhymes with "Saving". Movie: "Saving Private Ryan". Iconic Quote: "Earn this." Altered Quote to match Raiding: "Burn this."
    
    Generate the puzzle in the following strict JSON format:
    {{
        "target_word": "{target_word}",
        "original_movie": "string",
        "punned_movie": "string",
        "original_quote": "string",
        "modified_quote": "string"
    }}
    """
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        puzzle_data = json.loads(response.text)
        return puzzle_data
    except Exception as e:
        print(f"Gemini Puzzle Gen API Error for word {target_word}: {e}")
        return None

def generate_thematic_parody(movie_title, original_quote, punned_quote, replaced_word, rhyme_word):
    """Generates a parody title and pitch based on the punned quote using a Pitch-First approach."""
    if not gemini_key:
        print("CRITICAL: GEMINI_API_KEY not set.")
        return None
        
    model = genai.GenerativeModel('gemini-3.1-pro-preview')
    
    prompt = f"""
    System: You are a brilliant comedy writer specializing in absurd movie parodies and wordplay.
    Your task is to take an original movie and a newly "punned" quote from that movie, and create a Fictional Parody Title and a 1-sentence comedic pitch for this absurd new movie.

    You must follow a 4-step "Phonetic Intersection" process to ensure the highest quality parody title:
    1. Pitch: First, write a 1-sentence comedic `parody_pitch` that explains a movie where this absurd punned quote would naturally be spoken.
    2. Phonetic Target: Explicitly break down the syllables and rhyming sounds of the ORIGINAL MOVIE title.
    3. Thematic Brainstorm: Generate a short list of words that are conceptually related to the NEW RHYME WORD and the absurd Pitch.
    4. The Intersection: Find a word from your brainstorm list that perfectly rhymes with (or sounds very similar to) a key word in the ORIGINAL MOVIE title. Use this intersection to generate the `parody_title`.
    
    Example Thought Process:
    Original: "Jaws". Quote: "You're gonna need a bigger coat." Rhyme Word: "coat".
    1. Pitch: A giant killer shark terrorizes a beach town, but instead of eating people, it just gives them profound chills, forcing everyone to bundle up.
    2. Phonetic Target: "Jaws" is one syllable, rhyming with -aws (pause, claws, laws, thaws).
    3. Thematic Brainstorm: coat -> winter, freeze, cold, jacket, snow, thaw.
    4. Intersection: "thaw" rhymes perfectly with "Jaws". Parody Title = "Thaws".

    ORIGINAL MOVIE: {movie_title}
    ORIGINAL QUOTE: {original_quote}
    PUNNED QUOTE: {punned_quote}
    REPLACED WORD: {replaced_word}
    NEW RHYME WORD: {rhyme_word}

    Return a JSON object exactly matching this schema:
    {{
      "thought_process": "1. Pitch: ... 2. Phonetic Target: ... 3. Brainstorm: ... 4. Intersection: ...",
      "parody_pitch": "A 1-sentence absurd summary of the fake movie.",
      "parody_title": "The new punned movie title.",
      "target_guess_words": ["{rhyme_word}"]
    }}
    """
    
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Gemini Thematic Parody API Error for {movie_title}: {e}")
        return None
