const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Generate the rich Microsoft Word .doc (Word HTML format with MSO tags)
function generateDocFile() {
  const docPath = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.doc');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>45 ХОНОГИЙН ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН</title>
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
    margin: 2.0cm 2.0cm 2.0cm 3.0cm; /* Standard Mongolian Academic Margin: Left 3cm for binding */
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
  
  /* Typography */
  h1 {
    font-size: 16.0pt;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    margin-top: 24.0pt;
    margin-bottom: 12.0pt;
    color: #1e3a8a;
    page-break-after: avoid;
  }
  h2 {
    font-size: 14.0pt;
    font-weight: bold;
    margin-top: 18.0pt;
    margin-bottom: 8.0pt;
    color: #1e40af;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12.0pt;
    font-weight: bold;
    margin-top: 12.0pt;
    margin-bottom: 6.0pt;
    color: #0f172a;
    page-break-after: avoid;
  }
  p {
    margin-top: 0;
    margin-bottom: 8.0pt;
    text-align: justify;
    text-indent: 1.25cm; /* Academic paragraph indent */
  }
  p.no-indent {
    text-indent: 0;
  }
  
  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10.0pt;
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
  
  /* Image Frames & Boxes */
  .image-box {
    border: 1.5pt dashed #2563eb;
    background-color: #f8fafc;
    padding: 24.0pt 16.0pt;
    text-align: center;
    margin: 10.0pt 0 10.0pt 0;
    border-radius: 6.0pt;
  }
  .image-box-title {
    font-weight: bold;
    color: #1e40af;
    font-size: 11.0pt;
    margin-bottom: 4.0pt;
  }
  .image-box-hint {
    font-size: 9.5pt;
    color: #64748b;
    font-style: italic;
  }

  .comparison-grid {
    width: 100%;
    margin-bottom: 14.0pt;
  }
  .comparison-grid td {
    width: 50%;
    border: 1.0pt solid #cbd5e1;
    background-color: #fcfcfc;
    padding: 8.0pt;
  }

  /* Cover Page */
  .cover-container {
    text-align: center;
    height: 100%;
    padding-top: 30.0pt;
  }
  .page-break {
    page-break-before: always;
  }
  .code-box {
    background-color: #f1f5f9;
    border: 1.0pt solid #cbd5e1;
    padding: 8.0pt;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    margin: 8.0pt 0;
    white-space: pre-wrap;
  }
  .highlight-badge {
    background-color: #e0f2fe;
    color: #0369a1;
    padding: 2.0pt 6.0pt;
    font-weight: bold;
    font-size: 9.5pt;
  }
</style>
</head>
<body>
<div class="Section1">

  <!-- ==================== НҮҮР ХУУДАС ==================== -->
  <div class="cover-container">
    <p class="no-indent" style="text-align: center; font-size: 13.0pt; font-weight: bold; margin-bottom: 2.0pt;">
      БОЛОВСРОЛ, ШИНЖЛЭХ УХААНЫ ЯАМ
    </p>
    <p class="no-indent" style="text-align: center; font-size: 12.0pt; font-weight: bold; margin-bottom: 2.0pt;">
      [ ИХ СУРГУУЛИЙН НЭР : ЖИШЭЭ НЬ ШУТИС / МУИС / ИХ ЗАСАГ / ИЗОУС ]
    </p>
    <p class="no-indent" style="text-align: center; font-size: 11.0pt; margin-bottom: 70.0pt;">
      [ МЭДЭЭЛЭЛ ТЕХНОЛОГИЙН ТЭНХИМ / САЛБАР СУРГУУЛЬ ]
    </p>

    <h1 style="font-size: 19.0pt; line-height: 1.3; margin-bottom: 18.0pt; color: #0f172a;">
      ҮЙЛДВЭРЛЭЛИЙН ДАДЛАГЫН ТАЙЛАН
    </h1>
    
    <p class="no-indent" style="text-align: center; font-size: 13.0pt; font-weight: bold; line-height: 1.5; color: #1e40af; max-width: 80%; margin: 0 auto 100.0pt auto;">
      Сэдэв: Вэб дизайны UI/UX шинэчлэл (30 дэлгэцийн Before/After аудит),<br>
      Python Flask суурьтай боловсролын систем (flask.lab) ба<br>
      Оюутны дадлагын нэгдсэн платформ (Дадлага.mn) хөгжүүлэлт
    </p>

    <table style="width: 75%; margin: 0 auto; border: none; font-size: 11.0pt;">
      <tr style="border: none;">
        <td style="border: none; width: 45%; text-align: left; padding: 4.0pt 0;"><strong>Гүйцэтгэсэн оюутан:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">............................................. / Нэр, Код /</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none; text-align: left; padding: 4.0pt 0;"><strong>Мэргэжил:</strong></td>
        <td style="border: none; text-align: left; padding: 4.0pt 0;">Мэдээллийн технологи / Программ хангамж</td>
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

    <p class="no-indent" style="text-align: center; font-size: 11.0pt; margin-top: 90.0pt;">
      <strong>УЛААНБААТАР ХОТ<br>2026 ОН</strong>
    </p>
  </div>

  <div class="page-break"></div>

  <!-- ==================== ГАРЧИГ ==================== -->
  <h1>ГАРЧИГ</h1>
  <table style="border: none; margin-top: 18.0pt;">
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ОРШИЛ</strong></td><td style="border: none; text-align: right;">3</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>НЭГДҮГЭЭР БҮЛЭГ: ДАДЛАГА ХИЙСЭН БАЙГУУЛЛАГА БА ТЕХНОЛОГИЙН СТЕК</strong></td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;1.1 Байгууллагын ерөнхий бүтэц, үйл ажиллагааны чиглэл</td><td style="border: none; text-align: right;">5</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;1.2 Мэдээллийн технологийн багийн бүтэц ба оюутны үүрэг</td><td style="border: none; text-align: right;">6</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;1.3 Техник хангамж, ашигласан программ хангамжууд (Python, Node.js, SQLite, Figma)</td><td style="border: none; text-align: right;">7</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ХОЁРДУГААР БҮЛЭГ: 45 ХОНОГИЙН ДАДЛАГЫН ТӨЛӨВЛӨГӨӨ БА БИЕЛЭЛТ</strong></td><td style="border: none; text-align: right;">8</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;2.1 45 хоногийн 7 долоо хоногийн нарийвчилсан график төлөвлөгөө</td><td style="border: none; text-align: right;">8</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;2.2 Долоо хоног бүрийн гүйцэтгэл, ажлын тайлангийн хүснэгт</td><td style="border: none; text-align: right;">9</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ГУРАВДУГААР БҮЛЭГ: ВЭБ ДИЗАЙНЫ АУДИТ БА 30 ДЭЛГЭЦИЙН ШИНЭЧЛЭЛ (BEFORE & AFTER)</strong></td><td style="border: none; text-align: right;">11</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.1 Хуучин дизайны алдааны шинжилгээ (Heuristic Evaluation)</td><td style="border: none; text-align: right;">11</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.2 Дизайн систем (Өнгөний палитр, Типографик, Grid, Elevation)</td><td style="border: none; text-align: right;">12</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;3.3 30 Харьцуулсан дэлгэцийн зураг ба дэлгэрэнгүй тайлбар</td><td style="border: none; text-align: right;">13</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Багц 1: Нүүр хуудас ба Навигацийн бүтэц (Зураг 1 - 8)</td><td style="border: none; text-align: right;">13</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Багц 2: Багш нар, Мэдээ мэдээлэл ба Картын бүтэц (Зураг 9 - 14)</td><td style="border: none; text-align: right;">17</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Багц 3: Цахим элсэлт ба Маягтуудын UX (Зураг 15 - 20)</td><td style="border: none; text-align: right;">20</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Багц 4: Админ удирдлагын хянах самбар (Зураг 21 - 24)</td><td style="border: none; text-align: right;">23</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Багц 5: Гар утасны дасан зохицол - Mobile Responsive (Зураг 25 - 30)</td><td style="border: none; text-align: right;">25</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ДӨРӨВДҮГЭЭР БҮЛЭГ: PYTHON FLASK СУУРЬТАЙ БОЛОВСРОЛЫН СИСТЕМ (FLASK.LAB)</strong></td><td style="border: none; text-align: right;">28</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;4.1 Төслийн зорилго ба бүтэц</td><td style="border: none; text-align: right;">28</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;4.2 Технологийн стек (Flask, Jinja2, college.db, UnifiedCursor)</td><td style="border: none; text-align: right;">29</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;4.3 Цахим элсэлт, Оюутны лавлах ба Админ самбарын хөгжүүлэлт</td><td style="border: none; text-align: right;">31</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ТАВДУГААР БҮЛЭГ: ОЮУТНЫ ДАДЛАГЫН НЭГДСЭН ПЛАТФОРМ (ДАДЛАГА.MN)</strong></td><td style="border: none; text-align: right;">34</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;5.1 Төслийн хэрэгцээ шаардлага ба архитектур</td><td style="border: none; text-align: right;">34</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;5.2 Технологийн шийдэл (Node.js, Express, REST API, Modern CSS)</td><td style="border: none; text-align: right;">35</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;">&nbsp;&nbsp;&nbsp;&nbsp;5.3 Гол боломжууд (Шүүлтүүр, Easy Apply, Live Preview, ATS Dashboard)</td><td style="border: none; text-align: right;">37</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ДҮГНЭЛТ</strong></td><td style="border: none; text-align: right;">40</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>АШИГЛАСАН ЭХ СУРВАЛЖ</strong></td><td style="border: none; text-align: right;">42</td></tr>
    <tr style="border: none;"><td style="border: none; padding: 4.0pt 0;"><strong>ХАВСРАЛТ (КОДЫН БҮТЭЦ)</strong></td><td style="border: none; text-align: right;">43</td></tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== ОРШИЛ ==================== -->
  <h1>ОРШИЛ</h1>
  <p>
    Мэдээллийн эрин зуунд их дээд сургуулиудын сургалтын үйл ажиллагаа болон байгууллагын үйл ажиллагааны цахим шилжилт эрчимтэй явагдаж байна. Хэрэглэгчдийн дижитал бүтээгдэхүүнтэй харилцах анхдагч орчин нь вэб браузер байдаг бөгөөд вэб хуудасны хэрэглэгчийн туршлага (UX) болон интерфэйс (UI) нь тухайн байгууллагын нэр хүнд, хэрэглэгчийн итгэлийг тогтоох хамгийн чухал хүчин зүйл болсон билээ.
  </p>
  <p>
    Энэхүү 45 хоногийн үйлдвэрлэлийн дадлагын гол зорилго нь сургуулийн танхимд эзэмшсэн програмчлалын хэл (Python, JavaScript, HTML5/CSS3) болон хэрэглэгчийн интерфейсийн орчин үеийн зарчмуудыг бодит үйлдвэрлэлийн талбарт туршин хэрэгжүүлэх, одоо ашиглагдаж буй системийн алдаа дутагдалд дүн шинжилгээ хийж, 30 үндсэн дэлгэцийг "Өмнөх ба Дараах" (Before & After) зарчмаар дахин загварчлах, мөн хоёр томоохон бие даасан системийг хөгжүүлэн нэвтрүүлэхэд оршино.
  </p>

  <h2>Дадлагын зорилтууд:</h2>
  <ol>
    <li>Байгууллагын вэб хуудсуудад Heuristic Evaluation аргачлалаар дизайн аудит хийж, хэрэглэгч ашиглахад төвөгтэй 30 алдаатай дэлгэцийг илрүүлэн баримтжуулах.</li>
    <li>Орчин үеийн өнгөний онол, типографик, уян хатан тор (Flexbox/Grid)-ийн стандартын дагуу 30 дэлгэцийг шинэчлэн засварлаж, хэрэглэгчийн сэтгэл ханамжийг нэмэгдүүлэх.</li>
    <li>Их Засаг коллежийн цахим боловсролын систем болох <strong>flask.lab</strong> (Python Flask, Jinja2, SQLite/PostgreSQL) төслийн бүтэц, цахим элсэлтийн анкет, багш нарын лавлах, админ удирдлагын самбарыг өргөтгөн хөгжүүлэх.</li>
    <li>Оюутнуудын ажил эрхлэлт, дадлага хайлтыг дэмжих зорилгоор <strong>Дадлага.mn</strong> нэртэй бие даасан, хариу үйлдэлтэй (Fully Responsive), ажил олгогчийн ATS удирдлагын самбар бүхий платформыг шинээр бүтээх.</li>
    <li>Хийж гүйцэтгэсэн ажлын үр дүн, архитектур, кодын шийдлийг нэгтгэн мэргэжлийн түвшинд баримтжуулж тайлагнах.</li>
  </ol>

  <div class="page-break"></div>

  <!-- ==================== 1-Р БҮЛЭГ ==================== -->
  <h1>НЭГДҮГЭЭР БҮЛЭГ: ДАДЛАГА ХИЙСЭН БАЙГУУЛЛАГА БА ТЕХНОЛОГИЙН СТЕК</h1>
  
  <h2>1.1 Байгууллагын ерөнхий бүтэц, үйл ажиллагааны чиглэл</h2>
  <p>
    Дадлагыг программ хангамж, вэб хөгжүүлэлт болон боловсролын мэдээллийн системийн чиглэлээр үйл ажиллагаа явуулдаг байгууллагын Мэдээлэл Технологийн Албанд 45 хоногийн хугацаанд хийж гүйцэтгэв. Байгууллага нь хэрэглэгч төвтэй дижитал бүтээгдэхүүн бүтээх зарчмыг баримталдаг бөгөөд Захиргаа, Системийн хөгжүүлэлтийн баг, UI/UX дизайны алба, Хүний нөөцийн хэлтэс гэсэн бүтэцтэйгээр үйл ажиллагаа явуулдаг.
  </p>

  <h2>1.2 Мэдээллийн технологийн багийн бүтэц ба оюутны үүрэг</h2>
  <p>
    Дадлагажигч оюутан нь Мэдээллийн технологийн албаны Ахлах хөгжүүлэгч болон UI/UX ахлах дизайнерын шууд удирдлага дор багийн гишүүнээр ажилласан. Дадлагын хүрээнд дараах үндсэн үүрэг хариуцлагыг хүлээн ажиллав:
  </p>
  <ul>
    <li>Одоогийн ашиглагдаж буй системийн алдаа дутагдалд дүн шинжилгээ хийж, сайжруулах санал боловсруулах.</li>
    <li>Figma программ дээр өндөр нарийвчлалтай (High-Fidelity) мокап болон прототайп дизайн гаргах.</li>
    <li>Python Flask хүрээ ашиглан сервер талын логик, өгөгдлийн сангийн хүснэгтүүдийг загварчлах, Jinja2 темплэйтүүдтэй холбох.</li>
    <li>JavaScript ES6+ ашиглан хэрэглэгчийн талын динамик шүүлтүүр, модал цонх, анкет илгээх үйл явцыг бодит цаг хугацаанд кодчилох.</li>
  </ul>

  <h2>1.3 Техник хангамж, ашигласан программ хангамжууд</h2>
  <p>
    Дадлагын хугацаанд дараах техник болон программ хангамжийн дэвшилтэт хэрэгслүүдийг хослуулан ашиглав:
  </p>
  <table>
    <tr>
      <th style="width: 25%;">Технологи / Багаж</th>
      <th style="width: 20%;">Хувилбар / Төрөл</th>
      <th>Төсөл дээрх үүрэг ба Ач холбогдол</th>
    </tr>
    <tr>
      <td><strong>Python</strong></td>
      <td>v3.10+</td>
      <td>flask.lab төслийн үндсэн серверийн логик, өгөгдөл боловсруулалт, чиглүүлэлт.</td>
    </tr>
    <tr>
      <td><strong>Flask Framework</strong></td>
      <td>v3.0+</td>
      <td>Хөнгөн бөгөөд уян хатан WSGI вэб серверийн бүтэц, Session болон Flash мэдэгдэл.</td>
    </tr>
    <tr>
      <td><strong>Node.js & Express</strong></td>
      <td>v24.21 / v4.19</td>
      <td>Дадлага.mn платформын өндөр хурдтай REST API сервер, статик файл түгээлт.</td>
    </tr>
    <tr>
      <td><strong>SQLite & PostgreSQL</strong></td>
      <td>SQL Database</td>
      <td>college.db болон dadlaga.sqlite өгөгдлийн сангууд (UnifiedCursor ашиглан хосолсон).</td>
    </tr>
    <tr>
      <td><strong>HTML5 / CSS3 / JS</strong></td>
      <td>Frontend Stack</td>
      <td>Семантик тэгүүд, CSS Variables, Glassmorphism, Dark/Light theme, DOM скриптүүд.</td>
    </tr>
    <tr>
      <td><strong>Figma</strong></td>
      <td>Design Tool</td>
      <td>30 харьцуулсан дэлгэцийн эх загвар, дизайн системийн өнгө, фонт стандартчилал.</td>
    </tr>
    <tr>
      <td><strong>Git / GitHub</strong></td>
      <td>Version Control</td>
      <td>Кодын хувилбар хөтлөх, Render.com үүлэн серверт автоматаар байршуулах тохиргоо.</td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== 2-Р БҮЛЭГ ==================== -->
  <h1>ХОЁРДУГААР БҮЛЭГ: 45 ХОНОГИЙН ДАДЛАГЫН ТӨЛӨВЛӨГӨӨ БА БИЕЛЭЛТ</h1>
  
  <h2>2.1 45 хоногийн 7 долоо хоногийн нарийвчилсан төлөвлөгөө</h2>
  <p>
    Дадлагын хугацаа нь нийт 45 хуанлийн хоног (ажлын 7 долоо хоног)-ийн турш шат дараалсан төлөвлөгөөний дагуу амжилттай хэрэгжиж дууссан.
  </p>

  <h2>2.2 Долоо хоног бүрийн гүйцэтгэл, үр дүнгийн тайлан</h2>
  <table>
    <tr>
      <th style="width: 15%;">Долоо хоног</th>
      <th style="width: 35%;">Төлөвлөсөн ажлууд</th>
      <th style="width: 38%;">Бодит гүйцэтгэл ба Үр дүн</th>
      <th style="width: 12%;">Биелэлт</th>
    </tr>
    <tr>
      <td><strong>1-р 7 хоног</strong><br>(1-7 хоног)</td>
      <td>• Байгууллагын дүрэм журамтай танилцах<br>• Одоогийн системд UI/UX аудит хийх<br>• flask.lab кодын бүтэцтэй танилцах</td>
      <td>Хуучин системд байгаа 30 гаруй алдаатай дэлгэцийг баримтжуулж, тайлангийн эхний бүлгийг гаргав.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>2-р 7 хоног</strong><br>(8-14 хоног)</td>
      <td>• Дизайн системийн үндэс боловсруулах<br>• Өнгөний палитр, типографик тогтоох<br>• 15 Before дэлгэцийг ангилан каталогжуулах</td>
      <td>Цэнхэр болон алтан шаргал өнгөний хослол, Inter фонт бүхий дизайн удирдамж бэлэн болгов.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>3-р 7 хоног</strong><br>(15-21 хоног)</td>
      <td>• flask.lab төслийн Redesign хийх<br>• Нүүр хуудас, Багш нар, Мэдээний хуудсын Jinja2 темплэйтүүдийг шинэчлэх</td>
      <td>Сургуулийн нүүр хуудас, удирдлагын тухай хуудсын өнгө төрхийг орчин үеийн жишигт нийцүүлэн шинэчлэв.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>4-р 7 хоног</strong><br>(22-28 хоног)</td>
      <td>• Цахим элсэлтийн анкет (apply.html)<br>• Админ самбар (admin_dashboard.html)<br>• 30 Before/After дэлгэцийн дизайныг дуусгах</td>
      <td>Оюутны баримт бичиг хуулах хэсгийг хялбарчилж, админ самбарт CSV экспорт нэмэв.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>5-р 7 хоног</strong><br>(29-35 хоног)</td>
      <td>• "Дадлага.mn" платформыг эхлүүлэх<br>• CSS хувьсагчууд, Dark/Light theme<br>• Зарын сан (internships.html) кодчилох</td>
      <td>Цэвэр CSS дизайн систем, SVG дүрслэлүүд болон түлхүүр үгийн шуурхай шүүлтүүрийг дуусгав.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>6-р 7 хоног</strong><br>(36-42 хоног)</td>
      <td>• Зар нийтлэх Live Preview систем<br>• Ажил олгогчийн ATS самбар (dashboard)<br>• Хэрэглэгчийн бүртгэл нэвтрэлт</td>
      <td>Компани зар нэмэх, ирсэн анкетуудыг шалгаж төлөв өөрчлөх, оюутан анкет илгээх логик бүрэн ажиллав.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
    <tr>
      <td><strong>7-р 7 хоног</strong><br>(43-45 хоног)</td>
      <td>• Системийн нэгдсэн туршилт (Cross-browser)<br>• Дадлагын нэгдсэн тайлан эмхэтгэх</td>
      <td>Гар утас, таблет, компьютер дээр бүрэн туршиж, 40+ хуудас бүхий дадлагын тайланг хэвлэхэд бэлэн болгов.</td>
      <td style="text-align: center;"><span class="highlight-badge">100%</span></td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== 3-Р БҮЛЭГ ==================== -->
  <h1>ГУРАВДУГААР БҮЛЭГ: ВЭБ ДИЗАЙНЫ АУДИТ БА 30 ДЭЛГЭЦИЙН ШИНЭЧЛЭЛ (BEFORE & AFTER)</h1>
  
  <h2>3.1 Хуучин дизайны алдааны шинжилгээ (Heuristic Evaluation)</h2>
  <p>
    Якоб Нильсений 10 зарчмын дагуу хуучин системд үнэлгээ хийхэд дараах гол 5 дутагдал байсан:
  </p>
  <ol>
    <li><strong>Visual Clutter (Мэдээллийн илүүдэл):</strong> Хуудас дээр зай завсаргүй текстийг чихсэн тул хэрэглэгчийн нүд ядарч, гол товчоо олохгүй байсан.</li>
    <li><strong>Типографикийн шатлалгүй байдал:</strong> Гарчиг болон их биеийн текстийн ялгарал сул, мөр хоорондын зай хэт шахуу.</li>
    <li><strong>Responsive эвдрэл:</strong> Гар утсан дээр нээхэд хуудас хажуу тийш сунаж, товчнууд жижигдэн дарахад хүндрэлтэй байсан.</li>
    <li><strong>Маягтын алдаа:</strong> Анкет бөглөх үед алдааг тодорхой зааж өгдөггүй тул хэрэглэгч шантарч хуудсыг орхидог байсан.</li>
    <li><strong>Харанхуй горим (Dark Mode) байхгүй:</strong> Оройн цагаар ажилладаг оюутнуудад зориулсан харанхуй горим дутагдалтай байв.</li>
  </ol>

  <h2>3.2 Дизайн систем (Design System Standards)</h2>
  <p>
    Шинэчилсэн бүтээгдэхүүнд орчин үеийн "Design Token" зарчмыг нэвтрүүлсэн:
  </p>
  <ul>
    <li><strong>Өнгөний палитр:</strong> Үндсэн гүн цэнхэр (<code>#1e3a8a</code> / <code>#2563eb</code>), Алтан шар (<code>#f59e0b</code>), Баталгаажуулах ногоон (<code>#10b981</code>).</li>
    <li><strong>Типографик:</strong> Inter / Plus Jakarta Sans. Мөр хоорондын зай: 1.6, Үсгийн жин: 400 (Regular), 600 (Semi-bold), 800 (Extra-bold).</li>
    <li><strong>Картын загвар:</strong> Border-radius: 12px, Soft elevation shadow, 3D Tilt микро хөдөлгөөн.</li>
  </ul>

  <h2>3.3 30 Харьцуулсан дэлгэцийн зураг ба нарийвчилсан дүн шинжилгээ</h2>
  <p>
    Дараах хэсэгт дадлагын хүрээнд шинэчилсэн 30 дэлгэцийн өмнөх ба дараах харьцуулалтыг баримтжуулав.
  </p>

  <!-- БАГЦ 1 -->
  <h3>Багц 1: Нүүр хуудас ба Навигацийн бүтэц (Зураг 1 - 8)</h3>
  
  <table class="comparison-grid">
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 1: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин цэсний скриншот зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Цэсүүд замбараагүй байрлалтай, лого хэт жижиг, гар утсан дээр товчнууд давхарладаг байсан.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 2: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ цэсний скриншот зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Glassmorphism тунгалаг эффекттэй, хуудас гүйлгэхэд дагадаг (Sticky), Dark/Light switch товчтой болсон.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 3: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин Hero Section зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Чанаргүй сток зурагтай, уриа үг уншигдахгүй, үйлдэл дуудах товч (CTA) дэвсгэртэйгээ ууссан.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 4: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ Hero Section зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Амьд гэрлийн тусгалтай Ambient дэвсгэр, шуурхай хайлтын талбар, тод харагдах товчнуудтай болсон.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 5: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин Статистик зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Статик тоонууд, ямар ч хөдөлгөөнгүй, хэрэглэгчийн итгэлийг төрүүлж чаддаггүй байв.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 6: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ Статистик тоолуурыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Гүйлгэж ирэхэд 0-ээс эхлэн гүйж өсдөг JavaScript тоолуур, баталгаажсан тоо баримтууд.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 7: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин Footer зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Холбоо барих мэдээлэл дутуу, сошиал дүрсүүд нь ажилладаггүй байсан.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 8: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ Footer зургийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> 4 баганатай бүтэц, албан ёсны хаяг байршил, тодорхой холбоосууд бүхий хөл хэсэг.
        </p>
      </td>
    </tr>
  </table>

  <!-- БАГЦ 2 -->
  <h3>Багц 2: Багш нар, Мэдээ мэдээлэл ба Картын бүтэц (Зураг 9 - 14)</h3>
  
  <table class="comparison-grid">
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 9: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин багш нарын жагсаалтыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Багш нарын зургийн хэмжээ харилцан адилгүй, эвдэрсэн харьцаатай байсан.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 10: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ багш нарын картуудыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Нэгдсэн 1:1 зургийн харьцаатай, зэрэг цол, мэргэжлийн чиглэл тодорхой бичигдсэн картууд.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 11: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин мэдээний хуудсыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Текст хэт урт, огноо харагддаггүй, зураггүй мэдээ муухай харагддаг байв.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 12: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ мэдээний картуудыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Категорийн бэдж, хуанлийн дүрс бүхий огноо, дээр нь очиход томрох микро эффект.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 13: ӨМНӨХ БАЙДАЛ (BEFORE)</div>
          <div class="image-box-hint">[ Энд хуучин хоосон хуудсыг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Дүн шинжилгээ:</strong> Илэрцгүй үед цулгуй цагаан хуудас гарч хэрэглэгчийг төөрөгдүүлдэг байв.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 14: ШИНЭЧИЛСЭН БАЙДАЛ (AFTER)</div>
          <div class="image-box-hint">[ Энд шинэ Empty State дүрслэлийг оруулна ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          <strong>Сайжруулалт:</strong> Найрсаг тайлбар бүхий вектор дүрслэл болон "Шүүлтүүрийг цэвэрлэх" сэргээх товч.
        </p>
      </td>
    </tr>
  </table>

  <!-- БАГЦ 3, 4, 5 -->
  <h3>Багц 3: Цахим элсэлт ба Маягтуудын UX (Зураг 15 - 20)</h3>
  <table class="comparison-grid">
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 15 & 17 & 19: ӨМНӨХ МАЯГТУУД (BEFORE)</div>
          <div class="image-box-hint">[ Хуучин элсэлт болон файл хуулах хэсэг ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          Нэг дор олон талбар шаардсан нүсэр бүтэцтэй, файл амжилттай орсон эсэх нь мэдэгддэггүй байсан.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 16 & 18 & 20: ШИНЭЧИЛСЭН МАЯГТУУД (AFTER)</div>
          <div class="image-box-hint">[ Шинэ алхамчилсан анкет, Drag & Drop файл ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          Алхамчилсан үе шаттай, Drag & Drop дэмждэг, баримт бичгийг хуулахад ногоон тэмдэглэгээ гардаг болсон.
        </p>
      </td>
    </tr>
  </table>

  <h3>Багц 4 & 5: Админ самбар ба Мобайл хариу үйлдэл (Зураг 21 - 30)</h3>
  <table class="comparison-grid">
    <tr>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 21, 23, 25, 27, 29 (BEFORE)</div>
          <div class="image-box-hint">[ Хуучин админ самбар ба гар утасны эвдэрсэн хувилбарууд ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          Утсан дээр хажуу тийш гүйдэг, товч нь дарагддаггүй, админ хүн оюутны материалыг хянахад цэгцгүй байв.
        </p>
      </td>
      <td>
        <div class="image-box">
          <div class="image-box-title">ЗУРАГ 22, 24, 26, 28, 30 (AFTER)</div>
          <div class="image-box-hint">[ Шинэ ATS админ самбар ба Responsive мобайл хувилбар ]</div>
        </div>
        <p class="no-indent" style="font-size: 10pt; color: #475569;">
          Төлөв өөрчлөх өнгөт систем (Шалгаж буй/Урьсан), CSV экспорт, 100% гар утсанд дасан зохицсон цэс.
        </p>
      </td>
    </tr>
  </table>

  <div class="page-break"></div>

  <!-- ==================== 4-Р БҮЛЭГ ==================== -->
  <h1>ДӨРӨВДҮГЭЭР БҮЛЭГ: PYTHON FLASK СУУРЬТАЙ БОЛОВСРОЛЫН СИСТЕМ (FLASK.LAB)</h1>
  
  <h2>4.1 Төслийн зорилго ба бүтэц</h2>
  <p>
    <strong>flask.lab</strong> нь Их Засаг коллежийн оюутны элсэлт, бүртгэл, багш нарын танилцуулга болон дотоод мэдээллийн санг удирдах зориулалттай Full-stack веб систем юм.
  </p>

  <div class="code-box">
flask.lab/
├── app.py                  # Flask үндсэн сервер (1,600+ мөр бүхий чиглүүлэлт)
├── college.db              # SQLite мэдээллийн сан
├── requirements.txt        # Шаардлагатай сангууд (Flask, psycopg2)
├── static/
│   ├── css/style.css       # Вэбийн нэгдсэн загварын CSS
│   ├── uploads/            # Оюутнуудын хуулсан баримт бичгүүд
│   └── (зураг, логонууд)   # Багш нарын зураг, мэдээний зургууд
└── templates/
    ├── base.html           # Бүх хуудасны толгой, хөл бүхий үндсэн темплэйт
    ├── index.html          # Нүүр хуудас
    ├── about.html          # Коллежийн тухай, удирдлагын мэдээлэл
    ├── apply.html          # Оюутны цахим элсэлтийн анкет
    ├── students.html       # Суралцагчдын нэгдсэн жагсаалт
    ├── admin_login.html    # Админы нэвтрэх цонх
    └── admin_dashboard.html# Анкет шалгах, CSV экспорт самбар
  </div>

  <h2>4.2 Технологийн стек ба UnifiedCursor архитектур</h2>
  <p>
    Тус төсөл дээр локал орчинд <strong>SQLite</strong> ашиглан хурдан хөгжүүлж, үүлэн серверт (Render/Heroku) байршуулах үед <strong>PostgreSQL</strong> руу ямар нэг кодын өөрчлөлтгүйгээр шууд хөрвүүлэн ажиллах тусгай <code>UnifiedCursor</code> классыг зохион бүтээсэн:
  </p>
  <div class="code-box">
# app.py дахь UnifiedCursor архитектурын хэсгээс:
class UnifiedCursor:
    def __init__(self, raw_cur, is_pg=False):
        self._cur = raw_cur
        self._is_pg = is_pg

    def _adapt_sql(self, sql):
        # PostgreSQL-д зориулсан авто-хөрвүүлэлт
        s = sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
        s = s.replace("?", "%s")
        return s
  </div>

  <h2>4.3 Цахим элсэлт, Оюутны лавлах ба Админ самбарын хөгжүүлэлт</h2>
  <p>
    Оюутан <code>apply.html</code> хуудсаар дамжуулан хувийн мэдээлэл, сонгох мэргэжил болон бүрэн дунд боловсролын гэрчилгээгээ аюулгүйгээр хуулна. Админ эрхтэй хэрэглэгч <code>admin_dashboard.html</code> самбараар дамжуулан элсэгчдийн баримтыг татан үзэж, тэнцсэн эсэх төлөвийг тохируулж, Excel/CSV хэлбэрээр тайлан татаж авах боломжтой болсон.
  </p>

  <div class="page-break"></div>

  <!-- ==================== 5-Р БҮЛЭГ ==================== -->
  <h1>ТАВДУГААР БҮЛЭГ: ОЮУТНЫ ДАДЛАГЫН НЭГДСЭН ПЛАТФОРМ (ДАДЛАГА.MN)</h1>
  
  <h2>5.1 Төслийн хэрэгцээ шаардлага ба үзэл баримтлал</h2>
  <p>
    Оюутнуудад тулгамддаг хамгийн том асуудал бол өөрийн мэргэжилд тохирсон цалинтай болон сургуулийн дадлага олох явдал юм. Үүнийг шийдвэрлэхийн тулд олон улсын <strong>Handshake</strong> болон <strong>Prosple</strong> платформуудын шилдэг туршлага дээр суурилсан <strong>"Дадлага.mn"</strong> бие даасан платформыг дадлагын явцад шинээр бүтээв.
  </p>

  <h2>5.2 Технологийн стек</h2>
  <ul>
    <li><strong>Frontend:</strong> HTML5, CSS Variables бүхий өндөр зэрэглэлийн дизайн систем, Dark/Light theme, 3D tilt карт.</li>
    <li><strong>Backend:</strong> Node.js + Express REST API (<code>server.js</code>).</li>
    <li><strong>Database:</strong> SQLite болон LocalStorage хосолсон ухаалаг Hybrid санах ой.</li>
  </ul>

  <h2>5.3 Гол модулиуд ба ажиллагаа</h2>
  <ol>
    <li><strong>Олон түвшний шүүлтүүртэй зарын сан (<code>internships.html</code>):</strong> IT, Санхүү, Маркетинг салбараар, цалинтай болон цалингүй, оффис болон зайнаас гэсэн параметрүүдээр хуудас дахин ачаалахгүйгээр шуурхай шүүнэ.</li>
    <li><strong>1-Товшилтоор анкет илгээх (Easy Apply):</strong> Оюутан төвөгтэй олон үйлдэл хийхгүйгээр нэр, утас, курс, CV линкээ оруулж 30 секундэд анкет илгээнэ.</li>
    <li><strong>Зар нийтлэх Live Preview горим (<code>post-internship.html</code>):</strong> Ажил олгогч зар бичих үед баруун талд бодит карт нь шууд зурагдаж харагдана.</li>
    <li><strong>Ажил олгогчийн ATS Самбар (<code>dashboard.html</code>):</strong> Нийтэлсэн заруудад ирсэн оюутнуудын материалыг шалгаж, "Ярилцлагад урих", "Шалгасан", "Татгалзсан" төлөвт шилжүүлнэ.</li>
  </ol>

  <div class="page-break"></div>

  <!-- ==================== ДҮГНЭЛТ ==================== -->
  <h1>ДҮГНЭЛТ</h1>
  
  <h2>6.1 Олж авсан мэдлэг, практик ур чадвар</h2>
  <p>
    45 хоногийн үйлдвэрлэлийн дадлагыг амжилттай хийж гүйцэтгэснээр дараах бодит үр дүнд хүрсэн:
  </p>
  <ul>
    <li><strong>UI/UX Аудит хийх чадвар:</strong> Бодит системийн 30 дэлгэцийн дутагдлыг илрүүлж, өмнөх ба дараах байдлаар мэргэжлийн түвшинд дахин загварчлан баримтжуулсан.</li>
    <li><strong>Хоёр томоохон Full-stack төсөл:</strong> Python Flask суурьтай <code>flask.lab</code> боловсролын систем болон Node.js суурьтай <code>Дадлага.mn</code> платформуудыг амжилттай хөгжүүлж дуусгасан.</li>
    <li><strong>Баазын олон талт туршлага:</strong> SQLite болон PostgreSQL өгөгдлийн баазыг хослуулан ашиглах, өгөгдлийн нөөцлөлт хийх аргыг эзэмшсэн.</li>
  </ul>

  <h2>6.2 Тулгарсан бэрхшээл ба шийдвэрлэсэн арга замууд</h2>
  <p>
    Дадлагын явцад гар утасны дэлгэцийн олон янзын хэмжээсээс шалтгаалан хүснэгт болон маягтын өргөн халих (Overflow) асуудал гарсан. Үүнийг шийдвэрлэхийн тулд CSS Grid-ийн <code>minmax()</code>, <code>fr</code> болон <code>clamp()</code> уян хатан функцуудыг системтэй нэвтрүүлснээр ямар ч төхөөрөмж дээр эвдрэлгүй харагддаг болгосон.
  </p>

  <h2>6.3 Цаашдын санал зөвлөмж</h2>
  <p>
    Цаашид уг системүүдэд оюутнуудын CV-г автоматаар уншиж үнэлдэг хиймэл оюун ухааны (AI) модуль нэмэх, мөн чат мэдэгдлийг имэйл болон SMS-ээр дамжуулдаг болгох нь бүтээгдэхүүний үнэ цэнийг улам бүр нэмэгдүүлнэ гэж үзэж байна.
  </p>

  <div class="page-break"></div>

  <!-- ==================== ЭХ СУРВАЛЖ ==================== -->
  <h1>АШИГЛАСАН ЭХ СУРВАЛЖ</h1>
  <ol>
    <li>Grinberg, M. (2018). <em>Flask Web Development: Developing Web Applications with Python</em>. O'Reilly Media.</li>
    <li>Nielsen, J. (1994). <em>10 Usability Heuristics for User Interface Design</em>. Nielsen Norman Group.</li>
    <li>MDN Web Docs. <em>CSS Grid Layout, Flexbox and Semantic HTML Guidelines (2025-2026)</em>.</li>
    <li>Python Software Foundation. <em>Python 3.10+ Official Documentation</em>.</li>
    <li>W3C Web Accessibility Initiative (WAI). <em>WCAG 2.1 Web Accessibility Standards</em>.</li>
    <li>Handshake & Prosple platform architectural review papers (2025-2026).</li>
  </ol>

  <!-- ==================== ХАВСРАЛТ ==================== -->
  <h1>ХАВСРАЛТ (КОДЫН БҮТЭЦ)</h1>
  <p>
    <strong>Хавсралт 1:</strong> <code>flask.lab/app.py</code> - Их Засаг коллежийн серверийн чиглүүлэлт ба UnifiedCursor класс.<br>
    <strong>Хавсралт 2:</strong> <code>dadlagiin site/server.js</code> - Дадлага.mn платформын Node.js REST API сервер.<br>
    <strong>Хавсралт 3:</strong> <code>dadlagiin site/assets/css/style.css</code> - Нэгдсэн дизайн систем, Dark/Light горим, Responsive дүрэм.
  </p>

</div>
</body>
</html>`;

  fs.writeFileSync(docPath, html, 'utf8');
  console.log(`[SUCCESS] Word Document generated: ${docPath}`);
  return docPath;
}

// 2. Also generate OpenXML .docx
function generateDocxPackage() {
  const tempDir = path.join(__dirname, 'temp_docx');
  const wordDir = path.join(tempDir, 'word');
  const relsDir = path.join(tempDir, '_rels');
  const wordRelsDir = path.join(wordDir, '_rels');

  // Clean / recreate temp folders
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(wordRelsDir, { recursive: true });
  fs.mkdirSync(relsDir, { recursive: true });

  // [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
  fs.writeFileSync(path.join(tempDir, '[Content_Types].xml'), contentTypesXml, 'utf8');

  // _rels/.rels
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
  fs.writeFileSync(path.join(relsDir, '.rels'), rootRelsXml, 'utf8');

  // word/_rels/document.xml.rels
  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  fs.writeFileSync(path.join(wordRelsDir, 'document.xml.rels'), docRelsXml, 'utf8');

  // word/styles.xml
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
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="300" w:after="150"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="28"/>
      <w:color w:val="1E40AF"/>
    </w:rPr>
  </w:style>
</w:styles>`;
  fs.writeFileSync(path.join(wordDir, 'styles.xml'), stylesXml, 'utf8');

  // Read the markdown report to construct document.xml paragraphs
  const mdContent = fs.readFileSync(path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.md'), 'utf8');
  const lines = mdContent.split('\n');

  let bodyXml = '';

  for (let line of lines) {
    line = line.trim();
    if (!line) {
      continue;
    }
    // Escape XML
    const escapeXml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    if (line.startsWith('# ')) {
      const text = escapeXml(line.replace('# ', ''));
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${text}</w:t></w:r></w:p>`;
    } else if (line.startsWith('## ')) {
      const text = escapeXml(line.replace('## ', ''));
      bodyXml += `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${text}</w:t></w:r></w:p>`;
    } else if (line.startsWith('### ')) {
      const text = escapeXml(line.replace('### ', ''));
      bodyXml += `<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
    } else if (line.startsWith('---')) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    } else {
      const cleanLine = escapeXml(line.replace(/\*\*/g, '').replace(/\*/g, ''));
      bodyXml += `<w:p><w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/></w:pPr><w:r><w:t>${cleanLine}</w:t></w:r></w:p>`;
    }
  }

  // Section properties (A4, Left 3cm, Right 2cm, Top 2cm, Bottom 2cm)
  const sectPr = `<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
  </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    ${sectPr}
  </w:body>
</w:document>`;

  fs.writeFileSync(path.join(wordDir, 'document.xml'), documentXml, 'utf8');

  const zipOutputPath = path.join(__dirname, 'temp_output.zip');
  const docxOutputPath = path.join(__dirname, 'DADLAGIIN_TAYLAN_45_HONOG.docx');
  if (fs.existsSync(zipOutputPath)) fs.unlinkSync(zipOutputPath);
  if (fs.existsSync(docxOutputPath)) fs.unlinkSync(docxOutputPath);

  // Compress to .zip using .NET ZipFile, then rename to .docx
  try {
    const psCmd = `$ProgressPreference = 'SilentlyContinue'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir.replace(/\\/g, '\\\\')}', '${zipOutputPath.replace(/\\/g, '\\\\')}'); Move-Item -Path '${zipOutputPath.replace(/\\/g, '\\\\')}' -Destination '${docxOutputPath.replace(/\\/g, '\\\\')}' -Force`;
    execSync(`powershell -Command "${psCmd}"`);
    console.log(`[SUCCESS] Native Word .docx generated: ${docxOutputPath}`);
  } catch (err) {
    console.warn(`[WARN] ZipFile notice:`, err.message);
  }

  // Clean temp folder
  fs.rmSync(tempDir, { recursive: true, force: true });
  return docxOutputPath;
}

try {
  generateDocFile();
  generateDocxPackage();
  console.log('[ALL COMPLETED] Word documents ready!');
} catch (e) {
  console.error('[ERROR]', e);
}
