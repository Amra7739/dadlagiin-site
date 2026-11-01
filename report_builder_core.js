const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[1/4] Loading template resources and media...');

// 1. Read original XML to extract 15 drawings
const origXml = fs.readFileSync('local_sample_extracted/word/document.xml', 'utf8');
const drawings = origXml.match(/<w:drawing>[\s\S]*?<\/w:drawing>/g);
if (!drawings || drawings.length < 15) {
  console.error(`Error: Expected 15 drawings, found ${drawings ? drawings.length : 0}`);
  process.exit(1);
}
console.log(`[OK] Successfully loaded ${drawings.length} native DrawingML blocks.`);

// 2. Ensure settings.xml has print layout enabled
const settingsPath = 'local_sample_extracted/word/settings.xml';
let settingsXml = fs.readFileSync(settingsPath, 'utf8');
if (!settingsXml.includes('<w:view')) {
  settingsXml = settingsXml.replace('<w:settings', '<w:settings><w:view w:val="print"/>');
  fs.writeFileSync(settingsPath, settingsXml, 'utf8');
}

// 3. Setup footer with dynamic page numbers
const footerPath = 'local_sample_extracted/word/footer1.xml';
const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr>
      <w:jc w:val="right"/>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        <w:sz w:val="20"/>
        <w:color w:val="64748B"/>
      </w:rPr>
      <w:t xml:space="preserve">Хуудас </w:t>
    </w:r>
    <w:fldSimple w:instr="PAGE"/>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        <w:sz w:val="20"/>
        <w:color w:val="64748B"/>
      </w:rPr>
      <w:t xml:space="preserve"> / </w:t>
    </w:r>
    <w:fldSimple w:instr="NUMPAGES"/>
  </w:p>
</w:ftr>`;
fs.writeFileSync(footerPath, footerXml, 'utf8');

// Ensure footer relationship in document.xml.rels
const relsPath = 'local_sample_extracted/word/_rels/document.xml.rels';
let relsXml = fs.readFileSync(relsPath, 'utf8');
if (!relsXml.includes('footer1.xml')) {
  relsXml = relsXml.replace('</Relationships>', '<Relationship Id="rIdFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>');
  fs.writeFileSync(relsPath, relsXml, 'utf8');
}

// Ensure Content_Types has footer override
const ctPath = 'local_sample_extracted/[Content_Types].xml';
let ctXml = fs.readFileSync(ctPath, 'utf8');
if (!ctXml.includes('footer1.xml')) {
  ctXml = ctXml.replace('</Types>', '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>');
  fs.writeFileSync(ctPath, ctXml, 'utf8');
}

const docStart = origXml.match(/<w:document[^>]*>/)[0];
const sectPr = `
  <w:sectPr>
    <w:footerReference w:type="default" r:id="rIdFooter1"/>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
  </w:sectPr>`;

const escapeXml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

// Helper formatting functions
function p(text, options = {}) {
  let pPr = '';
  let rPr = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>';
  
  if (options.align === 'center') {
    pPr += '<w:jc w:val="center"/>';
  } else if (options.align === 'both') {
    pPr += '<w:jc w:val="both"/><w:ind w:firstLine="720"/>';
  } else if (options.align === 'right') {
    pPr += '<w:jc w:val="right"/>';
  }

  if (options.bold) rPr += '<w:b/>';
  if (options.italic) rPr += '<w:i/>';
  if (options.size) rPr += `<w:sz w:val="${options.size}"/>`;
  else rPr += '<w:sz w:val="24"/>'; // default 12pt
  if (options.color) rPr += `<w:color w:val="${options.color}"/>`;

  if (options.spacing) {
    pPr += `<w:spacing w:before="${options.spacing.before || 0}" w:after="${options.spacing.after || 120}" w:line="360" w:lineRule="auto"/>`;
  } else {
    pPr += '<w:spacing w:before="0" w:after="120" w:line="360" w:lineRule="auto"/>'; // 1.5 lines
  }

  return `<w:p><w:pPr>${pPr}</w:pPr><w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function h1(title) {
  return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="400" w:after="240"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="32"/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t></w:r></w:p>`;
}

function h2(title) {
  return `<w:p><w:pPr><w:spacing w:before="300" w:after="160"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/><w:color w:val="1E3A8A"/></w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t></w:r></w:p>`;
}

function h3(title) {
  return `<w:p><w:pPr><w:spacing w:before="220" w:after="120"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="25"/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t></w:r></w:p>`;
}

function pageBreak() {
  return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

function wrapDrawing(drawingXml, captionText, detailedAnalysis) {
  let xml = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="160" w:after="60"/></w:pPr><w:r>${drawingXml}</w:r></w:p>`;
  if (captionText) {
    xml += p(captionText, { align: 'center', italic: true, bold: true, size: 21, color: '334155', spacing: { before: 40, after: 120 } });
  }
  if (detailedAnalysis) {
    xml += analysisBox('Дэлгэцийн нарийвчилсан инженерийн шинжилгээ:', detailedAnalysis);
  }
  return xml;
}

function analysisBox(title, content) {
  let xml = `<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="2563EB"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:spacing w:before="140" w:after="40"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="23"/><w:color w:val="1E3A8A"/></w:rPr><w:t xml:space="preserve">${escapeXml(title)}</w:t></w:r></w:p>`;
  xml += `<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="2563EB"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:spacing w:before="0" w:after="160"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">${escapeXml(content)}</w:t></w:r></w:p>`;
  return xml;
}

function codeSnippet(code) {
  const lines = code.split('\n');
  let xml = '';
  for (const l of lines) {
    xml += `<w:p><w:pPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/><w:spacing w:before="0" w:after="30"/><w:ind w:left="280" w:right="280"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">${escapeXml(l)}</w:t></w:r></w:p>`;
  }
  return xml;
}

function makeTable(headers, rows, colWidths = []) {
  let tbl = `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="0" w:type="auto"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="8" w:space="0" w:color="334155"/>
        <w:left w:val="single" w:sz="8" w:space="0" w:color="334155"/>
        <w:bottom w:val="single" w:sz="8" w:space="0" w:color="334155"/>
        <w:right w:val="single" w:sz="8" w:space="0" w:color="334155"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      </w:tblBorders>
    </w:tblPr>`;

  // Headers
  tbl += '<w:tr><w:trPr><w:tblHeader/></w:trPr>';
  headers.forEach((h, idx) => {
    const w = colWidths[idx] ? `w:w="${colWidths[idx]}" w:type="dxa"` : 'w:w="0" w:type="auto"';
    tbl += `<w:tc>
      <w:tcPr>${colWidths[idx] ? `<w:tcW ${w}/>` : ''}<w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr>
      <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="70" w:after="70"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="21"/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">${escapeXml(h)}</w:t></w:r></w:p>
    </w:tc>`;
  });
  tbl += '</w:tr>';

  // Rows
  rows.forEach(r => {
    tbl += '<w:tr>';
    r.forEach((cell, idx) => {
      const w = colWidths[idx] ? `w:w="${colWidths[idx]}" w:type="dxa"` : 'w:w="0" w:type="auto"';
      tbl += `<w:tc>
        <w:tcPr>${colWidths[idx] ? `<w:tcW ${w}/>` : ''}</w:tcPr>
        <w:p><w:pPr><w:spacing w:before="60" w:after="60"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">${escapeXml(cell)}</w:t></w:r></w:p>
      </w:tc>`;
    });
    tbl += '</w:tr>';
  });

  tbl += '</w:tbl>';
  return tbl;
}

console.log('[2/4] Assembling comprehensive 55-60 page academic chapters...');

let body = '';

// Export building function for modular expansion
module.exports = {
  p, h1, h2, h3, pageBreak, wrapDrawing, analysisBox, codeSnippet, makeTable,
  docStart, sectPr, drawings, body
};
