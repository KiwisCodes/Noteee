import glob
import re

files = sorted(glob.glob('*.md'))
for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find formulas mentioning R(t, S) or F =
    for line in content.splitlines():
        if 'R(t,' in line or 'F =' in line or 'F=' in line or '1/9' in line or 'decay constant' in line.lower():
            print(f"{fname}: {line.strip()}")
