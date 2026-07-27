import os
import re

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

terms = ["TODO", "FIXME", "TBD", "WIP", "XXX", "TEMP", "PLACEHOLDER", "INSERT HERE", "YOUR_"]

print("=== DEEP PLACEHOLDER SEARCH ===")

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    for idx, line in enumerate(lines, 1):
        for term in terms:
            # Match whole word or bracketed
            if re.search(r'\b' + re.escape(term) + r'\b', line, re.IGNORECASE):
                # Ignore false positives like /todo in editor spec or standard english words if any
                if term.upper() == "TODO" and "/todo" in line:
                    continue
                if term.upper() == "TEMP" and ("temperature" in line.lower() or "template" in line.lower() or "temporary" in line.lower() or "temp_file" in line.lower() or "tempfile" in line.lower() or "tempdir" in line.lower() or "temporal" in line.lower()):
                    continue
                print(f"{fname}:{idx} [{term}]: {line.strip()}")

