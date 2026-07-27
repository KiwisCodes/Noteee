import os
import re

project_root = "/Users/apple/Coding-projects/Noteee"

def read_file(fname):
    with open(os.path.join(project_root, fname), "r", encoding="utf-8") as f:
        return f.read()

f10 = read_file("10_component_diagram.md")
f11 = read_file("11_class_diagrams.md")
f12 = read_file("12_sequence_diagrams.md")
f13 = read_file("13_state_machines.md")

r3_results = {}

# File 10 checks (Component Diagram)
r3_results["f10_apps_mobile"] = "apps/mobile" in f10 or "mobile" in f10
r3_results["f10_apps_web"] = "apps/web" in f10 or "web" in f10
r3_results["f10_apps_backend"] = "apps/backend" in f10 or "backend" in f10
r3_results["f10_packages"] = "packages/" in f10 or "packages" in f10
r3_results["f10_postgresql"] = "postgresql" in f10.lower()
r3_results["f10_powersync"] = "powersync" in f10.lower()
r3_results["f10_websocket"] = "websocket" in f10.lower()
r3_results["f10_mermaid"] = len(re.findall(r"```mermaid\s*\n(.*?)```", f10, re.DOTALL)) >= 1

# File 11 checks (Class Diagrams)
r3_results["f11_repos"] = "INoteRepository" in f11 and "IFolderRepository" in f11 and "ITagRepository" in f11
r3_results["f11_ai_services"] = "IEmbedder" in f11 and "ISpeechToText" in f11 and "ITextRecognizer" in f11 and "IClassificationEngine" in f11
r3_results["f11_capture_strategy"] = "ICaptureSource" in f11
r3_results["f11_block_hierarchy"] = "Block" in f11 or "BlockContent" in f11
r3_results["f11_fsrs"] = "FSRS" in f11 or "IFSRSScheduler" in f11
r3_results["f11_billing"] = ("IBillingAdapter" in f11) or ("IBillingProvider" in f11) or ("RevenueCatAdapter" in f11)
r3_results["f11_mermaid"] = len(re.findall(r"```mermaid\s*\n(.*?)```", f11, re.DOTALL)) >= 1

# File 12 checks (Sequence Diagrams)
r3_results["f12_onboarding"] = "onboarding" in f12.lower()
r3_results["f12_capture_session"] = "capture" in f12.lower()
r3_results["f12_note_editing"] = "edit" in f12.lower() or "auto-save" in f12.lower()
r3_results["f12_semantic_search"] = "search" in f12.lower()
r3_results["f12_flashcard_study"] = "flashcard" in f12.lower() or "study" in f12.lower()
r3_results["f12_multi_device_sync"] = "sync" in f12.lower()
r3_results["f12_collab_link"] = "collab" in f12.lower() or "sharing" in f12.lower() or "link" in f12.lower()
r3_results["f12_mermaid"] = len(re.findall(r"```mermaid\s*\n(.*?)```", f12, re.DOTALL)) >= 1

# File 13 checks (State Machines)
r3_results["f13_capture_session_states"] = "capture" in f13.lower()
r3_results["f13_flashcard_states"] = "learning" in f13.lower() or "review" in f13.lower() or "relearning" in f13.lower()
r3_results["f13_vault_states"] = "vault" in f13.lower() or "lock" in f13.lower()
r3_results["f13_sync_states"] = "offline" in f13.lower() or "syncing" in f13.lower() or "online" in f13.lower()
r3_results["f13_mermaid"] = len(re.findall(r"```mermaid\s*\n(.*?)```", f13, re.DOTALL)) >= 1

print("=== R3 VERIFICATION RESULTS ===")
all_pass = True
for k, v in r3_results.items():
    status = "PASS" if v else "FAIL"
    if not v:
        all_pass = False
    print(f"{k}: {status}")

print(f"\nR3 OVERALL: {'PASS' if all_pass else 'FAIL'}")
