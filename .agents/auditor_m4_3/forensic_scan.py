import glob
import re
import os

def run_forensic_scan():
    print("=== RUNNING INTEGRITY FORENSIC SCAN ===")
    
    # 1. Check for pre-populated result/log/output files
    print("\n1. Checking for pre-populated result/log artifacts...")
    artifacts = []
    for root, dirs, files in os.walk('.'):
        for f in files:
            if f.endswith(('.log', '.json', '.txt', '.result')) and not root.startswith('./.git'):
                artifacts.append(os.path.join(root, f))
    print(f"Artifacts found in workspace: {artifacts}")

    # 2. Check for suspicious patterns in markdown files
    md_files = sorted(glob.glob('*.md'))
    print(f"\n2. Scanning {len(md_files)} markdown files for prohibited patterns...")
    
    suspicious_patterns = [
        (r'\bLOREM IPSUM\b', 'Lorem Ipsum text'),
        (r'\bFIXME\b', 'FIXME marker'),
        (r'\bXXX\b', 'XXX marker'),
        (r'\bHARDCODED\b', 'Explicit hardcoded note'),
        (r'\bFACADE\b', 'Facade marker'),
        (r'```[a-z]*\s*\n\s*// TODO', 'Unimplemented code block stub'),
        (r'```[a-z]*\s*\n\s*/\* TODO', 'Unimplemented code block stub'),
    ]

    findings = []
    for fname in md_files:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for pat, desc in suspicious_patterns:
            matches = re.finditer(pat, content, re.IGNORECASE)
            for m in matches:
                line_num = content[:m.start()].count('\n') + 1
                findings.append(f"{fname} L{line_num}: {desc} -> '{m.group(0)}'")
                
    print(f"Prohibited pattern findings: {len(findings)}")
    for f in findings:
        print("  -", f)

if __name__ == '__main__':
    run_forensic_scan()
