import glob
import re
import os

def audit_diagrams():
    files = [f for f in sorted(glob.glob('/Users/apple/Coding-projects/Noteee/*.md')) if not f.endswith('PROJECT.md')]
    
    all_diagrams = []
    
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = list(re.finditer(r'```mermaid\n(.*?\n)```', content, re.DOTALL))
        for idx, match in enumerate(matches):
            code = match.group(1).strip()
            all_diagrams.append({
                'file': fname,
                'index': idx + 1,
                'code': code
            })

    print(f"Total diagrams: {len(all_diagrams)}\n")

    issues = []

    for d in all_diagrams:
        fname = d['file']
        didx = d['index']
        code = d['code']
        lines = [l for l in code.splitlines()]
        if not lines:
            issues.append(f"{fname} #{didx}: Empty mermaid block")
            continue
        
        header = lines[0].strip()
        
        # Check diagram header
        if header.startswith('sequenceDiagram'):
            # Validate sequence diagram
            participants = set()
            for line_no, line in enumerate(lines[1:], 2):
                l = line.strip()
                if not l or l.startswith('%%') or l.startswith('autonumber') or l.startswith('accTitle') or l.startswith('accDescr'):
                    continue
                if l.startswith('participant ') or l.startswith('actor '):
                    parts = l.split(maxsplit=2)
                    if len(parts) >= 2:
                        participants.add(parts[1])
                elif '->>' in l or '-->>' in l or '->' in l or '-->' in l or '-)' in l or '--)' in l or '-x' in l or '--x' in l:
                    # Message line
                    # e.g., ClientA->>Relay: message
                    m = re.match(r'^\s*([A-Za-z0-9_]+)\s*(?:--?>?>|-x|--x|-\)|--\))\s*([A-Za-z0-9_]+)\s*:\s*(.*)$', l)
                    if not m:
                        # Check note line or alt/else/end/rect/loop/opt
                        if not any(l.startswith(kw) for kw in ['Note ', 'Note over', 'Note left of', 'Note right of', 'alt ', 'else', 'end', 'loop ', 'opt ', 'par ', 'and ', 'rect ']):
                            issues.append(f"{fname} #{didx} L{line_no}: Malformed sequence diagram message line: '{l}'")
                elif any(l.startswith(kw) for kw in ['alt ', 'else', 'end', 'loop ', 'opt ', 'par ', 'and ', 'rect ', 'activate ', 'deactivate ', 'title ']):
                    continue
                elif l.startswith('Note '):
                    continue
                else:
                    issues.append(f"{fname} #{didx} L{line_no}: Unrecognized line in sequence diagram: '{l}'")

        elif header.startswith('classDiagram'):
            # Validate class diagram syntax
            for line_no, line in enumerate(lines[1:], 2):
                l = line.strip()
                if not l or l.startswith('%%'):
                    continue
                # class ClassName { ... } or ClassA <|-- ClassB : relationship or class ClassName
                if l.startswith('class ') or l.startswith('interface ') or l == '}' or ' <|-- ' in l or ' --* ' in l or ' --o ' in l or ' ..|> ' in l or ' -- ' in l or ' ..> ' in l or ' <|.. ' in l or ' *-- ' in l or ' o-- ' in l or '<|--' in l or '..|>' in l:
                    continue
                if re.match(r'^\s*[A-Za-z0-9_]+\s*:\s*.*$', l): # member or method line e.g. ClassName : +method()
                    continue
                if re.match(r'^\s*[\+\-#~]\s*.*$', l): # inside class block member
                    continue
                if l.startswith('<<') and l.endswith('>>'):
                    continue
                issues.append(f"{fname} #{didx} L{line_no}: Unrecognized line in class diagram: '{l}'")

        elif header.startswith('stateDiagram') or header.startswith('stateDiagram-v2'):
            # Validate state diagram syntax
            for line_no, line in enumerate(lines[1:], 2):
                l = line.strip()
                if not l or l.startswith('%%'):
                    continue
                if l.startswith('state ') or l == '}' or l == '[*]' or '[*] -->' in l or '--> [*]' in l or '-->' in l or l.startswith('note '):
                    continue
                issues.append(f"{fname} #{didx} L{line_no}: Unrecognized line in state diagram: '{l}'")

        elif header.startswith('graph') or header.startswith('flowchart'):
            # Validate flowchart/graph
            pass

    print(f"Total issues found in mermaid syntax validation: {len(issues)}")
    for iss in issues:
        print("  - " + iss)

if __name__ == '__main__':
    audit_diagrams()
