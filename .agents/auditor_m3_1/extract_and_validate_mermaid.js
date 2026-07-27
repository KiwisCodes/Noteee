const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'mermaid_tests');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function processFile(filePath, prefix) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /```mermaid\r?\n([\s\S]*?)\r?\n```/g;
  let match;
  let index = 1;
  while ((match = regex.exec(content)) !== null) {
    const mermaidCode = match[1];
    const mmdPath = path.join(outDir, `${prefix}_diagram_${index}.mmd`);
    fs.writeFileSync(mmdPath, mermaidCode, 'utf8');
    console.log(`Extracted: ${mmdPath}`);
    index++;
  }
}

processFile('/Users/apple/Coding-projects/Noteee/08_sector_5_canvas_pdf_spec.md', 'spec08');
processFile('/Users/apple/Coding-projects/Noteee/09_sector_6_sync_collab_monetization_spec.md', 'spec09');
