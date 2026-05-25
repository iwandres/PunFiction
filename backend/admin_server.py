import http.server
import socketserver
import json
import os
import database

PORT = 8000
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
DATA_FILE = os.path.join(DIR_PATH, 'production_daily_games.json')
HTML_FILE = os.path.join(DIR_PATH, 'admin.html')

class AdminRequestHandler(http.server.SimpleHTTPRequestHandler):
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
        if req_path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open(HTML_FILE, 'rb') as f:
                self.wfile.write(f.read())
        elif req_path == '/api/puzzles':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path == '/api/telemetry':
            import urllib.parse
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            puzzle_number = query_params.get('puzzle_number', [None])[0]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            try:
                if puzzle_number:
                    puzzle_stats = database.get_telemetry_stats(puzzle_number)
                    self.wfile.write(json.dumps(puzzle_stats).encode('utf-8'))
                else:
                    telemetry_data = database.get_telemetry_stats()
                    # Keep local telemetry.json in sync
                    telemetry_file = os.path.join(DIR_PATH, 'telemetry.json')
                    with open(telemetry_file, 'w', encoding='utf-8') as f:
                        json.dump(telemetry_data, f, indent=2)
                    self.wfile.write(json.dumps(telemetry_data).encode('utf-8'))
            except Exception as e:
                print(f"Error querying telemetry from MongoDB: {e}")
                # Fallback to local file
                telemetry_data = {}
                telemetry_file = os.path.join(DIR_PATH, 'telemetry.json')
                if os.path.exists(telemetry_file):
                    try:
                        with open(telemetry_file, 'r', encoding='utf-8') as f:
                            telemetry_data = json.load(f)
                    except:
                        pass
                if puzzle_number:
                    puzzle_stats = telemetry_data.get(puzzle_number, {
                        "start": 0, "solve_0": 0, "solve_1": 0, "solve_2": 0, "solve_3": 0
                    })
                    self.wfile.write(json.dumps(puzzle_stats).encode('utf-8'))
                else:
                    self.wfile.write(json.dumps(telemetry_data).encode('utf-8'))
        elif req_path == '/quotes':
            self.send_response(302)
            self.send_header('Location', '/#quotes')
            self.end_headers()
        elif req_path == '/incomplete':
            self.send_response(302)
            self.send_header('Location', '/#incomplete')
            self.end_headers()
        elif req_path == '/rhymes':
            self.send_response(302)
            self.send_header('Location', '/#rhymes')
            self.end_headers()
        elif req_path == '/api/quotes':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            quotes_file = os.path.join(DIR_PATH, 'phase2_quotes.json')
            if os.path.exists(quotes_file):
                with open(quotes_file, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path == '/api/incomplete_quotes':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            incomplete_file = os.path.join(DIR_PATH, 'incomplete_quotes.json')
            if os.path.exists(incomplete_file):
                with open(incomplete_file, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path == '/api/punned_quotes':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            punned_file = os.path.join(DIR_PATH, 'punned_quotes.json')
            if os.path.exists(punned_file):
                with open(punned_file, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path == '/parody':
            self.send_response(302)
            self.send_header('Location', '/#parody')
            self.end_headers()
        elif req_path == '/api/reviewed_parodies':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            reviewed_file = os.path.join(DIR_PATH, 'reviewed_parodies.json')
            if os.path.exists(reviewed_file):
                with open(reviewed_file, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path == '/posters':
            self.send_response(302)
            self.send_header('Location', '/#posters')
            self.end_headers()
        elif req_path == '/api/posters_state':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            posters_file = os.path.join(DIR_PATH, 'poster_prompts_state.json')
            if os.path.exists(posters_file):
                with open(posters_file, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'[]')
        elif req_path.startswith('/assets/'):
            import urllib.parse
            clean_path = urllib.parse.unquote(req_path.strip('/'))
            file_path = os.path.join(DIR_PATH, *clean_path.split('/'))
            if os.path.exists(file_path):
                self.send_response(200)
                if file_path.endswith('.png'):
                    self.send_header('Content-type', 'image/png')
                elif file_path.endswith('.jpg'):
                    self.send_header('Content-type', 'image/jpeg')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404)
        else:
            super().do_GET() # fallback for assets if any

    def do_POST(self):
        if self.path == '/api/puzzles':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Verify it's valid JSON
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving puzzles: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/telemetry':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            telemetry_file = os.path.join(DIR_PATH, 'telemetry.json')
            try:
                payload = json.loads(post_data.decode('utf-8'))
                event = payload.get('event')
                puzzle_number = payload.get('puzzle_number')
                hints_used = int(payload.get('hints_used', 0))
                
                if not puzzle_number:
                    raise ValueError("puzzle_number is required")
                
                # Write event to MongoDB
                database.record_telemetry_event(puzzle_number, event, hints_used)
                
                # Sync: update local telemetry.json copies with full db state
                try:
                    all_stats = database.get_telemetry_stats()
                    with open(telemetry_file, 'w', encoding='utf-8') as f:
                        json.dump(all_stats, f, indent=2)
                except Exception as sync_e:
                    print(f"Error syncing local telemetry copy from MongoDB: {sync_e}")
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error handling telemetry: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/quotes':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            quotes_file = os.path.join(DIR_PATH, 'phase2_quotes.json')
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(quotes_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving quotes: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/incomplete_quotes':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            incomplete_file = os.path.join(DIR_PATH, 'incomplete_quotes.json')
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(incomplete_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving incomplete quotes: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/punned_quotes':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            punned_file = os.path.join(DIR_PATH, 'punned_quotes.json')
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(punned_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving punned quotes: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/reviewed_parodies':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            reviewed_file = os.path.join(DIR_PATH, 'reviewed_parodies.json')
            try:
                data = json.loads(post_data.decode('utf-8'))
                with open(reviewed_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving reviewed parodies: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/posters_state':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            posters_file = os.path.join(DIR_PATH, 'poster_prompts_state.json')
            try:
                new_data = json.loads(post_data.decode('utf-8'))
                
                # Check for rejected items and delete their assets
                if os.path.exists(posters_file):
                    with open(posters_file, 'r', encoding='utf-8') as f:
                        old_data = json.load(f)
                    old_dict = {item['pun_id']: item for item in old_data}
                    
                    for item in new_data:
                        if item.get('status') == 'rejected':
                            old_item = old_dict.get(item['pun_id'])
                            if old_item and old_item.get('image_path'):
                                old_path = old_item['image_path']
                                if old_path and old_path.startswith('/assets/'):
                                    import urllib.parse
                                    clean_path = urllib.parse.unquote(old_path.strip('/'))
                                    file_to_delete = os.path.join(DIR_PATH, *clean_path.split('/'))
                                    if os.path.exists(file_to_delete):
                                        try:
                                            os.remove(file_to_delete)
                                            print(f"Deleted rejected asset: {file_to_delete}")
                                        except Exception as e:
                                            print(f"Failed to delete {file_to_delete}: {e}")

                with open(posters_file, 'w', encoding='utf-8') as f:
                    json.dump(new_data, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print(f"Error saving posters state: {e}")
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/generate_parodies':
            try:
                import subprocess
                import sys
                script_path = os.path.join(DIR_PATH, 'thematic_generator.py')
                # Launch asynchronously
                subprocess.Popen([sys.executable, '-u', script_path], cwd=DIR_PATH)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Parody title generation kicked off!"}).encode('utf-8'))
            except Exception as e:
                print(f"Error kicking off parody generation: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        elif self.path == '/api/generate_posters':
            try:
                import subprocess
                import sys
                # 1. Run prep_poster_prompts.py synchronously first (very fast)
                prep_script = os.path.join(DIR_PATH, 'prep_poster_prompts.py')
                subprocess.run([sys.executable, prep_script], cwd=DIR_PATH, check=True)
                
                # 2. Launch generate_posters.py asynchronously
                gen_script = os.path.join(DIR_PATH, 'generate_posters.py')
                subprocess.Popen([sys.executable, '-u', gen_script], cwd=DIR_PATH)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Poster generation kicked off!"}).encode('utf-8'))
            except Exception as e:
                print(f"Error kicking off poster generation: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_error(404)

if __name__ == '__main__':
    # Allow address reuse so we don't get "Address already in use" errors during dev
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), AdminRequestHandler) as httpd:
        print(f"Serving QA Admin Tool at http://localhost:{PORT}")
        httpd.serve_forever()
