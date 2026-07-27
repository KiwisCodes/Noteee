import os
import re

spec_files = [
    "03_sector_1_foundation_spec.md",
    "05_sector_2_capture_spec.md",
    "06_sector_3_editor_spec.md",
    "07_sector_4_ai_flashcards_spec.md",
    "08_sector_5_canvas_pdf_spec.md",
    "09_sector_6_sync_collab_monetization_spec.md",
    "14_agentic_rag_spec.md",
    "15_cloud_infrastructure_spec.md",
    "16_canvas_pdf_media_workflows.md",
    "17_app_shipping_monetization_spec.md"
]

base_dir = "/Users/apple/Coding-projects/Noteee"

print("=== PROTOCOL 4: ARCHITECTURAL GUIDELINES AUDIT ===")

gof_patterns = [
    "Strategy", "Factory", "Observer", "Command", "Adapter",
    "Decorator", "Mediator", "Singleton", "Composite", "State",
    "Facade", "Proxy", "Chain of Responsibility", "Visitor", "Repository"
]

results = {}

for fname in spec_files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # SOLID / DIP check
    has_solid = bool(re.search(r'SOLID', content, re.IGNORECASE))
    has_dip = bool(re.search(r'Dependency Inversion|DIP|interface I[A-Z]', content))
    
    # Clean Architecture check
    has_clean_arch = bool(re.search(r'Clean Architecture|Domain Layer|Presentation Layer|Infrastructure Layer|Data Layer|Core Domain', content, re.IGNORECASE))
    
    # GOF patterns check
    found_gof = [p for p in gof_patterns if re.search(r'\b' + re.escape(p) + r'\b', content, re.IGNORECASE)]
    
    # Production Pain-Point Analysis check
    has_pain_points = bool(re.search(r'Pain Point|Production Pain-Point|Failure Mode|Mitigation|Edge Case', content, re.IGNORECASE))
    
    results[fname] = {
        "SOLID": has_solid,
        "DIP": has_dip,
        "CleanArchitecture": has_clean_arch,
        "GOF_Patterns": found_gof,
        "PainPointsAnalysis": has_pain_points
    }
    
    print(f"\n--- {fname} ---")
    print(f"  SOLID mentioned/applied: {has_solid}")
    print(f"  DIP contracts/abstractions: {has_dip}")
    print(f"  Clean Architecture layers: {has_clean_arch}")
    print(f"  GOF Patterns found: {found_gof}")
    print(f"  Production Pain-Point Analysis: {has_pain_points}")

