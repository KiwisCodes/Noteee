const fs = require('fs');
const path = require('path');

// Try importing mermaid from cached npx location or standard require
const npxPath = '/Users/apple/.npm/_npx/668c188756b835f3/node_modules/mermaid';

async function testMermaid() {
  console.log('Attempting to validate mermaid diagrams...');
  
  const diagrams = [];
  
  // Extract diagrams from file 16
  const file16 = fs.readFileSync('/Users/apple/Coding-projects/Noteee/16_canvas_pdf_media_workflows.md', 'utf8');
  const matches16 = [...file16.matchAll(/```mermaid\n([\s\S]*?)\n```/g)];
  matches16.forEach((m, idx) => {
    diagrams.push({ source: '16_canvas_pdf_media_workflows.md', index: idx + 1, code: m[1] });
  });

  // Extract diagrams from file 17
  const file17 = fs.readFileSync('/Users/apple/Coding-projects/Noteee/17_app_shipping_monetization_spec.md', 'utf8');
  const matches17 = [...file17.matchAll(/```mermaid\n([\s\S]*?)\n```/g)];
  matches17.forEach((m, idx) => {
    diagrams.push({ source: '17_app_shipping_monetization_spec.md', index: idx + 1, code: m[1] });
  });

  console.log(`Extracted ${diagrams.length} Mermaid diagrams total.`);
  
  diagrams.forEach((d) => {
    console.log(`\n--- Diagram from ${d.source} #${d.index} ---`);
    console.log(d.code.slice(0, 100) + '...');
  });

  // Attempt parser
  try {
    const mermaid = require(npxPath);
    console.log('Mermaid module loaded successfully.');
    // Check if parse function exists
    if (mermaid.parse) {
      for (const d of diagrams) {
        try {
          await mermaid.parse(d.code);
          console.log(`SUCCESS: ${d.source} diagram #${d.index} parsed cleanly.`);
        } catch (err) {
          console.error(`ERROR: ${d.source} diagram #${d.index} failed parsing:`, err);
        }
      }
    }
  } catch (err) {
    console.log('Could not require mermaid directly:', err.message);
  }
}

testMermaid();
