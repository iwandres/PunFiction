import sys
import os
import unittest
from unittest.mock import MagicMock, patch
import json
from io import BytesIO

# Set up python paths so database modules and their local imports are found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock pymongo client at module level
mock_pymongo = MagicMock()
sys.modules['pymongo'] = mock_pymongo

# Import the server and database
import travelreviews_database as db_travelreviews
from backend.unified_server import UnifiedRequestHandler

class TestServerHandler(unittest.TestCase):

    def setUp(self):
        # Patch Travel Reviews database function calls to verify handler routing
        self.patcher_tr_get = patch('travelreviews_database.get_telemetry_stats')
        self.patcher_tr_record = patch('travelreviews_database.record_telemetry_event')
        self.patcher_tr_user_get = patch('travelreviews_database.get_user_profile')
        self.patcher_tr_user_upsert = patch('travelreviews_database.upsert_user_profile')
        self.patcher_save_json = patch('admin_server.save_json')
        
        self.mock_tr_get = self.patcher_tr_get.start()
        self.mock_tr_record = self.patcher_tr_record.start()
        self.mock_tr_user_get = self.patcher_tr_user_get.start()
        self.mock_tr_user_upsert = self.patcher_tr_user_upsert.start()
        self.mock_save_json = self.patcher_save_json.start()
        
        self.mock_tr_get.return_value = {}
        self.mock_tr_user_get.return_value = None

    def tearDown(self):
        self.patcher_tr_get.stop()
        self.patcher_tr_record.stop()
        self.patcher_tr_user_get.stop()
        self.patcher_tr_user_upsert.stop()
        self.patcher_save_json.stop()

    def make_handler(self, method, path, headers=None, body=None):
        request = MagicMock()
        client_address = ('127.0.0.1', 12345)
        server = MagicMock()
        
        handler = UnifiedRequestHandler.__new__(UnifiedRequestHandler)
        handler.request = request
        handler.client_address = client_address
        handler.server = server
        handler.headers = headers or {}
        
        if body:
            handler.headers['Content-Length'] = str(len(body))
            
        handler.path = path
        handler.directory = os.getcwd()
        
        handler.rfile = BytesIO(body or b"")
        handler.wfile = BytesIO()
        
        handler.send_response = MagicMock()
        handler.send_header = MagicMock()
        handler.end_headers = MagicMock()
        handler.send_error = MagicMock()
        
        return handler

    def test_get_puzzles_returns_travelreviews(self):
        handler = self.make_handler('GET', '/api/puzzles')
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertIsInstance(response_data, list)
        self.assertGreater(len(response_data), 0)

    def test_get_travelreviews_puzzles(self):
        handler = self.make_handler('GET', '/api/travelreviews/puzzles')
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertIsInstance(response_data, list)
        self.assertGreater(len(response_data), 0)

    def test_get_records_routes_to_travelreviews(self):
        handler = self.make_handler('GET', '/api/records')
        self.mock_tr_get.return_value = {"015": {"start": 5}}
        
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        self.mock_tr_get.assert_called_once()
        
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertEqual(response_data, {"015": {"start": 5}})

    def test_get_records_prefix_travelreviews(self):
        handler = self.make_handler('GET', '/api/travelreviews/records')
        self.mock_tr_get.return_value = {"015": {"start": 12}}
        
        handler.do_GET()
        
        handler.send_response.assert_called_with(200)
        self.mock_tr_get.assert_called_once()
        
        response_data = json.loads(handler.wfile.getvalue().decode('utf-8'))
        self.assertEqual(response_data, {"015": {"start": 12}})

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

    def test_boxoffice_routes_removed_return_404(self):
        for route in ['/api/boxoffice/puzzles', '/api/boxoffice/records', '/api/boxoffice/quotes']:
            handler = self.make_handler('GET', route)
            handler.do_GET()
            self.assertTrue(handler.send_error.called)
            self.assertEqual(handler.send_error.call_args[0][0], 404)

    def test_invalid_path_returns_404(self):
        handler = self.make_handler('GET', '/api/invalid_path_abc')
        handler.do_GET()
        
        self.assertTrue(handler.send_error.called)
        self.assertEqual(handler.send_error.call_args[0][0], 404)

if __name__ == '__main__':
    unittest.main()
