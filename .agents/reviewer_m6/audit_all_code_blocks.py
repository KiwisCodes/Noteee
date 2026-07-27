import sys

def check_file_code_blocks(filename):
    with open(filename, 'r', encoding='utf-8') as f:
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
                    'type': block_type
                })
                block_type = ""
                
    if in_block:
        print(f"❌ UNCLOSED CODE BLOCK in {filename}: started on line {start_line} (type: '{block_type}')")
    else:
        print(f"✅ All {len(blocks)} code blocks in {filename} are properly closed!")

check_file_code_blocks('16_canvas_pdf_media_workflows.md')
check_file_code_blocks('17_app_shipping_monetization_spec.md')
