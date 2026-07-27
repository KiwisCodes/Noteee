import glob
import re

files = sorted(glob.glob('*.md'))
for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.findall(r'.{0,50}(?:12 block|block json|block type|BlockType).{0,50}', content, re.IGNORECASE)
    if matches:
        print(f"=== {fname} ({len(matches)} matches) ===")
        for m in matches[:10]:
            print("  ", m.strip().replace('\n', ' '))
