# Workspace Rules for PunFiction Portal

- **Always Push Confirmed Changes to GitHub**: Whenever changes are made and verified locally (e.g., syntax checks, tests, or puzzle validation pass), ALWAYS stage, commit, and `git push origin main` to GitHub immediately so the live site (`punfiction.io`) stays updated. When editing frontend CSS/JS in `wordvine/` or `the-8-billionth/`, also bump the `?v=` cache-busting version in its `index.html` and keep mirrored folders (`C:\Users\iwand\.antigravity\Projects\PunFiction-TravelReviews`, `C:\Users\iwand\.antigravity\Projects\WordVine`, and `C:\Users\iwand\.gemini\antigravity\scratch\word-vine`) in sync as applicable.
- **Word Vine (`wordvine/`)**: Daily botanical compound word game live at `https://punfiction.io/wordvine/`.
- **1-Star Travel Reviews (`travelreviews/`)**: Daily location wordplay game live at `https://punfiction.io/travelreviews/`, with portal pages (`index.html`, `about.html`, `how-to-play-travelreviews.html`) in the root directory.
- **Flatball (`flatball/`)**: Daily Ultimate Frisbee tactics game live at `https://punfiction.io/flatball/`.
- **The 8.3 Billionth (`the-8-billionth/`)**: Single-player statistical uniqueness experience at `https://punfiction.io/the-8-billionth/` (featured on root `index.html`).
- **Backend & Curation (`backend/`)**: `backend/` contains the consolidated server (`unified_server.py` / `admin_server.py`), database handlers (`travelreviews_database.py`, `wordvine_database.py`, `billionth_database.py`, `billionth_estimator.py`), and curation dashboard (`unified_admin.html`).
