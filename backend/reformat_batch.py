import subprocess
import time
import sys
import os

pun_ids = [
    "quote_002_1778164883718", # Challenge 002
    "quote_005_1778210369173", # Challenge 006
    "quote_008_1778210636112", # Challenge 007
    "quote_009_1778210716130", # Challenge 008
    "quote_010_1778211045400", # Challenge 009
    "quote_012_1778211280003", # Challenge 010
    "quote_013_1778211371642", # Challenge 011
    "quote_015_1778211509916", # Challenge 012
    "quote_016_1778211589098", # Challenge 013
    "quote_017_1778211668918", # Challenge 014
    "quote_018_1778211781181", # Challenge 015
    "quote_020_1778211828204", # Challenge 016
    "quote_022_1778211937072", # Challenge 017
    "quote_024_1778212035034", # Challenge 018
    "quote_025_1778212167777", # Challenge 019
    "quote_026_1778212230151", # Challenge 020
    "quote_014_1778211399121"  # Challenge 021
]

print(f"Starting batch poster reformatting for {len(pun_ids)} challenges...")
success_count = 0
failed_ids = []

backend_dir = os.path.dirname(os.path.realpath(__file__))
script_path = os.path.join(backend_dir, "reformat_poster.py")

for idx, pun_id in enumerate(pun_ids):
    print(f"\n==================================================")
    print(f"Processing [{idx+1}/{len(pun_ids)}]: {pun_id}")
    print(f"==================================================")
    
    start_time = time.time()
    try:
        # Run reformat_poster.py with subprocess
        result = subprocess.run(
            ["python", script_path, "--pun_id", pun_id],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        
        elapsed = time.time() - start_time
        print(f"Finished in {elapsed:.1f} seconds.")
        
        if result.returncode == 0:
            print("STDOUT:")
            print(result.stdout)
            if "[SUCCESS]" in result.stdout:
                success_count += 1
            else:
                print("Warning: Script ran but [SUCCESS] was not in output.")
                failed_ids.append(pun_id)
        else:
            print(f"ERROR: Process exited with code {result.returncode}")
            print("STDERR:")
            print(result.stderr)
            print("STDOUT:")
            print(result.stdout)
            failed_ids.append(pun_id)
            
    except Exception as e:
        print(f"Process execution failed: {e}")
        failed_ids.append(pun_id)
        
    # Cool down period to avoid hitting API rate limits
    if idx < len(pun_ids) - 1:
        cooldown = 15
        print(f"Cooling down for {cooldown} seconds to respect API limits...")
        time.sleep(cooldown)

print(f"\n==================================================")
print(f"Batch completed: {success_count}/{len(pun_ids)} successfully reformatted.")
if failed_ids:
    print(f"Failed IDs: {failed_ids}")
else:
    print("All challenges completed successfully!")
print(f"==================================================")
