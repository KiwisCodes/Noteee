import glob
import re
import os

def check_all_46_diagrams():
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
            
    print(f"Loaded {len(diagram_list)} diagrams.\n")
    
    for i, d in enumerate(diagram_list, 1):
        lines = d['code'].splitlines()
        header = lines[0] if lines else 'EMPTY'
        print(f"Diagram #{i:02d} [{d['file']} #{d['idx']}]: type='{header}' ({len(lines)} lines)")

if __name__ == '__main__':
    check_all_46_diagrams()
