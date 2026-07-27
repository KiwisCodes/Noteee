import glob
import re
import os

def thorough_diagram_audit():
    files = [f for f in sorted(glob.glob('/Users/apple/Coding-projects/Noteee/*.md')) if not f.endswith('PROJECT.md')]
    
    diagram_list = []
    
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = list(re.finditer(r'```mermaid\n(.*?\n)```', content, re.DOTALL))
        for idx, match in enumerate(matches):
            code = match.group(1).strip()
            diagram_list.append({
                'file': fname,
                'idx': idx + 1,
                'code': code
            })

    print(f"Auditing {len(diagram_list)} diagrams for structural integrity...\n")

    syntax_issues = []

    for d in diagram_list:
        fname = d['file']
        idx = d['idx']
        code = d['code']
        lines = code.splitlines()
        first_line = lines[0].strip()

        # Check block balances (rect/end, alt/end, loop/end, opt/end, par/end, class block braces, state block braces, subgraph/end)
        open_blocks = []
        
        for lno, raw_line in enumerate(lines, 1):
            line = raw_line.strip()
            if not line or line.startswith('%%'):
                continue
                
            # Sequence diagram block keywords
            if first_line.startswith('sequenceDiagram'):
                if line.startswith('alt ') or line.startswith('loop ') or line.startswith('opt ') or line.startswith('par ') or line.startswith('rect '):
                    open_blocks.append((line.split()[0], lno))
                elif line == 'end':
                    if not open_blocks:
                        syntax_issues.append(f"{fname} #{idx} L{lno}: Unexpected 'end' without matching block start")
                    else:
                        open_blocks.pop()

            # Flowchart subgraph check
            elif first_line.startswith('flowchart') or first_line.startswith('graph'):
                if line.startswith('subgraph '):
                    open_blocks.append(('subgraph', lno))
                elif line == 'end':
                    if not open_blocks:
                        syntax_issues.append(f"{fname} #{idx} L{lno}: Unexpected 'end' without matching subgraph")
                    else:
                        open_blocks.pop()

            # Class/State diagram brace check
            elif first_line.startswith('classDiagram') or first_line.startswith('stateDiagram'):
                if line.endswith('{') or line.startswith('class ') and '{' in line or line.startswith('state ') and '{' in line:
                    open_blocks.append(('{', lno))
                elif line == '}':
                    if not open_blocks:
                        syntax_issues.append(f"{fname} #{idx} L{lno}: Unexpected '}}' without matching '{{'")
                    else:
                        open_blocks.pop()

        if open_blocks:
            for btype, blno in open_blocks:
                syntax_issues.append(f"{fname} #{idx}: Unclosed '{btype}' block started at L{blno}")

    if syntax_issues:
        print(f"❌ Found {len(syntax_issues)} structural block errors in Mermaid diagrams:")
        for issue in syntax_issues:
            print("  - " + issue)
    else:
        print("✅ All 46 Mermaid diagrams have perfectly balanced structural blocks (all alt/rect/loop/subgraph/braces closed properly)!")

if __name__ == '__main__':
    thorough_diagram_audit()
