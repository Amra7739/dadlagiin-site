const fs = require('fs');

const docXml = fs.readFileSync('local_sample_extracted/word/document.xml', 'utf8');
const relsXml = fs.readFileSync('local_sample_extracted/word/_rels/document.xml.rels', 'utf8');

// Parse rels
const rels = {};
const relMatches = [...relsXml.matchAll(/Id="([^"]+)"[^>]+Target="([^"]+)"/g)];
for (const m of relMatches) {
  rels[m[1]] = m[2];
}

// Split by paragraphs
const paragraphs = docXml.split('</w:p>');
for (let i = 0; i < paragraphs.length; i++) {
  const p = paragraphs[i];
  const text = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const imgMatch = p.match(/r:embed="([^"]+)"/);
  if (text || imgMatch) {
    const imgFile = imgMatch ? rels[imgMatch[1]] : null;
    console.log(`[P${i}] TEXT: ${text.substring(0, 80)} ${imgFile ? '--> IMAGE: ' + imgFile : ''}`);
  }
}
