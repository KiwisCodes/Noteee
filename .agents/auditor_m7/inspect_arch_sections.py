import os
import re

spec_files = [
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

for fname in spec_files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    print(f"\n==================== {fname} ====================")
    headings = [line.strip() for line in lines if line.startswith("#")]
    print("Headings:")
    for h in headings:
        print(f"  {h}")

