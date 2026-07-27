import glob
import re

files = sorted(glob.glob('*.md'))
print("=== CHECKING VECTORS & MINILM Across Files ===")

for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for dimension numbers (e.g. 384, 512, 768, 1536)
    dims = re.findall(r'\b(\d+)\s*(?:-| )*(?:dim|dimensional|d)\b', content, re.IGNORECASE)
    minilm_matches = re.findall(r'.{0,40}(?:MiniLM|384|embedding|vector).{0,40}', content, re.IGNORECASE)
    
    dim_set = set(dims)
    print(f"{fname}: Vector dimension references found: {dim_set if dim_set else 'None'}")
    
    # Print out any dimension that is NOT 384
    non_384 = [d for d in dims if d != '384']
    if non_384:
        print(f"  [WARNING] Non-384 dimension found in {fname}: {non_384}")

