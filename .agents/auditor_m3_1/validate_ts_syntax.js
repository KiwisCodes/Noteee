const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const tsTestsDir = path.join(__dirname, 'ts_tests');
const files = fs.readdirSync(tsTestsDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let totalErrors = 0;

files.forEach(file => {
  const filePath = path.join(tsTestsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  const isJsx = file.endsWith('.tsx');
  
  const sourceFile = ts.createSourceFile(
    file,
    code,
    ts.ScriptTarget.ESNext,
    true,
    isJsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const parseDiagnostics = sourceFile.parseDiagnostics || [];
  
  console.log(`=== Syntax Check: ${file} ===`);
  if (parseDiagnostics.length === 0) {
    console.log('✅ SYNTAX VALID');
  } else {
    console.log(`❌ SYNTAX ERRORS FOUND: ${parseDiagnostics.length}`);
    parseDiagnostics.forEach(diag => {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
      const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
      console.log(`  Line ${line + 1}:${character + 1} - ${message}`);
      totalErrors++;
    });
  }
});

console.log(`\nTotal Syntax Errors: ${totalErrors}`);
