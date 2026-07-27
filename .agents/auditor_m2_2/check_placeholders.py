import re
import sys

files = [
    '05_sector_2_capture_spec.md',
    '06_sector_3_editor_spec.md',
    '07_sector_4_ai_flashcards_spec.md'
]

print("=== Scanning Code Blocks for Ellipsis (...) or Stubs ===")
for fname in files:
    with open('/Users/apple/Coding-projects/Noteee/' + fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines to track line numbers accurately
    lines = content.splitlines()
    in_block = False
    block_type = ""
    block_start = 0
    block_lines = []
    
    for i, line in enumerate(lines, 1):
        if line.startswith("```"):
            if not in_block:
                in_block = True
                block_type = line.strip("`")
                block_start = i
                block_lines = []
            else:
                in_block = False
                block_content = "\n".join(block_lines)
                if "..." in block_content:
                    print(f"File {fname}, block starting at line {block_start} ({block_type}) contains '...':")
                    for bl_idx, bl in enumerate(block_lines, block_start + 1):
                        if "..." in bl:
                            print(f"  Line {bl_idx}: {bl}")
        elif in_block:
            block_lines.append(line)

print("=== Check Completed ===")
