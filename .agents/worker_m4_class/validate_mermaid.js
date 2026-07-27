const fs = require('fs');

const fileContent = fs.readFileSync('/Users/apple/Coding-projects/Noteee/11_class_diagrams.md', 'utf8');

const mermaidBlocks = fileContent.match(/```mermaid[\s\S]*?```/g) || [];
console.log(`Found ${mermaidBlocks.length} Mermaid blocks.`);

let totalErrors = 0;

mermaidBlocks.forEach((block, idx) => {
  console.log(`\n--- Validating Mermaid Block ${idx + 1} ---`);
  const lines = block.split('\n');
  let blockErrors = 0;

  lines.forEach((line, lidx) => {
    // Check for unescaped semicolons
    if (line.includes(';') && !line.includes('&quot;') && !line.includes('&amp;')) {
      console.warn(`[WARNING] Line ${lidx + 1}: Unescaped semicolon: "${line.trim()}"`);
      blockErrors++;
    }
  });

  if (blockErrors === 0) {
    console.log(`Block ${idx + 1} PASSED syntax sanity checks.`);
  } else {
    totalErrors += blockErrors;
  }
});

console.log(`\nTotal Warnings/Errors: ${totalErrors}`);
