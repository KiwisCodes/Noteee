import glob
import re
import os

def extract_all_mermaid():
    files = sorted(glob.glob('*.md'))
    all_mermaid = []
    
    for fname in files:
        if fname.startswith('.'):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to find ```mermaid ... ```
        pattern = r'```mermaid\s*\n(.*?)\n```'
        matches = re.findall(pattern, content, re.DOTALL)
        
        print(f"File {fname}: {len(matches)} mermaid blocks found.")
        for idx, block in enumerate(matches, 1):
            lines = [l.strip() for l in block.strip().splitlines() if l.strip() and not l.strip().startswith('%%')]
            diagram_type = lines[0] if lines else "EMPTY"
            all_mermaid.append({
                'file': fname,
                'index': idx,
                'type': diagram_type,
                'content': block,
                'lines_count': len(lines)
            })
            
    print(f"\nTotal mermaid blocks extracted: {len(all_mermaid)}")
    return all_mermaid

if __name__ == '__main__':
    blocks = extract_all_mermaid()
    for b in blocks:
        print(f"[{b['file']} # {b['index']}] Type: {b['type']} ({b['lines_count']} lines)")
