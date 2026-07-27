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

placeholder_patterns = [
    r'\bTODO\b',
    r'\bFIXME\b',
    r'\bTBD\b',
    r'\[TBD\]',
    r'\[...\\]',
    r'\.\.\.',
]

print("=== PROTOCOL 1: PLACEHOLDER & CODE BLOCK CHECK ===")

for fname in files:
    fpath = os.path.join(base_dir, fname)
    if not os.path.exists(fpath):
        print(f"MISSING FILE: {fname}")
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.splitlines()
    
    # 1. Unclosed code blocks check
    backticks_count = len(re.findall(r'^```', content, flags=re.MULTILINE))
    if backticks_count % 2 != 0:
        print(f"[FAIL] {fname}: Odd number of ``` blocks ({backticks_count}), likely unclosed code block!")
    
    # 2. Check placeholders
    for idx, line in enumerate(lines, 1):
        for pat in [r'\bTODO\b', r'\bFIXME\b', r'\bTBD\b', r'\[TBD\]']:
            matches = re.findall(pat, line, flags=re.IGNORECASE)
            if matches:
                print(f"[FOUND PLACEHOLDER] {fname}:{idx}: match '{matches}' in line: {line.strip()}")
        
        # Check '...' specifically in code blocks or text where it acts as a placeholder
        if '...' in line:
            # Check context of '...'
            print(f"[POSSIBLE ELLIPSIS/PLACEHOLDER] {fname}:{idx}: {line.strip()}")

