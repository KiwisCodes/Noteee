import re
import sys

def extract_mermaid_blocks(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    blocks = []
    in_mermaid = False
    current_block = []
    start_line = 0
    
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped == '```mermaid':
            in_mermaid = True
            current_block = []
            start_line = i
        elif stripped == '```' and in_mermaid:
            in_mermaid = False
            blocks.append({
                'start_line': start_line,
                'end_line': i,
                'content': ''.join(current_block)
            })
        elif in_mermaid:
            current_block.append(line)
            
    return blocks

for filepath in ['16_canvas_pdf_media_workflows.md', '17_app_shipping_monetization_spec.md']:
    blocks = extract_mermaid_blocks(filepath)
    print(f"=== File: {filepath} ({len(blocks)} Mermaid blocks) ===")
    for idx, b in enumerate(blocks, 1):
        print(f"Diagram #{idx} (Lines {b['start_line']}-{b['end_line']}):")
        print(b['content'].strip())
        print("-" * 50)
