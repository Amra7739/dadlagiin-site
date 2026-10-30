const fs = require('fs');
const html = fs.readFileSync('drive_view.html', 'utf8');

const titleMatch = html.match(/<title>([^<]+)<\/title>/);
console.log('PAGE TITLE:', titleMatch ? titleMatch[1] : 'None');

// Find all JSON strings or patterns of document title
const matches = [...html.matchAll(/"title":"([^"]+)"/g)];
for (const m of matches) {
  console.log('FOUND TITLE:', m[1]);
}

// Check if there's any file name mentioned in meta tags
const metaDesc = html.match(/name="description" content="([^"]+)"/);
console.log('META DESC:', metaDesc ? metaDesc[1] : 'None');
