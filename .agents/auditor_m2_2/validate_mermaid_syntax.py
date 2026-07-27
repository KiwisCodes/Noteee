import os
import subprocess
import glob

diag_files = sorted(glob.glob('/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_2/diagrams/*.mmd'))

print(f"Found {len(diag_files)} diagram files to validate:")

mmdc_path = None
# Check if mmdc is available directly or via npx
try:
    res = subprocess.run(['npx', '@mermaid-js/mermaid-cli', '--version'], capture_output=True, text=True, timeout=30)
    if res.returncode == 0:
        print("Found @mermaid-js/mermaid-cli version:", res.stdout.strip())
        mmdc_path = ['npx', '@mermaid-js/mermaid-cli']
except Exception as e:
    print("npx @mermaid-js/mermaid-cli check:", e)

for fpath in diag_files:
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"\n--- Validating {fname} ---")
    lines = [l.rstrip() for l in content.splitlines() if l.strip()]
    if not lines:
        print("  FAIL: Empty diagram")
        continue
    
    header = lines[0].strip()
    print(f"  Header: {header}")
    
    # Static Checks
    syntax_ok = True
    errors = []
    
    # Check diagram type
    valid_types = ['sequenceDiagram', 'stateDiagram-v2', 'stateDiagram', 'flowchart', 'gantt', 'classDiagram', 'erDiagram']
    if not any(header.startswith(vt) for vt in valid_types):
        errors.append(f"Unknown diagram header: {header}")
        syntax_ok = False
        
    # Check quote balance
    for idx, l in enumerate(lines, 1):
        if l.count('"') % 2 != 0:
            errors.append(f"Unbalanced double quotes at line {idx}: {l}")
            syntax_ok = False
        if l.count("'") % 2 != 0:
            errors.append(f"Unbalanced single quotes at line {idx}: {l}")
            syntax_ok = False
            
    # Check parenthetical balance in non-comment lines
    for idx, l in enumerate(lines, 1):
        if not l.strip().startswith('%%'):
            # count ( and )
            if l.count('(') != l.count(')'):
                errors.append(f"Unbalanced parentheses at line {idx}: {l}")
                syntax_ok = False
            if l.count('[') != l.count(']'):
                # Note: [ * ] in state diagram is fine
                pass
                
    if syntax_ok:
        print("  Static Syntax Check: PASS")
    else:
        print("  Static Syntax Check: FAIL")
        for err in errors:
            print("    -", err)
            
    # If mmdc available, run mmdc render check
    if mmdc_path:
        out_svg = fpath + ".svg"
        cmd = mmdc_path + ['-i', fpath, '-o', out_svg]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
            if res.returncode == 0:
                print("  CLI Compilation (mmdc): PASS (SVG generated)")
                if os.path.exists(out_svg):
                    os.remove(out_svg)
            else:
                print("  CLI Compilation (mmdc): FAIL")
                print("    stdout:", res.stdout)
                print("    stderr:", res.stderr)
        except Exception as ex:
            print("  CLI Compilation error:", ex)
