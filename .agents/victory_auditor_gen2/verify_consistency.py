import os

project_root = "/Users/apple/Coding-projects/Noteee"

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
    "13_state_machines.md"
]

contents = {}
for fname in files:
    with open(os.path.join(project_root, fname), "r", encoding="utf-8") as f:
        contents[fname] = f.read()

checks = {}

# 1. 12 block types consistency between File 03 and File 06 and File 11
blocks_12 = [
    "paragraph", "heading_1", "heading_2", "heading_3",
    "todo_item", "toggle", "callout", "code_block",
    "latex_math", "image", "audio", "subpage_link",
    "canvas_embed", "flashcard_cloze"
]

for b in blocks_12:
    checks[f"block_{b}_in_f03"] = b in contents["03_sector_1_foundation_spec.md"]
    checks[f"block_{b}_in_f06"] = b in contents["06_sector_3_editor_spec.md"]
    checks[f"block_{b}_in_f11"] = b in contents["11_class_diagrams.md"] or b.replace("_", "") in contents["11_class_diagrams.md"].lower()

# 2. File references in 02 match actual filenames
checks["f02_ref_03"] = "03_sector_1_foundation_spec.md" in contents["02_system_layers_roadmap.md"]
checks["f02_ref_05"] = "05_sector_2_capture_spec.md" in contents["02_system_layers_roadmap.md"]
checks["f02_ref_06"] = "06_sector_3_editor_spec.md" in contents["02_system_layers_roadmap.md"]
checks["f02_ref_07"] = "07_sector_4_ai_flashcards_spec.md" in contents["02_system_layers_roadmap.md"]
checks["f02_ref_08"] = "08_sector_5_canvas_pdf_spec.md" in contents["02_system_layers_roadmap.md"]
checks["f02_ref_09"] = "09_sector_6_sync_collab_monetization_spec.md" in contents["02_system_layers_roadmap.md"]

# 3. Interfaces in 11 match sector specs
interfaces = [
    "INoteRepository", "IFolderRepository", "ITagRepository",
    "IEmbedder", "ISpeechToText", "ITextRecognizer", "IClassificationEngine",
    "ICaptureSource", "IFSRSScheduler"
]
for inf in interfaces:
    checks[f"interface_{inf}_in_f11"] = inf in contents["11_class_diagrams.md"]

print("=== CROSS-FILE CONSISTENCY VERIFICATION ===")
all_pass = True
for k, v in checks.items():
    status = "PASS" if v else "FAIL"
    if not v:
        all_pass = False
    print(f"{k}: {status}")

print(f"\nCROSS-FILE CONSISTENCY OVERALL: {'PASS' if all_pass else 'FAIL'}")
