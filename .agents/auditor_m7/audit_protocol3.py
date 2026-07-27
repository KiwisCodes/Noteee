import os
import re

files = [
    "01_original_feature_list.md",
    "02_system_layers_roadmap.md",
    "03_sector_1_foundation_spec.md",
    "04_tech_stack_and_dependencies.md",
    "05_sector_2_capture_spec.md",
    "06_sector_3_editor_spec.md",
    "07_sector_4_ai_flashcards_spec.md",
    "08_sector_5_canvas_pdf_spec.md",
    "09_sector_6_sync_collab_monetization_spec.md",
    "10_component_diagram.md",
    "11_class_diagrams.md",
    "12_sequence_diagrams.md",
    "13_state_machines.md",
    "14_agentic_rag_spec.md",
    "15_cloud_infrastructure_spec.md",
    "16_canvas_pdf_media_workflows.md",
    "17_app_shipping_monetization_spec.md",
    "PROJECT.md"
]

base_dir = "/Users/apple/Coding-projects/Noteee"

print("=== PROTOCOL 3: CROSS-FILE & SCHEMA ALIGNMENT AUDIT ===")

# 1. Database Table Names Extraction
tables_by_file = {}
table_pattern = r'sqliteTable\(\s*[\'"]([^\'"]+)[\'"]'
table_pattern_sql = r'CREATE TABLE (?:IF NOT EXISTS )?([a-z0-9_]+)'

for fname in files:
    fpath = os.path.join(base_dir, fname)
    if not os.path.exists(fpath): continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    t1 = re.findall(table_pattern, content)
    t2 = re.findall(table_pattern_sql, content, re.IGNORECASE)
    all_t = sorted(list(set(t1 + t2)))
    if all_t:
        tables_by_file[fname] = all_t

print("\n--- DB Tables Defined per File ---")
for fn, tbls in tables_by_file.items():
    print(f"{fn}: {tbls}")

# Check all table references across files
all_known_tables = set()
for tbls in tables_by_file.values():
    all_known_tables.update(tbls)

print(f"\nTotal unique database tables defined across project: {len(all_known_tables)}")

# 2. Block Types Extraction
print("\n--- Block Types Verification ---")
# Block types defined in sector 1 foundation spec
with open(os.path.join(base_dir, "03_sector_1_foundation_spec.md"), "r", encoding="utf-8") as f:
    f3_content = f.read()

# Extract block types from 03
block_types_in_03 = re.findall(r"type:\s*['\"]([a-z0-9_]+)['\"]", f3_content)
block_types_in_03 += re.findall(r"BlockType\s*=\s*['\"]([a-z0-9_]+)['\"]", f3_content)
block_types_in_03 += re.findall(r"['\"]([a-z0-9_]+)['\"]\s*\|\s*//", f3_content)

print(f"Block types found in 03: {set(block_types_in_03)}")

# 3. Dependency versions check between 04 and other files
with open(os.path.join(base_dir, "04_tech_stack_and_dependencies.md"), "r", encoding="utf-8") as f:
    f4_content = f.read()

# Match lines like library: version or package@version
dep_versions = re.findall(r'([a-zA-Z0-9_@/-]+)\s*[@:]\s*([0-9]+\.[0-9]+\.[0-9]+[a-zA-Z0-9._-]*)', f4_content)
print(f"\nDependency versions in 04_tech_stack_and_dependencies.md: {len(dep_versions)} packages found.")
for pkg, ver in dep_versions[:10]:
    print(f"  {pkg} -> {ver}")

