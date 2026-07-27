import re

def check_code_blocks(filepath):
    print(f"=== CHECKING CODE BLOCKS IN {filepath} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.splitlines()

    in_code = False
    lang = ""
    current_code = []
    start_line = 0
    code_blocks = []

    for i, line in enumerate(lines, 1):
        if line.strip().startswith('```') and not line.strip().startswith('```mermaid'):
            if not in_code:
                in_code = True
                lang = line.strip()[3:]
                start_line = i
                current_code = []
            else:
                in_code = False
                code_blocks.append((start_line, i, lang, "\n".join(current_code)))
        elif in_code:
            current_code.append(line)

    print(f"Found {len(code_blocks)} code blocks.")
    for start_l, end_l, l_type, code in code_blocks:
        print(f"\n--- Block lines {start_l}-{end_l} (Lang: {l_type}) ---")
        c_lines = code.splitlines()
        # Search for suspect lines or empty methods
        for idx, cl in enumerate(c_lines, 1):
            if any(term in cl for term in ['TODO', 'FIXME', 'TBD', 'xxx', 'stub']):
                print(f"  [SUSPECT COMMENT] line {start_l + idx}: {cl.strip()}")
            if re.search(r'\{\s*\}', cl): # empty block
                print(f"  [EMPTY BLOCK] line {start_l + idx}: {cl.strip()}")
            if cl.strip().startswith('//') and any(w in cl.lower() for w in ['implement', 'placeholder', 'later', 'not implemented']):
                print(f"  [STUB COMMENT] line {start_l + idx}: {cl.strip()}")

check_code_blocks('/Users/apple/Coding-projects/Noteee/14_agentic_rag_spec.md')
print("\n" + "="*60 + "\n")
check_code_blocks('/Users/apple/Coding-projects/Noteee/15_cloud_infrastructure_spec.md')
