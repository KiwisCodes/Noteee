import re
import os

files = [
    '03_sector_1_foundation_spec.md',
    '04_tech_stack_and_dependencies.md',
    '05_sector_2_capture_spec.md',
    '06_sector_3_editor_spec.md',
    '07_sector_4_ai_flashcards_spec.md'
]

print("=== Extracting Database Tables and Drizzle Schemas ===")

for fname in files:
    fpath = os.path.join('/Users/apple/Coding-projects/Noteee', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find sqliteTable definitions
    tables = re.findall(r'export const (\w+) = sqliteTable\([\'"](\w+)[\'"]', content)
    print(f"\nFile {fname}:")
    if tables:
        for var_name, table_name in tables:
            print(f"  Table: {table_name} (var: {var_name})")
    else:
        print("  No sqliteTable definitions found.")

    # Find references to foreign tables (e.g. references(() => pages.id))
    refs = re.findall(r'references\(\(\) => (\w+)\.(\w+)', content)
    if refs:
        print("  Foreign Key References:")
        for ref_table_var, ref_col in refs:
            print(f"    -> {ref_table_var}.{ref_col}")
