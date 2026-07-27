import os
import re

files_specs = [
    "03_sector_1_foundation_spec.md",
    "05_sector_2_capture_spec.md",
    "06_sector_3_editor_spec.md",
    "07_sector_4_ai_flashcards_spec.md",
    "08_sector_5_canvas_pdf_spec.md",
    "09_sector_6_sync_collab_monetization_spec.md",
    "14_agentic_rag_spec.md",
    "15_cloud_infrastructure_spec.md",
    "16_canvas_pdf_media_workflows.md",
    "17_app_shipping_monetization_spec.md"
]

base_dir = "/Users/apple/Coding-projects/Noteee"

print("=== CHECKING MATH FORMULATIONS & DIP CONTRACTS ===")

for fname in files_specs:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Math formulas check (LaTeX $, $$, or math equations)
    math_matches = re.findall(r'(\$\$.*?\$\$|\$[^\$\n]+\$|\\\[.*?\\\]|\\\(.*?\\\))', content, re.DOTALL)
    
    # Interface / DIP contract check
    ts_interfaces = re.findall(r'interface\s+(I[A-Z][a-zA-Z0-9_]*)', content)
    
    print(f"\n--- {fname} ---")
    print(f"  Math Formulations count: {len(math_matches)}")
    if math_matches:
        print(f"    Sample math: {math_matches[0][:80]}...")
    print(f"  DIP Interfaces defined (count: {len(ts_interfaces)}): {ts_interfaces[:5]}")

