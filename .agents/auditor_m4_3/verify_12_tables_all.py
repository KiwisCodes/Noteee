import glob

tables = [
    'pages', 'blocks', 'tags', 'page_tags', 'anchors', 'vectors',
    'capture_sessions', 'canvas_documents', 'canvas_layers',
    'canvas_strokes', 'pdf_annotations', 'image_occlusion_masks'
]

files = sorted(glob.glob('*.md'))
print("=== VERIFYING THE 12 DRIZZLE SQLITE SCHEMA TABLES ACROSS ALL 13 FILES ===")

for t in tables:
    matching_files = []
    for fname in files:
        if fname.startswith('.'):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        if t in content:
            matching_files.append(fname)
    print(f"Table '{t}': present in {len(matching_files)} files ({', '.join(matching_files)})")

