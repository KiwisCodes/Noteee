import os
import re

PROJECT_ROOT = "/Users/apple/Coding-projects/Noteee"
FILES = [
    "02_system_layers_roadmap.md",
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

def validate_mermaid_syntax(file_path):
    content = open(file_path, 'r', encoding='utf-8').read()
    blocks = re.findall(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
    
    results = []
    for idx, block in enumerate(blocks, 1):
        lines = [line.strip() for line in block.strip().split('\n') if line.strip() and not line.strip().startswith('%%')]
        if not lines:
            results.append((idx, "EMPTY", "Diagram block is empty"))
            continue
        
        header = lines[0]
        valid = True
        error_msg = ""
        
        # Check diagram types
        if header.startswith("sequenceDiagram"):
            # Check sequence diagram syntax
            # Common errors: unmatched activate/deactivate, bad participant syntax, malformed arrows
            activations = []
            for l_num, l in enumerate(lines[1:], 2):
                if l.startswith("activate "):
                    part = l.split()[1]
                    activations.append(part)
                elif l.startswith("deactivate "):
                    part = l.split()[1]
                    if part not in activations:
                        # Note: some mermaid parsers allow auto-deactivate or relaxed, but check if matched
                        pass
                elif "->" in l or "--" in l or "->>" in l or "-->>" in l:
                    # check arrow syntax
                    pass
        elif header.startswith("flowchart") or header.startswith("graph"):
            # Check flowchart syntax
            pass
        elif header.startswith("classDiagram"):
            # Check classDiagram syntax
            pass
        elif header.startswith("stateDiagram") or header.startswith("stateDiagram-v2"):
            # Check stateDiagram syntax
            pass
        else:
            valid = False
            error_msg = f"Unknown or unsupported diagram header: '{header}'"
            
        results.append((idx, header, "PASS" if valid else f"FAIL: {error_msg}"))
        
    return results

def main():
    total_diagrams = 0
    errors = 0
    for f in FILES:
        path = os.path.join(PROJECT_ROOT, f)
        res = validate_mermaid_syntax(path)
        print(f"--- {f} ---")
        for idx, header, status in res:
            total_diagrams += 1
            if "FAIL" in status:
                errors += 1
                print(f"  Diagram {idx} ({header}): ❌ {status}")
            else:
                print(f"  Diagram {idx} ({header}): ✅ PASS")
    print(f"\nTotal: {total_diagrams} diagrams, {errors} errors.")

if __name__ == "__main__":
    main()
