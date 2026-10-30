const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateFlawlessDocx() {
  const origXml = fs.readFileSync('local_sample_extracted/word/document.xml', 'utf8');
  const drawings = origXml.match(/<w:drawing>[\s\S]*?<\/w:drawing>/g);
  console.log(`Found ${drawings.length} native drawings from original document.`);

  // Make sure settings.xml has <w:view w:val="print"/>
  const settingsPath = 'local_sample_extracted/word/settings.xml';
  let settingsXml = fs.readFileSync(settingsPath, 'utf8');
  if (!settingsXml.includes('<w:view')) {
    settingsXml = settingsXml.replace('<w:settings', '<w:settings><w:view w:val="print"/>');
    fs.writeFileSync(settingsPath, settingsXml, 'utf8');
  }

  // Get document tag and section properties
  const docStart = origXml.match(/<w:document[^>]*>/)[0];
  const sectPrMatch = origXml.match(/<w:sectPr[\s\S]*?<\/w:sectPr>/);
  const sectPr = sectPrMatch ? sectPrMatch[0] : `
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>`;

  const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  function p(text, options = {}) {
    let pPr = '';
    let rPr = '';
    
    if (options.align === 'center') {
      pPr += '<w:jc w:val="center"/>';
    } else if (options.align === 'both') {
      pPr += '<w:jc w:val="both"/><w:ind w:firstLine="720"/>';
    }

    if (options.bold) {
      rPr += '<w:b/>';
    }
    if (options.size) {
      rPr += `<w:sz w:val="${options.size}"/>`;
    }
    if (options.color) {
      rPr += `<w:color w:val="${options.color}"/>`;
    }
    if (options.italic) {
      rPr += '<w:i/>';
    }

    if (options.spacing) {
      pPr += `<w:spacing w:before="${options.spacing.before || 0}" w:after="${options.spacing.after || 120}"/>`;
    } else {
      pPr += '<w:spacing w:before="0" w:after="120"/>';
    }

    return `<w:p><w:pPr>${pPr}</w:pPr><w:r><w:rPr>${rPr}</w:rPr><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;
  }

  function pageBreak() {
    return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
  }

  function wrapDrawing(drawingXml, captionText) {
    let xml = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="180" w:after="60"/></w:pPr><w:r>${drawingXml}</w:r></w:p>`;
    if (captionText) {
      xml += p(captionText, { align: 'center', italic: true, size: 20, color: '475569', spacing: { before: 40, after: 160 } });
    }
    return xml;
  }

  let body = '';

  // ==================== НҮҮР ХУУДАС ====================
  body += p('БОЛОВСРОЛ, ШИНЖЛЭХ УХААНЫ ЯАМ', { align: 'center', bold: true, size: 24, spacing: { before: 200, after: 40 } });
  body += p('[ СУРГУУЛИЙН НЭР : ШУТИС / МУИС / ИХ ЗАСАГ / ИЗОУС ]', { align: 'center', bold: true, size: 23, spacing: { before: 40, after: 40 } });
  body += p('МЭДЭЭЛЭЛ ТЕХНОЛОГИЙН ТЭНХИМ / САЛБАР СУРГУУЛЬ', { align: 'center', size: 21, spacing: { before: 40, after: 800 } });

  body += p('ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН', { align: 'center', bold: true, size: 36, color: '0F172A', spacing: { before: 300, after: 300 } });
  
  body += p('Сэдэв: Цахим спортын платформын (BTT.mn) хэрэглэгчийн интерфэйс (UI/UX) аудит, өрсөлдөгчдийн харьцуулсан судалгаа (Xplay.gg, Leet.mn, Mirage.mn), сургалтын систем (flask.lab) ба дадлагын нэгдсэн портал (Дадлага.mn) хөгжүүлэлт', { align: 'center', bold: true, size: 25, color: '1E3A8A', spacing: { before: 100, after: 900 } });

  body += p('Гүйцэтгэсэн оюутан: ............................................. / Нэр, Код /', { size: 22, spacing: { before: 60, after: 60 } });
  body += p('Мэргэжил: Программ хангамж / Мэдээллийн технологи (3, 4-р курс)', { size: 22, spacing: { before: 60, after: 60 } });
  body += p('Дадлага удирдсан багш: ............................................. / Цол, Зэрэг, Нэр /', { size: 22, spacing: { before: 60, after: 60 } });
  body += p('Байгууллагын удирдагч: ............................................. / Албан тушаал, Нэр /', { size: 22, spacing: { before: 60, after: 60 } });
  body += p('Дадлага хийсэн газар: ............................................. / Компанийн нэр /', { size: 22, spacing: { before: 60, after: 60 } });
  body += p('Хугацаа: 2026.09.15 – 2026.10.30 (45 хоног)', { size: 22, spacing: { before: 60, after: 700 } });

  body += p('УЛААНБААТАР ХОТ - 2026 ОН', { align: 'center', bold: true, size: 22, spacing: { before: 400, after: 200 } });
  body += pageBreak();

  // ==================== ОРШИЛ ====================
  body += p('ОРШИЛ', { align: 'center', bold: true, size: 30, color: '0F172A', spacing: { before: 300, after: 200 } });
  body += p('Орчин үеийн цахим спорт (Esports) болон коммьюнити платформууд нь сая сая тоглогчдыг өөртөө татахын тулд зөвхөн тоглоомын сервер ажиллуулаад зогсохгүй, хэрэглэгчийн туршлага (UX), хувийн тохиргоо (Customization), аналитик дата дүрслэл болон интерактив вэб интерфейсийн шийдлүүдийг цогцоор нь хөгжүүлж байна. Тоглогч вэб дээрээс дуртай зэвсгийн өнгө үзэмж (Skin)-ээ тохируулах, өөрийн чансаа (Elo), оноолтын статистикийг хянах, тусгай газрын зураг (Workshop maps)-т холбогдох үйлдлүүд нь маш хялбар, ойлгомжтой, саадгүй (Seamless) байх шаардлагатай.', { align: 'both', size: 24 });
  body += p('Энэхүү 45 хоногийн үйлдвэрлэлийн дадлагын хүрээнд Монголын цахим спортын тэргүүлэгч платформуудын нэг болох BTT.mn-ийн хэрэглэгчийн интерфейс (UI) болон ажиллагаанд гүнзгийрүүлсэн аудит хийж, олон улсын жишиг Xplay.gg, дотоодын Leet.mn болон Mirage.mn системүүдтэй харьцуулсан бенчмарк (Benchmarking) судалгааг хийж гүйцэтгэлээ.', { align: 'both', size: 24 });
  body += p('Мөн түүнчлэн сургалтын үйл ажиллагааг цахимжуулах flask.lab (Python Flask, Jinja2, SQLite/PostgreSQL) системийн элсэлт, админ удирдлагын хөгжүүлэлт болон их дээд сургуулийн оюутнуудад зориулсан Дадлага.mn (Node.js, Express, ATS Dashboard) нэгдсэн платформыг бие даан төлөвлөж, бүрэн кодчилон ашиглалтад оруулав.', { align: 'both', size: 24 });
  body += pageBreak();

  // ==================== 1 & 2-Р БҮЛЭГ ====================
  body += p('НЭГДҮГЭЭР БҮЛЭГ: БАЙГУУЛЛАГЫН ТАНИЛЦУУЛГА БА ТЕХНОЛОГИЙН ОРЧИН', { bold: true, size: 26, color: '1E3A8A', spacing: { before: 240, after: 140 } });
  body += p('Дадлагыг программ хангамж, веб систем, өндөр ачаалалтай серверийн дэд бүтэц болон дижитал энтертайнмент чиглэлээр үйл ажиллагаа явуулдаг байгууллагын Системийн хөгжүүлэлтийн албанд 45 хоногийн турш гүйцэтгэв. Ажлын байранд Python 3.10+, Flask, SQLite, PostgreSQL, Node.js, Express, HTML5/CSS3, JavaScript ES6+, Figma болон Git/GitHub хувилбарын удирдлагын системийг цогцоор нь ашиглалаа.', { align: 'both', size: 24 });

  body += p('ХОЁРДУГААР БҮЛЭГ: 45 ХОНОГИЙН ДАДЛАГЫН ТӨЛӨВЛӨГӨӨ БА ГҮЙЦЭТГЭЛ', { bold: true, size: 26, color: '1E3A8A', spacing: { before: 240, after: 140 } });
  body += p('Дадлагыг 7 долоо хоногт хуваан шат дараатай төлөвлөгөөний дагуу амжилттай хэрэгжүүлсэн. Үүнд: 1-р 7 хоногт BTT.mn платформын анхдагч аудит, 2-р 7 хоногт өрсөлдөгчдийн судалгаа (Xplay.gg, Leet.mn, Mirage.mn), 3-р 7 хоногт In-game Live Sync ба монетизацийн санал, 4-р 7 хоногт flask.lab боловсролын систем, 5-р 7 хоногт Дадлага.mn платформын фронтенд, 6-р 7 хоногт ATS самбар ба бэкэнд холболт, 7-р 7 хоногт тестчлэл болон дадлагын нэгдсэн тайлангийн нэгтгэл тус тус 100% биелэлттэй хийгдсэн.', { align: 'both', size: 24 });
  body += pageBreak();

  // ==================== 3-Р БҮЛЭГ (ҮНДСЭН СУДАЛГАА БА ЗУРГУУД) ====================
  body += p('ГУРАВДУГААР БҮЛЭГ: ЦАХИМ СПОРТЫН ПЛАТФОРМЫН (BTT.MN) UI/UX АУДИТ БА БЕНЧМАРК СУДАЛГАА', { bold: true, size: 27, color: '0F172A', spacing: { before: 260, after: 160 } });

  body += p('3.1 Skinchanger интерфейсийн бүтэц ба Хэрэглэгчийн ашиглах зам (User Flow)', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 200, after: 100 } });
  body += p('Тоглогчдын платформыг сонгох хамгийн том сэдэл нь тоглоом доторх зэвсгийн өнгө үзэмжийг өөрийн хүссэнээр өөрчлөх "Skinchanger" модуль байдаг. BTT.mn-ийн одоогийн интерфейс нь бусад системүүдтэй харьцуулахад харагдах байдлын хувьд харьцангуй энгийн боловч хэрэглэгч хүссэн скинийхээ загвар, өнгө, чанарыг (Wear, Pattern, StatTrak) олоход алхмын тоо ихтэй, шүүлтүүр нь арай төвөгтэй санагдаж байна.', { align: 'both', size: 24 });

  // DRAWING 0 & 1 (Image 1 & 2)
  body += wrapDrawing(drawings[0], 'Зураг 3.1: BTT.mn платформын үндсэн интерфейс ба Skinchanger удирдлагын хэсэг');
  body += wrapDrawing(drawings[1], 'Зураг 3.2: BTT.mn зайн хуваарилалт, зэвсгийн жагсаалт ба навигацийн бүтэц');

  body += p('3.2 Өрсөлдөгчдийн шийдэл: Xplay.gg, Leet.mn ба Mirage.mn харьцуулалт', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 240, after: 100 } });
  body += p('Олон улсын тэргүүлэгч Xplay.gg платформын хувьд Skinchanger хэсэг нь маш цэвэрхэн харааны шатлалтай (Visual Hierarchy). Хэрэглэгч нэг товшилтоор буу, хутга, бээлийний ангиллыг сонгож, шууд хайлт хийхэд хэдхэн миллисекундын дотор 3D загвартайгаа гарч ирдэг тул хүссэн скинээ олоход туйлын хялбар байна.', { align: 'both', size: 24 });

  // DRAWING 2 (Image 3)
  body += wrapDrawing(drawings[2], 'Зураг 3.3: Xplay.gg платформын хялбаршуулсан Skinchanger интерфейс ба шуурхай хайлт');

  body += p('Дотоодын зах зээл дээрх Leet.mn платформын хувьд мөн адил тоглогч өөрийн хүссэн скинээ хайж олоход интерфейс нь маш ойлгомжтой, зэвсгийн дүрсүүд нь том, тодорхой хэмжээтэй хийгдсэн тул хэрэглэгчийн ашиглах хугацаа (Time-to-Task)-г мэдэгдэхүйц хэмнэдэг давуу талтай.', { align: 'both', size: 24 });

  // DRAWING 3 & 4 (Image 4 & 5)
  body += wrapDrawing(drawings[3], 'Зураг 3.4: Leet.mn платформын скин сонголтын каталог ба шүүлтүүрийн бүтэц');
  body += wrapDrawing(drawings[4], 'Зураг 3.5: Leet.mn скин тохируулах дэлгэрэнгүй цонх ба төлөвийн мэдээлэл');

  body += p('Мөн Mirage.mn коммьюнити сайтын хувьд ч энэ хэсэг хэт нүсэр биш, хэрэгцээт элементүүдээ шууд өмнөө байрлуулсан нь шинэ тоглогч анх орж ирээд ч шууд ойлгон ашиглахад маш амархан шийдэл болжээ.', { align: 'both', size: 24 });

  body += p('3.3 Тоглоомын горимууд ба Хэрэглэгчийн таталцал (Workshop Maps & Fun Modes)', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 240, after: 100 } });
  body += p('Тоглогчид зөвхөн 5v5 Competitive тоглохоос гадна өдөр бүр ур чадвараа хөгжүүлэх (Aim training), буудлага болон хөдөлгөөний чадвар (Movement: KZ, Surf, Bunnyhop), 1v1 дуэлийн сорилтуудыг тогтмол эрэлхийлж байдаг. Steam Workshop-ийн шилдэг газрын зургуудтай шууд холбогдож, вэб дээрээс 1 товшилтоор серверт орох боломж олгох нь BTT.mn платформын тоглогчдыг өдөр бүр татах гол хүчин зүйл болно.', { align: 'both', size: 24 });

  body += p('3.4 Серверийн бодит цагийн холболт ба Live Skin Synchronization шийдэл', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 240, after: 100 } });
  body += p('Аудитын явцад илэрсэн хамгийн том дутагдал бол: Тоглогч сервер дотор тоглож байх үедээ скинээ шууд сольж болохгүй байсан явдал юм. Үүнээс болж байнга скинээ сольж тоглоод сурчихсан тоглогчдод тоглоомоос гарч дахин холбогдох (Reconnect) төвөгтэй байдал үүсэж байна. Үүнийг шийдвэрлэхийн тулд Source Engine серверийн скин плагинтай WebSocket эсвэл RCON протоколоор бодит цагийн холболт үүсгэж, тоглоомын дундуур скинийг шууд солих (Live Hot-swap) архитектурыг нэвтрүүлэх нь нэн чухал байна.', { align: 'both', size: 24 });

  body += p('3.5 Тоглогчийн дата аналитик ба дүрслэл (Player Statistics)', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 240, after: 100 } });
  body += p('Бусад тэргүүлэгч платформууд тоглогчдын зөвхөн Чансаа (Elo)-г харуулаад зогсохгүй, туйлын нарийвчилсан статистик үзүүлэлтүүдийг график болон визуал картуудаар илэрхийлж байна. Үүнд: Winrate %, Headshot %, ямар буугаар хэдэн хүн алсан задаргаа, өдрийн аль цагт хамгийн үр дүнтэй тоглосныг харуулах аналитик дата багтаж байна.', { align: 'both', size: 24 });

  // DRAWING 5 (Image 6)
  body += wrapDrawing(drawings[5], 'Зураг 3.6: Тоглогчийн дэвшилтэт статистикийн дэлгэц: Чансаа, Winrate, HS% ба зэвсгийн задаргаа');

  body += p('3.6 Custom Agents, Визуал эффект ба Түрээсийн эдийн засгийн загварчлал', { bold: true, size: 25, color: '1E3A8A', spacing: { before: 240, after: 100 } });
  body += p('BTT.mn-ийг өрсөлдөгчдөөсөө эрс ялгарах, тоглогчдын сонирхлыг татах хамгийн том боломж бол Шинэлэг, онцгой дүрүүд (Custom Agents: Anime, Game characters) болон тоглоомын дуу, дүрсний визуал эффектүүдийг (Kill Effect, Hit Effect, Hit Sound, Bullet Tracer) нэвтрүүлэх явдал юм.', { align: 'both', size: 24 });

  // DRAWINGS 6 to 14 (Image 7 to 15)
  body += wrapDrawing(drawings[6], 'Зураг 3.7: Тусгай дүр / Агент загвар');
  body += wrapDrawing(drawings[7], 'Зураг 3.8: Аниме болон тусгай баатрын дүр');
  body += wrapDrawing(drawings[8], 'Зураг 3.9: Valorant/PUBG загварын зэвсгийн скин');
  body += wrapDrawing(drawings[9], 'Зураг 3.10: Гэрэлтдэг визуал бүхий захиалгат скин');
  body += wrapDrawing(drawings[10], 'Зураг 3.11: Custom 3D Агент модель');
  body += wrapDrawing(drawings[11], 'Зураг 3.12: Эмэгтэй баатрын виртуал дүр');
  body += wrapDrawing(drawings[12], 'Зураг 3.13: Сумны замнал (Bullet tracer) ба Hit Sound эффект');
  body += wrapDrawing(drawings[13], 'Зураг 3.14: Дайснаа устгах үеийн тусгай Kill Effect');
  body += wrapDrawing(drawings[14], 'Зураг 3.15: Anime, тоглоомын баатруудын нэгдсэн Агент сан');

  body += p('Монетизацийн боловсронгуй шийдэл: Эдгээр онцгой дүр, скинүүдийг үнэгүй өгөх бус, платформын Түрээсийн дэлгүүр (Rental Marketplace) хэлбэрээр 7 хоног, 30 хоногоор түрээслэх захиалгат загвар (Subscription) болон Battle Pass даалгаврын системээр олгох нь серверийн эдийн засгийн орлогыг тогтворжуулах хамгийн өндөр үр дүнтэй загварчлал болно.', { align: 'both', size: 24 });
  body += pageBreak();

  // ==================== 4 & 5-Р БҮЛЭГ & ДҮГНЭЛТ ====================
  body += p('ДӨРӨВДҮГЭЭР БҮЛЭГ: PYTHON FLASK СУУРЬТАЙ БОЛОВСРОЛЫН СИСТЕМ (FLASK.LAB)', { bold: true, size: 26, color: '1E3A8A', spacing: { before: 240, after: 140 } });
  body += p('Дадлагын хүрээнд хэрэгжүүлсэн flask.lab төсөл нь сургуулийн элсэлт, удирдлага, багш нарын лавлах, оюутны бүртгэлийг цахимжуулсан 1,600 гаруй мөр Python эх код бүхий хүчирхэг систем юм. UnifiedCursor классыг хөгжүүлж, SQLite болон PostgreSQL хоёр өөр өгөгдлийн баазыг нэг кодоор удирдах архитектурыг амжилттай хэрэгжүүлэв.', { align: 'both', size: 24 });

  body += p('ТАВДУГААР БҮЛЭГ: ОЮУТНЫ ДАДЛАГЫН НЭГДСЭН ПЛАТФОРМ (ДАДЛАГА.MN)', { bold: true, size: 26, color: '1E3A8A', spacing: { before: 240, after: 140 } });
  body += p('Оюутнуудыг ажлын байр, байгууллагын дадлагын хөтөлбөрүүдтэй холбох зорилгоор орчин үеийн Дадлага.mn платформыг бүтээв. Node.js + Express REST API сервер, Live Preview зарын маягт, шүүлтүүртэй зарын сан, компаниудад зориулсан ATS анкет шалгах самбарыг бүрэн хөгжүүлж дууслаа.', { align: 'both', size: 24 });

  body += p('ДҮГНЭЛТ БА ЗӨВЛӨМЖ', { bold: true, size: 26, color: '0F172A', spacing: { before: 260, after: 140 } });
  body += p('45 хоногийн үйлдвэрлэлийн дадлагын үр дүнд BTT.mn платформын өрсөлдөх чадварыг дээшлүүлэх UI/UX болон функциональ цогц зөвлөмжүүд боловсруулагдсанаас гадна, боловсролын систем flask.lab болон оюутны ажлын байрны нэгдсэн систем Дадлага.mn платформууд бүрэн ажиллагаанд орж, их сургуулийн дээд шалгуурыг хангах дадлагын тайлан бэлэн боллоо.', { align: 'both', size: 24 });

  const finalDocumentXml = `${docStart}<w:body>${body}${sectPr}</w:body></w:document>`;
  fs.writeFileSync('local_sample_extracted/word/document.xml', finalDocumentXml, 'utf8');

  // Pack back to DADLAGIIN_TAYLAN_45_HONOG.docx
  const targetDocx = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.docx');
  const tempZip = path.join(__dirname, 'temp_flawless.zip');
  if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
  if (fs.existsSync(targetDocx)) fs.unlinkSync(targetDocx);

  const ps = `$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('local_sample_extracted', '${tempZip}'); Move-Item -Path '${tempZip}' -Destination '${targetDocx}' -Force`;
  execSync(`powershell -Command "${ps}"`);

  console.log('[COMPLETED] Flawless Native DOCX generated at:', targetDocx);
}

generateFlawlessDocx();
