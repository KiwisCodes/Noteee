import glob

for fname in ['10_component_diagram.md', '11_class_diagrams.md', '12_sequence_diagrams.md', '13_state_machines.md']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    lines = content.splitlines()
    print(f"=== {fname} ===")
    print(f"First 3 lines:\n  " + "\n  ".join(lines[:3]))
    print(f"Last 3 lines:\n  " + "\n  ".join(lines[-3:]))
    # Check if any open codeblock without closing codeblock
    ticks = content.count("```")
    print(f"Triple backticks count: {ticks} (even number: {ticks % 2 == 0})")
    print()
