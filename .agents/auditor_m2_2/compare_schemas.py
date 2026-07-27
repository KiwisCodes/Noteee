import os
import re

files = {
    '03': '/Users/apple/Coding-projects/Noteee/03_sector_1_foundation_spec.md',
    '05': '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
    '06': '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
    '07': '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
}

print("=== Detailed Table Schema Comparison Across Specs ===")

tables_by_spec = {}

for label, fpath in files.items():
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract code blocks defining tables
    blocks = re.findall(r'export const (\w+) = sqliteTable\([\'"](\w+)[\'"],\s*\{([^}]+)\}', content, re.DOTALL)
    tables_by_spec[label] = {}
    for var_name, table_name, body in blocks:
        # Extract columns
        cols = [col.strip() for col in body.strip().splitlines() if col.strip() and not col.strip().startswith('//')]
        tables_by_spec[label][table_name] = cols

for label, tables in tables_by_spec.items():
    print(f"\n--- Spec {label} ---")
    for tname, cols in tables.items():
        print(f"Table `{tname}` ({len(cols)} columns):")
        for c in cols[:5]:
            print(f"  {c}")
        if len(cols) > 5:
            print(f"  ... (+{len(cols)-5} more columns)")

# Check overlap / consistency between 03, 05, and 07
print("\n=== Overlapping Table Consistency Check ===")
all_tables = set()
for tmap in tables_by_spec.values():
    all_tables.update(tmap.keys())

for tname in sorted(all_tables):
    specs_with_table = [label for label, tmap in tables_by_spec.items() if tname in tmap]
    print(f"\nTable `{tname}` appears in specs: {specs_with_table}")
    if len(specs_with_table) > 1:
        cols_per_spec = {label: tables_by_spec[label][tname] for label in specs_with_table}
        for label, cols in cols_per_spec.items():
            print(f"  Spec {label} ({len(cols)} cols):")
            for c in cols:
                print(f"    {c}")
