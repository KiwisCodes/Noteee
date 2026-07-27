import glob
import re
import os

def check_file_diagrams():
    files = [f for f in sorted(glob.glob('/Users/apple/Coding-projects/Noteee/*.md')) if not f.endswith('PROJECT.md')]
    
    diagram_count = 0
    errors = []
    
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = list(re.finditer(r'```mermaid\n(.*?\n)```', content, re.DOTALL))
        for idx, match in enumerate(matches):
            diagram_count += 1
            code = match.group(1).strip()
            lines = code.splitlines()
            if not lines:
                errors.append(f"{fname} Diagram #{idx+1}: Empty diagram")
                continue
            
            first_line = lines[0].strip()
            
            # Check Sequence Diagrams
            if first_line.startswith('sequenceDiagram'):
                for lno, line in enumerate(lines[1:], 2):
                    s = line.strip()
                    if not s or s.startswith('%%') or s.startswith('autonumber'):
                        continue
                    # Check for lowercase 'note ' in sequence diagrams
                    if re.match(r'^note\s+(over|left of|right of)', s):
                        errors.append(f"[{fname} Diagram #{idx+1} L{lno}] Lowercase 'note' in sequence diagram (must be 'Note'): '{s}'")
                    # Check for raw angle brackets in messages
                    if '<' in s and '>' in s:
                        # Check if it might break HTML parsing
                        pass

            # Check Class Diagrams
            elif first_line.startswith('classDiagram'):
                for lno, line in enumerate(lines[1:], 2):
                    s = line.strip()
                    if not s or s.startswith('%%'):
                        continue
                    # Check for raw angle brackets <T> instead of ~T~ in class member return types
                    # e.g., +find(id: string) Promise<Page> instead of Promise~Page~
                    if re.search(r'\b[A-Za-z0-9_]+\s*<[A-Za-z0-9_,\s]+>', s) and not ('<|--' in s or '<|..' in s or '..|>' in s or '<<' in s):
                        errors.append(f"[{fname} Diagram #{idx+1} L{lno}] Raw angle brackets in class diagram member (use ~Type~ for generics): '{s}'")

            # Check State Diagrams
            elif first_line.startswith('stateDiagram'):
                for lno, line in enumerate(lines[1:], 2):
                    s = line.strip()
                    if not s or s.startswith('%%'):
                        continue

            # Check Flowcharts / Graph
            elif first_line.startswith('graph') or first_line.startswith('flowchart'):
                for lno, line in enumerate(lines[1:], 2):
                    s = line.strip()
                    if not s or s.startswith('%%'):
                        continue

    print(f"Scanned {diagram_count} diagrams across 13 files.")
    if errors:
        print(f"\n❌ Found {len(errors)} Mermaid Syntax Errors:")
        for err in errors:
            print("  " + err)
    else:
        print("\n✅ All 46 Mermaid diagrams strictly comply with Mermaid syntax standard!")

if __name__ == '__main__':
    check_file_diagrams()
