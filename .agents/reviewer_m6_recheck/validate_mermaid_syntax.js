const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FILE_16 = "/Users/apple/Coding-projects/Noteee/16_canvas_pdf_media_workflows.md";
const FILE_17 = "/Users/apple/Coding-projects/Noteee/17_app_shipping_monetization_spec.md";

function extractMermaidDiagrams(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const diagrams = [];
  
  let inMermaid = false;
  let currentDiagram = [];
  let startLine = 0;
  
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.trim().startsWith('```mermaid')) {
      inMermaid = true;
      startLine = lineNum;
      currentDiagram = [];
    } else if (inMermaid && line.trim().startsWith('```')) {
      inMermaid = false;
      diagrams.push({
        filePath,
        fileName: path.basename(filePath),
        startLine,
        endLine: lineNum,
        code: currentDiagram.join('\n')
      });
    } else if (inMermaid) {
      currentDiagram.push(line);
    }
  });
  
  return diagrams;
}

const diagrams16 = extractMermaidDiagrams(FILE_16);
const diagrams17 = extractMermaidDiagrams(FILE_17);
const allDiagrams = [...diagrams16, ...diagrams17];

console.log(`Extracted ${allDiagrams.length} total Mermaid diagrams.`);

// Save each diagram to a temp file and test parsing
allDiagrams.forEach((d, idx) => {
  const tmpFile = path.join(__dirname, `diagram_${idx + 1}.mmd`);
  fs.writeFileSync(tmpFile, d.code);
  console.log(`\nTesting Diagram #${idx + 1} (${d.fileName} lines ${d.startLine}-${d.endLine}):`);
  console.log(`Code preview:\n${d.code.slice(0, 150)}...\n`);
});

// Let's test with mermaid parser if available or using mermaid node library
const npxMermaidPath = '/Users/apple/.npm/_npx/668c188756b835f3/node_modules/mermaid';
let mermaidModule = null;
try {
  mermaidModule = require(npxMermaidPath);
  console.log('Successfully loaded cached mermaid module from npx cache.');
} catch (e) {
  try {
    mermaidModule = require('mermaid');
    console.log('Successfully loaded mermaid module from standard require.');
  } catch (e2) {
    console.log('Mermaid package not directly resolvable via require.');
  }
}

if (mermaidModule && mermaidModule.parse) {
  (async () => {
    for (let i = 0; i < allDiagrams.length; i++) {
      const d = allDiagrams[i];
      try {
        await mermaidModule.parse(d.code);
        console.log(`✅ PARSE PASS: Diagram #${i + 1} (${d.fileName} lines ${d.startLine}-${d.endLine}) parsed cleanly!`);
      } catch (err) {
        console.error(`❌ PARSE FAIL: Diagram #${i + 1} (${d.fileName} lines ${d.startLine}-${d.endLine}):`, err.message);
      }
    }
  })();
} else {
  console.log('Mermaid parse function not available, testing diagram structural syntax manually & via npx...');
}
