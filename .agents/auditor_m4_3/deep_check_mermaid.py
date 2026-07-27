import glob
import re

def deep_check():
    files = sorted(glob.glob('*.md'))
    all_blocks = []
    
    for fname in files:
        if fname.startswith('.'):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        matches = re.finditer(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
        for idx, m in enumerate(matches, 1):
            block_text = m.group(1)
            start_line = content[:m.start()].count('\n') + 1
            all_blocks.append({
                'file': fname,
                'index': idx,
                'start_line': start_line,
                'content': block_text
            })

    print(f"Deep checking {len(all_blocks)} Mermaid blocks...")
    warnings = []

    for b in all_blocks:
        lines = b['content'].splitlines()
        header = lines[0].strip()
        
        for idx, l in enumerate(lines[1:], 2):
            raw = l
            l = l.strip()
            if not l or l.startswith('%%'):
                continue
            
            # Sequence diagram checks
            if header.startswith('sequenceDiagram'):
                # Valid sequence diagram start keywords or arrow constructs
                valid_seq_keywords = (
                    'autonumber', 'participant', 'actor', 'alt', 'else', 'opt', 
                    'loop', 'par', 'and', 'critical', 'option', 'break', 'rect', 
                    'end', 'activate', 'deactivate', 'note', 'box', 'links'
                )
                first_word = l.split()[0] if l.split() else ''
                has_arrow = any(arrow in l for arrow in ['->>', '-->>', '->', '-->', '->x', '--x', '-\)', '--\)', '-)', '--)'])
                
                if first_word not in valid_seq_keywords and not has_arrow:
                    warnings.append(f"[{b['file']} L{b['start_line']+idx-1}] Sequence syntax warning: '{l}'")
            
            # Flowchart checks
            elif header.startswith('flowchart') or header.startswith('graph'):
                valid_fc_keywords = ('subgraph', 'end', 'classDef', 'class', 'style', 'linkStyle', 'click', 'direction')
                first_word = l.split()[0] if l.split() else ''
                has_arrow = any(arrow in l for arrow in ['-->', '-.->', '==>', '---', '-.-', '==='])
                has_node = bool(re.search(r'[\w_\-\+]+(\[[^\]]+\]|\([^\)]+\)|\{[^\}]+\}|"([^"]+)")', l))
                
                if first_word not in valid_fc_keywords and not has_arrow and not has_node and not l.startswith('direction'):
                    warnings.append(f"[{b['file']} L{b['start_line']+idx-1}] Flowchart syntax warning: '{l}'")

            # Class diagram checks
            elif header.startswith('classDiagram'):
                valid_cd_keywords = ('class', 'namespace', 'direction', '<<', '}')
                first_word = l.split()[0] if l.split() else ''
                has_rel = any(rel in l for rel in ['<|--', '--|>', '*--', '--*', 'o--', '--o', '<--', '-->', '--', '..>', '<..', '..', '<|..', '..|>'])
                has_member = bool(re.search(r'^[\+\-\#\~]?\s*[\w_<>\[\]]+\s+[\w_]+\s*(\(.*\))?', l)) or bool(re.search(r'^[\w_]+\s*:\s*', l))
                
                if first_word not in valid_cd_keywords and not has_rel and not has_member and l != '}':
                    warnings.append(f"[{b['file']} L{b['start_line']+idx-1}] ClassDiagram syntax warning: '{l}'")

            # State diagram checks
            elif header.startswith('stateDiagram'):
                valid_sd_keywords = ('state', 'note', 'end', '[*]', '}')
                first_word = l.split()[0] if l.split() else ''
                has_arrow = '-->' in l
                
                if first_word not in valid_sd_keywords and not has_arrow and l != '}':
                    warnings.append(f"[{b['file']} L{b['start_line']+idx-1}] StateDiagram syntax warning: '{l}'")

    print(f"Total warnings/anomalies: {len(warnings)}")
    for w in warnings:
        print("  -", w)

if __name__ == '__main__':
    deep_check()
