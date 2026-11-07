---
trigger: always_on
description: Always commit and push changes to GitHub after they are confirmed locally
---

# Always Push Confirmed Changes to GitHub

1. **Verify Locally First**: Validate all changes locally (run syntax checks such as `node -c`, unit tests, or data validation scripts, and sync mirrored workspace directories).
2. **Bump Asset Cache Version**: If modifying frontend CSS or JS files served via GitHub Pages (e.g. `wordvine/`), increment the `?v=` cache-busting query string in `index.html`.
3. **Commit & Push Immediately**: Once local verification succeeds, always run `git add`, `git commit`, and `git push origin main` in `C:\Users\iwand\.antigravity\Projects\PunFiction-BoxOffice` so the live GitHub Pages site (`punfiction.io`) updates automatically.
