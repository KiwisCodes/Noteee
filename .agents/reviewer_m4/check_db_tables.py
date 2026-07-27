import re
import os

base_dir = "/Users/apple/Coding-projects/Noteee"
files = sorted([f for f in os.listdir(base_dir) if re.match(r'^\d\d_.*\.md$', f)])

db_tables = [
    'folders',
    'pages',
    'blocks',
    'tags',
    'page_tags',
    'anchors',
    'vectors',
    'folder_vectors',
    'page_vectors',
    'capture_sessions',
    'canvas_documents',
    'canvas_layers',
    'canvas_strokes',
    'pdf_annotations',
    'image_occlusion_masks',
    'flashcards',
    'flashcard_review_logs',
    'ps_crud'
]

print("=== CHECKING DATABASE TABLE NAMES ACROSS ALL 13 FILES ===")

table_counts = {t: {} for t in db_tables}

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    for t in db_tables:
        # Match as whole word or in code blocks
        matches = re.findall(r'\b' + re.escape(t) + r'\b', content)
        if matches:
            table_counts[t][fname] = len(matches)

for t in db_tables:
    print(f"\nTable: `{t}`")
    if table_counts[t]:
        for fname, count in table_counts[t].items():
            print(f"  - {fname}: {count} occurrences")
    else:
        print("  - NOT FOUND in any file!")
