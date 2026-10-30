const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildNativeDocx() {
  const tempDir = path.join(__dirname, 'temp_native_docx');
  const wordDir = path.join(tempDir, 'word');
  const relsDir = path.join(tempDir, '_rels');
  const wordRelsDir = path.join(wordDir, '_rels');
  const mediaDir = path.join(wordDir, 'media');

  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(wordRelsDir, { recursive: true });
  fs.mkdirSync(relsDir, { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });

  // Copy images
  const srcMedia = path.join(__dirname, 'assets', 'report_images');
  for (let i = 1; i <= 15; i++) {
    const fn = `image${i}.png`;
    const sp = path.join(srcMedia, fn);
    if (fs.existsSync(sp)) {
      fs.copyFileSync(sp, path.join(mediaDir, fn));
    }
  }

  // [Content_Types].xml
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
</Types>`;
  fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypes, 'utf8');

  // _rels/.rels
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  fs.writeFileSync(path.join(relsDir, '.rels'), rootRels, 'utf8');

  // settings.xml (FORCES PRINT LAYOUT / A4!)
  const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:view w:val="print"/>
  <w:zoom w:percent="100"/>
  <w:defaultTabStop w:val="720"/>
</w:settings>`;
  fs.writeFileSync(path.join(wordDir, 'settings.xml'), settingsXml, 'utf8');

  // styles.xml
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:lang w:val="mn-MN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="360" w:lineRule="auto" w:after="160"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="400" w:after="200"/>
      <w:jc w:val="center"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="32"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="300" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="27"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="24"/>
      <w:color w:val="1E293B"/>
    </w:rPr>
  </w:style>
</w:styles>`;
  fs.writeFileSync(path.join(wordDir, 'styles.xml'), stylesXml, 'utf8');

  // word/_rels/document.xml.rels
  let docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>\n`;

  for (let i = 1; i <= 15; i++) {
    docRels += `  <Relationship Id="rIdImg${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${i}.png"/>\n`;
  }
  docRels += `</Relationships>`;
  fs.writeFileSync(path.join(wordRelsDir, 'document.xml.rels'), docRels, 'utf8');

  // Read the markdown
  const md = fs.readFileSync(path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.md'), 'utf8');
  const lines = md.split('\n');

  const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  // Image drawing helper (approx 5.5 inches width x 3.2 inches height: 5029200 x 2926080 EMUs)
  function makeImageXml(relId, imgNum) {
    return `<w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="200" w:after="100"/></w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
            <wp:extent cx="5029200" cy="2850000"/>
            <wp:docPr id="${imgNum}" name="Зураг ${imgNum}"/>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                  <pic:nvPicPr>
                    <pic:cNvPr id="${imgNum}" name="Image ${imgNum}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="${relId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
                    <a:stretch><a:fillRect/></a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm><a:off x="0" y="0"/><a:ext cx="5029200" cy="2850000"/></a:xfrm>
                    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>`;
  }

  let bodyXml = '';

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(line.replace('# ', ''))}</w:t></w:r></w:p>`;
    } else if (line.startsWith('## ')) {
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${escapeXml(line.replace('## ', ''))}</w:t></w:r></w:p>`;
    } else if (line.startsWith('### ')) {
      const headingText = escapeXml(line.replace('### ', ''));
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>${headingText}</w:t></w:r></w:p>`;

      // Insert matching images after key sections
      if (headingText.includes('Skinchanger') || headingText.includes('Зураг 1-5')) {
        bodyXml += makeImageXml('rIdImg1', 1);
        bodyXml += makeImageXml('rIdImg2', 2);
        bodyXml += makeImageXml('rIdImg3', 3);
        bodyXml += makeImageXml('rIdImg4', 4);
        bodyXml += makeImageXml('rIdImg5', 5);
      } else if (headingText.includes('Тоглогчийн дата аналитик') || headingText.includes('Зураг 6')) {
        bodyXml += makeImageXml('rIdImg6', 6);
      } else if (headingText.includes('Custom Agents') || headingText.includes('Зураг 7-15')) {
        for (let j = 7; j <= 15; j++) {
          bodyXml += makeImageXml(`rIdImg${j}`, j);
        }
      }
    } else if (line.startsWith('---')) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    } else {
      const clean = escapeXml(line.replace(/\*\*/g, '').replace(/\*/g, ''));
      bodyXml += `<w:p><w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/></w:pPr><w:r><w:t>${clean}</w:t></w:r></w:p>`;
    }
  }

  // Section properties (A4 Page: width 11906, height 16838. Margins: left 1701 (3cm), right 1134 (2cm), top 1134 (2cm), bottom 1134 (2cm))
  const sectPr = `<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
  </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${bodyXml}
    ${sectPr}
  </w:body>
</w:document>`;

  fs.writeFileSync(path.join(wordDir, 'document.xml'), documentXml, 'utf8');

  // Pack into .docx
  const zipTemp = path.join(__dirname, 'native_temp.zip');
  const docxTarget = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.docx');

  if (fs.existsSync(zipTemp)) fs.unlinkSync(zipTemp);
  if (fs.existsSync(docxTarget)) fs.unlinkSync(docxTarget);

  const ps = `$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir.replace(/\\/g, '\\\\')}', '${zipTemp.replace(/\\/g, '\\\\')}'); Move-Item -Path '${zipTemp.replace(/\\/g, '\\\\')}' -Destination '${docxTarget.replace(/\\/g, '\\\\')}' -Force`;
  execSync(`powershell -Command "${ps}"`);

  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('[SUCCESS] Native A4 Print-Layout .docx created:', docxTarget);
}

buildNativeDocx();
