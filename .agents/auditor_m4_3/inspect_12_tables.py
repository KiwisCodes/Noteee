import glob
import re

files = sorted(glob.glob('*.md'))
for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'.{0,60}(?:12 sqlite|12 drizzle|12 schema|12 tables|12 table|sqlite schema tables).{0,60}', content, re.IGNORECASE)
    if matches:
        print(f"=== {fname} ({len(matches)} matches) ===")
        for m in matches:
            print("  ", m.strip().replace('\n', ' '))
