with open('10_component_diagram.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'The 12 Schema Tables' in l:
        for j in range(max(0, i-5), min(len(lines), i+25)):
            print(f"L{j+1}: {lines[j].strip()}")
