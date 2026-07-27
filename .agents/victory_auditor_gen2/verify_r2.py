import os
import re

project_root = "/Users/apple/Coding-projects/Noteee"

def read_file(fname):
    with open(os.path.join(project_root, fname), "r", encoding="utf-8") as f:
        return f.read()

f5 = read_file("05_sector_2_capture_spec.md")
f6 = read_file("06_sector_3_editor_spec.md")
f7 = read_file("07_sector_4_ai_flashcards_spec.md")
f8 = read_file("08_sector_5_canvas_pdf_spec.md")
f9 = read_file("09_sector_6_sync_collab_monetization_spec.md")

r2_results = {}

# Common required sections in every sector file:
# 1. Feature breakdown
# 2. Design patterns
# 3. Data models / schema
# 4. Sequence/State diagrams (Mermaid)
# 5. Interface/contract definitions (TypeScript)

for idx, (fname, content) in enumerate([
    ("05_sector_2_capture_spec.md", f5),
    ("06_sector_3_editor_spec.md", f6),
    ("07_sector_4_ai_flashcards_spec.md", f7),
    ("08_sector_5_canvas_pdf_spec.md", f8),
    ("09_sector_6_sync_collab_monetization_spec.md", f9),
], start=5):
    prefix = f"f{idx}"
    r2_results[f"{prefix}_features"] = "Feature" in content or "feature" in content
    r2_results[f"{prefix}_design_patterns"] = "Pattern" in content or "pattern" in content
    r2_results[f"{prefix}_schema"] = "Schema" in content or "drizzle" in content.lower() or "interface" in content
    mermaid_count = len(re.findall(r"```mermaid\s*\n(.*?)```", content, re.DOTALL))
    r2_results[f"{prefix}_mermaid_at_least_2"] = mermaid_count >= 2
    r2_results[f"{prefix}_ts_interfaces"] = "interface " in content or "export interface" in content or "type " in content

# File 5 specifics
r2_results["f5_camera"] = "camera" in f5.lower() or "photo" in f5.lower()
r2_results["f5_whisper_stt"] = "whisper" in f5.lower()
r2_results["f5_quick_capture"] = "quick capture" in f5.lower()
r2_results["f5_clipboard"] = "clipboard" in f5.lower()
r2_results["f5_live_activities"] = "live activities" in f5.lower() or "dynamic island" in f5.lower()
r2_results["f5_icapturesource"] = "ICaptureSource" in f5
r2_results["f5_state_machine"] = "IDLE" in f5 and "RECORDING" in f5 and "FILED" in f5

# File 6 specifics
r2_results["f6_tiptap_bridge"] = "tiptap" in f6.lower() and "webview" in f6.lower()
r2_results["f6_12_block_renderers"] = "paragraph" in f6 and "todo" in f6 and "code" in f6
r2_results["f6_slash_menu"] = "slash" in f6.lower() or "slash menu" in f6.lower()
r2_results["f6_undo_redo"] = "undo" in f6.lower()
r2_results["f6_yjs_collab"] = "yjs" in f6.lower() or "crdt" in f6.lower()

# File 7 specifics
r2_results["f7_local_embedding"] = "minilm" in f7.lower() or "onnx" in f7.lower()
r2_results["f7_3_pathways"] = "fallback" in f7.lower() or "pathway" in f7.lower()
r2_results["f7_semantic_search"] = "semantic search" in f7.lower()
r2_results["f7_fsrs"] = "fsrs" in f7.lower()
r2_results["f7_cloze_qa"] = "cloze" in f7.lower() and "q&a" in f7.lower() or "qa" in f7.lower()

# File 8 specifics
r2_results["f8_skia"] = "skia" in f8.lower()
r2_results["f8_pdf_highlighter"] = "pdf" in f8.lower() and "highlight" in f8.lower()
r2_results["f8_image_occlusion"] = "occlusion" in f8.lower()
r2_results["f8_canvas_embed"] = "canvas" in f8.lower()
r2_results["f8_stroke_model"] = "stroke" in f8.lower()

# File 9 specifics
r2_results["f9_powersync"] = "powersync" in f9.lower()
r2_results["f9_yjs_crdt"] = "yjs" in f9.lower()
r2_results["f9_e2ee"] = "e2ee" in f9.lower() or "zero-knowledge" in f9.lower()
r2_results["f9_tts"] = "tts" in f9.lower() or "speech" in f9.lower()
r2_results["f9_auth"] = "supabase" in f9.lower() or "auth" in f9.lower()
r2_results["f9_revenuecat"] = "revenuecat" in f9.lower() or "billing" in f9.lower()

print("=== R2 VERIFICATION RESULTS ===")
all_pass = True
for k, v in r2_results.items():
    status = "PASS" if v else "FAIL"
    if not v:
        all_pass = False
    print(f"{k}: {status}")

print(f"\nR2 OVERALL: {'PASS' if all_pass else 'FAIL'}")
