import http.server
import socketserver
import json
import os
import urllib.parse
import time
import sys
import subprocess
import touristtraps_database as database

PORT = int(os.environ.get("PORT", 8001))
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
PROJECT_ROOT = os.path.dirname(DIR_PATH)

# File Paths
DAILY_GAMES_FILE = os.path.join(DIR_PATH, 'touristtraps_daily_games.json')
LANDMARKS_FILE = os.path.join(DIR_PATH, 'touristtraps_landmarks.json')
PUNS_FILE = os.path.join(DIR_PATH, 'touristtraps_puns.json')
CLUES_FILE = os.path.join(DIR_PATH, 'touristtraps_clues.json')
POSTCARDS_FILE = os.path.join(DIR_PATH, 'touristtraps_postcards.json')
RECORDS_FILE = os.path.join(DIR_PATH, 'touristtraps_records.json')
HTML_FILE = os.path.join(DIR_PATH, 'touristtraps_admin.html')

CARTOONS_DIR = os.path.join(PROJECT_ROOT, 'touristtraps', 'assets', 'cartoons')
os.makedirs(CARTOONS_DIR, exist_ok=True)

# Helper to load/save JSON
def load_json(filepath, default_val=[]):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
    return default_val

def save_json(filepath, data):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

# Initialize Gemini Client if key available
gemini_key = os.environ.get("GEMINI_API_KEY")
gemini_available = bool(gemini_key)

class TouristTrapsRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        req_path = self.path.split('?')[0]
        
        # 1. Admin Page
        if req_path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open(HTML_FILE, 'rb') as f:
                self.wfile.write(f.read())
                
        # 2. Curation APIs
        elif req_path == '/api/landmarks':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = load_json(LANDMARKS_FILE, [])
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif req_path == '/api/puns':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = load_json(PUNS_FILE, [])
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif req_path == '/api/clues':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = load_json(CLUES_FILE, [])
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif req_path == '/api/postcards':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = load_json(POSTCARDS_FILE, [])
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif req_path == '/api/puzzles':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            data = load_json(DAILY_GAMES_FILE, [])
            self.wfile.write(json.dumps(data).encode('utf-8'))
            
        elif req_path == '/api/records':
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            puzzle_number = query_params.get('puzzle_number', [None])[0]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            try:
                if puzzle_number:
                    stats = database.get_telemetry_stats(puzzle_number)
                else:
                    stats = database.get_telemetry_stats()
                    # Sync local file
                    save_json(RECORDS_FILE, stats)
                self.wfile.write(json.dumps(stats).encode('utf-8'))
            except Exception as e:
                print(f"MongoDB error: {e}, falling back to local file")
                telemetry = load_json(RECORDS_FILE, {})
                if puzzle_number:
                    self.wfile.write(json.dumps(telemetry.get(puzzle_number, {
                        "start": 0, "attempts": 0, "solve_0": 0, "solve_1": 0, "solve_2": 0, "solve_3": 0, "solve_4": 0,
                        "solve_att_1": 0, "solve_att_2": 0, "solve_att_3": 0, "solve_att_4": 0, "solve_att_5": 0
                    })).encode('utf-8'))
                else:
                    self.wfile.write(json.dumps(telemetry).encode('utf-8'))
                    
        elif req_path == '/api/user':
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            profile_id = query_params.get('profile_id', [None])[0]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            if profile_id:
                try:
                    profile = database.get_user_profile(profile_id)
                    if profile:
                        self.wfile.write(json.dumps(profile).encode('utf-8'))
                    else:
                        self.wfile.write(json.dumps({"error": "Profile not found"}).encode('utf-8'))
                except Exception as e:
                    self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            else:
                self.wfile.write(json.dumps({"error": "profile_id is required"}).encode('utf-8'))
                
        # 3. Serve Client Files Directly (e.g. /touristtraps/index.html, /touristtraps/app.js)
        elif req_path.startswith('/touristtraps/') or req_path.startswith('/assets/'):
            clean_path = urllib.parse.unquote(req_path.strip('/'))
            if req_path.startswith('/assets/'):
                file_path = os.path.join(PROJECT_ROOT, 'touristtraps', *clean_path.split('/'))
            else:
                file_path = os.path.join(PROJECT_ROOT, *clean_path.split('/'))
            if os.path.exists(file_path) and not os.path.isdir(file_path):
                self.send_response(200)
                if file_path.endswith('.html'):
                    self.send_header('Content-type', 'text/html')
                elif file_path.endswith('.js'):
                    self.send_header('Content-type', 'application/javascript')
                elif file_path.endswith('.css'):
                    self.send_header('Content-type', 'text/css')
                elif file_path.endswith('.png'):
                    self.send_header('Content-type', 'image/png')
                elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                    self.send_header('Content-type', 'image/jpeg')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404)
        else:
            self.send_error(404)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        req_path = self.path.split('?')[0]
        
        # 1. Curation Post Operations
        if req_path in ['/api/landmarks', '/api/puns', '/api/clues', '/api/postcards', '/api/puzzles']:
            file_map = {
                '/api/landmarks': LANDMARKS_FILE,
                '/api/puns': PUNS_FILE,
                '/api/clues': CLUES_FILE,
                '/api/postcards': POSTCARDS_FILE,
                '/api/puzzles': DAILY_GAMES_FILE
            }
            target_file = file_map[req_path]
            try:
                data = json.loads(post_data.decode('utf-8'))
                save_json(target_file, data)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                
        elif req_path == '/api/records':
            try:
                payload = json.loads(post_data.decode('utf-8'))
                event = payload.get('event')
                puzzle_number = payload.get('puzzle_number')
                hints_used = int(payload.get('hints_used', 0))
                attempts = int(payload.get('attempts', 1))
                
                db_success = True
                try:
                    database.record_telemetry_event(puzzle_number, event, hints_used, attempts)
                except Exception as db_e:
                    print(f"MongoDB failed, logging locally: {db_e}")
                    db_success = False
                
                # Sync local fallback file
                telemetry = load_json(RECORDS_FILE, {})
                if puzzle_number not in telemetry:
                    telemetry[puzzle_number] = {
                        "start": 0, "attempts": 0, "solve_0": 0, "solve_1": 0, "solve_2": 0, "solve_3": 0, "solve_4": 0,
                        "solve_att_1": 0, "solve_att_2": 0, "solve_att_3": 0, "solve_att_4": 0, "solve_att_5": 0,
                        "click_profile": 0, "click_stats": 0, "click_help": 0
                    }
                
                if event == 'start':
                    telemetry[puzzle_number]["start"] += 1
                elif event == 'attempt':
                    telemetry[puzzle_number]["attempts"] += 1
                elif event == 'solve':
                    hints_used = max(0, min(4, hints_used))
                    attempts = max(1, min(5, attempts))
                    telemetry[puzzle_number][f"solve_{hints_used}"] += 1
                    telemetry[puzzle_number][f"solve_att_{attempts}"] += 1
                elif event in ['click_profile', 'click_stats', 'click_help']:
                    telemetry[puzzle_number][event] += 1
                    
                save_json(RECORDS_FILE, telemetry)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "db_connected": db_success}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                
        elif req_path == '/api/user':
            try:
                payload = json.loads(post_data.decode('utf-8'))
                profile_id = payload.get('profile_id')
                solved_puzzles = payload.get('solved_puzzles', [])
                solved_hints = payload.get('solved_hints', {})
                attempted_puzzles = payload.get('attempted_puzzles', [])
                max_streak = int(payload.get('max_streak', 0))
                
                success = database.upsert_user_profile(
                    profile_id, solved_puzzles, solved_hints, attempted_puzzles, max_streak
                )
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": success}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

        # 2. Automated Generation Calls via Gemini
        elif req_path == '/api/generate_puns':
            if not gemini_available:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "GEMINI_API_KEY env variable missing"}).encode('utf-8'))
                return
                
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=gemini_key)
                
                landmarks = load_json(LANDMARKS_FILE, [])
                puns = load_json(PUNS_FILE, [])
                existing_landmarks_in_puns = {p['landmark_id'] for p in puns}
                
                approved_landmarks = [l for l in landmarks if l.get('status') == 'approved' and l['id'] not in existing_landmarks_in_puns]
                
                new_puns_count = 0
                # Process in batches of 5 to avoid HTTP timeouts
                for lm in approved_landmarks[:5]:
                    prompt = f"""
                    You are a comedy writer for a travel pun trivia game. 
                    Given the famous landmark "{lm['name']}" located in "{lm.get('location', 'Unknown')}", generate 3 funny location puns.
                    Each pun must change a part of the original landmark name to a rhyming word, creating a funny parodied landmark.
                    Example:
                    Original Landmark: Grand Canyon
                    Generated Pun: The Grand Crayon
                    
                    Return a JSON array of objects with exactly this schema:
                    [
                      {{
                        "pun_name": "The Grand Crayon",
                        "replaced_part": "Canyon",
                        "rhyme_used": "Crayon"
                      }}
                    ]
                    """
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json"
                        )
                    )
                    generated = json.loads(response.text)
                    
                    for idx, g in enumerate(generated):
                        puns.append({
                            "id": f"pun_{lm['id']}_{idx}_{int(time.time())}",
                            "landmark_id": lm['id'],
                            "original_name": lm['name'],
                            "pun_name": g['pun_name'],
                            "replaced_part": g.get('replaced_part', ''),
                            "rhyme_used": g.get('rhyme_used', ''),
                            "status": "pending"
                        })
                        new_puns_count += 1
                        
                save_json(PUNS_FILE, puns)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "generated_count": new_puns_count}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

        elif req_path == '/api/generate_clues':
            if not gemini_available:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "GEMINI_API_KEY env variable missing"}).encode('utf-8'))
                return
                
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=gemini_key)
                
                puns = load_json(PUNS_FILE, [])
                clues = load_json(CLUES_FILE, [])
                existing_puns_in_clues = {c['pun_id'] for c in clues}
                
                approved_puns = [p for p in puns if p.get('status') == 'approved' and p['id'] not in existing_puns_in_clues]
                
                new_clues_count = 0
                # Process in batches of 5 to avoid HTTP timeouts
                for p in approved_puns[:5]:
                    prompt = f"""
                    You are a writer for a 1-star TripAdvisor review parody game.
                    Original Landmark: {p['original_name']}
                    Pun Name: {p['pun_name']}
                    
                    Your job is to generate 3 progressive clues (reviews) complaining about this location in an unhinged, comedic way:
                    - Clue 1: The most obscure, absurd complaint about the location.
                    - Clue 2: A slightly more obvious complaint about the original landmark's actual features.
                    - Clue 3: A complaint that makes it fairly obvious what the location pun is (without saying it).
                    
                    Also generate a funny review title.
                    Also generate a funny Reviewer Username (reviewer_name) that is thematically related to the parodied location or the complaint (e.g., 'SyrupSlinger' for Waffle Tower, 'SoggySouffle' for Eiffel Shower, 'BitterSingle' for Lover Museum). Do not include the '@' symbol in the JSON value.
                    
                    Also generate a 'Response from the Owner' (flavor text reply from management).
                    CRITICAL: The Owner's POV is the manager of the ACTUAL historical landmark (e.g. the Eiffel Tower, the Louvre Museum, etc.). You are responding to a ridiculous 1-star TripAdvisor review from a traveler who has confused your actual historical landmark with a silly, literal pun name (e.g., Eiffel Towel, Waffle Tower, Lover Museum).
                    The response must be short (under 2 sentences), highly sarcastic, and punchy, correcting the reviewer's absurd confusion by pointing out the actual nature of your landmark (e.g. that it is a 300-meter iron monument, a fine art museum, etc.) and why their complaint makes no sense.
                    To bolster the response and make it highly contextual, the owner can directly reference a specific notable complaint or mistake made by the reviewer in the clues (e.g., trying to dry off with wrought iron, complaining about square indentations or wanting maple syrup on the girders). Do NOT mention the original landmark name in the response itself.
                    The owner should occasionally reference the reviewer's username (reviewer_name) directly in their reply prefixed with '@' (e.g. 'Listen here, @DampCroissant...', 'Dear @DampCroissant...'), but vary it sometimes with general greetings like 'Dear Traveler' or 'Dear Adventurer'.
                    Example of the tone:
                    Actual Landmark: Eiffel Tower
                    Pun Name: Eiffel Towel
                    Reviewer Username: DampCroissant
                    Reviewer Complaint: "Tried to dry off after my shower with it, but it's made of wrought iron and completely non-absorbent."
                    Response from the Owner: "Listen, @DampCroissant, if you are using 10,000 tons of 19th-century iron to dry your hair, you have significantly bigger problems than a slight draft."
                    
                    Return a JSON object matching exactly this schema:
                    {
                      "reviewer_name": "Username",
                      "review_title": "Avoid at all costs!",
                      "clue1": "Clue 1 text",
                      "clue2": "Clue 2 text",
                      "clue3": "Clue 3 text",
                      "owner_response": "Owner response here"
                    }
                    """
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json"
                        )
                    )
                    generated = json.loads(response.text)
                    
                    clues.append({
                        "id": f"clue_{p['id']}_{int(time.time())}",
                        "pun_id": p['id'],
                        "pun_name": p['pun_name'],
                        "original_name": p['original_name'],
                        "reviewer_name": generated.get('reviewer_name', 'DisappointedTraveler'),
                        "review_title": generated.get('review_title', 'Avoid at all costs!'),
                        "clue1": generated['clue1'],
                        "clue2": generated['clue2'],
                        "clue3": generated['clue3'],
                        "owner_response": generated['owner_response'],
                        "status": "pending"
                      })
                    new_clues_count += 1
                    
                save_json(CLUES_FILE, clues)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "generated_count": new_clues_count}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

        elif req_path == '/api/generate_postcards':
            if not gemini_available:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "GEMINI_API_KEY env variable missing"}).encode('utf-8'))
                return
                
            try:
                # We will import the new unified genai Client for Imagen
                from google import genai
                from google.genai import types
                from PIL import Image
                import io
                import random
                
                client = genai.Client(api_key=gemini_key)
                
                # Parse payload for selected art style
                payload = {}
                try:
                    payload = json.loads(post_data.decode('utf-8'))
                except:
                    pass
                selected_style = payload.get('art_style', 'random')
                
                styles_dict = {
                    "cartoon": "Comical cartoon illustration, bold lines, bright vibrant colors, humorous caricature, white postcard border.",
                    "watercolor": "Whimsical watercolor and ink sketch, detailed storybook style, soft textures, pastel colors, artistically detailed.",
                    "retro": "Vintage 1950s travel poster style, retro flat vector design, bold colors, screen-printed poster aesthetic.",
                    "wpa": "Old school nature park illustration style, rooted in 1930s WPA-era silk-screened travel posters and 1960s lithographs, featuring bold shapes, muted nature-inspired color palettes, and hand-drawn typography.",
                    "vintage": "Classic distressed linen texture vintage postcard style, hand-colored photo print aesthetic, 1930s travel style.",
                    "pop-art": "Vibrant Pop Art style, bold outlines, screen print dot texture, retro comic book feel, high contrast colors."
                }
                
                clues = load_json(CLUES_FILE, [])
                postcards = load_json(POSTCARDS_FILE, [])
                target_clue_id = payload.get('clue_id')
                
                if target_clue_id:
                    # Regenerate mode: find the specific clue regardless of status
                    approved_clues = [c for c in clues if c['id'] == target_clue_id]
                else:
                    existing_clues_in_postcards = {p['clue_id'] for p in postcards}
                    approved_clues = [c for c in clues if c.get('status') == 'approved' and c['id'] not in existing_clues_in_postcards]
                
                new_postcards_count = 0
                # Process in batches of 5 to avoid HTTP timeouts
                for c in approved_clues[:5]:
                    # Determine style description
                    style_key = selected_style
                    if style_key == 'random' or style_key not in styles_dict:
                        style_key = random.choice(list(styles_dict.keys()))
                    style_prompt = styles_dict[style_key]
                    
                    # Let's generate a prompt first using standard Gemini
                    prompt_gen = f"""
                    Create a single-sentence descriptive text-to-image prompt for a parodied travel postcard based on the location pun "{c['pun_name']}" (derived from "{c['original_name']}").
                    The prompt should describe a funny, comical scene matching this art style: "{style_prompt}".
                    Example for "The Grand Crayon":
                    "A giant yellow crayon laying inside the rocky Grand Canyon, comical cartoon illustration."
                    
                    Return a JSON object exactly matching this schema:
                    {{
                      "image_prompt": "A giant yellow crayon laying inside the rocky Grand Canyon, comical cartoon illustration."
                    }}
                    """
                    prompt_res = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt_gen,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json"
                        )
                    )
                    prompt_data = json.loads(prompt_res.text)
                    image_prompt = prompt_data.get("image_prompt", f"A funny cartoon of {c['pun_name']}, comical illustration.")
                    
                    # Run Gemini 3 Pro Image generation
                    safe_filename = c['pun_name'].lower().replace(' ', '_').replace('-', '_').replace(':', '') + f"_{int(time.time())}.png"
                    image_path = f"/assets/cartoons/{safe_filename}"
                    local_image_path = os.path.join(CARTOONS_DIR, safe_filename)
                    
                    print(f"Generating postcard for '{c['pun_name']}' in style '{style_key}' using gemini-3-pro-image-preview...")
                    response = client.models.generate_content(
                        model='models/gemini-3-pro-image-preview',
                        contents=[f"{style_prompt} {image_prompt}"]
                    )
                    
                    # Save image from inline data
                    saved_image = False
                    for part in response.parts:
                        if part.inline_data:
                            image_bytes = part.inline_data.data
                            image = Image.open(io.BytesIO(image_bytes))
                            image.save(local_image_path)
                            print(f"Saved generated image: {local_image_path}")
                            saved_image = True
                            break
                    if not saved_image:
                        raise Exception("No image returned in response parts from gemini-3-pro-image-preview")
                        
                    # Check if postcard already exists to replace it (regenerate)
                    existing_idx = next((i for i, p in enumerate(postcards) if p['clue_id'] == c['id']), None)
                    
                    postcard_entry = {
                        "id": f"postcard_{c['id']}_{int(time.time())}" if existing_idx is None else postcards[existing_idx]["id"],
                        "clue_id": c['id'],
                        "pun_name": c['pun_name'],
                        "original_name": c['original_name'],
                        "image_prompt": image_prompt,
                        "image_path": image_path,
                        "art_style": style_key,
                        "owner_response": c['owner_response'],
                        "status": "pending"
                    }
                    
                    if existing_idx is not None:
                        postcards[existing_idx] = postcard_entry
                    else:
                        postcards.append(postcard_entry)
                    new_postcards_count += 1
                    
                save_json(POSTCARDS_FILE, postcards)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "generated_count": new_postcards_count}).encode('utf-8'))
            except Exception as e:
                print(f"Error generating postcard images: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif req_path == '/api/regenerate_owner_reply':
            if not gemini_available:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "GEMINI_API_KEY env variable missing"}).encode('utf-8'))
                return
                
            try:
                from google import genai
                from google.genai import types
                
                payload = {}
                try:
                    payload = json.loads(post_data.decode('utf-8'))
                except:
                    pass
                clue_id = payload.get('clue_id')
                if not clue_id:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": "clue_id is required"}).encode('utf-8'))
                    return
                    
                clues = load_json(CLUES_FILE, [])
                postcards = load_json(POSTCARDS_FILE, [])
                
                c = next((cl for cl in clues if cl['id'] == clue_id), None)
                if not c:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": "Clue not found"}).encode('utf-8'))
                    return
                    
                client = genai.Client(api_key=gemini_key)
                prompt = f"""
                You are the owner/manager of the ACTUAL historical landmark (the real place behind the pun "{c['pun_name']}", which has original landmark features of "{c['original_name']}").
                Your POV is that of the real, actual landmark. You are responding to a ridiculous 1-star TripAdvisor review from a traveler named "{c['reviewer_name']}" who has confused your famous landmark with a silly, literal pun name (the "{c['pun_name']}").
                Complaints:
                - Clue 1: "{c['clue1']}"
                - Clue 2: "{c['clue2']}"
                - Clue 3: "{c['clue3']}"
                
                Write a short (under 2 sentences), highly sarcastic, and punchy owner response correcting the reviewer's absurd confusion by pointing out the actual nature of your landmark (e.g., that it is a giant iron structure, a historic fine art museum, etc.) and why their complaint makes no sense.
                To bolster the response and make it highly contextual, the owner can directly reference a specific notable complaint or mistake made by the reviewer in the clues (e.g. drying hair on iron, eating waffles, complaining about public romance). Do NOT mention the original landmark name in the response itself.
                Reference their username directly in the reply prefixed with '@' (e.g., 'Listen, @{c['reviewer_name']}...', 'Dear @{c['reviewer_name']}...'), or use general terms like 'Dear Adventurer' or 'Dear Traveler' for variation.
                
                Return a JSON object matching exactly this schema:
                {{
                  "owner_response": "Response text here"
                }}
                """
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                data = json.loads(response.text)
                new_reply = data.get('owner_response', '')
                
                # Update files
                c['owner_response'] = new_reply
                save_json(CLUES_FILE, clues)
                
                for p in postcards:
                    if p['clue_id'] == clue_id:
                        p['owner_response'] = new_reply
                save_json(POSTCARDS_FILE, postcards)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "owner_response": new_reply}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_error(404)

if __name__ == '__main__':
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), TouristTrapsRequestHandler) as httpd:
        print(f"Serving PunFiction: Tourist Traps Curation Server at http://localhost:{PORT}")
        httpd.serve_forever()
