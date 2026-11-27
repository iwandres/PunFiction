"""Unit tests for Umwelt: Animal Optics backend data, BioDepth builder, discovery verification, and routes."""
import io
import os
import tempfile
import unittest
from unittest import mock

from PIL import Image

from backend import umwelt_data
from backend import umwelt_database as udb
from backend import umwelt_pipeline as upipe


class TestUmweltBackend(unittest.TestCase):
    def setUp(self):
        self._tmpdir = tempfile.TemporaryDirectory()
        self._orig_cache_dir = udb.LOCAL_CACHE_DIR
        self._orig_plates_meta = udb.LOCAL_PLATES_META
        self._orig_journals = udb.LOCAL_JOURNALS_FILE
        self._orig_stats = udb.LOCAL_STATS_FILE
        self._orig_mongo_ready = udb._mongo_ready

        udb._mongo_ready = False
        udb.LOCAL_CACHE_DIR = self._tmpdir.name
        udb.LOCAL_PLATES_META = os.path.join(self._tmpdir.name, "plates_meta.json")
        udb.LOCAL_JOURNALS_FILE = os.path.join(self._tmpdir.name, "journals.json")
        udb.LOCAL_STATS_FILE = os.path.join(self._tmpdir.name, "stats.json")
        udb._rate_buckets.clear()

    def tearDown(self):
        udb.LOCAL_CACHE_DIR = self._orig_cache_dir
        udb.LOCAL_PLATES_META = self._orig_plates_meta
        udb.LOCAL_JOURNALS_FILE = self._orig_journals
        udb.LOCAL_STATS_FILE = self._orig_stats
        udb._mongo_ready = self._orig_mongo_ready
        self._tmpdir.cleanup()

    def test_catalog_completeness(self):
        catalog = umwelt_data.get_full_catalog()
        self.assertEqual(len(catalog["biomes"]), 3)
        total_species = sum(len(b["species"]) for b in catalog["biomes"])
        self.assertEqual(total_species, 15)
        self.assertEqual(len(catalog["mysteries"]), 12)

        # Verify every mystery points to a valid biome + species
        for m in catalog["mysteries"]:
            biome, sp = umwelt_data.get_species_config(m["biomeId"], m["requiredSpeciesSlug"])
            self.assertIsNotNone(biome)
            self.assertIsNotNone(sp)

    def test_bio_depth_map_builder_outputs_valid_rgba_png(self):
        img = Image.new("RGB", (640, 360), (40, 140, 60))
        bio_bytes = upipe.build_bio_depth_map(img, "meadow", "kestrel")
        parsed = Image.open(io.BytesIO(bio_bytes))
        self.assertEqual(parsed.mode, "RGBA")
        self.assertEqual(parsed.size, (upipe.BIO_WIDTH, upipe.BIO_HEIGHT))

    def test_plate_save_and_binary_read_roundtrip(self):
        pk = udb.sanitize_plate_key("reef", "cuttlefish", "Tropical Zenith Caustics", 1)
        doc = udb.save_plate_asset(
            plate_key=pk,
            biome_id="reef",
            species_slug="cuttlefish",
            lighting_preset="Tropical Zenith Caustics",
            rgb_bytes=b"FAKE_WEBP_BYTES",
            bio_bytes=b"FAKE_PNG_BYTES",
            semantics={"primaryTarget": {"present": True, "x": 0.4, "y": 0.55, "rx": 0.1, "ry": 0.1}},
            generation_ms=1234,
        )
        self.assertEqual(doc["plateKey"], pk)
        self.assertEqual(udb.count_cached_plates(), 1)
        rgb_b, rgb_ct = udb.read_plate_binary(pk, "rgb")
        bio_b, bio_ct = udb.read_plate_binary(pk, "bio")
        self.assertEqual(rgb_b, b"FAKE_WEBP_BYTES")
        self.assertEqual(rgb_ct, "image/webp")
        self.assertEqual(bio_b, b"FAKE_PNG_BYTES")
        self.assertEqual(bio_ct, "image/png")

    def test_verify_mystery_discovery_cuttlefish_mechanic_and_solve(self):
        # Unaligned polarization should prompt player to rotate analyzer
        code1, res1 = upipe.verify_mystery_discovery({
            "clientUuid": "tester-1",
            "mysteryId": "reef_cuttlefish_glass_shrimp",
            "biomeId": "reef",
            "speciesSlug": "cuttlefish",
            "clickX": 0.40,
            "clickY": 0.55,
            "mechanicState": {"polarizationDeg": 130},
        })
        self.assertEqual(code1, 200)
        self.assertFalse(res1["solved"])
        self.assertEqual(res1["reason"], "mechanic_unaligned")

        # Properly aligned polarization should solve & persist to journal
        code2, res2 = upipe.verify_mystery_discovery({
            "clientUuid": "tester-1",
            "mysteryId": "reef_cuttlefish_glass_shrimp",
            "biomeId": "reef",
            "speciesSlug": "cuttlefish",
            "clickX": 0.42,
            "clickY": 0.54,
            "mechanicState": {"polarizationDeg": 44},
            "timeToSolveMs": 12400,
        })
        self.assertEqual(code2, 200)
        self.assertTrue(res2["solved"])
        self.assertIn("492 nm", res2["codexEntry"])

        journal = udb.get_journal("tester-1")
        self.assertEqual(len(journal["solvedMysteries"]), 1)
        self.assertEqual(journal["totalPoints"], 200)

    def test_resolve_plate_cache_hit_skips_gemini(self):
        pk = udb.sanitize_plate_key("meadow", "kestrel", "Alpine Noon", 1)
        udb.save_plate_asset(
            plate_key=pk,
            biome_id="meadow",
            species_slug="kestrel",
            lighting_preset="Alpine Noon",
            rgb_bytes=b"W",
            bio_bytes=b"P",
            semantics={"primaryTarget": {"present": True, "x": 0.62, "y": 0.56, "rx": 0.08, "ry": 0.08}},
        )
        with mock.patch.object(upipe, "synthesize_wildlife_plate") as synth_mock:
            code, payload = upipe.resolve_plate("meadow", "kestrel", "Alpine Noon")
            self.assertEqual(code, 200)
            self.assertTrue(payload["cacheHit"])
            synth_mock.assert_not_called()


if __name__ == "__main__":
    unittest.main()
