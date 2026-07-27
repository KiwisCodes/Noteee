import os
import re
import json

files = [
    "01_original_feature_list.md",
    "02_system_layers_roadmap.md",
    "03_sector_1_foundation_spec.md",
    "04_tech_stack_and_dependencies.md",
    "05_sector_2_capture_spec.md",
    "06_sector_3_editor_spec.md",
    "07_sector_4_ai_flashcards_spec.md",
    "08_sector_5_canvas_pdf_spec.md",
    "09_sector_6_sync_collab_monetization_spec.md",
    "10_component_diagram.md",
    "11_class_diagrams.md",
    "12_sequence_diagrams.md",
    "13_state_machines.md",
    "14_agentic_rag_spec.md",
    "15_cloud_infrastructure_spec.md",
    "16_canvas_pdf_media_workflows.md",
    "17_app_shipping_monetization_spec.md",
    "PROJECT.md"
]

base_dir = "/Users/apple/Coding-projects/Noteee"

all_diagrams = []

for fname in files:
    fpath = os.path.join(base_dir, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all ```mermaid blocks
    # We regex match ```mermaid ... ```
    pattern = r'```mermaid\n(.*?)```'
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for match_idx, m in enumerate(matches, 1):
        diagram_code = m.group(1)
        # line number in file
        start_line = content[:m.start()].count('\n') + 1
        end_line = content[:m.end()].count('\n') + 1
        
        # Identify diagram type (first non-empty line)
        lines = [line.strip() for line in diagram_code.splitlines() if line.strip() and not line.strip().startswith("%%")]
        first_line = lines[0] if lines else "EMPTY"
        
        all_diagrams.append({
            "file": fname,
            "index": match_idx,
            "start_line": start_line,
            "end_line": end_line,
            "header": first_line,
            "code": diagram_code
        })

print(f"Total Mermaid diagrams extracted: {len(all_diagrams)}")

out_path = "/Users/apple/Coding-projects/Noteee/.agents/auditor_m7/extracted_diagrams.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(all_diagrams, f, indent=2)

print(f"Saved to {out_path}")

# Print summary table per file
from collections import Counter
counts = Counter(d['file'] for d in all_diagrams)
for fname in files:
    print(f"  {fname}: {counts[fname]} diagrams")

