import os
import re

project_root = "/Users/apple/Coding-projects/Noteee"

files_to_check = [
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
    "13_state_machines.md"
]

print("=== Checking File Existence & Sizes ===")
for fname in files_to_check:
    fpath = os.path.join(project_root, fname)
    if not os.path.exists(fpath):
        print(f"MISSING FILE: {fname}")
    else:
        size = os.path.getsize(fpath)
        print(f"EXISTS: {fname} ({size} bytes)")

print("\n=== Counting Mermaid Diagrams per File ===")
total_mermaid = 0
mermaid_by_file = {}
for fname in files_to_check:
    fpath = os.path.join(project_root, fname)
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        blocks = re.findall(r"```mermaid\s*\n(.*?)```", content, re.DOTALL)
        mermaid_by_file[fname] = blocks
        print(f"{fname}: {len(blocks)} mermaid diagram(s)")
        total_mermaid += len(blocks)

print(f"Total Mermaid diagrams across all 13 files: {total_mermaid}")
