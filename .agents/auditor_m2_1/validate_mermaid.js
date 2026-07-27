const fs = require('fs');

const files = [
  '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
  '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
  '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
];

let totalDiagrams = 0;
let errors = [];

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/```mermaid\n([\s\S]*?)\n```/g);
  let index = 0;
  for (const m of matches) {
    index++;
    totalDiagrams++;
    const code = m[1].trim();
    console.log(`\n--- Diagram #${totalDiagrams} in ${filePath.split('/').pop()} ---`);
    console.log(code.substring(0, 100) + '...');
    
    // Basic syntax checks
    const lines = code.split('\n').map(l => l.trim());
    const header = lines[0];
    if (!header.startsWith('stateDiagram') && !header.startsWith('sequenceDiagram') && !header.startsWith('flowchart') && !header.startsWith('graph')) {
      errors.push(`Invalid header in ${filePath} diagram #${index}: ${header}`);
    }
  }
});

console.log(`\nTotal Mermaid diagrams found: ${totalDiagrams}`);
if (errors.length > 0) {
  console.log('Errors:', errors);
  process.exit(1);
} else {
  console.log('Mermaid check passed!');
}
