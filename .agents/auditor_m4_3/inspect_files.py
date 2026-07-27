import os
import glob
import re

def inspect_files():
    files = sorted(glob.glob('*.md'))

    print("=== INSPECTING ALL MD FILES ===")
    for f in files:
        if f.startswith('.'):
            continue
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        lines = content.splitlines()
        headers = [line.strip() for line in lines if line.startswith('#')]
        placeholders = re.findall(r'\b(TODO|TBD|FIXME|XXX|LOREM IPSUM|PLACEHOLDER|INSERT HERE)\b', content, re.IGNORECASE)
        mermaid_blocks = re.findall(r'```mermaid', content)
        print(f"File: {f}")
        print(f"  Size: {len(content)} bytes, Lines: {len(lines)}")
        print(f"  Headers: {len(headers)}")
        print(f"  Mermaid blocks: {len(mermaid_blocks)}")
        print(f"  Placeholders: {placeholders}")
        print()

if __name__ == '__main__':
    inspect_files()
