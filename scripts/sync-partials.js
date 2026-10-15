// Propagates the shared partials (header.html, footer.html) into the matching
// <header>...</header> and <footer>...</footer> blocks of every page.
// Run manually with `node scripts/sync-partials.js`, or automatically via the
// pre-commit hook in hooks/pre-commit.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const partials = [
  { file: 'header.html', re: /<header>[\s\S]*?<\/header>/ },
  { file: 'footer.html', re: /<footer>[\s\S]*?<\/footer>/ },
];
for (const p of partials) {
  p.html = fs
    .readFileSync(path.join(root, p.file), 'utf8')
    .replace(/\r\n/g, '\n')
    .trimEnd();
}

const pages = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && !partials.some((p) => p.file === f));

let changed = [];
for (const page of pages) {
  const file = path.join(root, page);
  const content = fs.readFileSync(file, 'utf8');
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  let updated = content;
  for (const p of partials) {
    if (!p.re.test(updated)) {
      console.log(`skip ${p.file} (no match): ${page}`);
      continue;
    }
    const replacement = eol === '\r\n' ? p.html.replace(/\n/g, '\r\n') : p.html;
    updated = updated.replace(p.re, () => replacement);
  }
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    changed.push(page);
  }
}

if (changed.length) {
  console.log(`Synced partials into: ${changed.join(', ')}`);
} else {
  console.log('All pages already up to date.');
}
