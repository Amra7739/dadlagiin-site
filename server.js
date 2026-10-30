/**
 * Дадлага.mn (Dadlaga.mn) - Production-Ready Full-Stack Server
 * Node.js Native SQLite Database + REST API & Static Asset Server
 * Zero fragile dependencies, high-performance, Render.com & Docker ready
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
// Connect directly to dadlaga.db in root folder
const DB_PATH = path.join(__dirname, 'dadlaga.db');

// Initialize Native SQLite Database
const db = new DatabaseSync(DB_PATH);

// Create Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'student' or 'company'
    organization TEXT,
    phone TEXT,
    school TEXT,
    major TEXT,
    year TEXT,
    bio TEXT,
    website TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    logoText TEXT,
    logoBg TEXT,
    logoColor TEXT,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    workMode TEXT NOT NULL,
    type TEXT NOT NULL,
    stipend TEXT,
    duration TEXT,
    deadline TEXT,
    postedDate TEXT,
    featured INTEGER DEFAULT 0,
    description TEXT,
    requirements TEXT, -- JSON array
    responsibilities TEXT, -- JSON array
    benefits TEXT, -- JSON array
    tags TEXT, -- JSON array
    user_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    user_id TEXT,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_school TEXT,
    applicant_major TEXT,
    applicant_year TEXT,
    cv_link TEXT,
    cv_file_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'reviewing', -- 'reviewing', 'interview', 'accepted', 'rejected'
    interview_date TEXT,
    interview_location TEXT,
    hr_notes TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    author_name TEXT NOT NULL,
    role TEXT,
    rating REAL NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    mentorship_rating REAL DEFAULT 5,
    culture_rating REAL DEFAULT 5,
    stipend_rating REAL DEFAULT 4,
    created_at TEXT NOT NULL
  );
`);

// Safe migrations for additional profile and application fields
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN website TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN cv_file_name TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN interview_date TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN interview_location TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN hr_notes TEXT`); } catch (e) {}

// Simple crypto hash helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_dadlaga_salt').digest('hex');
}

// In-Memory Token Session Store
const sessions = new Map();

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization || ''
  });
  return token;
}

function getUserFromReq(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  if (sessions.has(token)) return sessions.get(token);

  // Fallback for demo tokens so demo company and student are always recognized
  if (token.startsWith('demo-token-company') || token.includes('company')) {
    return {
      userId: 'user-company-demo',
      email: 'hr@golomtbank.com',
      name: 'Голомт Банк Хүний Нөөц',
      role: 'company',
      organization: 'Голомт Банк'
    };
  }
  if (token.startsWith('demo-token-') || token.includes('student')) {
    return {
      userId: 'user-student-demo',
      email: 'student@dadlaga.mn',
      name: 'Батболд Тэмүүлэн',
      role: 'student',
      organization: 'МУИС'
    };
  }
  return null;
}

// Seed Initial Data if Database is Fresh
function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial demo users...');
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, organization, phone, school, major, year, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Demo Student
    insertUser.run(
      'user-student-demo',
      'student@dadlaga.mn',
      hashPassword('demo123'),
      'Батболд Тэмүүлэн',
      'student',
      'МУИС',
      '99112233',
      'МУИС',
      'Программ хангамж',
      '3-р курс',
      new Date().toISOString()
    );

    // Demo Company
    insertUser.run(
      'user-company-demo',
      'hr@golomtbank.com',
      hashPassword('demo123'),
      'Голомт Банк Хүний Нөөц',
      'company',
      'Голомт Банк',
      '70111111',
      '',
      '',
      '',
      new Date().toISOString()
    );
  }

  const jobCount = db.prepare('SELECT COUNT(*) as count FROM internships').get().count;
  if (jobCount === 0) {
    console.log('Seeding initial internships from data.js...');
    try {
      const dataJsContent = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'data.js'), 'utf8');
      // Extract INITIAL_INTERNSHIPS using Function
      const sandbox = {};
      const runCode = new Function(dataJsContent + '; return INITIAL_INTERNSHIPS;');
      const initialJobs = runCode();

      const insertJob = db.prepare(`
        INSERT INTO internships (
          id, title, company, logoText, logoBg, logoColor, category,
          location, workMode, type, stipend, duration, deadline,
          postedDate, featured, description, requirements, responsibilities,
          benefits, tags, user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const j of initialJobs) {
        insertJob.run(
          j.id,
          j.title,
          j.company,
          j.logoText || j.company.substring(0, 2),
          j.logoBg || '#0f172a',
          j.logoColor || '#ffffff',
          j.category,
          j.location,
          j.workMode,
          j.type,
          j.stipend || 'Тохиролцоно',
          j.duration || '2-3 сар',
          j.deadline || '2026-12-01',
          j.postedDate || 'Шинэ',
          j.featured ? 1 : 0,
          j.description,
          JSON.stringify(j.requirements || []),
          JSON.stringify(j.responsibilities || []),
          JSON.stringify(j.benefits || []),
          JSON.stringify(j.tags || []),
          j.company === 'Голомт Банк' ? 'user-company-demo' : 'system',
          new Date().toISOString()
        );
      }
      console.log(`Successfully seeded ${initialJobs.length} internships into SQLite!`);
    } catch (e) {
      console.error('Seed error:', e);
    }
  }

  // Pre-seed sample applications for Golomt Bank so ATS looks awesome out of the box!
  const appCount = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
  if (appCount === 0) {
    console.log('Seeding sample applications for ATS...');
    const insertApp = db.prepare(`
      INSERT INTO applications (
        id, job_id, job_title, company_name, user_id,
        applicant_name, applicant_email, applicant_phone,
        applicant_school, applicant_major, applicant_year,
        cv_link, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertApp.run(
      'app-1',
      'fin-1',
      'Дата Шинжээч / Data Analyst Intern',
      'Голомт Банк',
      'user-student-demo',
      'Батболд Тэмүүлэн',
      'student@dadlaga.mn',
      '99112233',
      'МУИС',
      'Хэрэглээний математик',
      '3-р курс',
      'https://github.com/temuulen',
      'SQL, Python болон PowerBI дээр санхүүгийн төсөл хийж байсан.',
      'interview',
      new Date(Date.now() - 86400000).toISOString()
    );

    insertApp.run(
      'app-2',
      'fin-1',
      'Дата Шинжээч / Data Analyst Intern',
      'Голомт Банк',
      'user-2',
      'Сүхбаатар Ариунболд',
      'ariunbold@gmail.com',
      '99887766',
      'ШУТИС - МХТС',
      'Мэдээллийн систем',
      '4-р курс',
      'https://linkedin.com/in/ariunbold',
      'Өгөгдлийн сангийн шинжилгээний чиглэлээр дадлага хийх сонирхолтой.',
      'reviewing',
      new Date().toISOString()
    );

    insertApp.run(
      'app-3',
      'fin-2',
      'Зээлийн Шинжилгээ & Эрсдэлийн Дадлагажигч',
      'Хаан Банк',
      'user-student-demo',
      'Батболд Тэмүүлэн',
      'student@dadlaga.mn',
      '99112233',
      'МУИС',
      'Санхүү',
      '3-р курс',
      'https://drive.google.com/cv',
      'Санхүүгийн тайлан шинжилгээ хийх сонирхолтой.',
      'reviewing',
      new Date().toISOString()
    );
  }

  // Seed Initial Student Reviews for Top Employers
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (reviewCount === 0) {
    console.log('Seeding initial student reviews...');
    const insertRev = db.prepare(`
      INSERT INTO reviews (id, company_name, author_name, role, rating, title, content, pros, cons, mentorship_rating, culture_rating, stipend_rating, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRev.run(
      'rev-1',
      'Голомт Банк',
      'Б. Тэмүүлэн',
      'Дата Шинжээч дадлагажигч',
      4.9,
      'Мэргэжлийн өсөлт болон менторшип маш сайн',
      '3 сарын хугацаанд банкны бодит том дата өгөгдөл дээр ажиллаж, өгөгдлийн сангийн архитектур, PowerBI хяналтын самбар боловсруулах дадлага туршлага хуримтлуулсан. Ментор багш цаг ямагт чиглүүлж зааж өгч байсан.',
      'Уян хатан цаг, өдрийн хоолны хөнгөлөлт, 800,000₮ тэтгэлэг олгосон',
      'Ажлын ачаалал сарын эцсээр бага зэрэг ихэсдэг',
      5.0, 4.9, 4.8,
      new Date(Date.now() - 172800000).toISOString()
    );

    insertRev.run(
      'rev-2',
      'Хаан Банк',
      'М. Анударь',
      'Санхүүгийн шинжээч дадлагажигч',
      4.8,
      'Байгууллагын соёл төлөвшсөн, олон улсын стандарттай',
      'Хаан банкны төв байранд дижитал банкны чиглэлээр дадлага хийсэн. Залууст нээлттэй, шинэ санал санаачилгыг маш сайн дэмждэг.',
      'Тохилог оффис, сургалтын хөтөлбөр маш чанартай, үндсэн ажилтнаар үлдэх боломж 70%',
      'Дадлагажигчид өгөх бичиг цаасны шаардлага өндөр',
      4.8, 5.0, 4.7,
      new Date(Date.now() - 259200000).toISOString()
    );

    insertRev.run(
      'rev-3',
      'Юнител Групп',
      'Э. Төгөлдөр',
      'Frontend хөгжүүлэгч дадлагажигч',
      5.0,
      'Шилдэг технологи, залуу эрч хүчтэй баг хамт олон',
      'React, TypeScript ашиглан Юнителийн дотоод системүүдийг шинэчлэх төсөлд гар бие оролцсон. Туршлагагүй гэж гололгүй бодит код бичүүлж, Code Review хийж өгсөн нь асар их тусалсан.',
      'Сар бүр 1,000,000₮ тэтгэлэг, үнэгүй кофе, чөлөөтэй ажлын цаг, ширээний теннис',
      'Одоогоор сул тал ажиглагдаагүй',
      5.0, 5.0, 5.0,
      new Date(Date.now() - 345600000).toISOString()
    );

    insertRev.run(
      'rev-4',
      'Оюу Толгой',
      'Ц. Бат-Эрдэнэ',
      'Автоматжуулалтын инженер дадлагажигч',
      5.0,
      'Олон улсын жишиг дадлагын хөтөлбөр',
      'Уурхайн гүний болон баяжуулах үйлдвэрийн SCADA системтэй танилцсан. Хөдөлмөрийн аюулгүй ажиллагааг дээд зэргээр сахидаг.',
      '1,500,000₮ тэтгэлэг, нислэг, амрах байр, хоол бүгд 100% хангагдсан',
      '14 хоног талбар дээр ажиллах тул гэрээсээ хол байдаг',
      5.0, 5.0, 5.0,
      new Date(Date.now() - 432000000).toISOString()
    );

    insertRev.run(
      'rev-5',
      'М-Си-Эс Групп',
      'Д. Номин',
      'Хүний нөөц & Маркетинг дадлагажигч',
      4.7,
      'Монголын хамгийн том групп компанийн бүтцийг ойлгосон',
      'Эерэг уур амьсгалтай, өсөж хөгжих сургалтуудад үнэгүй хамруулдаг. Дадлагын эцэст удирдлагуудад төслөө танилцуулж сайшаал авсан.',
      'Мэргэжлийн өсөлт маш өндөр, карьер хөгжлийн боломжтой',
      'Төслийн хугацаа богино учир хурд их шаардсан',
      4.8, 4.8, 4.6,
      new Date(Date.now() - 518400000).toISOString()
    );
  }
}

seedDatabase();

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Helper to send JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Request Body Parser
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Main HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // REST API ROUTES (/api/*)
  // =========================================================================

  // 1. Auth: Register
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const body = await parseBody(req);
    const { 
      email, 
      password, 
      name, 
      role = 'student', 
      organization = '', 
      phone = '', 
      school = '', 
      major = '', 
      year = '',
      bio = '',
      website = ''
    } = body;

    if (!email || !password || !name) {
      return sendJSON(res, 400, { error: 'Имэйл, нууц үг, нэр заавал шаардлагатай.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return sendJSON(res, 400, { error: 'Имэйл хаягийн бүтэц буруу байна.' });
    }

    if (password.length < 6) {
      return sendJSON(res, 400, { error: 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.' });
    }

    try {
      const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
      if (existing) {
        return sendJSON(res, 400, { error: 'Энэ имэйл хаягаар бүртгэл үүссэн байна. Нэвтрэх хэсгээр орно уу.' });
      }

      const id = 'user-' + Date.now();
      const password_hash = hashPassword(password);
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, organization, phone, school, major, year, bio, website, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, cleanEmail, password_hash, name.trim(), role, organization.trim(), phone.trim(), school.trim(), major.trim(), year.trim(), bio.trim(), website.trim(), createdAt);

      const user = { id, email: cleanEmail, name: name.trim(), role, organization: organization.trim(), phone: phone.trim(), school: school.trim(), major: major.trim(), year: year.trim(), bio: bio.trim(), website: website.trim() };
      const token = createSession(user);

      return sendJSON(res, 201, { success: true, token, user });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 2. Auth: Login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return sendJSON(res, 400, { error: 'Имэйл болон нууц үгээ оруулна уу.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const password_hash = hashPassword(password);
    const user = db.prepare('SELECT * FROM users WHERE lower(email) = ? AND password_hash = ?').get(cleanEmail, password_hash);

    if (!user) {
      return sendJSON(res, 401, { error: 'Имэйл хаяг эсвэл нууц үг буруу байна. Шалгаад дахин оролдоно уу.' });
    }

    const token = createSession(user);
    delete user.password_hash;
    return sendJSON(res, 200, { success: true, token, user });
  }

  // 3. Auth: 1-Click Demo Login
  if (pathname === '/api/auth/demo' && req.method === 'POST') {
    const body = await parseBody(req);
    const role = body.role || 'student';

    const targetEmail = role === 'company' ? 'hr@golomtbank.com' : 'student@dadlaga.mn';
    const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(targetEmail);

    if (!user) {
      return sendJSON(res, 404, { error: 'Демо хэрэглэгч олдсонгүй.' });
    }

    const token = createSession(user);
    delete user.password_hash;
    return sendJSON(res, 200, { success: true, token, user });
  }

  // 4. Auth: Current User Info (/api/auth/me)
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const session = getUserFromReq(req);
    if (!session) {
      return sendJSON(res, 401, { error: 'Нэвтрээгүй байна.' });
    }
    const user = db.prepare('SELECT id, email, name, role, organization, phone, school, major, year, bio, website FROM users WHERE id = ?').get(session.userId);
    return sendJSON(res, 200, { user });
  }

  // 4.1. Auth: Update User Profile (/api/auth/profile)
  if (pathname === '/api/auth/profile' && req.method === 'PUT') {
    const session = getUserFromReq(req);
    if (!session) {
      return sendJSON(res, 401, { error: 'Нэвтрээгүй байна.' });
    }
    const body = await parseBody(req);
    const { name, phone, school, major, year, organization, bio, website } = body;

    try {
      db.prepare(`
        UPDATE users SET
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          school = COALESCE(?, school),
          major = COALESCE(?, major),
          year = COALESCE(?, year),
          organization = COALESCE(?, organization),
          bio = COALESCE(?, bio),
          website = COALESCE(?, website)
        WHERE id = ?
      `).run(
        name !== undefined ? name : null,
        phone !== undefined ? phone : null,
        school !== undefined ? school : null,
        major !== undefined ? major : null,
        year !== undefined ? year : null,
        organization !== undefined ? organization : null,
        bio !== undefined ? bio : null,
        website !== undefined ? website : null,
        session.userId
      );

      const user = db.prepare('SELECT id, email, name, role, organization, phone, school, major, year, bio, website FROM users WHERE id = ?').get(session.userId);
      return sendJSON(res, 200, { success: true, user });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 4.2. Auth: Change Password (/api/auth/change-password)
  if (pathname === '/api/auth/change-password' && req.method === 'POST') {
    const session = getUserFromReq(req);
    if (!session) {
      return sendJSON(res, 401, { error: 'Нэвтрээгүй байна.' });
    }
    const body = await parseBody(req);
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return sendJSON(res, 400, { error: 'Одоогийн болон шинэ нууц үгээ оруулна уу.' });
    }
    if (newPassword.length < 6) {
      return sendJSON(res, 400, { error: 'Шинэ нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.' });
    }

    const currentHash = hashPassword(currentPassword);
    const user = db.prepare('SELECT id FROM users WHERE id = ? AND password_hash = ?').get(session.userId, currentHash);
    if (!user) {
      return sendJSON(res, 400, { error: 'Одоогийн нууц үг буруу байна.' });
    }

    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, session.userId);
    return sendJSON(res, 200, { success: true, message: 'Нууц үг амжилттай солигдлоо.' });
  }

  // 4.3. Auth: Forgot Password / Password Reset (/api/auth/forgot-password)
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    const body = await parseBody(req);
    const { email } = body;
    if (!email) {
      return sendJSON(res, 400, { error: 'Имэйл хаягаа оруулна уу.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id, email, name FROM users WHERE lower(email) = ?').get(cleanEmail);
    if (!user) {
      return sendJSON(res, 404, { error: 'Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч олдсонгүй.' });
    }

    // Set temporary password for smooth recovery: "dadlaga2026"
    const tempPass = 'dadlaga2026';
    const tempHash = hashPassword(tempPass);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(tempHash, user.id);

    return sendJSON(res, 200, { 
      success: true, 
      message: `Таны түр нууц үгийг "${tempPass}" болгон шинэчиллээ. Та энэ нууц үгээр шууд нэвтэрч ороод солих боломжтой.`,
      tempPassword: tempPass
    });
  }

  // 5. Internships: List (with filters & search)
  if (pathname === '/api/internships' && req.method === 'GET') {
    const keyword = (parsedUrl.searchParams.get('keyword') || '').trim().toLowerCase();
    const category = parsedUrl.searchParams.get('category');
    const type = parsedUrl.searchParams.get('type');
    const workMode = parsedUrl.searchParams.get('workMode');

    let query = 'SELECT * FROM internships WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (workMode && workMode !== 'all') {
      query += ' AND workMode = ?';
      params.push(workMode);
    }

    query += ' ORDER BY created_at DESC';

    let rows = db.prepare(query).all(...params);

    // Parse JSON fields
    rows = rows.map(r => ({
      ...r,
      featured: Boolean(r.featured),
      requirements: JSON.parse(r.requirements || '[]'),
      responsibilities: JSON.parse(r.responsibilities || '[]'),
      benefits: JSON.parse(r.benefits || '[]'),
      tags: JSON.parse(r.tags || '[]')
    }));

    if (keyword) {
      rows = rows.filter(r => 
        r.title.toLowerCase().includes(keyword) ||
        r.company.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword) ||
        r.tags.some(t => t.toLowerCase().includes(keyword))
      );
    }

    return sendJSON(res, 200, { count: rows.length, internships: rows });
  }

  // 6. Internships: Create New
  if (pathname === '/api/internships' && req.method === 'POST') {
    try {
      const session = getUserFromReq(req);
      const body = await parseBody(req);

      const title = (body.title || '').trim();
      const company = (body.company || '').trim();
      const category = (body.category || 'Мэдээллийн технологи & Программ').trim();
      const location = (body.location || 'Улаанбаатар').trim();
      const workMode = (body.workMode || 'Оффис').trim();
      const type = (body.type || 'Цалинтай').trim();
      const stipend = (body.stipend || 'Тохиролцоно').trim();
      const duration = (body.duration || '3 сар').trim();
      const deadline = (body.deadline || '2026-12-01').trim();
      const description = (body.description || '').trim();
      const requirements = Array.isArray(body.requirements) ? body.requirements : [];
      const responsibilities = Array.isArray(body.responsibilities) ? body.responsibilities : [
        'Төслийн өдөр тутмын үйл ажиллагаанд оролцох',
        'Менторын өгсөн даалгаврыг чанартай биелүүлэх'
      ];
      const benefits = Array.isArray(body.benefits) ? body.benefits : ['Туршлага хуримтлуулах', 'Тодорхойлолт олгоно'];
      const tags = Array.isArray(body.tags) ? body.tags : [category];

      if (!title || !company) {
        return sendJSON(res, 400, { error: 'Гарчиг болон компанийн нэрийг заавал бөглөнө үү.' });
      }

      const id = 'job-' + Date.now();
      const createdAt = new Date().toISOString();
      const logoText = (company.length >= 2) ? company.substring(0, 2).toUpperCase() : (company || 'CO').toUpperCase();
      const userId = session ? session.userId : (body.user_id || 'user-company-demo');

      db.prepare(`
        INSERT INTO internships (
          id, title, company, logoText, logoBg, logoColor, category,
          location, workMode, type, stipend, duration, deadline,
          postedDate, featured, description, requirements, responsibilities,
          benefits, tags, user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        title,
        company,
        logoText,
        '#2563eb',
        '#ffffff',
        category,
        location,
        workMode,
        type,
        stipend,
        duration,
        deadline,
        'Дөнгөж сая',
        1,
        description,
        JSON.stringify(requirements),
        JSON.stringify(responsibilities),
        JSON.stringify(benefits),
        JSON.stringify(tags),
        userId,
        createdAt
      );

      return sendJSON(res, 201, {
        success: true,
        id,
        internship: {
          id, title, company, logoText, logoBg: '#2563eb', logoColor: '#ffffff',
          category, location, workMode, type, stipend, duration, deadline,
          postedDate: 'Дөнгөж сая', featured: true, description,
          requirements, responsibilities, benefits, tags, user_id: userId, created_at: createdAt
        },
        message: 'Дадлагын зар амжилттай нийтлэгдлээ!'
      });
    } catch (err) {
      console.error('Error creating internship:', err);
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 6.1. Internships: Delete
  if (pathname.startsWith('/api/internships/') && req.method === 'DELETE') {
    const parts = pathname.split('/');
    const jobId = parts[3];

    try {
      db.prepare('DELETE FROM internships WHERE id = ?').run(jobId);
      return sendJSON(res, 200, { success: true, message: 'Дадлагын зар амжилттай устгагдлаа.' });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 7. Applications: List (ATS view for company / My applications for student)
  if (pathname === '/api/applications' && req.method === 'GET') {
    const session = getUserFromReq(req);
    const userRole = session ? session.role : null;
    const companyFilter = parsedUrl.searchParams.get('company');

    let query = 'SELECT * FROM applications ORDER BY created_at DESC';
    let rows = db.prepare(query).all();

    if (userRole === 'company' && session.organization) {
      rows = rows.filter(r => r.company_name.toLowerCase().includes(session.organization.toLowerCase()));
    } else if (companyFilter) {
      rows = rows.filter(r => r.company_name.toLowerCase().includes(companyFilter.toLowerCase()));
    }

    return sendJSON(res, 200, { count: rows.length, applications: rows });
  }

  // 8. Applications: Submit New Application
  if (pathname === '/api/applications' && req.method === 'POST') {
    try {
      const session = getUserFromReq(req);
      const body = await parseBody(req);
      const {
        job_id, job_title, company_name, applicant_name, applicant_email,
        applicant_phone, applicant_school, applicant_major, applicant_year,
        cv_link, cv_file_name, notes
      } = body;

      if (!job_id || !applicant_name || !applicant_email || !applicant_phone) {
        return sendJSON(res, 400, { error: 'Анкетын үндсэн мэдээллийг бүрэн бөглөнө үү.' });
      }

      const id = 'app-' + Date.now();
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO applications (
          id, job_id, job_title, company_name, user_id, applicant_name,
          applicant_email, applicant_phone, applicant_school, applicant_major,
          applicant_year, cv_link, cv_file_name, notes, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, job_id, job_title || 'Дадлага', company_name || 'Байгууллага',
        session ? session.userId : 'guest',
        applicant_name, applicant_email, applicant_phone,
        applicant_school || '', applicant_major || '', applicant_year || '',
        cv_link || '', cv_file_name || '', notes || '', 'reviewing', createdAt
      );

      return sendJSON(res, 201, { success: true, id, message: 'Таны анкет амжилттай бүртгэгдлээ!' });
    } catch (err) {
      console.error('Error creating application:', err);
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // 8.1. Applications: Export to CSV (Excel Compatible with UTF-8 BOM)
  if (pathname === '/api/applications/export' && req.method === 'GET') {
    const session = getUserFromReq(req);
    const userRole = session ? session.role : null;
    let rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();

    if (userRole === 'company' && session.organization) {
      rows = rows.filter(r => r.company_name.toLowerCase().includes(session.organization.toLowerCase()));
    }

    const headers = ['Нэр', 'Имэйл', 'Утас', 'Сургууль', 'Мэргэжил', 'Курс', 'Дадлагын_нэр', 'Компани', 'Статус', 'Ярилцлагын_огноо', 'Ярилцлагын_байршил', 'CV_линк', 'Тэмдэглэл', 'Огноо'];
    const csvRows = [headers.join(',')];

    for (const r of rows) {
      const escape = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
      csvRows.push([
        escape(r.applicant_name),
        escape(r.applicant_email),
        escape(r.applicant_phone),
        escape(r.applicant_school),
        escape(r.applicant_major),
        escape(r.applicant_year),
        escape(r.job_title),
        escape(r.company_name),
        escape(r.status),
        escape(r.interview_date),
        escape(r.interview_location),
        escape(r.cv_link),
        escape(r.notes),
        escape(r.created_at)
      ].join(','));
    }

    // Add UTF-8 Byte Order Mark (BOM) so Microsoft Excel opens Mongolian Cyrillic with zero encoding errors
    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="anketuud_' + Date.now() + '.csv"',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(csvContent);
  }

  // 9. Applications: Update Status (Reviewing, Interview, Accepted, Rejected)
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/status') && req.method === 'PATCH') {
    const parts = pathname.split('/');
    const appId = parts[3];
    const body = await parseBody(req);
    const { status } = body;

    if (!['reviewing', 'interview', 'accepted', 'rejected'].includes(status)) {
      return sendJSON(res, 400, { error: 'Буруу статус утга.' });
    }

    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, appId);
    return sendJSON(res, 200, { success: true, message: 'Анкетын статус амжилттай шинэчлэгдлээ!' });
  }

  // 9.1. Applications: Schedule Interview
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/interview') && req.method === 'PATCH') {
    const parts = pathname.split('/');
    const appId = parts[3];
    const body = await parseBody(req);
    const { interview_date, interview_location } = body;

    if (!interview_date) {
      return sendJSON(res, 400, { error: 'Ярилцлагын огноо оруулна уу.' });
    }

    db.prepare(`
      UPDATE applications 
      SET status = 'interview', interview_date = ?, interview_location = ?
      WHERE id = ?
    `).run(interview_date, interview_location || 'Google Meet', appId);

    return sendJSON(res, 200, { success: true, message: 'Ярилцлага амжилттай товлогдлоо!' });
  }

  // 9.2. Applications: Update HR Internal Notes
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/notes') && req.method === 'PATCH') {
    const parts = pathname.split('/');
    const appId = parts[3];
    const body = await parseBody(req);
    const { hr_notes } = body;

    db.prepare('UPDATE applications SET hr_notes = ? WHERE id = ?').run(hr_notes || '', appId);
    return sendJSON(res, 200, { success: true, message: 'Тэмдэглэл хадгалагдлаа.' });
  }

  // 9.3. Reviews: List & Add (Company Reviews & Ratings - Glassdoor & Prosple style)
  if (pathname === '/api/reviews' && req.method === 'GET') {
    const company = parsedUrl.searchParams.get('company');
    let query = 'SELECT * FROM reviews';
    const params = [];
    if (company && company !== 'all') {
      query += ' WHERE company_name LIKE ?';
      params.push(`%${company}%`);
    }
    query += ' ORDER BY created_at DESC';

    const reviews = db.prepare(query).all(...params);

    // Calculate average metrics
    const totalCount = reviews.length;
    const avgRating = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '5.0';
    const avgMentorship = totalCount > 0 ? (reviews.reduce((acc, r) => acc + (r.mentorship_rating || 5), 0) / totalCount).toFixed(1) : '5.0';
    const avgCulture = totalCount > 0 ? (reviews.reduce((acc, r) => acc + (r.culture_rating || 5), 0) / totalCount).toFixed(1) : '5.0';
    const avgStipend = totalCount > 0 ? (reviews.reduce((acc, r) => acc + (r.stipend_rating || 5), 0) / totalCount).toFixed(1) : '4.8';

    return sendJSON(res, 200, {
      count: totalCount,
      avgRating,
      avgMentorship,
      avgCulture,
      avgStipend,
      reviews
    });
  }

  if (pathname === '/api/reviews' && req.method === 'POST') {
    const body = await parseBody(req);
    const {
      company_name, author_name, role, rating, title, content,
      pros = '', cons = '', mentorship_rating = 5, culture_rating = 5, stipend_rating = 5
    } = body;

    if (!company_name || !title || !content || !rating) {
      return sendJSON(res, 400, { error: 'Компани, гарчиг, сэтгэгдэл, үнэлгээ заавал шаардлагатай.' });
    }

    const id = 'rev-' + Date.now();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (
        id, company_name, author_name, role, rating, title,
        content, pros, cons, mentorship_rating, culture_rating, stipend_rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, company_name, author_name || 'Оюутан', role || 'Дадлагажигч',
      parseFloat(rating), title, content, pros, cons,
      parseFloat(mentorship_rating), parseFloat(culture_rating), parseFloat(stipend_rating), createdAt
    );

    return sendJSON(res, 201, { success: true, id, message: 'Таны сэтгэгдэл, үнэлгээ амжилттай нийтлэгдлээ!' });
  }

  // 9.4. Stipend / Salary Insights API (Comprehensive Market Analysis)
  if (pathname === '/api/stats/salary-insights' && req.method === 'GET') {
    const salaryData = [
      { category: 'Мэдээллийн технологи & Программ', avgStipend: '1,200,000₮', min: '800,000₮', max: '2,500,000₮', paidPercent: 95, topSkills: ['JavaScript', 'Python', 'React', 'SQL'] },
      { category: 'Уул уурхай, Геологи & Хүнд үйлдвэр', avgStipend: '1,450,000₮', min: '1,000,000₮', max: '2,800,000₮', paidPercent: 98, topSkills: ['AutoCAD', 'Vulcan', 'SCADA', 'HSE'] },
      { category: 'Санхүү, Банк & Нягтлан', avgStipend: '950,000₮', min: '600,000₮', max: '1,500,000₮', paidPercent: 88, topSkills: ['Financial Modeling', 'Excel Advanced', 'IFRS', 'PowerBI'] },
      { category: 'Маркетинг, Борлуулалт & PR', avgStipend: '850,000₮', min: '500,000₮', max: '1,400,000₮', paidPercent: 82, topSkills: ['Meta Ads', 'Copywriting', 'SEO', 'TikTok Content'] },
      { category: 'График дизайн, UI/UX & Мультимедиа', avgStipend: '900,000₮', min: '600,000₮', max: '1,600,000₮', paidPercent: 85, topSkills: ['Figma', 'Photoshop', 'Illustrator', 'After Effects'] },
      { category: 'Цахилгаан, Механик & Автоматжуулалт', avgStipend: '1,100,000₮', min: '800,000₮', max: '1,800,000₮', paidPercent: 92, topSkills: ['PLC', 'SolidWorks', 'Matlab', 'Circuit Design'] },
      { category: 'Барилга, Архитектур & Интерьер', avgStipend: '850,000₮', min: '500,000₮', max: '1,300,000₮', paidPercent: 80, topSkills: ['Revit', '3ds Max', 'BIM', 'AutoCAD'] },
      { category: 'Эрүүл мэнд, Эм зүй & Биотехнологи', avgStipend: '750,000₮', min: '450,000₮', max: '1,200,000₮', paidPercent: 75, topSkills: ['Clinical Research', 'GMP', 'Laboratory Analysis'] },
      { category: 'Хууль эрх зүй & Өмгөөлөл', avgStipend: '700,000₮', min: '400,000₮', max: '1,100,000₮', paidPercent: 70, topSkills: ['Contract Review', 'Legal Writing', 'Due Diligence'] },
      { category: 'Ложистик, Тээвэр & Нийлүүлэлтийн сүлжээ', avgStipend: '900,000₮', min: '600,000₮', max: '1,400,000₮', paidPercent: 84, topSkills: ['Supply Chain', 'ERP', 'Warehouse Ops'] },
      { category: 'Хүний нөөц, Олон нийтийн харилцаа', avgStipend: '750,000₮', min: '500,000₮', max: '1,200,000₮', paidPercent: 78, topSkills: ['Recruitment', 'Labor Law', 'Talent Acquisition'] },
      { category: 'Байгаль орчин, ХАА & Ногоон хөгжил', avgStipend: '800,000₮', min: '500,000₮', max: '1,300,000₮', paidPercent: 80, topSkills: ['EIA', 'GIS', 'Sustainability', 'Soil Science'] }
    ];

    return sendJSON(res, 200, {
      success: true,
      country: 'Монгол Улс',
      year: '2026',
      overallAvg: '980,000₮/сар',
      highestPaidField: 'Уул уурхай, Геологи & Хүнд үйлдвэр',
      insights: salaryData,
      salaryData
    });
  }

  // 10. Overall Stats
  if (pathname === '/api/stats' && req.method === 'GET') {
    const jobCount = db.prepare('SELECT COUNT(*) as c FROM internships').get().c;
    const appCount = db.prepare('SELECT COUNT(*) as c FROM applications').get().c;
    const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const reviewCount = db.prepare('SELECT COUNT(*) as c FROM reviews').get().c;

    return sendJSON(res, 200, {
      totalJobs: jobCount,
      totalApplications: appCount,
      totalUsers: userCount,
      totalReviews: reviewCount,
      categoriesCount: 14,
      successRate: '88%'
    });
  }

  // =========================================================================
  // STATIC FILE SERVER
  // =========================================================================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 - Not Found
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html lang="mn">
        <head><meta charset="UTF-8"><title>404 Хуудас олдсонгүй</title><link rel="stylesheet" href="/assets/css/style.css"></head>
        <body style="display:flex; align-items:center; justify-content:center; height:100vh; text-align:center;">
          <div>
            <h1 style="font-size:3rem; font-weight:800; color:var(--primary);">404</h1>
            <p style="font-size:1.2rem; margin:14px 0 24px 0;">Уучлаарай, хайсан хуудас олдсонгүй.</p>
            <a href="/" class="btn btn-primary">Нүүр хуудас руу буцах</a>
          </div>
        </body>
        </html>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

// Start listening
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Дадлага.mn Server is running on: http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (${DB_PATH})`);
  console.log(`🎓 Demo Student: student@dadlaga.mn | demo123`);
  console.log(`🏢 Demo Company: hr@golomtbank.com | demo123`);
  console.log(`=======================================================`);
});

// Guard against process crashes
process.on('uncaughtException', (err) => {
  console.error('Server Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Server Unhandled Rejection at:', promise, 'reason:', reason);
});
