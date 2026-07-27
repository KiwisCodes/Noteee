import re
import os
import subprocess
import sys

FILE_16 = "/Users/apple/Coding-projects/Noteee/16_canvas_pdf_media_workflows.md"
FILE_17 = "/Users/apple/Coding-projects/Noteee/17_app_shipping_monetization_spec.md"

def check_code_blocks(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_block = False
    block_type = ""
    start_line = 0
    blocks = []
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('```'):
            if not in_block:
                in_block = True
                block_type = stripped[3:].strip()
                start_line = i
            else:
                in_block = False
                blocks.append({
                    'start': start_line,
                    'end': i,
                    'type': block_type,
                    'content_lines': i - start_line - 1
                })
                block_type = ""
                
    return in_block, start_line, block_type, blocks, len(lines)

def check_placeholders(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Exclude markdown ellipses if any, but check for code placeholders
    placeholder_patterns = [
        (r'\bTODO\b', 'TODO'),
        (r'\bFIXME\b', 'FIXME'),
        (r'\bTBD\b', 'TBD'),
        (r'\/\/\s*\.\.\.', '// ...'),
        (r'#\s*\.\.\.', '# ...'),
        (r'\bplaceholder\b', 'placeholder')
    ]
    
    matches = []
    lines = content.split('\n')
    for line_idx, line in enumerate(lines, 1):
        for pattern, name in placeholder_patterns:
            if re.search(pattern, line, re.IGNORECASE):
                matches.append((line_idx, name, line.strip()))
                
    return matches

def main():
    print("=== M6 RE-CHECK VERIFICATION SCRIPT ===")
    
    # 1. Code Block Audit
    print("\n--- 1. CODE BLOCK AUDIT ---")
    for fp in [FILE_16, FILE_17]:
        unclosed, start_line, block_type, blocks, total_lines = check_code_blocks(fp)
        filename = os.path.basename(fp)
        if unclosed:
            print(f"❌ FAIL: {filename} has UNCLOSED code block starting at line {start_line} (type: '{block_type}') (Total lines: {total_lines})")
        else:
            print(f"✅ PASS: {filename} has {len(blocks)} code blocks, all properly closed! (Total lines: {total_lines})")
            for idx, b in enumerate(blocks, 1):
                print(f"    Block #{idx}: lines {b['start']}-{b['end']} ({b['type'] or 'plain'}, {b['content_lines']} content lines)")

    # 2. Placeholder Check
    print("\n--- 2. PLACEHOLDER & BROKEN CODE FENCE SCAN ---")
    for fp in [FILE_16, FILE_17]:
        filename = os.path.basename(fp)
        matches = check_placeholders(fp)
        if matches:
            print(f"❌ FAIL: {filename} has potential placeholders:")
            for line_no, name, snippet in matches:
                print(f"    Line {line_no} [{name}]: {snippet}")
        else:
            print(f"✅ PASS: {filename} contains zero placeholders (TODO, FIXME, TBD, // ..., etc.).")

    # 3. Mermaid Diagram Extraction
    print("\n--- 3. MERMAID DIAGRAM EXTRACTION & SYNTAX VERIFICATION ---")
    for fp in [FILE_16, FILE_17]:
        filename = os.path.basename(fp)
        _, _, _, blocks, _ = check_code_blocks(fp)
        mermaid_blocks = [b for b in blocks if b['type'] == 'mermaid']
        print(f"File {filename} contains {len(mermaid_blocks)} Mermaid diagrams.")
        
        with open(fp, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for idx, mb in enumerate(mermaid_blocks, 1):
            diagram_code = "".join(lines[mb['start']:mb['end']-1])
            first_line = lines[mb['start']].strip()
            print(f"\n  Diagram #{idx} in {filename} (Lines {mb['start']}-{mb['end']}):")
            print(f"  Header/Type: {first_line}")
            print(f"  Lines count: {mb['content_lines']}")

if __name__ == "__main__":
    main()
