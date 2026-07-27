import glob
import re

files = sorted(glob.glob('*.md'))
print("=== CHECKING BLOCK JSON TYPES ACROSS FILES ===")

# Known 12 block types expected or specified
for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Look for block type definitions or BlockType enum / type
    types_found = re.findall(r"type\s+BlockType\s*=([^;]+);", content, re.MULTILINE | re.DOTALL)
    if not types_found:
        types_found = re.findall(r"export\s+type\s+BlockType\s*=([^;]+);", content, re.MULTILINE | re.DOTALL)
    
    if types_found:
        print(f"\n--- BlockType definition found in {fname}: ---")
        for t in types_found:
            items = [item.strip().strip("'\"| ") for item in t.strip().splitlines() if item.strip()]
            # Filter out empty or punctuation
            clean_items = [i for i in items if i and i != '|']
            print(f"Count: {len(clean_items)}")
            print("Items:", clean_items)

