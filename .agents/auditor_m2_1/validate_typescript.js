const fs = require('fs');
const { execSync } = require('child_process');

const files = [
  '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
  '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
  '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
];

let tsCodeByFile = {};

files.forEach(filePath => {
  const fileName = filePath.split('/').pop();
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/```typescript\n([\s\S]*?)\n```/g);
  let codeBlocks = [];
  for (const m of matches) {
    codeBlocks.push(m[1]);
  }
  tsCodeByFile[fileName] = codeBlocks.join('\n\n');
});

// Write to temporary test files
const tempDir = '/Users/apple/Coding-projects/Noteee/.agents/auditor_m2_1/ts_check';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Write dummy drizzle / react types if imported
const dummyTypes = `
declare module 'drizzle-orm/sqlite-core' {
  export function sqliteTable(name: string, schema: any): any;
  export function text(name: string, opts?: any): any;
  export function integer(name: string, opts?: any): any;
  export function real(name: string, opts?: any): any;
  export function blob(name: string, opts?: any): any;
}
declare module 'react' {
  export type ReactNode = any;
}
`;

fs.writeFileSync(`${tempDir}/shims.d.ts`, dummyTypes);

let allCombinedTs = '';
Object.keys(tsCodeByFile).forEach(f => {
  fs.writeFileSync(`${tempDir}/${f}.ts`, tsCodeByFile[f]);
  allCombinedTs += `// --- ${f} ---\n` + tsCodeByFile[f] + '\n\n';
});

fs.writeFileSync(`${tempDir}/combined.ts`, allCombinedTs);

console.log('TypeScript blocks extracted successfully.');
