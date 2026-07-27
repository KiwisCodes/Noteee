const fs = require('fs');

const files = [
  '/Users/apple/Coding-projects/Noteee/05_sector_2_capture_spec.md',
  '/Users/apple/Coding-projects/Noteee/06_sector_3_editor_spec.md',
  '/Users/apple/Coding-projects/Noteee/07_sector_4_ai_flashcards_spec.md'
];

function checkSyntax(code, fileName, blockIndex) {
  // Strip comments and regexes before checking brackets/braces
  // Replace regex literals like /.../g with ''
  const sanitized = code
    .replace(/\/\/[^\n]*/g, '') // remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
    .replace(/\/(\\.|[^\/\\\n])+\/[gimsuy]*/g, '"regex"'); // remove regex literals

  const stack = [];
  const map = { '}': '{', ']': '[', ')': '(' };
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const prev = sanitized[i - 1];
    
    if ((char === '"' || char === "'" || char === '`') && prev !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
      }
    }
    
    if (inString) continue;
    
    if (['{', '[', '('].includes(char)) {
      stack.push({ char, line: sanitized.substring(0, i).split('\n').length });
    } else if (['}', ']', ')'].includes(char)) {
      if (stack.length === 0) {
        return `Unmatched closing '${char}' at line ${sanitized.substring(0, i).split('\n').length}`;
      }
      const top = stack.pop();
      if (top.char !== map[char]) {
        return `Mismatched '${char}' (expected closing for '${top.char}' from line ${top.line}) at line ${sanitized.substring(0, i).split('\n').length}`;
      }
    }
  }
  
  if (stack.length > 0) {
    const top = stack.pop();
    return `Unclosed '${top.char}' from line ${top.line}`;
  }
  
  return null;
}

let hasError = false;

files.forEach(filePath => {
  const fileName = filePath.split('/').pop();
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.matchAll(/```typescript\n([\s\S]*?)\n```/g);
  let bIdx = 0;
  for (const m of matches) {
    bIdx++;
    const err = checkSyntax(m[1], fileName, bIdx);
    if (err) {
      console.error(`Syntax error in ${fileName} TS Block #${bIdx}: ${err}`);
      hasError = true;
    } else {
      console.log(`Passed TS syntax check: ${fileName} Block #${bIdx}`);
    }
  }
});

if (hasError) {
  process.exit(1);
} else {
  console.log('\nALL TS interfaces passed structural syntax check!');
}
