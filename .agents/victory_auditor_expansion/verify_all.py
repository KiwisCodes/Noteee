import os
import re
import json

BASE_DIR = "/Users/apple/Coding-projects/Noteee"

def check_placeholders():
    print("=== CHECK 1: PLACEHOLDERS SCAN ===")
    files = [
        "01_original_feature_list.md", "02_system_layers_roadmap.md", "03_sector_1_foundation_spec.md",
        "04_tech_stack_and_dependencies.md", "05_sector_2_capture_spec.md", "06_sector_3_editor_spec.md",
        "07_sector_4_ai_flashcards_spec.md", "08_sector_5_canvas_pdf_spec.md", "09_sector_6_sync_collab_monetization_spec.md",
        "10_component_diagram.md", "11_class_diagrams.md", "12_sequence_diagrams.md", "13_state_machines.md",
        "14_agentic_rag_spec.md", "15_cloud_infrastructure_spec.md", "16_canvas_pdf_media_workflows.md",
        "17_app_shipping_monetization_spec.md", "PROJECT.md"
    ]
    
    placeholder_pattern = re.compile(r'\b(TODO|FIXME|TBD|XXX|HACK|LOREM|PLACEHOLDER)\b', re.IGNORECASE)
    
    violations = []
    for fname in files:
        fpath = os.path.join(BASE_DIR, fname)
        if not os.path.exists(fpath):
            violations.append(f"File missing: {fname}")
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            for line_idx, line in enumerate(f, 1):
                # Ignore valid documentation mentions such as "/todo" command or explicit auditor notes
                if "/todo" in line.lower() or "todo list" in line.lower():
                    continue
                m = placeholder_pattern.search(line)
                if m:
                    violations.append(f"{fname}:{line_idx} -> {line.strip()}")
                    
    if violations:
        print(f"FAILED: Found {len(violations)} placeholder violations:")
        for v in violations:
            print("  ", v)
    else:
        print("PASS: 0 unresolved placeholders found across all 18 deliverables.")
    return len(violations) == 0

def check_planning_only():
    print("\n=== CHECK 2: PLANNING-ONLY REQUIREMENT ===")
    prohibited_exts = {'.ts', '.tsx', '.js', '.jsx', '.py', '.rs', '.go', '.java', '.cpp', '.c', '.h', '.swift', '.kt'}
    found_code_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        # Ignore hidden directories like .agents and .idea
        if ".agents" in root or ".idea" in root:
            continue
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in prohibited_exts:
                found_code_files.append(os.path.join(root, file))
                
    if found_code_files:
        print(f"FAILED: Found {len(found_code_files)} source code files:")
        for f in found_code_files:
            print("  ", f)
    else:
        print("PASS: 0 source code files found in workspace (planning-only requirement satisfied).")
    return len(found_code_files) == 0

def check_master_diagrams_content():
    print("\n=== CHECK 3: MASTER DIAGRAMS UPDATE ===")
    
    # 10_component_diagram.md should contain Redis, BullMQ, Cloudflare, RAG
    comp_path = os.path.join(BASE_DIR, "10_component_diagram.md")
    with open(comp_path, "r", encoding="utf-8") as f:
        comp_text = f.read()
    
    reqs_10 = ["Redis", "BullMQ", "Cloudflare", "RAG Engine", "Skia"]
    missing_10 = [r for r in reqs_10 if r.lower() not in comp_text.lower()]
    
    # 11_class_diagrams.md should contain key DIP interfaces
    class_path = os.path.join(BASE_DIR, "11_class_diagrams.md")
    with open(class_path, "r", encoding="utf-8") as f:
        class_text = f.read()
    
    reqs_11 = ["IRagEngine", "IStrokeSpatialIndex", "IJobQueueAdapter", "IRateLimiter", "IPdfAnnotationEngine", "IBillingAdapter", "ISafetyGuardrail"]
    missing_11 = [r for r in reqs_11 if r not in class_text]
    
    # 12_sequence_diagrams.md should contain RAG execution, Canvas stroke search, BYOK, PDF occlusion
    seq_path = os.path.join(BASE_DIR, "12_sequence_diagrams.md")
    with open(seq_path, "r", encoding="utf-8") as f:
        seq_text = f.read()
    
    reqs_12 = ["RAG", "Canvas", "BYOK", "Occlusion"]
    missing_12 = [r for r in reqs_12 if r.lower() not in seq_text.lower()]
    
    # 13_state_machines.md should contain rate limiting, subscription, RAG reflection, canvas drawing
    state_path = os.path.join(BASE_DIR, "13_state_machines.md")
    with open(state_path, "r", encoding="utf-8") as f:
        state_text = f.read()
    
    reqs_13 = ["Rate Limit", "Subscription", "Reflection", "Canvas"]
    missing_13 = [r for r in reqs_13 if r.lower() not in state_text.lower()]

    pass_all = True
    if missing_10:
        print(f"FAILED 10_component_diagram.md missing: {missing_10}")
        pass_all = False
    else:
        print("PASS 10_component_diagram.md contains all updated components.")

    if missing_11:
        print(f"FAILED 11_class_diagrams.md missing: {missing_11}")
        pass_all = False
    else:
        print("PASS 11_class_diagrams.md contains all required interfaces.")

    if missing_12:
        print(f"FAILED 12_sequence_diagrams.md missing: {missing_12}")
        pass_all = False
    else:
        print("PASS 12_sequence_diagrams.md contains all required sequence flows.")

    if missing_13:
        print(f"FAILED 13_state_machines.md missing: {missing_13}")
        pass_all = False
    else:
        print("PASS 13_state_machines.md contains all required state machines.")

    return pass_all

def check_deliverables_completeness():
    print("\n=== CHECK 4: EXPANDED SPEC DELIVERABLES COMPLETENESS ===")
    
    deliverables = {
        "14_agentic_rag_spec.md": ["IRagEngine", "RRF", "Reciprocal Rank Fusion", "ONNX", "pgvector", "BM25", "Hallucination", "Self-Correction"],
        "15_cloud_infrastructure_spec.md": ["Cloudflare", "AWS ALB", "Redis", "BullMQ", "RabbitMQ", "Token Bucket", "PII", "Prompt Injection"],
        "16_canvas_pdf_media_workflows.md": ["Skia", "R-Tree", "ISkiaCanvasEngine", "IStrokeSpatialIndex", "IHandwritingRecognizer", "IPdfAnnotationEngine", "Occlusion", "FSRS"],
        "17_app_shipping_monetization_spec.md": ["RevenueCat", "PrivacyInfo.xcprivacy", "AndroidManifest.xml", "BYOK", "Sentry", "IBillingAdapter", "IKeyStoreManager", "IObservabilityService"]
    }
    
    all_pass = True
    for fname, req_terms in deliverables.items():
        fpath = os.path.join(BASE_DIR, fname)
        if not os.path.exists(fpath):
            print(f"FAILED: {fname} does not exist.")
            all_pass = False
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        missing = [t for t in req_terms if t.lower() not in content.lower()]
        if missing:
            print(f"FAILED: {fname} is missing terms: {missing}")
            all_pass = False
        else:
            print(f"PASS: {fname} contains all required sections and domain terms.")
            
    return all_pass

if __name__ == "__main__":
    r1 = check_placeholders()
    r2 = check_planning_only()
    r3 = check_master_diagrams_content()
    r4 = check_deliverables_completeness()
    print("\n================ FINAL SUITE RESULT ================")
    if r1 and r2 and r3 and r4:
        print("OVERALL VERDICT: PASS")
    else:
        print("OVERALL VERDICT: FAIL")
