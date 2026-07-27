import re
import sys

def verify_file(filepath):
    print(f"=== VERIFYING {filepath} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.splitlines()

    # 1. Check for Placeholders
    placeholders = ['TODO', 'FIXME', 'TBD', '[TBD]', '...']
    found_placeholders = []
    
    # We ignore '...' if used in legitimate context (e.g. JS rest operator `...` or string truncation like `'...'`)
    # But let's report any suspect line.
    for i, line in enumerate(lines, 1):
        for ph in ['TODO', 'FIXME', 'TBD', '[TBD]']:
            if ph in line:
                found_placeholders.append((i, ph, line.strip()))
        # Check standalone '...' in code or text (not rest parameter `...args` or `...spread`)
        if re.search(r'(?<!\.)\.\.\.(?!\.|\w|\))', line) and not '...' in line: # custom check
            pass

    print(f"Placeholder check (TODO/FIXME/TBD): {len(found_placeholders)} found.")
    for line_no, ph, snippet in found_placeholders:
        print(f"  Line {line_no} [{ph}]: {snippet}")

    # 2. Extract and Check Mermaid Diagrams
    mermaid_blocks = []
    in_mermaid = False
    current_block = []
    start_line = 0

    for i, line in enumerate(lines, 1):
        if line.strip().startswith('```mermaid'):
            in_mermaid = True
            current_block = []
            start_line = i
        elif in_mermaid and line.strip() == '```':
            in_mermaid = False
            mermaid_blocks.append((start_line, i, "\n".join(current_block)))
        elif in_mermaid:
            current_block.append(line)

    print(f"\nMermaid diagrams count: {len(mermaid_blocks)}")
    for start_l, end_l, block_content in mermaid_blocks:
        print(f"  Diagram at lines {start_l}-{end_l}:")
        b_lines = [l for l in block_content.splitlines() if l.strip()]
        header = b_lines[0] if b_lines else "EMPTY"
        print(f"    Header: {header}")

        # Check common syntax issues
        # e.g., mismatched brackets, invalid node characters, unescaped quotes, etc.
        open_parens = block_content.count('(') - block_content.count(')')
        open_brackets = block_content.count('[') - block_content.count(']')
        open_braces = block_content.count('{') - block_content.count('}')
        
        print(f"    Paren diff: {open_parens}, Bracket diff: {open_brackets}, Brace diff: {open_braces}")
        
        # Check for unescaped special characters in node labels
        # Check for invalid semicolons or syntax errors in sequence/flowchart/state diagrams
        for idx, l in enumerate(b_lines, 1):
            if ';' in l and not l.strip().endswith(';'):
                print(f"    Warning on diagram line {idx}: Semicolon in mid-line -> {l.strip()}")
            if header.startswith('sequenceDiagram'):
                # Check arrow syntax e.g. ->>, -->>, ->, --)
                if '->' in l:
                    # check valid sequence diagram arrow
                    valid_arrows = ['->>', '-->>', '->', '-->', '->>', '-->>', '-x', '--x', '-)', '--)']
                    has_valid = any(arr in l for arr in valid_arrows)
                    if not has_valid:
                        print(f"    Sequence diagram suspicious arrow line {idx}: {l.strip()}")

    return content, lines, mermaid_blocks

if __name__ == '__main__':
    f1 = '/Users/apple/Coding-projects/Noteee/14_agentic_rag_spec.md'
    f2 = '/Users/apple/Coding-projects/Noteee/15_cloud_infrastructure_spec.md'
    verify_file(f1)
    print("\n" + "="*50 + "\n")
    verify_file(f2)
