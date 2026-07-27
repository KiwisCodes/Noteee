import os
import re

spec_files = [
    '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
    '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
    '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
]

out_dir = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_3/diagrams'
os.makedirs(out_dir, exist_ok=True)

total_diagrams = 0

for spec_path in spec_files:
    fname = os.path.basename(spec_path)
    file_prefix = fname.split('_')[0] # e.g. '05', '06', '07'
    
    with open(spec_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    in_diagram = False
    current_lines = []
    start_line = 0
    diag_index = 1
    
    for idx, line in enumerate(lines, 1):
        if line.strip().startswith('```mermaid'):
            in_diagram = True
            start_line = idx
            current_lines = []
        elif line.strip() == '```' and in_diagram:
            in_diagram = False
            diagram_content = "".join(current_lines)
            
            diag_filename = f"{file_prefix}_diag_{diag_index}_line_{start_line}.mmd"
            diag_filepath = os.path.join(out_dir, diag_filename)
            
            with open(diag_filepath, 'w', encoding='utf-8') as df:
                df.write(diagram_content)
                
            print(f"Extracted: {diag_filename} ({len(current_lines)} lines, starting at line {start_line})")
            diag_index += 1
            total_diagrams += 1
        elif in_diagram:
            current_lines.append(line)

print(f"\nTotal extracted Mermaid diagrams: {total_diagrams}")
