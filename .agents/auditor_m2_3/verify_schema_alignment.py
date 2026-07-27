import os
import re

files = {
    '03_foundation': '/Users/apple/Coding-projects/Noteee/03_sector_1_foundation_spec.md',
    '05_capture': '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
    '06_editor': '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
    '07_ai_flashcards': '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
}

print("=== Schema Alignment Forensic Verification ===")

tables_by_spec = {}

for label, fpath in files.items():
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract code blocks defining tables
    blocks = re.findall(r'export const (\w+) = sqliteTable\([\'"](\w+)[\'"],\s*\{([^}]+)\}', content, re.DOTALL)
    tables_by_spec[label] = {}
    for var_name, table_name, body in blocks:
        # Extract column lines
        raw_cols = [line.strip() for line in body.strip().splitlines() if line.strip() and not line.strip().startswith('//')]
        tables_by_spec[label][table_name] = {
            'var_name': var_name,
            'cols': raw_cols,
            'body': body.strip()
        }

all_table_names = set()
for tmap in tables_by_spec.values():
    all_table_names.update(tmap.keys())

print(f"Total unique tables defined across specs: {len(all_table_names)}")
for tname in sorted(all_table_names):
    specs_with_tname = [label for label, tmap in tables_by_spec.items() if tname in tmap]
    print(f" - `{tname}` defined in: {', '.join(specs_with_tname)}")

mismatches = []

for tname in sorted(all_table_names):
    specs = [label for label, tmap in tables_by_spec.items() if tname in tmap]
    if len(specs) > 1:
        # Compare definitions
        first_spec = specs[0]
        first_cols = tables_by_spec[first_spec][tname]['cols']
        
        for other_spec in specs[1:]:
            other_cols = tables_by_spec[other_spec][tname]['cols']
            if first_cols != other_cols:
                mismatches.append((tname, first_spec, other_spec, first_cols, other_cols))

if mismatches:
    print("\n❌ SCHEMA ALIGNMENT FAILURES FOUND:")
    for tname, spec1, spec2, cols1, cols2 in mismatches:
        print(f"\nMismatch in table `{tname}` between {spec1} and {spec2}:")
        print(f"  {spec1} cols: {cols1}")
        print(f"  {spec2} cols: {cols2}")
else:
    print("\n✅ All overlapping table schemas match 100% identically across all specification files!")

