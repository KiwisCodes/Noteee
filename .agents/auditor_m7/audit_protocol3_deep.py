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

print("=== DEEP CROSS-FILE ALIGNMENT CHECK ===")

# 1. Interface Names Cross-Reference
interface_defs = {}
interface_refs = {}

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    defs = re.findall(r'interface\s+(I[A-Z][a-zA-Z0-9_]*)', content)
    for d in defs:
        interface_defs.setdefault(d, []).append(fname)
    
    # Matches any IInterface pattern
    all_i = set(re.findall(r'\b(I[A-Z][a-zA-Z0-9_]{2,})\b', content))
    for i in all_i:
        interface_refs.setdefault(i, []).append(fname)

print(f"Total Unique Interface Definitions (I...): {len(interface_defs)}")
for idef, fnames in sorted(interface_defs.items()):
    all_referencing_files = interface_refs.get(idef, [])
    print(f"  {idef}: Defined in {fnames} | Mentioned in {len(all_referencing_files)} files")

# 2. Database Table Names Consistency
print("\n--- DB Table Cross-Reference ---")
tables = [
    'pages', 'blocks', 'folders', 'tags', 'page_tags', 'page_vectors', 'folder_vectors',
    'capture_sessions', 'capture_chunks', 'block_vectors', 'flashcards', 'flashcard_review_logs',
    'canvas_documents', 'canvas_layers', 'canvas_strokes', 'image_occlusion_masks',
    'pdf_annotations', 'handwriting_vectors'
]

for tbl in tables:
    appearing_in = []
    for fname in files:
        fpath = os.path.join(base_dir, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            c = f.read()
        if re.search(r'\b' + re.escape(tbl) + r'\b', c):
            appearing_in.append(fname)
    print(f"  Table '{tbl}': present in {len(appearing_in)} files -> {appearing_in[:3]}...")

