import sys
import os
import json
import subprocess

def run_git_command(args):
    try:
        result = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return result.stdout.splitlines()
    except subprocess.CalledProcessError as e:
        print(f"Error running git command {args}: {e.stderr}")
        return []

def main():
    # 1. Get list of all staged files
    staged_files = run_git_command(["git", "diff", "--cached", "--name-only"])
    
    # Standardize paths to use forward slashes
    staged_files = [f.replace('\\', '/') for f in staged_files]
    
    db_path = "backend/production_daily_games.json"
    
    # 2. If the database file is not staged, we don't need to check anything
    if db_path not in staged_files:
        sys.exit(0)
        
    print(f"🔍 [Pre-Commit Hook] Detecting staged database updates: {db_path}")
    print("Checking if all referenced poster assets are tracked in Git...")
    
    # 3. Read the staged version of the database
    try:
        staged_content = subprocess.run(
            ["git", "show", f":{db_path}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        ).stdout
        puzzles = json.loads(staged_content)
    except Exception as e:
        print(f"❌ Failed to parse staged database JSON: {e}")
        sys.exit(1)
        
    # 4. Extract all unique poster paths
    referenced_posters = set()
    for puzzle in puzzles:
        poster_url = puzzle.get("boss_poster_url")
        if poster_url and poster_url.startswith("/assets/posters/"):
            # Convert /assets/posters/filename.png to backend/assets/posters/filename.png
            local_path = f"backend{poster_url}"
            referenced_posters.add(local_path)
            
    if not referenced_posters:
        print("✅ No poster assets referenced in the database.")
        sys.exit(0)
        
    # 5. Get list of all files already tracked in git
    tracked_files = set(run_git_command(["git", "ls-files"]))
    # Standardize
    tracked_files = {f.replace('\\', '/') for f in tracked_files}
    staged_files_set = set(staged_files)
    
    # 6. Verify each referenced poster
    missing_posters = []
    for poster in referenced_posters:
        # Check if the poster is staged OR already committed/tracked in git
        if poster not in staged_files_set and poster not in tracked_files:
            missing_posters.append(poster)
            
    if missing_posters:
        print("\n❌ COMMIT BLOCKED: Missing Poster Assets!")
        print("The following poster images are referenced in the database but are NOT staged or tracked in Git:")
        for missing in sorted(missing_posters):
            print(f"  - {missing}")
        print("\n👉 To fix this, stage the missing assets first:")
        print("  git add backend/assets/posters/")
        print("  (or stage the files individually, then try committing again)\n")
        sys.exit(1)
        
    print("✅ All referenced poster assets are successfully tracked or staged in Git.")
    sys.exit(0)

if __name__ == "__main__":
    main()
