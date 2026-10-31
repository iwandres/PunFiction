"""
Unified server entrypoint for 1-Star Travel Reviews.
Re-exports admin_server components for compatibility with tests and deployment scripts.
"""
from admin_server import *
import threading
import socketserver

if __name__ == '__main__':
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    t = threading.Thread(target=pipeline_listener, daemon=True)
    t.start()
    with socketserver.ThreadingTCPServer(("", PORT), UnifiedRequestHandler) as httpd:
        print(f"Serving 1-Star Travel Reviews Curation Server at http://localhost:{PORT}")
        httpd.serve_forever()
