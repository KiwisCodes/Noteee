import re
import os

base_dir = "/Users/apple/Coding-projects/Noteee"
files = sorted([f for f in os.listdir(base_dir) if re.match(r'^\d\d_.*\.md$', f)])

def search_terms(term_dict):
    results = {}
    for name, pattern in term_dict.items():
        results[name] = {}
        for fname in files:
            fpath = os.path.join(base_dir, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                results[name][fname] = len(matches)
    return results

print("=== CHECKING REPOSITORY INTERFACES ===")
repo_interfaces = {
    'INoteRepository': r'\bINoteRepository\b',
    'IFolderRepository': r'\bIFolderRepository\b',
    'ITagRepository': r'\bITagRepository\b',
}
res_repo = search_terms(repo_interfaces)
for interface, found in res_repo.items():
    print(f"\n{interface}:")
    for fname, count in found.items():
        print(f"  {fname}: {count} matches")

print("\n=== CHECKING AI INTERFACES ===")
ai_interfaces = {
    'IEmbedder': r'\bIEmbedder\b',
    'ISpeechToText': r'\bISpeechToText\b',
    'ITextRecognizer': r'\bITextRecognizer\b',
    'IClassificationEngine': r'\bIClassificationEngine\b',
}
res_ai = search_terms(ai_interfaces)
for interface, found in res_ai.items():
    print(f"\n{interface}:")
    for fname, count in found.items():
        print(f"  {fname}: {count} matches")

print("\n=== CHECKING CAPTURE & SCHEDULER & BILLING INTERFACES ===")
other_interfaces = {
    'ICaptureSource': r'\bICaptureSource\b',
    'IFSRSScheduler': r'\bIFSRSScheduler\b',
    'IBillingAdapter': r'\bIBillingAdapter\b',
}
res_other = search_terms(other_interfaces)
for interface, found in res_other.items():
    print(f"\n{interface}:")
    for fname, count in found.items():
        print(f"  {fname}: {count} matches")

print("\n=== CHECKING MATHEMATICAL CONSTANTS & FSRS DECAY ===")
math_terms = {
    'FSRS decay F=1/9': r'1/9|0\.1111',
    'FSRS retention R=0.90': r'0\.90|0\.9\b|retention',
    'RRF k=60': r'RRF|Reciprocal Rank Fusion|60',
}
res_math = search_terms(math_terms)
for term, found in res_math.items():
    print(f"\n{term}:")
    for fname, count in found.items():
        print(f"  {fname}: {count} matches")
