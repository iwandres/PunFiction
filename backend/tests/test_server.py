import sys
import os
import unittest
from unittest.mock import MagicMock, patch
import json
import urllib.parse
from io import BytesIO

# Set up python paths so database modules and their local imports are found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock pymongo client at module level
mock_pymongo = MagicMock()
sys.modules['pymongo'] = mock_pymongo

# Now import the server and databases
import database as db_boxoffice
import travelreviews_database as db_travelreviews
from backend.unified_server import UnifiedRequestHandler

class TestServerHandler(unittest.TestCase):

    def setUp(self):
        # Patch database function calls to verify handler routing
        self.patcher_bo_get = patch('database.get_telemetry_stats')
        self.patcher_tr_get = patch('travelreviews_database.get_telemetry_stats')
        self.patcher_bo_record = patch('database.record_telemetry_event')
        self.patcher_tr_record = patch('travelreviews_database.record_telemetry_event')
        
        self.mock_bo_get = self.patcher_bo_get.start()
        self.mock_tr_get = self.patcher_tr_get.start()
        self.mock_bo_record = self.patcher_bo_record.start()
        self.mock_tr_record = self.patcher_tr_record.start()
        
        # Configure default dictionary return values to prevent JSON serialization crashes on file sync fallbacks
        self.mock_bo_get.return_value = {}
        self.mock_tr_get.return_value = {}

    def tearDown(self):
        self.patcher_bo_get.stop()
        self.patcher_tr_get.stop()
        self.patcher_bo_record.stop()
        self.patcher_tr_record.stop()

    def make_handler(self, method, path, headers=None, body=None):
        # Helper to construct a mock request handler
        request = MagicMock()
        client_address = ('127.0.0.1', 12345)
        server = MagicMock()
        
        # Mock class instantiation
        handler = UnifiedRequestHandler.__new__(UnifiedRequestHandler)
        handler.request = request
        handler.client_address = client_address
        handler.server = server
        handler.headers = headers or {}
        
        # Populate content length for post data
        if body:
            handler.headers['Content-Length'] = str(len(body))
            
        handler.path = path
        handler.directory = os.getcwd()
        
        # Mock IO streams
        handler.rfile = BytesIO(body or b"")
        handler.wfile = BytesIO()
        
        # Mock connection and response tracking methods
        handler.send_response = MagicMock()
        handler.send_header = MagicMock()
        handler.end_headers = MagicMock()
        handler.send_error = MagicMock()
        
        return handler

    def test_get_puzzles_boxoffice(self):
        handler = self.make_handler('GET', '/api/puzzles')
        handler.do_GET()
        
        # Verify it responds 200 OK
        handler.send_response.assert_called_with(200)
        
        # Verify JSON is written
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertIsInstance(response_data, list)

    def test_get_records_referrer_travelreviews(self):
        # Setting referer to travelreviews should trigger travelreviews_database
        headers = {'Referer': 'https://punfiction.io/travelreviews/'}
        handler = self.make_handler('GET', '/api/records', headers=headers)
        
        # Mock DB response
        self.mock_tr_get.return_value = {"015": {"start": 5}}
        
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        self.mock_tr_get.assert_called_once()
        self.mock_bo_get.assert_not_called()
        
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertEqual(response_data, {"015": {"start": 5}})

    def test_get_records_prefix_travelreviews(self):
        # URL path prefix /api/travelreviews/records should trigger travelreviews_database
        handler = self.make_handler('GET', '/api/travelreviews/records')
        
        self.mock_tr_get.return_value = {"015": {"start": 12}}
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        self.mock_tr_get.assert_called_once()
        
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertEqual(response_data, {"015": {"start": 12}})

    def test_post_telemetry_boxoffice(self):
        payload = json.dumps({
            'event': 'start',
            'puzzle_number': '001'
        }).encode('utf-8')
        
        handler = self.make_handler('POST', '/api/records', body=payload)
        handler.do_POST()
        
        handler.send_response.assert_called_with(200)
        self.mock_bo_record.assert_called_once_with('001', 'start', 0, 1)

    def test_post_telemetry_travelreviews(self):
        payload = json.dumps({
            'event': 'solve',
            'puzzle_number': '015',
            'hints_used': 2,
            'attempts': 3
        }).encode('utf-8')
        
        handler = self.make_handler('POST', '/api/travelreviews/records', body=payload)
        handler.do_POST()
        
        handler.send_response.assert_called_with(200)
        self.mock_tr_record.assert_called_once_with('015', 'solve', 2, 3)

    def test_invalid_path_returns_404(self):
        handler = self.make_handler('GET', '/api/invalid_path_abc')
        handler.do_GET()
        
        self.assertTrue(handler.send_error.called)
        self.assertEqual(handler.send_error.call_args[0][0], 404)

if __name__ == '__main__':
    unittest.main()
