const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  fs.copyFileSync('sample_doc.docx', 'sample_doc.zip');
  const psCmd = `$ProgressPreference = 'SilentlyContinue'; Expand-Archive -Path 'sample_doc.zip' -DestinationPath 'sample_extracted' -Force`;
  execSync(`powershell -Command "${psCmd}"`);
  const xml = fs.readFileSync('sample_extracted/word/document.xml', 'utf8');
  // Strip XML tags to get raw text
  const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').replace(/[\t ]+/g, ' ');
  fs.writeFileSync('sample_text.txt', text, 'utf8');
  console.log('EXTRACTED_OK. Total length:', text.length);
  console.log(text.substring(0, 3000));
} catch (e) {
  console.error(e);
}
