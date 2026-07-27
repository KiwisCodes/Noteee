import glob
import os
import re

diag_files = sorted(glob.glob('/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_3/diagrams/*.mmd'))

print(f"Validating {len(diag_files)} Mermaid diagram files...")

passed = 0
failed = 0

for fpath in diag_files:
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    lines = content.splitlines()
    errors = []
    
    # Header check
    if not lines or not lines[0].strip():
        errors.append("Empty file")
    else:
        header = lines[0].strip()
        if not (header.startswith('sequenceDiagram') or header.startswith('stateDiagram-v2') or header.startswith('flowchart') or header.startswith('classDiagram')):
            errors.append(f"Invalid header: {header}")
            
    # Check for unescaped semicolons inside sequence diagram message labels
    if lines and lines[0].strip() == 'sequenceDiagram':
        for lno, line in enumerate(lines, 1):
            if '->>' in line or '-->>' in line or '->' in line or '-->' in line:
                if ':' in line:
                    label = line.split(':', 1)[1]
                    if ';' in label and not (label.startswith('"') and label.endswith('"')):
                        errors.append(f"Line {lno}: Unescaped semicolon in arrow label without quotes: {line}")
                        
    # Check quote balance
    for lno, line in enumerate(lines, 1):
        if line.count('"') % 2 != 0:
            errors.append(f"Line {lno}: Unbalanced double quotes: {line}")
        if line.count("'") % 2 != 0:
            # ignore contractions like "don't" inside double quotes or comments
            pass

    # Check block structure balance (alt/else/end, par/and/end, rect/end, loop/end)
    block_stack = []
    for lno, line in enumerate(lines, 1):
        sline = line.strip()
        if sline.startswith('alt ') or sline.startswith('loop ') or sline.startswith('par ') or sline.startswith('rect '):
            block_stack.append((sline.split()[0], lno))
        elif sline.startswith('else') or sline.startswith('and'):
            if not block_stack:
                errors.append(f"Line {lno}: Unexpected '{sline.split()[0]}' without open block")
        elif sline == 'end':
            if not block_stack:
                errors.append(f"Line {lno}: Unexpected 'end' without open block")
            else:
                block_stack.pop()

    if block_stack:
        for btype, lno in block_stack:
            errors.append(f"Unclosed block '{btype}' opened at line {lno}")

    if errors:
        print(f"❌ FAIL: {fname}")
        for err in errors:
            print(f"   - {err}")
        failed += 1
    else:
        print(f"✅ PASS: {fname}")
        passed += 1

print(f"\nSummary: Total={len(diag_files)}, PASS={passed}, FAIL={failed}")
