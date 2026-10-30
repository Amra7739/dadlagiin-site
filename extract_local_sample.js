const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  fs.copyFileSync('local_sample.docx', 'local_sample.zip');
  const psCmd = `$ProgressPreference = 'SilentlyContinue'; Expand-Archive -Path 'local_sample.zip' -DestinationPath 'local_sample_extracted' -Force`;
  execSync(`powershell -Command "${psCmd}"`);
  const xml = fs.readFileSync('local_sample_extracted/word/document.xml', 'utf8');
  const text = xml.replace(/<w:p[^>]*>/g, '\n').replace(/<[^>]+>/g, '').replace(/[\t ]+/g, ' ');
  fs.writeFileSync('sample_report_text.txt', text, 'utf8');
  console.log('EXTRACTED_OK. Length:', text.length);
  console.log('PREVIEW:\n', text.substring(0, 3000));
} catch (e) {
  console.error(e);
}
