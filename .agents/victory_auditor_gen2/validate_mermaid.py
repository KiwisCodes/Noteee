import os
import re

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

def check_mermaid_syntax(diagram_code, file_name, diagram_idx):
    lines = [line.strip() for line in diagram_code.strip().split("\n") if line.strip() and not line.strip().startswith("%%")]
    if not lines:
        return False, "Empty diagram block"
    
    header = lines[0]
    valid_headers = [
        "sequenceDiagram", "classDiagram", "stateDiagram", "stateDiagram-v2",
        "flowchart", "graph", "erDiagram", "gantt", "pie", "journey", "C4Context", "architecture"
    ]
    
    header_type = None
    for vh in valid_headers:
        if header.startswith(vh):
            header_type = vh
            break
            
    if not header_type:
        return False, f"Unknown diagram header: '{header}'"
    
    errors = []
    
    # Check bracket balance
    round_open = diagram_code.count("(")
    round_close = diagram_code.count(")")
    curly_open = diagram_code.count("{")
    curly_close = diagram_code.count("}")
    square_open = diagram_code.count("[")
    square_close = diagram_code.count("]")
    
    # Note: in class diagrams ~T~ is used for generics like Promise~Page~
    # Note: in quotes or labels brackets can be used
    if curly_open != curly_close:
        errors.append(f"Unbalanced curly braces: {curly_open} open, {curly_close} close")
    if square_open != square_close:
        errors.append(f"Unbalanced square brackets: {square_open} open, {square_close} close")

    # Specific checks by diagram type
    if header_type == "sequenceDiagram":
        for i, l in enumerate(lines[1:], 1):
            if l.startswith("autonumber") or l.startswith("actor") or l.startswith("participant") or l.startswith("box") or l.startswith("end") or l.startswith("alt") or l.startswith("else") or l.startswith("opt") or l.startswith("loop") or l.startswith("par") or l.startswith("critical") or l.startswith("break") or l.startswith("rect") or l.startswith("note"):
                continue
            if "->" in l or "--" in l or "-)" in l or "--)" in l:
                continue
            # Some sequence diagrams have sub-comments or inline statements
            # Check if line looks like valid participant statement or arrow
            pass

    elif header_type in ["stateDiagram", "stateDiagram-v2"]:
        for i, l in enumerate(lines[1:], 1):
            if l.startswith("[*]") or l.startswith("state") or l == "}" or l.startswith("note"):
                continue
            if "-->" in l or "->" in l:
                continue

    elif header_type == "classDiagram":
        for i, l in enumerate(lines[1:], 1):
            if l.startswith("class") or l == "}" or l.startswith("<<") or l.startswith("namespace"):
                continue
            if "<|--" in l or "<|.." in l or "*--" in l or "o--" in l or "-->" in l or "..>" in l or "--" in l or ".." in l:
                continue
            if l.startswith("+") or l.startswith("-") or l.startswith("#") or l.startswith("~"):
                continue

    elif header_type in ["flowchart", "graph"]:
        for i, l in enumerate(lines[1:], 1):
            if l.startswith("subgraph") or l == "end" or l.startswith("style") or l.startswith("classDef") or l.startswith("class") or l.startswith("click"):
                continue
            if "-->" in l or "---" in l or "-.->" in l or "==>" in l or "-->|" in l:
                continue

    if errors:
        return False, "; ".join(errors)
    return True, f"Valid {header_type}"

total_diagrams = 0
passed_diagrams = 0
results = []

for fname in files:
    fpath = os.path.join(project_root, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    blocks = re.findall(r"```mermaid\s*\n(.*?)```", content, re.DOTALL)
    for idx, block in enumerate(blocks, 1):
        total_diagrams += 1
        is_valid, msg = check_mermaid_syntax(block, fname, idx)
        if is_valid:
            passed_diagrams += 1
            results.append((fname, idx, "PASS", msg))
        else:
            results.append((fname, idx, "FAIL", msg))

print(f"=== MERMAID DIAGRAM VALIDATION REPORT ===")
print(f"Total Diagrams: {total_diagrams}")
print(f"Passed: {passed_diagrams}")
print(f"Failed: {total_diagrams - passed_diagrams}\n")

for fname, idx, status, msg in results:
    if status == "FAIL":
        print(f"❌ {fname} Diagram #{idx}: {status} - {msg}")
    else:
        print(f"✅ {fname} Diagram #{idx}: {status} - {msg}")

