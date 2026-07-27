import glob
import re
import os
import sys

def main():
    files = [f for f in sorted(glob.glob('/Users/apple/Coding-projects/Noteee/*.md')) if not f.endswith('PROJECT.md')]
    print(f"Auditing {len(files)} specification files...\n")
    
    total_diagrams = 0
    diagrams = []
    
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = list(re.finditer(r'```mermaid\n(.*?\n)```', content, re.DOTALL))
        print(f"📄 {fname}: {len(matches)} mermaid diagrams")
        for idx, match in enumerate(matches):
            code = match.group(1).strip()
            lines = code.splitlines()
            header = lines[0] if lines else ''
            total_diagrams += 1
            diagrams.append({
                'file': fname,
                'path': fpath,
                'index': idx + 1,
                'header': header,
                'code': code
            })

    print(f"\nTotal mermaid diagrams extracted: {total_diagrams}\n")

    # Syntax sanity checks
    valid_diagram_types = [
        'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 'stateDiagram',
        'graph', 'flowchart', 'erDiagram', 'gantt', 'pie', 'gitGraph', 'architecture-beta', 'mindmap'
    ]

    syntax_errors = []
    for d in diagrams:
        code = d['code']
        first_line = code.splitlines()[0].strip() if code.splitlines() else ''
        dtype = first_line.split()[0] if first_line else ''
        
        if not any(first_line.startswith(t) for t in valid_diagram_types):
            syntax_errors.append(f"[{d['file']} Diagram #{d['index']}] Unknown diagram type: '{first_line}'")
        
        # Check sequence diagram syntax
        if first_line.startswith('sequenceDiagram'):
            # Check for illegal characters or unclosed quotes/brackets
            for line_no, line in enumerate(code.splitlines(), 1):
                # check balanced quotes in lines
                if line.count('"') % 2 != 0:
                    syntax_errors.append(f"[{d['file']} Diagram #{d['index']} Line {line_no}] Unbalanced quotes: {line}")
                if line.count('(') != line.count(')'):
                    # In sequence diagram, parentheses in messages might be okay if in strings, but let's check
                    pass

        # Check class diagram syntax
        if first_line.startswith('classDiagram'):
            for line_no, line in enumerate(code.splitlines(), 1):
                if line.count('"') % 2 != 0:
                    syntax_errors.append(f"[{d['file']} Diagram #{d['index']} Line {line_no}] Unbalanced quotes: {line}")

        # Check state diagram syntax
        if first_line.startswith('stateDiagram'):
            for line_no, line in enumerate(code.splitlines(), 1):
                if line.count('"') % 2 != 0:
                    syntax_errors.append(f"[{d['file']} Diagram #{d['index']} Line {line_no}] Unbalanced quotes: {line}")

    if syntax_errors:
        print("❌ Mermaid Syntax Issues Found:")
        for err in syntax_errors:
            print("  - " + err)
    else:
        print("✅ Basic Mermaid Syntax Sanity Checks Passed for all diagrams!")

if __name__ == '__main__':
    main()
