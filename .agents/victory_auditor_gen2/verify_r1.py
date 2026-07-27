import os

project_root = "/Users/apple/Coding-projects/Noteee"

def read_file(fname):
    with open(os.path.join(project_root, fname), "r", encoding="utf-8") as f:
        return f.read()

f1 = read_file("01_original_feature_list.md")
f2 = read_file("02_system_layers_roadmap.md")
f3 = read_file("03_sector_1_foundation_spec.md")
f4 = read_file("04_tech_stack_and_dependencies.md")

r1_results = {}

# File 1 checks
r1_results["f1_accessibility_section"] = "Accessibility & Localization" in f1
r1_results["f1_voiceover_talkback"] = "VoiceOver" in f1 and "TalkBack" in f1
r1_results["f1_dynamic_type"] = "Dynamic Type" in f1
r1_results["f1_vietnamese_dual_lang"] = "English + Vietnamese dual-language support" in f1
r1_results["f1_vietnamese_ai_models"] = "Vietnamese-tuned AI models" in f1
r1_results["f1_session_continuation_mvp"] = "[MVP] Session Continuation" in f1

# File 2 checks
r1_results["f2_layer2_file"] = "05_sector_2_capture_spec.md" in f2
r1_results["f2_layer3_file"] = "06_sector_3_editor_spec.md" in f2
r1_results["f2_layer4_file"] = "07_sector_4_ai_flashcards_spec.md" in f2
r1_results["f2_layer5_file"] = "08_sector_5_canvas_pdf_spec.md" in f2
r1_results["f2_layer6_file"] = "09_sector_6_sync_collab_monetization_spec.md" in f2

# Check line 163 of 02_system_layers_roadmap.md
lines_f2 = f2.splitlines()
line163 = lines_f2[162] if len(lines_f2) >= 163 else ""
r1_results["f2_line163_exact"] = "09_sector_6_sync_collab_monetization_spec.md" in line163
r1_results["f2_tts_clarification"] = "Local TTS" in f2
r1_results["f2_auth_added"] = "Authentication" in f2 or "Cloud Auth" in f2

# File 3 checks
r1_results["f3_capture_sessions_table"] = "captureSessions" in f3 or "capture_sessions" in f3
r1_results["f3_parentPageId_column"] = "parentPageId" in f3 or "parent_page_id" in f3
r1_results["f3_daily_notes_query"] = "Query-Level Implementation for Daily Notes Engine" in f3

blocks_12 = [
    "paragraph", "heading_1", "heading_2", "heading_3",
    "todo_item", "toggle", "callout", "code_block",
    "latex_math", "image", "audio", "subpage_link",
    "canvas_embed", "flashcard_cloze"
]
for b in blocks_12:
    r1_results[f"f3_block_{b}"] = b in f3

# File 4 checks: 12 dependencies
deps = [
    "expo-speech", "react-native-worklets", "date-fns", "fractional-indexing", "zod",
    "expo-notifications", "expo-haptics", "expo-file-system",
    "expo-clipboard", "@supabase/supabase-js", "react-native-google-mobile-ads"
]
for dep in deps:
    r1_results[f"f4_dep_{dep}"] = dep in f4
r1_results["f4_dep_uuid_or_crypto"] = ("uuid" in f4) or ("expo-crypto" in f4)

print("=== R1 VERIFICATION RESULTS ===")
all_pass = True
for k, v in r1_results.items():
    status = "PASS" if v else "FAIL"
    if not v:
        all_pass = False
    print(f"{k}: {status}")

print(f"\nR1 OVERALL: {'PASS' if all_pass else 'FAIL'}")
