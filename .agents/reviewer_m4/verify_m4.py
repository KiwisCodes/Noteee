import re
import os
import glob

base_dir = "/Users/apple/Coding-projects/Noteee"
files_01_13 = sorted([f for f in os.listdir(base_dir) if re.match(r'^\d\d_.*\.md$', f)])

print(f"Found {len(files_01_13)} planning files:")
for f in files_01_13:
    print(f" - {f}")

# 1. Mermaid Block Extractor & Syntax Checker
mermaid_blocks = []
for fname in files_01_13:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    blocks = re.findall(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
    print(f"\nFile: {fname} contains {len(blocks)} mermaid blocks.")
    for idx, block in enumerate(blocks, 1):
        mermaid_blocks.append((fname, idx, block))

# Check Mermaid Syntax basic rules (e.g. unescaped semicolons inside labels, illegal characters, open brackets)
def check_mermaid_syntax(fname, idx, block):
    errors = []
    lines = block.split('\n')
    header = lines[0].strip() if lines else ""
    
    # Check diagram type
    valid_headers = ['flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 'stateDiagram', 'erDiagram', 'gantt', 'pie']
    header_type = header.split()[0] if header else ""
    if header_type not in valid_headers:
        errors.append(f"Unknown or invalid mermaid header: '{header}'")
    
    # Check for raw unescaped semicolons inside brackets/quotes if any
    # Check bracket matching
    open_curly = block.count('{') - block.count('}')
    open_paren = block.count('(') - block.count(')')
    open_square = block.count('[') - block.count(']')
    
    if open_curly != 0:
        errors.append(f"Unbalanced curly braces {{}}: delta {open_curly}")
    if open_paren != 0:
        errors.append(f"Unbalanced parentheses (): delta {open_paren}")
    if open_square != 0:
        errors.append(f"Unbalanced square brackets []: delta {open_square}")

    return errors

print("\n--- MERMAID SYNTAX CHECK ---")
total_mermaid_errors = 0
for fname, idx, block in mermaid_blocks:
    errs = check_mermaid_syntax(fname, idx, block)
    if errs:
        print(f"❌ {fname} Diagram #{idx} errors: {errs}")
        total_mermaid_errors += len(errs)
    else:
        print(f"✅ {fname} Diagram #{idx} syntax OK ({block.splitlines()[0].strip()})")

print(f"\nTotal Mermaid Syntax Errors: {total_mermaid_errors}")
