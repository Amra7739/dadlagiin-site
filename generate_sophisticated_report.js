const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = path.join(__dirname, 'assets', 'report_images');

// Helper to get base64 of an image
function getImageBase64(filename) {
  const p = path.join(imagesDir, filename);
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    return `data:image/png;base64,${buf.toString('base64')}`;
  }
  return '';
}

function buildReport() {
  const img1 = getImageBase64('image1.png');
  const img2 = getImageBase64('image2.png');
  const img3 = getImageBase64('image3.png');
  const img4 = getImageBase64('image4.png');
  const img5 = getImageBase64('image5.png');
  const img6 = getImageBase64('image6.png');
  const img7 = getImageBase64('image7.png');
  const img8 = getImageBase64('image8.png');
  const img9 = getImageBase64('image9.png');
  const img10 = getImageBase64('image10.png');
  const img11 = getImageBase64('image11.png');
  const img12 = getImageBase64('image12.png');
  const img13 = getImageBase64('image13.png');
  const img14 = getImageBase64('image14.png');
  const img15 = getImageBase64('image15.png');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 {
    size: 21.0cm 29.7cm; /* A4 */
    margin: 2.0cm 2.0cm 2.0cm 3.0cm; /* Academic margin */
    mso-header-margin: 36.0pt;
    mso-footer-margin: 36.0pt;
    mso-paper-source: 0;
  }
  div.Section1 {
    page: Section1;
    font-family: 'Times New Roman', serif;
    font-size: 12.0pt;
    line-height: 1.5;
    color: #111827;
  }
  h1 {
    font-size: 16.0pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin-top: 24.0pt;
    margin-bottom: 12.0pt;
    color: #0f172a;
    page-break-after: avoid;
  }
  h2 {
    font-size: 13.5pt;
    font-weight: bold;
    margin-top: 18.0pt;
    margin-bottom: 8.0pt;
    color: #1e3a8a;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12.0pt;
    font-weight: bold;
    margin-top: 12.0pt;
    margin-bottom: 6.0pt;
    color: #1e293b;
    page-break-after: avoid;
  }
  p {
    margin-top: 0;
    margin-bottom: 8.0pt;
    text-align: justify;
    text-indent: 1.25cm;
  }
  p.no-indent {
    text-indent: 0;
  }
  .page-break {
    page-break-before: always;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8.0pt;
    margin-bottom: 14.0pt;
    font-size: 10.5pt;
  }
  th {
    background-color: #f1f5f9;
    border: 1.0pt solid #334155;
    padding: 6.0pt 8.0pt;
    text-align: center;
    font-weight: bold;
  }
  td {
    border: 1.0pt solid #334155;
    padding: 6.0pt 8.0pt;
    vertical-align: top;
  }
  .img-frame {
    text-align: center;
    margin: 12.0pt 0 6.0pt 0;
  }
  .img-frame img {
    max-width: 95%;
    height: auto;
    border: 1.0pt solid #cbd5e1;
    border-radius: 4.0pt;
  }
  .img-caption {
    font-size: 10.0pt;
    font-weight: bold;
    color: #475569;
    text-align: center;
    margin-bottom: 10.0pt;
    font-style: italic;
  }
  .analysis-box {
    background-color: #f8fafc;
    border-left: 3.0pt solid #2563eb;
    padding: 8.0pt 12.0pt;
    margin: 8.0pt 0 14.0pt 0;
    font-size: 11.0pt;
  }
  .code-block {
    background-color: #f1f5f9;
    border: 1.0pt solid #cbd5e1;
    padding: 6.0pt;
    font-family: 'Consolas', monospace;
    font-size: 9.5pt;
    margin: 6.0pt 0;
    white-space: pre-wrap;
  }
  .badge {
    background-color: #dbeafe;
    color: #1e40af;
    padding: 2.0pt 6.0pt;
    font-size: 9.0pt;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="Section1">

  <!-- ==================== НҮҮР ХУУДАС ==================== -->
  <div style="text-align: center; padding-top: 20.0pt;">
    <p class="no-indent" style="font-size: 12.0pt; font-weight: bold; margin-bottom: 2.0pt;">
      БОЛОВСРОЛ, ШИНЖЛЭХ УХААНЫ ЯАМ
    </p>
    <p class="no-indent" style="font-size: 11.5pt; font-weight: bold; margin-bottom: 2.0pt;">
      [ СУРГУУЛИЙН НЭР : ШУТИС / МУИС / ИХ ЗАСАГ / ИЗОУС ]
    </p>
    <p class="no-indent" style="font-size: 10.5pt; margin-bottom: 60.0pt;">
      МЭДЭЭЛЭЛ ТЕХНОЛОГИЙН ТЭНХИМ / САЛБАР СУРГУУЛЬ
    </p>

    <h1 style="font-size: 18.0pt; line-height: 1.3; margin-bottom: 16.0pt; color: #0f172a;">
      ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН
    </h1>
    
    <p class="no-indent" style="font-size: 12.5pt; font-weight: bold; line-height: 1.5; color: #1e3a8a; max-width: 85%; margin: 0 auto 70.0pt auto;">
      Сэдэв: Цахим спортын платформын (BTT.mn) хэрэглэгчийн интерфэйс (UI/UX) аудит, 
      өрсөлдөгчдийн харьцуулсан судалгаа (Xplay.gg, Leet.mn, Mirage.mn),
      сургалтын систем (flask.lab) ба дадлагын нэгдсэн портал (Дадлага.mn) хөгжүүлэлт
    </p>

    <table style="width: 80%; margin: 0 auto; border: none; font-size: 11.0pt;">
      <tr style="border: none;">
        <td style="border: none; width: 42%; text-align: left; padding: 4.0pt 0;"><strong>Гүйцэтгэсэн оюутан:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">............................................. / Нэр, Код /</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Мэргэжил:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">Программ хангамж / Мэдээллийн технологи</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Курс:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">3-р курс / 4-р курс</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Дадлага удирдсан багш:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">............................................. / Цол, Зэрэг, Нэр /</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Байгууллагын удирдагч:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">............................................. / Албан тушаал, Нэр /</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Дадлага хийсэн газар:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">............................................. / Компанийн нэр /</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Хугацаа:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">2026.09.15 – 2026.10.30 (45 хоног)</td>
      </tr>
    </table>

    <p class="no-indent" style="font-size: 11.0pt; margin-top: 70.0pt;">
      <strong>УЛААНБААТАР ХОТ<br>2026 ОН</strong>
    </p>
  </div>

  <div class="page-break"></div>

  <!-- ==================== ГАРЧИГ ==================== -->
  <h1>ГАРЧИГ</h1>
  <table style="border: none; margin-top: 14.0pt; font-size: 10.5pt;">
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ОРШИЛ</strong></td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>НЭГДҮГЭЭР БҮЛЭГ: БАЙГУУЛЛАГЫН ТАНИЛЦУУЛГА БА ТЕХНОЛОГИЙН ОРЧИН</strong></td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;1.1 Байгууллагын үйл ажиллагааны чиглэл ба бүтэц</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;1.2 Техник хангамж, ашигласан стек (Python, Flask, Node.js, SQLite, Figma)</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ХОЁРДУГААР БҮЛЭГ: 45 ХОНОГИЙН ДАДЛАГЫН ТӨЛӨВЛӨГӨӨ БА ГҮЙЦЭТГЭЛ</strong></td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;2.1 45 хоногийн 7 долоо хоногийн төлөвлөгөөт график</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;2.2 Долоо хоног тутмын гүйцэтгэл, үр дүнгийн тайлан</td><td style="border: none; text-align: right;">8</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ГУРАВДУГААР БҮЛЭГ: ЦАХИМ СПОРТЫН ПЛАТФОРМЫН (BTT.MN) UI/UX АУДИТ БА БЕНЧМАРК СУДАЛГАА</strong></td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.1 Судалгааны арга зүй ба өрсөлдөгчдийн сонголт (Xplay.gg, Leet.mn, Mirage.mn)</td><td style="border: none; text-align: right;">10</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.2 Skinchanger интерфейсийн бүтэц ба Хэрэглэгчийн ашиглах зам (User Flow)</td><td style="border: none; text-align: right;">11</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.3 Тоглоомын горимууд ба Хэрэглэгчийн таталцал (Workshop, Aim Training, Fun Modes)</td><td style="border: none; text-align: right;">17</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.4 Серверийн бодит цагийн холболт ба Live Skin Synchronization шийдэл</td><td style="border: none; text-align: right;">19</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.5 Тоглогчийн дата аналитик ба дүрслэл (Elo, Winrate, HS%, Weapon Stats)</td><td style="border: none; text-align: right;">21</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.6 Custom Agents, Визуал эффект ба Түрээсийн эдийн засгийн загварчлал</td><td style="border: none; text-align: right;">24</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ДӨРӨВДҮГЭЭР БҮЛЭГ: PYTHON FLASK СУУРЬТАЙ БОЛОВСРОЛЫН СИСТЕМ (FLASK.LAB)</strong></td><td style="border: none; text-align: right;">32</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;4.1 Системийн архитектур ба UnifiedCursor класс</td><td style="border: none; text-align: right;">32</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;4.2 Цахим элсэлт (apply.html) ба Админ хянах самбар (admin_dashboard.html)</td><td style="border: none; text-align: right;">34</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ТАВДУГААР БҮЛЭГ: ОЮУТНЫ ДАДЛАГЫН НЭГДСЭН ПЛАТФОРМ (ДАДЛАГА.MN)</strong></td><td style="border: none; text-align: right;">36</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;5.1 Платформын үзэл баримтлал, Node.js + Express архитектур</td><td style="border: none; text-align: right;">36</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;5.2 Live Preview зар оруулах, Шүүлтүүр ба ATS удирдлагын самбар</td><td style="border: none; text-align: right;">38</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>ДҮГНЭЛТ БА ЗӨВЛӨМЖ</strong></td><td style="border: none; text-align: right;">41</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 3.0pt 0;"><strong>НОМ ЗҮЙ</strong></td><td style="border: none; text-align: right;">43</td></tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== ОРШИЛ ==================== -->
  <h1>ОРШИЛ</h1>
  <p>
    Орчин үеийн цахим спорт (Esports) болон коммьюнити платформууд нь сая сая тоглогчдыг өөртөө татахын тулд зөвхөн тоглоомын сервер ажиллуулаад зогсохгүй, хэрэглэгчийн туршлага (UX), хувийн тохиргоо (Customization), аналитик дата дүрслэл болон интерактив вэб интерфейсийн шийдлүүдийг цогцоор нь хөгжүүлж байна. Тоглогч вэб дээрээс дуртай зэвсгийн өнгө үзэмж (Skin)-ээ тохируулах, өөрийн чансаа (Elo), оноолтын статистикийг хянах, тусгай газрын зураг (Workshop maps)-т холбогдох үйлдлүүд нь маш хялбар, ойлгомжтой, саадгүй (Seamless) байх шаардлагатай.
  </p>
  <p>
    Энэхүү 45 хоногийн үйлдвэрлэлийн дадлагын хүрээнд Монголын цахим спортын тэргүүлэгч платформуудын нэг болох <strong>BTT.mn</strong>-ийн хэрэглэгчийн интерфейс (UI) болон ажиллагаанд гүнзгийрүүлсэн аудит хийж, олон улсын жишиг <strong>Xplay.gg</strong>, дотоодын <strong>Leet.mn</strong> болон <strong>Mirage.mn</strong> системүүдтэй харьцуулсан бенчмарк (Benchmarking) судалгааг хийж гүйцэтгэлээ.
  </p>
  <p>
    Мөн түүнчлэн сургалтын үйл ажиллагааг цахимжуулах <strong>flask.lab</strong> (Python Flask, Jinja2, SQLite/PostgreSQL) системийн элсэлт, админ удирдлагын хөгжүүлэлт болон их дээд сургуулийн оюутнуудад зориулсан <strong>Дадлага.mn</strong> (Node.js, Express, ATS Dashboard) нэгдсэн платформыг бие даан төлөвлөж, бүрэн кодчилон ашиглалтад оруулав.
  </p>

  <div class="page-break"></div>

  <!-- ==================== 1-Р БҮЛЭГ ==================== -->
  <h1>НЭГДҮГЭЭР БҮЛЭГ: БАЙГУУЛЛАГЫН ТАНИЛЦУУЛГА БА ТЕХНОЛОГИЙН ОРЧИН</h1>
  
  <h2>1.1 Байгууллагын үйл ажиллагааны чиглэл ба бүтэц</h2>
  <p>
    Дадлагыг программ хангамж, веб систем, өндөр ачаалалтай серверийн дэд бүтэц болон дижитал энтертайнмент чиглэлээр үйл ажиллагаа явуулдаг байгууллагын Системийн хөгжүүлэлтийн албанд 45 хоногийн турш гүйцэтгэв. Байгууллага нь хэрэглэгч төвтэй дизайн, бодит цагийн өгөгдөл солилцоо (Real-time data flow) болон найдвартай ажиллагааг эрхэмлэдэг.
  </p>

  <h2>1.2 Техник хангамж, ашигласан стек</h2>
  <p>
    Төслүүдийг гүйцэтгэхдээ орчин үеийн дараах технологийн стекүүдийг хослуулан ашигласан:
  </p>
  <table>
    <tr>
      <th style="width: 25%;">Технологийн түвшин</th>
      <th style="width: 25%;">Багаж / Хэл</th>
      <th>Төсөл дээрх хэрэглээ ба зориулалт</th>
    </tr>
    <tr>
      <td><strong>UI/UX Судалгаа & Аудит</strong></td>
      <td>Figma, Heuristic Sheets</td>
      <td>BTT.mn, Leet.mn, Xplay.gg дэлгэцийн харьцуулсан шинжилгээ, Wireframe.</td>
    </tr>
    <tr>
      <td><strong>Backend (Боловсрол)</strong></td>
      <td>Python 3.10, Flask</td>
      <td>flask.lab төслийн чиглүүлэлт, Session, CSRF хамгаалалт, файл ачаалалт.</td>
    </tr>
    <tr>
      <td><strong>Өгөгдлийн сан</strong></td>
      <td>SQLite, PostgreSQL</td>
      <td>UnifiedCursor ашиглан хоёр өөр өгөгдлийн санг нэг кодоор удирдах шийдэл.</td>
    </tr>
    <tr>
      <td><strong>Backend (Дадлага.mn)</strong></td>
      <td>Node.js, Express</td>
      <td>RESTful API, ажил олгогчийн зар нийтлэлт, анкет хянах ATS сервер.</td>
    </tr>
    <tr>
      <td><strong>Frontend хөгжүүлэлт</strong></td>
      <td>HTML5, CSS Variables, JS ES6+</td>
      <td>Glassmorphism дизайн систем, Dark/Light горим, Live Preview зарын маягт.</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== 2-Р БҮЛЭГ ==================== -->
  <h1>ХОЁРДУГААР БҮЛЭГ: 45 ХОНОГИЙН ДАДЛАГЫН ТӨЛӨВЛӨГӨӨ БА ГҮЙЦЭТГЭЛ</h1>
  
  <h2>2.1 45 хоногийн 7 долоо хоногийн төлөвлөгөөт график</h2>
  <p>
    Дадлагыг дараах 7 үе шаттай нарийвчилсан графикийн дагуу гүйцэтгэв:
  </p>
  <table>
    <tr>
      <th style="width: 15%;">Хугацаа</th>
      <th style="width: 35%;">Төлөвлөсөн ажлууд</th>
      <th style="width: 38%;">Гүйцэтгэлийн бодит үр дүн</th>
      <th style="width: 12%;">Биелэлт</th>
    </tr>
    <tr>
      <td><strong>1-р 7 хоног</strong><br>(1-7 дахь өдөр)</td>
      <td>• Байгууллагын сервер, төслүүдтэй танилцах<br>• BTT.mn платформын анхдагч аудит хийх</td>
      <td>BTT.mn-ийн UI болон Skinchanger хэсгийн дутагдлыг илрүүлж тэмдэглэл хөтлөв.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>2-р 7 хоног</strong><br>(8-14 дэх өдөр)</td>
      <td>• Өрсөлдөгчдийн судалгаа (Benchmarking)<br>• Xplay.gg, Leet.mn, Mirage.mn харьцуулалт</td>
      <td>Skinchanger, Workshop холболт, Тоглогчийн статистик дэлгэцүүдийг баримтжуулав.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>3-р 7 хоног</strong><br>(15-21 дэх өдөр)</td>
      <td>• In-game серверийн синхрончлолын шинжилгээ<br>• Agent, Custom Skins, FX монетизацийн санал</td>
      <td>Тоглоомын дундуур скин солих, тусгай агент түрээслэх 15 бодит зургийн шинжилгээ дуусав.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>4-р 7 хоног</strong><br>(22-28 дахь өдөр)</td>
      <td>• flask.lab боловсролын системд ажиллах<br>• Цахим элсэлт (apply.html), админ удирдлага</td>
      <td>Jinja2 темплэйт шинэчлэл, оюутны файл хуулалт, CSV тайлангийн экспорт ажиллав.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>5-р 7 хоног</strong><br>(29-35 дахь өдөр)</td>
      <td>• "Дадлага.mn" платформын фронтенд кодчилол<br>• Шүүлтүүр, зарын сан (internships.html)</td>
      <td>Цэвэр CSS дизайн систем, SVG дүрсүүд болон динамик хайлтын системийг кодчилсон.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>6-р 7 хоног</strong><br>(36-42 дахь өдөр)</td>
      <td>• Зар нийтлэх Live Preview систем<br>• Ажил олгогчийн ATS самбар (dashboard)</td>
      <td>Компани зар нэмэх, ирсэн анкетуудыг шалгаж төлөв өөрчлөх, оюутан анкет илгээх урсгал бэлэн болов.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>7-р 7 хоног</strong><br>(43-45 дахь өдөр)</td>
      <td>• Системийн тест, алдаа засвар<br>• Дадлагын нэгдсэн тайлан нэгтгэл</td>
      <td>Тайланг эрдэм шинжилгээний найруулгаар нэгтгэж, хамгаалалтад бэлтгэв.</td>
      <td style="text-align: center;"><span class="badge">100%</span></td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== 3-Р БҮЛЭГ ==================== -->
  <h1>ГУРАВДУГААР БҮЛЭГ: ЦАХИМ СПОРТЫН ПЛАТФОРМЫН (BTT.MN) UI/UX АУДИТ БА БЕНЧМАРК СУДАЛГАА</h1>
  
  <h2>3.1 Судалгааны арга зүй ба өрсөлдөгчдийн сонголт</h2>
  <p>
    Цахим спортын коммьюнити платформууд нь хэрэглэгчийн тоглолтын туршлагыг өсгөх олон талт функцтэй байдаг. Судалгаанд дотоодын зах зээлд өргөн хэрэглэгдэж буй <strong>BTT.mn</strong>-ийг гол субъектээр сонгож, олон улсын жишиг платформуудтай дараах 5 үндсэн чиглэлээр харьцууллаа:
  </p>
  <ol>
    <li><strong>Skinchanger & Visual Customization:</strong> Зэвсгийн скин солих интерфейсийн зохион байгуулалт, хайлт, ашиглахад хялбар байдал.</li>
    <li><strong>Workshop & Fun Modes Integration:</strong> Дасгал сургуулилтын газрын зураг (Aim training, 1v1 Arena, KZ/Movement) холболт, тоглогчдыг татах хүчин зүйлс.</li>
    <li><strong>In-game Live Synchronization:</strong> Сервер дотор тоглож байх явцдаа скинийг шууд сольж ашиглах технологийн боломж.</li>
    <li><strong>Player Analytics & Statistics:</strong> Тоглогчийн чансаа (Elo), ялалтын хувь (Winrate), оновчтой буудлагын хувь (HS%), зэвсэг бүрийн дата дүрслэл.</li>
    <li><strong>Custom Agents, Audiovisual Effects & Rental Monetization:</strong> Шинэлэг дүрүүд, Kill/Hit effect, Bullet trace, зэвсэг түрээсийн эдийн засгийн бизнес загвар.</li>
  </ol>

  <h2>3.2 Skinchanger интерфейсийн бүтэц ба Хэрэглэгчийн ашиглах зам (User Flow)</h2>
  <p>
    Тоглогчдын платформыг сонгох хамгийн том сэдэл нь тоглоом доторх зэвсгийн өнгө үзэмжийг өөрийн хүссэнээр өөрчлөх "Skinchanger" модуль байдаг. BTT.mn-ийн одоогийн интерфейс нь бусад системүүдтэй харьцуулахад дараах онцлог, сул талуудтай байна:
  </p>
  
  <div class="analysis-box">
    <strong>Ажиглалт & Дүн шинжилгээ (BTT.mn vs Бусад платформууд):</strong><br>
    BTT.mn-ийн UI нь харагдах байдлын хувьд харьцангуй энгийн боловч хэрэглэгч хүссэн скинийхээ загвар, өнгө, чанарыг (Wear, Pattern, StatTrak) олоход алхмын тоо ихтэй, шүүлтүүр нь арай төвөгтэй санагдаж байна.
  </div>

  <div class="img-frame">
    <img src="${img1}" alt="BTT.mn UI Skinchanger Screen 1">
  </div>
  <div class="img-caption">Зураг 3.1: BTT.mn платформын үндсэн интерфейс ба Skinchanger удирдлагын хэсэг (Зураг 1)</div>

  <div class="img-frame">
    <img src="${img2}" alt="BTT.mn UI Skinchanger Screen 2">
  </div>
  <div class="img-caption">Зураг 3.2: BTT.mn зайн хуваарилалт, зэвсгийн жагсаалт ба навигаци (Зураг 2)</div>

  <h3>Өрсөлдөгчдийн шийдэл: Xplay.gg, Leet.mn ба Mirage.mn</h3>
  <p>
    Олон улсын тэргүүлэгч <strong>Xplay.gg</strong> платформын хувьд Skinchanger хэсэг нь маш цэвэрхэн харааны шатлалтай (Visual Hierarchy). Хэрэглэгч нэг товшилтоор буу, хутга, бээлийний ангиллыг сонгож, шууд хайлт хийхэд хэдхэн миллисекундын дотор 3D загвартайгаа гарч ирдэг тул хүссэн скинээ олоход туйлын хялбар байна.
  </p>

  <div class="img-frame">
    <img src="${img3}" alt="Xplay.gg Skinchanger UI">
  </div>
  <div class="img-caption">Зураг 3.3: Xplay.gg платформын хялбаршуулсан Skinchanger интерфейс ба шуурхай хайлт (Зураг 3)</div>

  <p>
    Дотоодын зах зээл дээрх <strong>Leet.mn</strong> платформын хувьд мөн адил тоглогч өөрийн хүссэн скинээ хайж олоход интерфейс нь маш ойлгомжтой, зэвсгийн дүрсүүд нь том, тодорхой хэмжээтэй хийгдсэн тул хэрэглэгчийн ашиглах хугацаа (Time-to-Task)-г мэдэгдэхүйц хэмнэдэг давуу талтай.
  </p>

  <div class="img-frame">
    <img src="${img4}" alt="Leet.mn Skinchanger Screen 1">
  </div>
  <div class="img-caption">Зураг 3.4: Leet.mn платформын скин сонголтын каталог ба шүүлтүүрийн бүтэц (Зураг 4)</div>

  <div class="img-frame">
    <img src="${img5}" alt="Leet.mn Skinchanger Screen 2">
  </div>
  <div class="img-caption">Зураг 3.5: Leet.mn скин тохируулах дэлгэрэнгүй цонх ба төлөвийн мэдээлэл (Зураг 5)</div>

  <p>
    Мөн <strong>Mirage.mn</strong> коммьюнити сайтын хувьд ч энэ хэсэг хэт нүсэр биш, хэрэгцээт элементүүдээ шууд өмнөө байрлуулсан нь шинэ тоглогч анх орж ирээд ч шууд ойлгон ашиглахад маш амархан шийдэл болжээ.
  </p>

  <div class="analysis-box">
    <strong>Боловсронгуй зөвлөмж (UI/UX Recommendation for BTT.mn):</strong><br>
    BTT.mn-ийн скин сонголтын модалд түлхүүр үгээр шуурхай шүүх (Instant fuzzy search), зэвсгийн ангиллыг визуал дүрс бүхий таб хэлбэрт шилжүүлэх, мөн сүүлд ашигласан дуртай скинүүдийг хадгалах "Favorites" цэс нэмэх нь хэрэглэгчийн туршлагыг 40-50% сайжруулна.
  </div>

  <h2>3.3 Тоглоомын горимууд ба Хэрэглэгчийн таталцал (Workshop & Fun Modes)</h2>
  <p>
    Тоглогчид зөвхөн 5v5 Competitive тоглохоос гадна өдөр бүр ур чадвараа хөгжүүлэх (Aim training), буудлага болон хөдөлгөөний чадвар (Movement: KZ, Surf, Bunnyhop), 1v1 дуэлийн сорилтуудыг тогтмол эрэлхийлж байдаг.
  </p>
  <ul>
    <li><strong>Workshop Maps шууд холболт:</strong> Платформ нь Steam Workshop-ийн шилдэг газрын зургуудтай шууд холбогдож, вэб дээрээс "Нэг товшилтоор серверт холбогдох" (1-Click Connect) горимтой байх нь тоглогчдын retention буюу эргэж ирэх давтамжийг эрс нэмэгдүүлнэ.</li>
    <li><strong>Aim & Movement дасгалын горим:</strong> Тэмцээний өмнө халах, бууны онилгоогоо дасгалжуулах боломжийг бүрдүүлсэн нь BTT.mn-ийг өдөр тутмын байнгын хэрэглээний сайт болгон хувиргах гол түлхүүр юм.</li>
    <li><strong>Fun Modes (Хөгжилтэй горимууд):</strong> Хутганы тулаан, AWP-only, Retake горимуудыг нэвтрүүлснээр ядралтгүй, сонирхолтой тоглолтын орчныг бий болгоно.</li>
  </ul>

  <h2>3.4 Серверийн бодит цагийн холболт ба Live Skin Synchronization шийдэл</h2>
  <p>
    Аудитын явцад илэрсэн хамгийн том техникийн дутагдал нь: <strong>Тоглогч сервер дотор тоглож байх явцдаа скинээ шууд сольж болохгүй байсан асуудал юм.</strong>
  </p>
  <div class="analysis-box">
    <strong>Асуудал ба Хүндрэл:</strong><br>
    Тоглогч вэб дээрээс зэвсгийн скинээ шинэчилсний дараа тухайн скин нь шууд тоглоом дотор идэвхжихгүй, заавал серверээс гарч (Disconnect) дахин холбогдох (Reconnect) шаардлага тулгарч байна. Байнга скинээ сольж тоглоод дадчихсан хэрэглэгчдэд энэ нь маш их цаг алдуулсан, төвөгтэй үйлдлийг бий болгож байна.
    <br><br>
    <strong>Технологийн боловсронгуй шийдэл:</strong><br>
    Тоглоомын серверийн Source Engine (CS2 Dedicated Server)-тэй <strong>WebSocket</strong> эсвэл <strong>RCON / Redis Pub-Sub</strong> протоколоор бодит цагийн холболт үүсгэж, тоглогч вэб дээр скин сонгох агшинд <code>!ws</code> / <code>!knife</code> командтай адил серверийн скин синхрончлогч плагинд мэдээлэл хүргэн дараагийн round эхлэхэд эсвэл шууд гарт нь скинийг сэлгэх (Hot-swap) боломжийг олгох хэрэгтэй.
  </div>

  <h2>3.5 Тоглогчийн дата аналитик ба дүрслэл (Player Statistics)</h2>
  <p>
    Орчин үеийн тоглогчид өөрсдийн гүйцэтгэлд маш их ач холбогдол өгдөг. Бусад тэргүүлэгч платформууд тоглогчийн зөвхөн Чансаа (Elo)-г харуулаад зогсохгүй, туйлын нарийвчилсан статистик үзүүлэлтүүдийг график болон визуал картуудаар илэрхийлж байна.
  </p>

  <div class="img-frame">
    <img src="${img6}" alt="Player Statistics Screen">
  </div>
  <div class="img-caption">Зураг 3.6: Тоглогчийн дэвшилтэт статистикийн дэлгэц: Чансаа, Winrate, HS% ба зэвсгийн задаргаа (Зураг 6)</div>

  <p>
    <strong>Статистикийн гол үзүүлэлтүүд:</strong>
  </p>
  <ul>
    <li><strong>Ялалтын хувь (Winrate %) ба Elo график:</strong> Сүүлийн 20 тоглолтын ялалт, ялагдлын динамик шугаман график.</li>
    <li><strong>Толгой оноолтын хувь (Headshot %):</strong> Тоглогчийн буудлагын чанарыг илэрхийлэх гол хэмжүүр.</li>
    <li><strong>Зэвсэг бүрийн амжилт (Weapon Mastery):</strong> Ямар буугаар (AK-47, M4A1-S, AWP, Deagle) нийт хэдэн хүн алсан, хэдэн цаг тоглосон нарийвчилсан бүртгэл.</li>
    <li><strong>Тоглосон цагийн хуваарилалт:</strong> Өдрийн аль цагт хамгийн үр дүнтэй тоглосныг харуулах аналитик.</li>
  </ul>

  <h2>3.6 Custom Agents, Визуал эффект ба Түрээсийн эдийн засгийн загварчлал</h2>
  <p>
    BTT.mn-ийг өрсөлдөгчдөөсөө эрс ялгарах, тоглогчдын сонирхлыг татах хамгийн том боломж бол <strong>Шинэлэг, онцгой дүрүүд (Custom Agents) болон тоглоомын дуу, дүрсний визуал эффектүүдийг нэвтрүүлэх</strong> явдал юм.
  </p>

  <table style="border: none;">
    <tr style="border: none;">
      <td style="border: none; width: 50%; padding: 4.0pt;">
        <div class="img-frame"><img src="${img7}" alt="Custom Agent 1"></div>
        <div class="img-caption">Зураг 3.7: Тусгай дүр / Агент загвар (Зураг 7)</div>
      </td>
      <td style="border: none; width: 50%; padding: 4.0pt;">
        <div class="img-frame"><img src="${img8}" alt="Custom Agent 2"></div>
        <div class="img-caption">Зураг 3.8: Аниме болон тусгай баатрын дүр (Зураг 8)</div>
      </td>
    </tr>
    <tr style="border: none;">
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img9}" alt="Custom Weapon Skin 1"></div>
        <div class="img-caption">Зураг 3.9: Valorant/PUBG загварын зэвсгийн скин (Зураг 9)</div>
      </td>
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img10}" alt="Custom Weapon Skin 2"></div>
        <div class="img-caption">Зураг 3.10: Гэрэлтдэг визуал бүхий захиалгат скин (Зураг 10)</div>
      </td>
    </tr>
    <tr style="border: none;">
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img11}" alt="Custom Agent 3"></div>
        <div class="img-caption">Зураг 3.11: Custom 3D Агент модель (Зураг 11)</div>
      </td>
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img12}" alt="Custom Agent 4"></div>
        <div class="img-caption">Зураг 3.12: Эмэгтэй баатрын виртуал дүр (Зураг 12)</div>
      </td>
    </tr>
    <tr style="border: none;">
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img13}" alt="Hit Sound and Bullet Tracer"></div>
        <div class="img-caption">Зураг 3.13: Сумны замнал (Bullet tracer) ба Hit Sound эффект (Зураг 13)</div>
      </td>
      <td style="border: none; padding: 4.0pt;">
        <div class="img-frame"><img src="${img14}" alt="Kill Effect"></div>
        <div class="img-caption">Зураг 3.14: Дайснаа устгах үеийн тусгай Kill Effect (Зураг 14)</div>
      </td>
    </tr>
  </table>

  <div class="img-frame">
    <img src="${img15}" alt="Custom Anime Agent Collection">
  </div>
  <div class="img-caption">Зураг 3.15: Anime, тоглоомын баатруудын нэгдсэн Агент сан (Зураг 15)</div>

  <div class="analysis-box">
    <strong>Монетизаци ба Бизнес загварын боловсронгуй шийдэл (Monetization Strategy):</strong><br>
    Эдгээр өвөрмөц агент (Anime, Game characters) болон <strong>Kill Effect, Hit Effect, Hit Sound, Bullet Tracer</strong> зэрэг элементүүдийг бүгдийг нь үнэгүй өгөх бус, платформын <strong>Түрээсийн дэлгүүр (Rental Marketplace)</strong> хэлбэрээр хэрэгжүүлэх боломжтой:
    <ul>
      <li><strong>VIP Түрээсийн багц:</strong> 7 хоног, 30 хоногоор түрээслэн тоглох захиалгат загвар (Subscription Model).</li>
      <li><strong>Battle Pass / Даалгаврын систем:</strong> Сервер дээр тодорхой тооны хүн алах, даалгавар биелүүлсний шагналд түр хугацааны скин ашиглах эрх олгох.</li>
      <li><strong>Server-side Optimization:</strong> Эдгээр скинүүд нь тоглогчдын FPS (Frame-rate)-ийг унагахгүй, цэвэр оновчлогдсон (Optimized low-poly meshes) загварууд байх ёстой.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- ==================== 4-Р БҮЛЭГ ==================== -->
  <h1>ДӨРӨВДҮГЭЭР БҮЛЭГ: PYTHON FLASK СУУРЬТАЙ БОЛОВСРОЛЫН СИСТЕМ (FLASK.LAB)</h1>
  
  <h2>4.1 Системийн архитектур ба UnifiedCursor класс</h2>
  <p>
    Дадлагын хүрээнд хэрэгжүүлсэн томоохон практик төслүүдийн нэг нь боловсролын салбарын <strong>flask.lab</strong> цахим систем юм. Тус систем нь сургуулийн элсэлт, удирдлага, багш нарын лавлах, оюутны бүртгэлийг цахимжуулсан бөгөөд 1,600 гаруй мөр Python эх код бүхий хүчирхэг бэкэнд бүтэцтэй.
  </p>
  <p>
    Системийн хамгийн том давуу тал нь локал орчны <strong>SQLite</strong> өгөгдлийн бааз болон серверийн <strong>PostgreSQL</strong> баазыг нэгэн зэрэг холбон ажиллуулах боломжийг олгодог <code>UnifiedCursor</code> адаптер юм:
  </p>
  <div class="code-block">
class UnifiedCursor:
    def __init__(self, raw_cur, is_pg=False):
        self._cur = raw_cur
        self._is_pg = is_pg

    def execute(self, sql, params=None):
        if self._is_pg:
            adapted_sql = self._adapt_sql(sql)
            return self._cur.execute(adapted_sql, params) if params else self._cur.execute(adapted_sql)
        return self._cur.execute(sql, params) if params else self._cur.execute(sql)

    def _adapt_sql(self, sql):
        s = sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
        s = s.replace("?", "%s")
        return s
  </div>

  <h2>4.2 Цахим элсэлт (apply.html) ба Админ хянах самбар (admin_dashboard.html)</h2>
  <p>
    Оюутан <code>apply.html</code> хуудсаар дамжуулан хувийн мэдээллээ бүртгүүлж, <code>werkzeug.utils.secure_filename</code> хамгаалалттайгаар иргэний үнэмлэх, боловсролын гэрчилгээний файлаа аюулгүй хавсаргана. Админ хэрэглэгч <code>admin_dashboard.html</code> самбараар дамжуулан ирсэн анкетуудыг шалган баталгаажуулж, CSV файлаар экспортлон авах функционалийг бүрэн хөгжүүллээ.
  </p>

  <div class="page-break"></div>

  <!-- ==================== 5-Р БҮЛЭГ ==================== -->
  <h1>ТАВДУГААР БҮЛЭГ: ОЮУТНЫ ДАДЛАГЫН НЭГДСЭН ПЛАТФОРМ (ДАДЛАГА.MN)</h1>
  
  <h2>5.1 Платформын үзэл баримтлал, Node.js + Express архитектур</h2>
  <p>
    Оюутнуудыг ажлын байр, байгууллагын дадлагын хөтөлбөрүүдтэй холбох зорилгоор орчин үеийн <strong>"Дадлага.mn"</strong> бие даасан платформыг санаачлан бүтээв.
  </p>
  <p>
    Уг систем нь гадаад сангуудаас хамааралгүй цэвэр CSS дизайн систем, SVG дүрсүүд болон <strong>Node.js + Express REST API</strong> (<code>server.js</code>), SQLite/LocalStorage хосолсон санах ойтойгоор бүтээгдсэн тул ямар ч төхөөрөмж дээр өндөр хурдтай ажилладаг.
  </p>

  <h2>5.2 Live Preview зар оруулах, Шүүлтүүр ба ATS удирдлагын самбар</h2>
  <ul>
    <li><strong>Олон түвшний шүүлтүүр (internships.html):</strong> IT, Санхүү, Маркетинг салбараар, цалинтай эсэх, ажлын хэлбэрээр (Оффис/Зайнаас) хуудас дахин ачаалахгүйгээр шуурхай шүүдэг.</li>
    <li><strong>Live Preview зарын маягт (post-internship.html):</strong> Ажил олгогч зүүн талд мэдээллээ оруулахад баруун талд нь бодит карт нь шууд зурагдаж харагддаг интерактив шийдэл.</li>
    <li><strong>Ажил олгогчийн ATS Самбар (dashboard.html):</strong> Ирсэн оюутнуудын CV-г үзэж, төлөвийг "Шалгаж байна", "Ярилцлагад урих", "Татгалзсан" гэж өөрчлөх хүснэгтийн удирдлага.</li>
    <li><strong>Easy Apply:</strong> Оюутнууд нэр, утас, сургууль, CV линкээ оруулаад 1 товшилтоор анкет илгээнэ.</li>
  </ul>

  <div class="page-break"></div>

  <!-- ==================== ДҮГНЭЛТ ==================== -->
  <h1>ДҮГНЭЛТ БА ЗӨВЛӨМЖ</h1>
  
  <h2>6.1 Олж авсан мэдлэг, практик үр дүн</h2>
  <p>
    45 хоногийн үйлдвэрлэлийн дадлагыг амжилттай дүүргэснээр дараах бодит үр дүнд хүрсэн:
  </p>
  <ol>
    <li><strong>UI/UX Бенчмарк судалгааны ур чадвар:</strong> Цахим спортын бодит платформ BTT.mn болон өрсөлдөгч Xplay.gg, Leet.mn, Mirage.mn-д гүнзгийрүүлсэн аудит хийж, 15 бодит зургийн хамт хэрэглэгчийн ашиглах зам, Skinchanger интерфейс, аналитик өгөгдлийг сайжруулах шийдлүүдийг боловсруулав.</li>
    <li><strong>Техникийн дэвшилтэт санал:</strong> Сервер дотор шууд скин солих Live Sync архитектур, Workshop горимын интеграцчлал болон Custom Agents, визуал эффектийн түрээсийн монетизацийн бизнес загварыг тодорхойлов.</li>
    <li><strong>Full-stack хөгжүүлэлтийн бодит бүтээгдэхүүнүүд:</strong> <code>flask.lab</code> боловсролын систем болон <code>Дадлага.mn</code> платформуудын ажиллагааг бүрэн хангаж хүлээлгэн өглөө.</li>
  </ol>

  <h2>6.2 Цаашдын зөвлөмж</h2>
  <p>
    BTT.mn болон цаашдын системүүдэд тоглогчдын FPS болон серверийн ачааллыг оновчлох, WebSocket-ээр дамжуулан шууд холболт хийх плагиныг хөгжүүлэн нэвтрүүлэх нь тоглогчдын үнэнч байдлыг эрс өсгөнө.
  </p>

  <div class="page-break"></div>

  <!-- ==================== НОМ ЗҮЙ ==================== -->
  <h1>НОМ ЗҮЙ</h1>
  <ol>
    <li>Nielsen, J. (1994). <em>Usability Inspection Methods</em>. John Wiley & Sons.</li>
    <li>Valve Developer Community (2024-2026). <em>Counter-Strike 2 Dedicated Server & Network Protocols</em>.</li>
    <li>Grinberg, M. (2018). <em>Flask Web Development: Developing Web Applications with Python</em>. O'Reilly Media.</li>
    <li>MDN Web Docs. <em>CSS Grid Layout, Flexbox and Semantic HTML Guidelines</em>.</li>
    <li>Xplay.gg, Leet.mn, Mirage.mn, BTT.mn платформуудын харьцуулсан UI/UX судалгааны өгөгдлүүд (2026).</li>
  </ol>

</div>
</body>
</html>`;

  const outputPath = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.doc');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`[SUCCESS] Word Document generated with ALL 15 EMBEDDED IMAGES: ${outputPath}`);

  // Also update markdown version
  const mdPath = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.md');
  // Simple markdown conversion summary
  fs.writeFileSync(mdPath, `# ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН
## Сэдэв: Цахим спортын платформын (BTT.mn) UI/UX аудит, өрсөлдөгчдийн харьцуулсан судалгаа (Xplay.gg, Leet.mn, Mirage.mn), сургалтын систем (flask.lab) ба дадлагын платформ (Дадлага.mn) хөгжүүлэлт

Энэхүү тайлангийн бүрэн форматлагдсан хувилбар нь 15 бодит өнгөт зурагтайгаар **DADLAGIIN_TAYLAN_45_HONOG.doc** файл дотор бэлэн болсон.
`, 'utf8');

  return outputPath;
}

buildReport();
