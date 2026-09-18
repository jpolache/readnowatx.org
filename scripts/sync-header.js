// Propagates header.html into the <header>...</header> block of every page.
// Run manually with `node scripts/sync-header.js`, or automatically via the
// pre-commit hook in hooks/pre-commit.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const headerFile = path.join(root, 'header.html');

const pages = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && f !== 'header.html');

const header = fs.readFileSync(headerFile, 'utf8').replace(/\r\n/g, '\n').trimEnd();
const re = /<header>[\s\S]*?<\/header>/;

let changed = [];
for (const page of pages) {
  const file = path.join(root, page);
  const content = fs.readFileSync(file, 'utf8');
  if (!re.test(content)) {
    console.log(`skip (no <header>): ${page}`);
    continue;
  }
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const replacement = eol === '\r\n' ? header.replace(/\n/g, '\r\n') : header;
  const updated = content.replace(re, replacement);
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    changed.push(page);
  }
}

if (changed.length) {
  console.log(`Synced header into: ${changed.join(', ')}`);
} else {
  console.log('All pages already up to date.');
}
