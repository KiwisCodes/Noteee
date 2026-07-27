import glob
import re

files = sorted(glob.glob('*.md'))
print("=== SEARCHING FOR ALL SQLITE TABLES / DRIZZLE TABLES ACROSS ALL FILES ===")

for fname in files:
    if fname.startswith('.'):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches sqliteTable, CREATE TABLE, or schema tables list
    sqlite_tables = re.findall(r'sqliteTable\(\s*["\']([^"\']+)["\']', content)
    create_tables = re.findall(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`\']?(\w+)["`\']?', content, re.IGNORECASE)
    
    # Table lists in text/markdown tables
    all_found = set(sqlite_tables + create_tables)
    
    # Also search for table names mentioned in Drizzle schema sections
    if 'drizzle' in content.lower() or 'sqlite' in content.lower() or 'schema' in content.lower():
        # find references to tables in 03 or 10 or 11
        pass
        
    print(f"\n{fname}:")
    print(f"  sqliteTable calls: {sqlite_tables}")
    print(f"  CREATE TABLE calls: {create_tables}")

