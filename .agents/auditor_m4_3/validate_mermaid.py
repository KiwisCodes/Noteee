import glob
import re

def extract_mermaid_blocks():
    files = sorted(glob.glob('*.md'))
    blocks = []
    for fname in files:
        if fname.startswith('.'):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = re.finditer(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
        for idx, m in enumerate(matches, 1):
            block_text = m.group(1)
            start_line = content[:m.start()].count('\n') + 1
            blocks.append({
                'file': fname,
                'index': idx,
                'start_line': start_line,
                'content': block_text
            })
    return blocks

def validate_block(block):
    lines = block['content'].splitlines()
    clean_lines = []
    for l in lines:
        stripped = l.strip()
        if stripped and not stripped.startswith('%%'):
            clean_lines.append(stripped)
            
    if not clean_lines:
        return ["EMPTY_BLOCK: Diagram content is empty"]
    
    header = clean_lines[0]
    errors = []
    
    # 1. Block type check
    valid_types = ('sequenceDiagram', 'flowchart', 'graph', 'classDiagram', 'stateDiagram-v2', 'stateDiagram', 'erDiagram', 'gantt')
    if not any(header.startswith(vt) for vt in valid_types):
        errors.append(f"INVALID_HEADER: Unknown diagram header '{header}'")
        return errors

    # 2. Check matching blocks (end balance / brace balance)
    if header.startswith('sequenceDiagram'):
        block_starts = 0
        block_ends = 0
        for line in clean_lines[1:]:
            tokens = line.split()
            first = tokens[0] if tokens else ""
            if first in ('alt', 'opt', 'loop', 'par', 'critical', 'break', 'rect'):
                block_starts += 1
            elif first == 'end':
                block_ends += 1
        if block_starts != block_ends:
            errors.append(f"UNBALANCED_BLOCKS: sequenceDiagram has {block_starts} block starts and {block_ends} 'end' statements")

    elif header.startswith('flowchart') or header.startswith('graph'):
        subgraph_count = 0
        end_count = 0
        for line in clean_lines[1:]:
            if line.startswith('subgraph'):
                subgraph_count += 1
            elif line == 'end':
                end_count += 1
        if subgraph_count != end_count:
            errors.append(f"UNBALANCED_SUBGRAPH: flowchart has {subgraph_count} subgraphs and {end_count} 'end' statements")

    elif header.startswith('stateDiagram'):
        open_braces = 0
        close_braces = 0
        for line in clean_lines[1:]:
            open_braces += line.count('{')
            close_braces += line.count('}')
        if open_braces != close_braces:
            errors.append(f"UNBALANCED_BRACES: stateDiagram has {open_braces} '{{' and {close_braces} '}}'")

    elif header.startswith('classDiagram'):
        open_braces = 0
        close_braces = 0
        for line in clean_lines[1:]:
            open_braces += line.count('{')
            close_braces += line.count('}')
        if open_braces != close_braces:
            errors.append(f"UNBALANCED_BRACES: classDiagram has {open_braces} '{{' and {close_braces} '}}'")

    # 3. Line by line balance checks
    for l_num, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('%%'):
            continue
        
        # Check square brackets
        if line.count('[') != line.count(']'):
            errors.append(f"UNBALANCED_SQUARE_BRACKET on line {l_num}: {stripped}")
            
        # Check double quotes
        if line.count('"') % 2 != 0:
            errors.append(f"UNBALANCED_QUOTES on line {l_num}: {stripped}")

    return errors

def run_validation():
    blocks = extract_mermaid_blocks()
    print(f"Validating {len(blocks)} Mermaid blocks...")
    total_errors = 0
    for b in blocks:
        errs = validate_block(b)
        if errs:
            print(f"\n[FAIL] {b['file']} line {b['start_line']} (Block #{b['index']}):")
            for e in errs:
                print(f"  - {e}")
            total_errors += len(errs)
        else:
            pass
            
    print(f"\nValidation completed. Total errors found: {total_errors}")
    return total_errors

if __name__ == '__main__':
    run_validation()
