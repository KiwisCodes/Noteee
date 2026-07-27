import glob
import re

def verify_tables():
    files = sorted(glob.glob('*.md'))
    
    # Extract table names from 03_sector_1_foundation_spec.md
    with open('03_sector_1_foundation_spec.md', 'r', encoding='utf-8') as f:
        content_03 = f.read()
    
    # Drizzle sqliteTable("table_name", ...)
    tables_in_03 = re.findall(r'sqliteTable\(\s*["\']([^"\']+)["\']', content_03)
    unique_tables_03 = sorted(list(set(tables_in_03)))
    
    print(f"=== Tables defined in 03_sector_1_foundation_spec.md (Count: {len(unique_tables_03)}) ===")
    for t in unique_tables_03:
        print(f"  - {t}")
    print()
    
    # Check occurrences of each table across all 13 files
    print("=== Table name occurrences across all files ===")
    for fname in files:
        if fname.startswith('.'):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found = [t for t in unique_tables_03 if f'"{t}"' in content or f"'{t}'" in content or f"`{t}`" in content or f" {t} " in content or f"*{t}*" in content or f"**{t}**" in content]
        print(f"{fname}: {len(found)} / {len(unique_tables_03)} tables referenced ({found})")

if __name__ == '__main__':
    verify_tables()
