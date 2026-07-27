import os
import re

PROJECT_ROOT = "/Users/apple/Coding-projects/Noteee"

def read_file(filename):
    path = os.path.join(PROJECT_ROOT, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def check_cross_references():
    print("--- CROSS-REFERENCE FILE NUMBER CHECK ---")
    files = [f for f in os.listdir(PROJECT_ROOT) if f.endswith('.md') and f[0:2].isdigit()]
    files.sort()
    
    old_refs = ["04_sector_2", "05_sector_3", "06_sector_4", "07_sector_5", "08_sector_6"]
    found_old_refs = []
    
    for f in files:
        content = read_file(f)
        for old in old_refs:
            if old in content:
                found_old_refs.append((f, old))
                
    if found_old_refs:
        print("❌ Found outdated sector file references:")
        for f, old in found_old_refs:
            print(f"  {f} references {old}")
    else:
        print("✅ No outdated sector file references found.")

def check_interface_consistency():
    print("\n--- INTERFACE CONSISTENCY CHECK ---")
    file_11 = read_file("11_class_diagrams.md")
    
    required_interfaces = [
        "INoteRepository", "IFolderRepository", "ITagRepository",
        "IEmbedder", "ISpeechToText", "ITextRecognizer", "IClassificationEngine",
        "ICaptureSource", "FSRSEngine", "IBillingProvider"
    ]
    
    for iface in required_interfaces:
        in_11 = iface in file_11
        # search across sector files
        sectors_with_iface = []
        for s in ["03_sector_1_foundation_spec.md", "05_sector_2_capture_spec.md", "06_sector_3_editor_spec.md", "07_sector_4_ai_flashcards_spec.md", "08_sector_5_canvas_pdf_spec.md", "09_sector_6_sync_collab_monetization_spec.md"]:
            if iface in read_file(s):
                sectors_with_iface.append(s[:2])
        print(f"Interface {iface:25s}: in 11 = {str(in_11):5s} | present in sectors: {', '.join(sectors_with_iface)}")

def check_block_types():
    print("\n--- BLOCK TYPE CONSISTENCY CHECK ---")
    f03 = read_file("03_sector_1_foundation_spec.md")
    f06 = read_file("06_sector_3_editor_spec.md")
    f10 = read_file("10_component_diagram.md")
    f11 = read_file("11_class_diagrams.md")
    
    blocks = [
        "paragraph", "heading_1", "heading_2", "heading_3",
        "todo_item", "toggle", "callout", "code_block",
        "latex_math", "image", "audio", "subpage_link",
        "canvas_embed", "flashcard_cloze"
    ]
    
    print(f"{'Block Type':20s} | In File 03 | In File 06 | In File 10 | In File 11")
    print("-" * 65)
    for b in blocks:
        in_03 = b in f03
        in_06 = b in f06
        in_10 = b in f10
        in_11 = b in f11
        print(f"{b:20s} | {str(in_03):9s} | {str(in_06):9s} | {str(in_10):9s} | {str(in_11):9s}")

if __name__ == "__main__":
    check_cross_references()
    check_interface_consistency()
    check_block_types()
