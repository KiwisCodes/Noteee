import re

with open('13_state_machines.md', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.finditer(r'```mermaid\s*\n(.*?)\n```', content, re.DOTALL)
for idx, m in enumerate(matches, 1):
    start_line = content[:m.start()].count('\n') + 1
    print(f"=== BLOCK #{idx} (line {start_line}) ===")
    print(m.group(1))
    print()
