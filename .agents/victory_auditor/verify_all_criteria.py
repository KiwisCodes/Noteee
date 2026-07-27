import os
import re

PROJECT_ROOT = "/Users/apple/Coding-projects/Noteee"

def read_file(filename):
    path = os.path.join(PROJECT_ROOT, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def audit_file_01():
    content = read_file("01_original_feature_list.md")
    results = {}
    
    # Accessibility & Localization
    has_accessibility = "Accessibility" in content and "Localization" in content
    has_voiceover = "VoiceOver" in content or "TalkBack" in content
    has_dynamic_type = "Dynamic Type" in content
    has_vietnamese = "Vietnamese" in content
    results['File 01 Accessibility & Localization Section'] = has_accessibility and has_voiceover and has_dynamic_type and has_vietnamese
    
    # Session Continuation bumped to MVP
    # Search for Session Continuation and check if [MVP] tag is present
    session_cont_match = re.search(r'Session Continuation.*?\b(MVP|v2)\b', content, re.IGNORECASE)
    has_session_mvp = "Session Continuation" in content and "[MVP]" in content[content.find("Session Continuation"):content.find("Session Continuation")+200]
    results['File 01 Session Continuation bumped to [MVP]'] = has_session_mvp
    
    return results

def audit_file_02():
    content = read_file("02_system_layers_roadmap.md")
    results = {}
    
    # Deliverable file numbering starts at 05_
    has_05 = "05_sector_2_capture_spec.md" in content
    has_06 = "06_sector_3_editor_spec.md" in content
    has_07 = "07_sector_4_ai_flashcards_spec.md" in content
    has_08 = "08_sector_5_canvas_pdf_spec.md" in content
    has_09 = "09_sector_6_sync_collab_monetization_spec.md" in content
    # Ensure NO old 04_ references for sector 2 exist
    has_old_04 = "04_sector_2" in content
    results['File 02 Sector file numbering starting at 05_'] = has_05 and has_06 and has_07 and has_08 and has_09 and not has_old_04
    
    # TTS placement in layer stack clarified
    has_tts = "TTS" in content or "Text-to-Speech" in content
    results['File 02 TTS clarification'] = has_tts
    
    # Authentication in layer stack
    has_auth = "Auth" in content or "Authentication" in content
    results['File 02 Auth in layer stack'] = has_auth
    
    return results

def audit_file_03():
    content = read_file("03_sector_1_foundation_spec.md")
    results = {}
    
    # capture_sessions table in Drizzle schema
    has_capture_sessions = "capture_sessions" in content and "sqliteTable" in content
    results['File 03 capture_sessions table'] = has_capture_sessions
    
    # parentPageId column in pages table
    has_parent_page_id = "parentPageId" in content
    results['File 03 parentPageId column'] = has_parent_page_id
    
    # 12 block types defined with JSON content shapes
    block_types = [
        "paragraph", "heading_1", "heading_2", "heading_3", 
        "todo_item", "toggle", "callout", "code_block", 
        "latex_math", "image", "audio", "subpage_link", 
        "canvas_embed", "flashcard_cloze"
    ]
    missing_blocks = [b for b in block_types if b not in content]
    results['File 03 JSON content payload shapes for 12 block types'] = len(missing_blocks) == 0
    if missing_blocks:
        print(f"File 03 missing block types: {missing_blocks}")
        
    # Daily Notes query level clarification
    has_daily_notes = "Daily Notes" in content and ("virtual" in content.lower() or "query" in content.lower())
    results['File 03 Daily Notes query-level clarification'] = has_daily_notes
    
    return results

def audit_file_04():
    content = read_file("04_tech_stack_and_dependencies.md")
    results = {}
    
    deps = [
        "expo-speech", "react-native-worklets", "expo-crypto",
        "date-fns", "fractional-indexing", "zod",
        "expo-notifications", "expo-haptics", "expo-file-system",
        "expo-clipboard", "@supabase/supabase-js", "react-native-google-mobile-ads"
    ]
    missing_deps = [d for d in deps if d not in content]
    results['File 04 12 additional dependencies added'] = len(missing_deps) == 0
    if missing_deps:
        print(f"File 04 missing dependencies: {missing_deps}")
        
    return results

def audit_sector_files():
    results = {}
    sectors = {
        "05_sector_2_capture_spec.md": [
            "Multi-Photo", "Whisper", "Quick Capture", "Clipboard", "Live Activities", "Dynamic Island",
            "ICaptureSource", "IDLE", "RECORDING", "PROCESSING", "SUGGESTION", "FILED"
        ],
        "06_sector_3_editor_spec.md": [
            "TipTap", "WebView Bridge", "Slash", "Undo", "redo", "Yjs",
            "paragraph", "heading_1", "todo_item", "canvas_embed"
        ],
        "07_sector_4_ai_flashcards_spec.md": [
            "MiniLM", "ONNX", "FSRS", "Cloze", "semantic search", "embedding"
        ],
        "08_sector_5_canvas_pdf_spec.md": [
            "Skia", "PDF", "highlighter", "freehand", "occlusion", "coordinate", "stroke"
        ],
        "09_sector_6_sync_collab_monetization_spec.md": [
            "PowerSync", "SQLite", "PostgreSQL", "Yjs", "E2EE", "TTS", "Supabase Auth", "RevenueCat"
        ]
    }
    
    for filename, keywords in sectors.items():
        content = read_file(filename)
        missing = [k for k in keywords if k.lower() not in content.lower()]
        has_schema = "schema" in content.lower() or "table" in content.lower() or "interface" in content.lower()
        has_ts = "interface" in content or "type " in content
        has_diagrams = len(re.findall(r'```mermaid', content)) >= 2
        
        passed = (len(missing) == 0) and has_ts and has_diagrams
        results[f"Sector Spec {filename}"] = passed
        if missing:
            print(f"{filename} missing key topics: {missing}")
            
    return results

def audit_diagram_files():
    results = {}
    
    # 10_component_diagram.md
    c10 = read_file("10_component_diagram.md")
    has_monorepo = "apps/mobile" in c10 and "apps/web" in c10 and "packages/" in c10
    has_services = "PostgreSQL" in c10 and "PowerSync" in c10 and "WebSocket" in c10
    results["File 10 Component Diagram"] = has_monorepo and has_services
    
    # 11_class_diagrams.md
    c11 = read_file("11_class_diagrams.md")
    repos = "INoteRepository" in c11 and "IFolderRepository" in c11 and "ITagRepository" in c11
    ai_services = "IEmbedder" in c11 and "ISpeechToText" in c11 and "ITextRecognizer" in c11 and "IClassificationEngine" in c11
    capture_strat = "ICaptureSource" in c11
    block_hier = "BaseBlock" in c11 or "Block" in c11
    fsrs = "FSRS" in c11 or "Scheduler" in c11
    billing = "Billing" in c11 or "RevenueCat" in c11
    results["File 11 Class Diagrams"] = repos and ai_services and capture_strat and block_hier and fsrs and billing
    
    # 12_sequence_diagrams.md
    c12 = read_file("12_sequence_diagrams.md")
    onboarding = "onboarding" in c12.lower()
    capture = "capture" in c12.lower()
    editing = "editing" in c12.lower() or "auto-save" in c12.lower()
    search = "search" in c12.lower()
    flashcard = "flashcard" in c12.lower() or "study" in c12.lower()
    sync = "sync" in c12.lower() or "conflict" in c12.lower()
    collab = "collab" in c12.lower() or "sharing" in c12.lower()
    results["File 12 Sequence Diagrams"] = onboarding and capture and editing and search and flashcard and sync and collab
    
    # 13_state_machines.md
    c13 = read_file("13_state_machines.md")
    cap_state = "capture" in c13.lower()
    flash_state = "learning" in c13.lower() and "review" in c13.lower()
    vault_state = "vault" in c13.lower() or "lock" in c13.lower()
    sync_state = "sync" in c13.lower() and "online" in c13.lower()
    results["File 13 State Machines"] = cap_state and flash_state and vault_state and sync_state
    
    return results

def main():
    print("=================== FULL AUDIT SUMMARY ===================")
    all_results = {}
    all_results.update(audit_file_01())
    all_results.update(audit_file_02())
    all_results.update(audit_file_03())
    all_results.update(audit_file_04())
    all_results.update(audit_sector_files())
    all_results.update(audit_diagram_files())
    
    all_passed = True
    for item, passed in all_results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False
        print(f"{status} : {item}")
        
    print("==========================================================")
    print(f"OVERALL VERDICT PREPARATION: {'ALL REQUIREMENTS PASSED' if all_passed else 'REQUIREMENT FAILURES DETECTED'}")

if __name__ == "__main__":
    main()
