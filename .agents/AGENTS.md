# Workspace Rules for PunFiction & Word Vine

- **Always Push Confirmed Changes to GitHub**: Whenever changes are made and verified locally (e.g., syntax checks, tests, or puzzle validation pass), ALWAYS stage, commit, and `git push origin main` to GitHub immediately so the live site (`punfiction.io`) stays updated. When editing frontend CSS/JS in `wordvine/`, also bump the `?v=` cache-busting version in `wordvine/index.html` and keep mirrored folders (`C:\Users\iwand\.antigravity\Projects\WordVine` and `C:\Users\iwand\.gemini\antigravity\scratch\word-vine`) in sync.
- **Word Vine (`wordvine/`)**: Daily botanical compound word game live at `https://punfiction.io/wordvine/`.
- **1-Star Travel Reviews (`travelreviews/`)**: Frontend game assets and client logic live in `travelreviews/`, with portal pages (`index.html`, `about.html`, `how-to-play-travelreviews.html`) in the root directory.
- **Backend & Curation (`backend/`)**: `backend/` contains the curation server (`admin_server.py` / `unified_server.py`), database handlers (`travelreviews_database.py`, `wordvine_database.py`, `database.py`), and curation dashboards.
- **Box Office Blunders Removed**: Do not reintroduce Box Office Blunders files, endpoints, or `movie_puzzle_db` MongoDB tables.
