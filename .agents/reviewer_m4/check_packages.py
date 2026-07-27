import re
import os

base_dir = "/Users/apple/Coding-projects/Noteee"
files = sorted([f for f in os.listdir(base_dir) if re.match(r'^\d\d_.*\.md$', f)])

packages = [
    'apps/mobile',
    'apps/web',
    'apps/backend',
    'packages/shared',
    'packages/db',
    'packages/editor',
    'packages/ai',
    'packages/canvas',
    'packages/sync',
    'packages/ui'
]

print("=== CHECKING MONOREPO PACKAGES ===")
for pkg in packages:
    print(f"\nPackage: `{pkg}`")
    for fname in files:
        fpath = os.path.join(base_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        count = len(re.findall(re.escape(pkg), content))
        if count > 0:
            print(f"  - {fname}: {count} matches")
