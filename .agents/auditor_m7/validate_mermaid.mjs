import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

// Setup JSDOM environment for Node.js
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/'
});

const domPurify = createDOMPurify(dom.window);

// Patch factory function too because mermaid imports DOMPurify directly
createDOMPurify.sanitize = function(str, opts) {
  return domPurify.sanitize(str, opts);
};

global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true
});
global.DOMParser = dom.window.DOMParser;
global.DOMPurify = domPurify;
global.window.DOMPurify = domPurify;
globalThis.DOMPurify = domPurify;

// Dynamic import of mermaid after global DOM setup
const mermaid = (await import('mermaid')).default;

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
});

const jsonPath = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m7/extracted_diagrams.json';
const diagrams = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Loaded ${diagrams.length} diagrams for syntax verification with JSDOM polyfill.`);

let passCount = 0;
let failCount = 0;
const errors = [];

for (const d of diagrams) {
  const code = d.code;
  try {
    const valid = await mermaid.parse(code);
    passCount++;
    console.log(`[PASS] ${d.file} #${d.index} (lines ${d.start_line}-${d.end_line}) [${d.header}]`);
  } catch (err) {
    failCount++;
    const errMsg = err.str || err.message || String(err);
    console.error(`[FAIL] ${d.file} #${d.index} (lines ${d.start_line}-${d.end_line}): ${errMsg.split('\n')[0]}`);
    errors.push({
      file: d.file,
      index: d.index,
      lines: `${d.start_line}-${d.end_line}`,
      header: d.header,
      error: errMsg
    });
  }
}

console.log("\n================ MERMAID VERIFICATION RESULTS ================");
console.log(`TOTAL: ${diagrams.length}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);

if (failCount > 0) {
  console.log("\nFAILED DIAGRAM DETAILS:");
  for (const e of errors) {
    console.log(`\n--- File: ${e.file} Diagram #${e.index} (Lines ${e.lines}) ---`);
    console.log(`Header: ${e.header}`);
    console.log(`Error: ${e.error}`);
  }
}
