const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.DOMPurify = require('dompurify')(dom.window);

async function validate() {
  const mermaidModule = await import('mermaid');
  const mermaid = mermaidModule.default;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
  });

  const diagDir = path.join(__dirname, 'diagrams');
  const files = fs.readdirSync(diagDir).filter(f => f.endsWith('.mmd')).sort();

  console.log(`Found ${files.length} diagrams to validate with official Mermaid JS parser:\n`);

  let passCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(diagDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const result = await mermaid.parse(content);
      console.log(`✅ [PASS] ${file}: Diagram parsed successfully!`);
      passCount++;
    } catch (err) {
      console.error(`❌ [FAIL] ${file}: Mermaid parsing failed!`);
      console.error(`   Error message: ${err.message || err}`);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL: ${files.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  console.log(`========================================`);

  if (failCount > 0) {
    process.exit(1);
  }
}

validate().catch(err => {
  console.error("Validation script error:", err);
  process.exit(1);
});
