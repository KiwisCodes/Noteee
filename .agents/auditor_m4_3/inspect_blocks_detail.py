import glob
import re

def inspect_blocks_detail():
    files = ['03_sector_1_foundation_spec.md', '06_sector_3_editor_spec.md', '10_component_diagram.md', '11_class_diagrams.md', 'PROJECT.md']
    
    for fname in files:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"=== {fname} ===")
        # Look for section 10.1 or block type lists
        lines = content.splitlines()
        for i, line in enumerate(lines):
            if '12 core block' in line.lower() or '12 block' in line.lower() or 'block json types' in line.lower() or 'blocktype' in line.lower():
                print(f"L{i+1}: {line}")
                # print next 15 lines
                for j in range(i+1, min(i+25, len(lines))):
                    print(f"  L{j+1}: {lines[j]}")
                print("-" * 40)

if __name__ == '__main__':
    inspect_blocks_detail()
