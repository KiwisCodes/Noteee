import glob
import re

files = sorted(glob.glob('*.md'))
print("=== CHECKING FSRS FORMULA AND retention factor F across files ===")

for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'.{0,60}(?:FSRS|1/9|factor|retention|decay|decayFormulaF).{0,60}', content, re.IGNORECASE)
    if matches:
        print(f"\n--- {fname} ({len(matches)} matches) ---")
        for m in matches[:10]: # print first 10 per file
            cleaned = m.strip().replace('\n', ' ')
            print(f"  ... {cleaned} ...")

