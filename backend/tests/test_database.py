import sys
import os
import unittest
from unittest.mock import MagicMock

# Set up python paths so database modules and their local imports are found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock pymongo to prevent actual connection attempts on import
mock_pymongo = MagicMock()
mock_client = MagicMock()
mock_pymongo.MongoClient.return_value = mock_client
sys.modules['pymongo'] = mock_pymongo

# Import the database modules
import backend.database as db_compat
import backend.travelreviews_database as db_travelreviews

class TestDatabaseHelpers(unittest.TestCase):

    def setUp(self):
        # Assign fresh mock objects to each collection to ensure test isolation
        db_travelreviews.telemetry_pool = MagicMock()
        db_travelreviews.user_profiles_pool = MagicMock()
        db_travelreviews.client = MagicMock()

    def test_database_reexports_travelreviews(self):
        # Verify database.py re-exports travelreviews_database helpers
        self.assertIs(db_compat.record_telemetry_event, db_travelreviews.record_telemetry_event)
        self.assertIs(db_compat.get_telemetry_stats, db_travelreviews.get_telemetry_stats)
        self.assertIs(db_compat.get_user_profile, db_travelreviews.get_user_profile)
        self.assertIs(db_compat.upsert_user_profile, db_travelreviews.upsert_user_profile)

    def test_record_telemetry_event_start(self):
        db_travelreviews.record_telemetry_event("015", "start")
        db_travelreviews.telemetry_pool.update_one.assert_called_once_with(
            {"_id": "015"},
            {"$inc": {"start": 1}},
            upsert=True
        )

    def test_record_telemetry_event_solve(self):
        db_travelreviews.record_telemetry_event("015", "solve", hints_used=2, attempts=3)
        db_travelreviews.telemetry_pool.update_one.assert_called_once_with(
            {"_id": "015"},
            {
                "$inc": {
                    "solve_2": 1,
                    "solve_att_3": 1
                }
            },
            upsert=True
        )

    def test_get_telemetry_stats_single(self):
        db_travelreviews.telemetry_pool.find_one.return_value = {
            "start": 10,
            "attempts": 20,
            "solve_0": 5,
            "solve_1": 2,
            "solve_att_1": 4,
            "solve_att_2": 3
        }
        
        stats = db_travelreviews.get_telemetry_stats("015")
        self.assertEqual(stats["start"], 10)
        self.assertEqual(stats["attempts"], 20)
        self.assertEqual(stats["solve_0"], 5)
        self.assertEqual(stats["solve_1"], 2)
        self.assertEqual(stats["solve_2"], 0) # defaults to 0
        db_travelreviews.telemetry_pool.find_one.assert_called_with({"_id": "015"})

    def test_get_user_profile(self):
        db_travelreviews.user_profiles_pool.find_one.return_value = {
            "_id": "USER123",
            "solved_puzzles": ["015"],
            "solved_hints": {"015": 0},
            "attempted_puzzles": ["015", "016"],
            "max_streak": 3
        }
        
        profile = db_travelreviews.get_user_profile("USER123")
        self.assertEqual(profile["profile_id"], "USER123")
        self.assertEqual(profile["solved_puzzles"], ["015"])
        self.assertEqual(profile["max_streak"], 3)
        db_travelreviews.user_profiles_pool.find_one.assert_called_with({"_id": "USER123"})

    def test_upsert_user_profile(self):
        db_travelreviews.upsert_user_profile("USER123", ["015"], {"015": 0}, ["015", "016"], 3)
        db_travelreviews.user_profiles_pool.update_one.assert_called_once()
        call_args = db_travelreviews.user_profiles_pool.update_one.call_args[0]
        self.assertEqual(call_args[0], {"_id": "USER123"})
        self.assertEqual(call_args[1]["$set"]["solved_puzzles"], ["015"])
        self.assertEqual(call_args[1]["$set"]["max_streak"], 3)

    def test_drop_boxoffice_database(self):
        mock_legacy_db = MagicMock()
        mock_legacy_db.list_collection_names.return_value = [
            "boss_puzzle_sets",
            "raw_combinator_pool",
            "PunFiction",
            "UserProfiles"
        ]
        db_travelreviews.client.__getitem__.return_value = mock_legacy_db

        result = db_travelreviews.drop_boxoffice_database()
        self.assertTrue(result)
        db_travelreviews.client.__getitem__.assert_called_with("movie_puzzle_db")
        self.assertEqual(mock_legacy_db.drop_collection.call_count, 4)
        db_travelreviews.client.drop_database.assert_called_once_with("movie_puzzle_db")

if __name__ == '__main__':
    unittest.main()
