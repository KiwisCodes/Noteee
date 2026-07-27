import os
import re
import sys

PROJECT_ROOT = "/Users/apple/Coding-projects/Noteee"
FILES = [
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
]

def check_files_exist():
    print("--- FILE EXISTENCE CHECK ---")
    for f in FILES:
        path = os.path.join(PROJECT_ROOT, f)
        if os.path.exists(path):
            size = os.path.getsize(path)
            lines = len(open(path, 'r', encoding='utf-8').readlines())
            print(f"✅ {f}: {lines} lines, {size} bytes")
        else:
            print(f"❌ {f}: MISSING")

def check_placeholders():
    print("\n--- PLACEHOLDER & SUSPICIOUS KEYWORD SEARCH ---")
    keywords = ["TODO", "FIXME", "TBD", "placeholder", "xxx", "Lorem ipsum", "FIX ME", "WIP"]
    found_any = False
    for f in FILES:
        path = os.path.join(PROJECT_ROOT, f)
        if not os.path.exists(path):
            continue
        content = open(path, 'r', encoding='utf-8').read()
        for kw in keywords:
            matches = [m.start() for m in re.finditer(re.escape(kw), content, re.IGNORECASE)]
            if matches:
                found_any = True
                print(f"⚠️ {f}: Found {len(matches)} occurrences of '{kw}'")
                # Show context
                for m in matches[:3]: # first 3
                    snippet = content[max(0, m-30):min(len(content), m+40)].replace('\n', ' ')
                    print(f"   Context: ...{snippet}...")
    if not found_any:
        print("✅ No suspicious placeholder keywords found in any file.")

def extract_mermaid_blocks():
    print("\n--- MERMAID DIAGRAM EXTRACTION ---")
    diagram_count = 0
    for f in FILES:
        path = os.path.join(PROJECT_ROOT, f)
        if not os.path.exists(path):
            continue
        content = open(path, 'r', encoding='utf-8').read()
        blocks = re.findall(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
        if blocks:
            print(f"📄 {f}: {len(blocks)} Mermaid diagram(s)")
            for idx, block in enumerate(blocks, 1):
                first_line = block.strip().split('\n')[0]
                lines_in_block = len(block.strip().split('\n'))
                print(f"   Diagram {idx}: type '{first_line}' ({lines_in_block} lines)")
            diagram_count += len(blocks)
    print(f"Total Mermaid diagrams found across all files: {diagram_count}")

if __name__ == "__main__":
    check_files_exist()
    check_placeholders()
    extract_mermaid_blocks()
