const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'ts_tests');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function extractTS(filePath, prefix) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /```typescript\r?\n([\s\S]*?)\r?\n```/g;
  let match;
  let index = 1;
  while ((match = regex.exec(content)) !== null) {
    const tsCode = match[1];
    // check if contains JSX/React
    const ext = tsCode.includes('JSX.Element') || tsCode.includes('<BannerAd') || tsCode.includes('React.FC') ? 'tsx' : 'ts';
    const tsPath = path.join(outDir, `${prefix}_block_${index}.${ext}`);
    fs.writeFileSync(tsPath, tsCode, 'utf8');
    console.log(`Extracted: ${tsPath}`);
    index++;
  }
}

extractTS('/Users/apple/Coding-projects/Noteee/08_sector_5_canvas_pdf_spec.md', 'spec08');
extractTS('/Users/apple/Coding-projects/Noteee/09_sector_6_sync_collab_monetization_spec.md', 'spec09');
