import glob
import re

files = ['07_sector_4_ai_flashcards_spec.md', '08_sector_5_canvas_pdf_spec.md', '10_component_diagram.md', '13_state_machines.md']

for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"=== Context in {fname} ===")
    for i, line in enumerate(lines, 1):
        if re.search(r'\b(11|2)\s*(?:-| )*(?:dim|dimensional|d)\b', line, re.IGNORECASE):
            print(f"  Line {i}: {line.strip()}")
