const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  referrer: 'http://localhost/',
  contentType: 'text/html',
  includeNodeLocations: true,
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const mermaidModule = require('mermaid');
const mermaid = mermaidModule.default || mermaidModule;

mermaid.initialize({ startOnLoad: false, suppressErrorRendering: true });

const testsDir = path.join(__dirname, 'mermaid_tests');
const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.mmd')).sort();

async function runValidation() {
  let totalDiagramErrors = 0;
  const results = [];
  for (const file of files) {
    const filePath = path.join(testsDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    try {
      const isValid = await mermaid.parse(code);
      if (isValid) {
        results.push({ file, status: 'PASS', error: null });
      } else {
        results.push({ file, status: 'FAIL', error: 'Invalid syntax' });
        totalDiagramErrors++;
      }
    } catch (err) {
      results.push({ file, status: 'FAIL', error: err.message });
      totalDiagramErrors++;
    }
  }

  console.log('\n=== MERMAID VALIDATION RESULTS ===');
  results.forEach(r => {
    if (r.status === 'PASS') {
      console.log(`✅ ${r.file}: PASS`);
    } else {
      console.log(`❌ ${r.file}: FAIL - ${r.error}`);
    }
  });
  console.log(`\nTotal Errors: ${totalDiagramErrors}`);
}

runValidation();
