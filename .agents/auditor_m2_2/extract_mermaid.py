import os
import re

spec_files = [
    '05_sector_2_capture_spec.md',
    '06_sector_3_editor_spec.md',
    '07_sector_4_ai_flashcards_spec.md'
]

out_dir = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_2/diagrams'
os.makedirs(out_dir, exist_ok=True)

extracted = []

for spec in spec_files:
    spec_path = os.path.join('/Users/apple/Coding-projects/Noteee', spec)
    with open(spec_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_mermaid = False
    mermaid_lines = []
    start_line = 0
    diagram_count = 0
    
    for idx, line in enumerate(lines, 1):
        if line.strip().startswith('```mermaid'):
            in_mermaid = True
            start_line = idx
            mermaid_lines = []
        elif line.strip() == '```' and in_mermaid:
            in_mermaid = False
            diagram_count += 1
            diagram_name = f"{spec.split('_')[0]}_diag_{diagram_count}_line_{start_line}.mmd"
            diag_path = os.path.join(out_dir, diagram_name)
            content = "".join(mermaid_lines)
            with open(diag_path, 'w', encoding='utf-8') as df:
                df.write(content)
            extracted.append((spec, start_line, diag_path, content))
        elif in_mermaid:
            mermaid_lines.append(line)

print(f"Extracted {len(extracted)} mermaid diagrams:")
for spec, start_line, diag_path, content in extracted:
    first_line = content.strip().splitlines()[0] if content.strip() else "EMPTY"
    print(f"  {os.path.basename(diag_path)}: {spec}:{start_line} -> {first_line}")
