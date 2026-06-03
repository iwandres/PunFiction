import subprocess
import time
import sys
import os

pun_ids = [
    "quote_041_1778286228945",
    "quote_036_1778213033731",
    "quote_028_1778212439127",
    "quote_034_1778212828914",
    "quote_059_1778295017383",
    "quote_060_1778295124876",
    "quote_055_1778294817033",
    "quote_050_1778294490232",
    "quote_046_1778291183235",
    "quote_042_1778290898042",
    "quote_043_1778286338815",
    "quote_038_1778285559305",
    "quote_037_1778213175039",
    "quote_035_1778212969843",
    "quote_033_1778212736314",
    "quote_029_1778212492820"
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
