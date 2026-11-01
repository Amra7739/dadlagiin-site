const fs = require('fs');

const xml = fs.readFileSync('local_sample_extracted/word/document.xml', 'utf8');
console.log('XML size:', xml.length);
const texts = (xml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join(' ');
console.log('Text characters:', texts.length);
console.log('Words approx:', texts.split(/\s+/).filter(Boolean).length);
console.log('Paragraphs:', (xml.match(/<w:p[ >]/g) || []).length);
console.log('Tables:', (xml.match(/<w:tbl[ >]/g) || []).length);
console.log('Drawings:', (xml.match(/<w:drawing[ >]/g) || []).length);
console.log('Explicit Page breaks:', (xml.match(/w:br w:type="page"/g) || []).length);
