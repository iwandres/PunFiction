# Workspace Rules for PunFiction - 1-Star Travel Reviews

PunFiction is focused exclusively on **1-Star Travel Reviews** as its active game:

- **Primary Game**: All frontend game assets and client logic live in `travelreviews/`, with portal pages (`index.html`, `about.html`, `how-to-play-travelreviews.html`) in the root directory.
- **Backend & Curation**: `backend/` contains the 1-Star Travel Reviews curation server (`admin_server.py` / `unified_server.py`), MongoDB handler (`travelreviews_database.py` / `database.py`), curation dashboard (`admin.html` / `unified_admin.html`), and Travel Reviews JSON data files (`travelreviews_*.json`).
- **Box Office Blunders Removed**: Do not reintroduce Box Office Blunders files, endpoints, or `movie_puzzle_db` MongoDB tables.
