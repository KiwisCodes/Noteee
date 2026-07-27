import glob
import re
import os

def check_consistency():
    files = [f for f in sorted(glob.glob('/Users/apple/Coding-projects/Noteee/*.md')) if not f.endswith('PROJECT.md')]
    
    file_contents = {}
    for fpath in files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            file_contents[fname] = f.read()
            
    print(f"Loaded {len(file_contents)} files for consistency check.\n")

    # 1. Check all cross-file references to spec file names
    valid_spec_files = set(file_contents.keys())
    # Also check if any old/invalid file names like 09_sector_6_sync_collaboration_monetization_spec.md are referenced
    invalid_filename_refs = []
    
    for fname, content in file_contents.items():
        # Find references like 0X_..._spec.md or 1X_..._diagram.md
        refs = re.findall(r'\b\d{2}_[a-zA-Z0-9_]+\.md\b', content)
        for ref in refs:
            if ref not in valid_spec_files:
                invalid_filename_refs.append((fname, ref))
                
    print("--- 1. Spec Filename Cross-References Check ---")
    if invalid_filename_refs:
        print(f"❌ Found {len(invalid_filename_refs)} invalid file references:")
        for source, bad_ref in invalid_filename_refs:
            print(f"  In {source}: references non-existent file '{bad_ref}'")
    else:
        print("✅ All cross-file markdown file references match existing files 100%!")

    # 2. Check System Anchors consistency
    system_anchors = [
        "Daily Notes", "To-Do & Planner", "Miscellaneous", "Ideas", "Vault", "Inbox", "Flashcards Hub"
    ]
    print("\n--- 2. System Anchors Check ---")
    anchor_occurrences = {}
    for sa in system_anchors:
        anchor_occurrences[sa] = [fname for fname, content in file_contents.items() if sa in content]
        print(f"Anchor '{sa}': present in {len(anchor_occurrences[sa])} files")

    # 3. Check Core Block Types
    core_block_types = [
        "paragraph", "heading_1", "heading_2", "heading_3", "todo_item",
        "toggle", "callout", "code_block", "latex_math", "image",
        "audio", "subpage_link", "canvas_embed", "flashcard_cloze"
    ]
    print("\n--- 3. Core Block Types Check ---")
    for bt in core_block_types:
        present_files = [fname for fname, content in file_contents.items() if bt in content]
        print(f"Block type '{bt}': present in {len(present_files)} files")

    # 4. Check for fake / hardcoded mock data or cheating markers
    print("\n--- 4. Hardcoded Fake Data / Cheating Detection ---")
    cheating_keywords = [
        "mock_result", "hardcoded", "fake_pass", "dummy_output",
        "TODO: implement later", "FIXME: fake", "return true; // fake"
    ]
    cheating_findings = []
    for fname, content in file_contents.items():
        for kw in cheating_keywords:
            if kw.lower() in content.lower():
                cheating_findings.append((fname, kw))

    if cheating_findings:
        print(f"❌ Found potential cheating keywords:")
        for fname, kw in cheating_findings:
            print(f"  In {fname}: '{kw}'")
    else:
        print("✅ Zero suspicious hardcoded/fake data keywords found!")

if __name__ == '__main__':
    check_consistency()
