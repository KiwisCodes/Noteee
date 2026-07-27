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

print("=== CHECKING CODE BLOCKS & DIAGRAM COMPLETENESS ===")

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all code blocks ```lang ... ```
    blocks = re.findall(r'```([a-zA-Z0-9_-]*)\n(.*?)```', content, re.DOTALL)
    
    # Also count all ```
    all_fences = re.findall(r'^```', content, re.MULTILINE)
    if len(all_fences) % 2 != 0:
        print(f"[FAIL] {fname}: Unclosed code fence count = {len(all_fences)}")
    else:
        print(f"[OK] {fname}: {len(blocks)} code blocks parsed cleanly.")

    for i, (lang, body) in enumerate(blocks, 1):
        if not body.strip():
            print(f"[WARN] {fname}: Block #{i} ({lang}) is EMPTY!")
        
        # Check if block ends abruptly (e.g. incomplete line, trailing comment like // TODO or open syntax)
        last_line = body.strip().splitlines()[-1] if body.strip() else ""
        if last_line.strip().startswith("// ...") or last_line.strip().startswith("# ...") or last_line.strip() == "...":
            print(f"[WARN] {fname}: Block #{i} ({lang}) ends with truncation indicator: '{last_line.strip()}'")

