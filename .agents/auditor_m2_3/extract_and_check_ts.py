import os
import re
import subprocess
import glob

ts_dir = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_3/ts_check'
os.makedirs(ts_dir, exist_ok=True)

# Write tsconfig.json in ts_dir
tsconfig_content = """{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "noEmit": true,
    "allowJs": true
  },
  "include": ["**/*.ts"]
}
"""
with open(os.path.join(ts_dir, "tsconfig.json"), "w", encoding="utf-8") as f:
    f.write(tsconfig_content)

spec_files = [
    '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
    '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
    '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
]

extracted_files = []

for spec_path in spec_files:
    spec_name = os.path.basename(spec_path)
    with open(spec_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_ts = False
    ts_lines = []
    start_line = 0
    block_count = 0
    
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('```typescript') or stripped.startswith('```ts'):
            in_ts = True
            start_line = idx
            ts_lines = []
        elif stripped == '```' and in_ts:
            in_ts = False
            block_count += 1
            file_name = f"{spec_name.split('_')[0]}_ts_{block_count}_line_{start_line}.ts"
            target_path = os.path.join(ts_dir, file_name)
            content = "".join(ts_lines)
            with open(target_path, 'w', encoding='utf-8') as tf:
                tf.write(content)
            extracted_files.append((spec_name, start_line, target_path, content))
        elif in_ts:
            ts_lines.append(line)

print(f"Extracted {len(extracted_files)} TypeScript code blocks across 05, 06, 07.\n")

tsc_bin = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_2/node_modules/typescript/bin/tsc'

results = []
for spec, start_line, target_path, content in extracted_files:
    fname = os.path.basename(target_path)
    print(f"=== Checking {fname} ({spec}:{start_line}) ===")
    
    cmd = ['node', tsc_bin, '--noEmit', '--target', 'ES2022', '--skipLibCheck', 'true', target_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    all_errors = [line for line in res.stdout.splitlines() if line.strip()]
    syntax_errors = [e for e in all_errors if any(code in e for code in ['TS1005', 'TS1128', 'TS1136', 'TS1068', 'TS1434', 'TS1109', 'TS1003', 'TS1009', 'TS1144', 'TS1184'])]
    
    print(f"  Total diagnostic outputs: {len(all_errors)}")
    if syntax_errors:
        print(f"  ❌ SYNTAX ERRORS DETECTED: {len(syntax_errors)}")
        for err in syntax_errors:
            print("    ", err)
        results.append((fname, False, syntax_errors, all_errors))
    else:
        print("  ✅ Syntax OK")
        results.append((fname, True, [], all_errors))

print("\n================ SUMMARY ================")
pass_count = sum(1 for _, ok, _, _ in results if ok)
fail_count = len(results) - pass_count
print(f"Total TS Blocks: {len(results)} | PASS: {pass_count} | FAIL: {fail_count}")
