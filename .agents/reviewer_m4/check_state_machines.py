import re
import os

base_dir = "/Users/apple/Coding-projects/Noteee"
files = sorted([f for f in os.listdir(base_dir) if re.match(r'^\d\d_.*\.md$', f)])

state_groups = {
    "Capture Session States": ["Idle", "Initializing", "Recording", "Finalizing", "Processing", "Completed", "Error", "Cancelled"],
    "Flashcard Card States": ["New", "Learning", "Review", "Relearning", "Graduated", "Lapsed"],
    "Vault Security States": ["Locked", "Authenticating", "Unlocked", "AutoLockTimer", "FailedLockout"],
    "Sync Connection States": ["Offline", "Connecting", "Syncing", "Online", "ConflictResolution", "Reconnecting"]
}

for group_name, states in state_groups.items():
    print(f"\n=== {group_name} ===")
    for state in states:
        print(f"\nState: `{state}`")
        for fname in ["05_sector_2_capture_spec.md", "07_sector_4_ai_flashcards_spec.md", "09_sector_6_sync_collab_monetization_spec.md", "11_class_diagrams.md", "12_sequence_diagrams.md", "13_state_machines.md"]:
            fpath = os.path.join(base_dir, fname)
            if not os.path.exists(fpath):
                continue
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = re.findall(r'\b' + re.escape(state) + r'\b', content, re.IGNORECASE)
            if matches:
                print(f"  - {fname}: {len(matches)} occurrences")
