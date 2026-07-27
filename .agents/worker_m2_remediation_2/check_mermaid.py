import sys

file_path = '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_mermaid = False
mermaid_blocks = []
current_block = []
start_line = 0

for idx, line in enumerate(lines, 1):
    stripped = line.strip()
    if stripped.startswith('```mermaid'):
        in_mermaid = True
        start_line = idx
        current_block = []
    elif in_mermaid and stripped == '```':
        in_mermaid = False
        mermaid_blocks.append((start_line, idx, current_block))
    elif in_mermaid:
        current_block.append((idx, line))

print(f"Total Mermaid blocks found: {len(mermaid_blocks)}")

semicolons_found = 0
for start, end, block in mermaid_blocks:
    print(f"\n--- Mermaid Block: Lines {start} to {end} ---")
    for line_num, line_str in block:
        print(f"  Line {line_num:3d}: {line_str.rstrip()}")
        if ';' in line_str:
            print(f"    ^^^ [SEMICOLON DETECTED] Line {line_num}: {line_str.rstrip()}")
            semicolons_found += 1

print("\n==========================================")
if semicolons_found == 0:
    print("RESULT: SUCCESS - ZERO semicolons found across all Mermaid diagrams.")
else:
    print(f"RESULT: FAILURE - Found {semicolons_found} semicolons in Mermaid diagrams.")
