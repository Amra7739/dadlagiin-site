/**
 * Дадлага.mn (Dadlaga.mn) - Production-Ready Full-Stack Server
 * Node.js Native SQLite Database + REST API & Static Asset Server
 * Zero fragile dependencies, high-performance, Render.com & Docker ready
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
// Database location. Set DB_PATH (e.g. /var/data/dadlaga.db) to keep data on a persistent disk.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'dadlaga.db');
// Uploaded CV files live next to the database so they share the same persistent disk.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(path.dirname(DB_PATH), 'uploads');
try { fs.mkdirSync(path.dirname(DB_PATH), { recursive: true }); } catch (e) {}
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch (e) {}

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

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Safe migrations for additional profile and application fields
try { db.exec(`ALTER TABLE applications ADD COLUMN cv_stored TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN bio TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN website TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN cv_file_name TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN interview_date TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN interview_location TEXT`); } catch (e) {}
try { db.exec(`ALTER TABLE applications ADD COLUMN hr_notes TEXT`); } catch (e) {}

// ---------------------------------------------------------------------------
// Password hashing: scrypt with a unique random salt per user.
// Legacy SHA-256 hashes (from older versions) are still accepted and are
// transparently upgraded to scrypt the next time the user logs in.
// ---------------------------------------------------------------------------
function legacyHash(password) {
  return crypto.createHash('sha256').update(password + '_dadlaga_salt').digest('hex');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof password !== 'string') return false;
  if (stored.startsWith('scrypt$')) {
    const [, salt, hash] = stored.split('$');
    const expected = Buffer.from(hash, 'hex');
    const actual = crypto.scryptSync(password, salt, expected.length);
    return crypto.timingSafeEqual(expected, actual);
  }
  return stored === legacyHash(password);
}

// ---------------------------------------------------------------------------
// Persistent sessions (stored in SQLite so users stay logged in after restarts)
// ---------------------------------------------------------------------------
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(tokenHash(token), user.id, Date.now() + SESSION_TTL_MS, new Date().toISOString());
  return token;
}

function getBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return '';
  return authHeader.replace(/^Bearer\s+/i, '').trim();
}

function getUserFromReq(req) {
  const token = getBearerToken(req);
  if (!token) return null;
  const row = db.prepare(`
    SELECT u.id, u.email, u.name, u.role, u.organization, s.expires_at
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
  `).get(tokenHash(token));
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
    return null;
  }
  return {
    userId: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    organization: row.organization || ''
  };
}

try { db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now()); } catch (e) {}

// ---------------------------------------------------------------------------
// Tiny in-memory rate limiter (per IP + bucket) to slow down brute force
// ---------------------------------------------------------------------------
const rateBuckets = new Map();

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(req, bucket, max, windowMs) {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || entry.reset < now) {
    rateBuckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateBuckets) if (v.reset < now) rateBuckets.delete(k);
}, 60 * 1000).unref();

// Small helpers
const clip = (value, max) => String(value == null ? '' : value).trim().slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


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
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2'
};

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);

// Helper to send JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Request Body Parser (size-limited; returns { __tooLarge: true } when exceeded)
function parseBody(req, limit = 1024 * 1024) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { tooLarge = true; return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (tooLarge) return resolve({ __tooLarge: true });
      try {
        const text = Buffer.concat(chunks).toString('utf8');
        resolve(text ? JSON.parse(text) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// Auth guards (send the error response and return null when access is denied)
function requireSession(req, res, role) {
  const session = getUserFromReq(req);
  if (!session) {
    sendJSON(res, 401, { error: 'Энэ үйлдлийг хийхийн тулд нэвтэрнэ үү.' });
    return null;
  }
  if (role && session.role !== role) {
    sendJSON(res, 403, { error: role === 'company' ? 'Энэ үйлдлийг зөвхөн ажил олгогч (байгууллагын) эрхээр хийнэ.' : 'Энэ үйлдлийг зөвхөн оюутны эрхээр хийнэ.' });
    return null;
  }
  return session;
}

// Can this company session manage this application? (owner of the job, or same organization)
function companyOwnsApplication(session, app) {
  if (!session || session.role !== 'company' || !app) return false;
  const job = db.prepare('SELECT user_id, company FROM internships WHERE id = ?').get(app.job_id);
  if (job && job.user_id && job.user_id === session.userId) return true;
  const org = (session.organization || '').toLowerCase();
  const target = ((job && job.company) || app.company_name || '').toLowerCase();
  return Boolean(org && target && (target.includes(org) || org.includes(target)));
}

// Main HTTP Server
const server = http.createServer(async (req, res) => {
  // Baseline security headers for every response
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // =========================================================================
  // REST API ROUTES (/api/*)
  // =========================================================================

  // 0. Health check (used by Render / uptime monitors)
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJSON(res, 200, { ok: true, uptime: Math.round(process.uptime()) });
  }

  // 1. Auth: Register
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    if (isRateLimited(req, 'register', 10, 10 * 60 * 1000)) {
      return sendJSON(res, 429, { error: 'Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.' });
    }
    const body = await parseBody(req);
    const email = clip(body.email, 160);
    const password = typeof body.password === 'string' ? body.password : '';
    const name = clip(body.name, 120);
    const role = body.role === 'company' ? 'company' : 'student';
    const organization = clip(body.organization, 160);
    const phone = clip(body.phone, 30);
    const school = clip(body.school, 160);
    const major = clip(body.major, 160);
    const year = clip(body.year, 40);
    const bio = clip(body.bio, 1000);
    const website = clip(body.website, 200);

    if (!email || !password || !name) {
      return sendJSON(res, 400, { error: 'Имэйл, нууц үг, нэр заавал шаардлагатай.' });
    }

    const cleanEmail = email.toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      return sendJSON(res, 400, { error: 'Имэйл хаягийн бүтэц буруу байна.' });
    }

    if (password.length < 6 || password.length > 128) {
      return sendJSON(res, 400, { error: 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.' });
    }

    if (role === 'company' && !organization) {
      return sendJSON(res, 400, { error: 'Байгууллагын нэрийг заавал оруулна уу.' });
    }

    try {
      const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(cleanEmail);
      if (existing) {
        return sendJSON(res, 400, { error: 'Энэ имэйл хаягаар бүртгэл үүссэн байна. Нэвтрэх хэсгээр орно уу.' });
      }

      const id = 'user-' + crypto.randomUUID();
      const password_hash = hashPassword(password);
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, organization, phone, school, major, year, bio, website, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, cleanEmail, password_hash, name, role, organization, phone, school, major, year, bio, website, createdAt);

      const user = { id, email: cleanEmail, name, role, organization, phone, school, major, year, bio, website };
      const token = createSession(user);

      return sendJSON(res, 201, { success: true, token, user });
    } catch (err) {
      console.error('Register error:', err);
      return sendJSON(res, 500, { error: 'Бүртгэл үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.' });
    }
  }

  // 2. Auth: Login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    if (isRateLimited(req, 'login', 12, 60 * 1000)) {
      return sendJSON(res, 429, { error: 'Хэт олон удаа оролдлоо. 1 минут хүлээгээд дахин оролдоно уу.' });
    }
    const body = await parseBody(req);
    const email = clip(body.email, 160);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return sendJSON(res, 400, { error: 'Имэйл болон нууц үгээ оруулна уу.' });
    }

    const cleanEmail = email.toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(cleanEmail);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return sendJSON(res, 401, { error: 'Имэйл хаяг эсвэл нууц үг буруу байна. Шалгаад дахин оролдоно уу.' });
    }

    // Upgrade legacy SHA-256 hashes to scrypt on successful login
    if (!user.password_hash.startsWith('scrypt$')) {
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), user.id);
    }

    const token = createSession(user);
    delete user.password_hash;
    return sendJSON(res, 200, { success: true, token, user });
  }

  // 2.1. Auth: Logout (invalidate the server-side session)
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = getBearerToken(req);
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
    return sendJSON(res, 200, { success: true });
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
    const pick = (v, max) => (typeof v === 'string' ? clip(v, max) : null);
    const name = pick(body.name, 120);
    const phone = pick(body.phone, 30);
    const school = pick(body.school, 160);
    const major = pick(body.major, 160);
    const year = pick(body.year, 40);
    const organization = pick(body.organization, 160);
    const bio = pick(body.bio, 1000);
    const website = pick(body.website, 200);

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
        name || null, phone, school, major, year, organization, bio, website,
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

    const currentUser = db.prepare('SELECT id, password_hash FROM users WHERE id = ?').get(session.userId);
    if (!currentUser || !verifyPassword(String(currentPassword), currentUser.password_hash)) {
      return sendJSON(res, 400, { error: 'Одоогийн нууц үг буруу байна.' });
    }
    if (String(newPassword).length > 128) {
      return sendJSON(res, 400, { error: 'Шинэ нууц үг хэт урт байна.' });
    }

    const newHash = hashPassword(String(newPassword));
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, session.userId);
    return sendJSON(res, 200, { success: true, message: 'Нууц үг амжилттай солигдлоо.' });
  }

  // 4.3. Auth: Forgot Password / Password Reset (/api/auth/forgot-password)
  // Ownership check: the email AND the phone number saved on the account must both match.
  // (A real email/SMS one-time link needs an SMTP/SMS provider - see DEPLOY.md.)
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    if (isRateLimited(req, 'forgot', 5, 10 * 60 * 1000)) {
      return sendJSON(res, 429, { error: 'Хэт олон оролдлого хийлээ. 10 минутын дараа дахин оролдоно уу.' });
    }
    const body = await parseBody(req);
    const email = clip(body.email, 160).toLowerCase();
    const phone = clip(body.phone, 30).replace(/\D/g, '');
    if (!email || !phone) {
      return sendJSON(res, 400, { error: 'Имэйл болон бүртгэлтэй утасны дугаараа оруулна уу.' });
    }

    const user = db.prepare('SELECT id, phone FROM users WHERE lower(email) = ?').get(email);
    const storedPhone = user ? String(user.phone || '').replace(/\D/g, '') : '';
    if (!user || !storedPhone || storedPhone !== phone) {
      return sendJSON(res, 400, { error: 'Имэйл эсвэл утасны дугаар бүртгэлтэй мэдээлэлтэй таарахгүй байна.' });
    }

    const tempPass = crypto.randomBytes(6).toString('base64url');
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(tempPass), user.id);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);

    return sendJSON(res, 200, {
      success: true,
      message: `Таны түр нууц үг: ${tempPass}. Нэвтэрсний дараа профайлаасаа заавал солиорой.`,
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

  // 6. Internships: Create New (company accounts only)
  if (pathname === '/api/internships' && req.method === 'POST') {
    const session = requireSession(req, res, 'company');
    if (!session) return;
    try {
      const body = await parseBody(req);
      const list = (v, fallback) => {
        const arr = Array.isArray(v) ? v.map(x => clip(x, 300)).filter(Boolean).slice(0, 20) : [];
        return arr.length ? arr : fallback;
      };

      const title = clip(body.title, 160);
      const company = clip(body.company || session.organization || session.name, 160);
      const category = clip(body.category || 'Мэдээллийн технологи & Программ', 120);
      const location = clip(body.location || 'Улаанбаатар', 160);
      const workMode = ['Оффис', 'Зайнаас', 'Хосолсон'].includes(body.workMode) ? body.workMode : 'Оффис';
      const type = ['Цалинтай', 'Урамшуулалтай', 'Цалингүй'].includes(body.type) ? body.type : 'Цалинтай';
      const stipend = clip(body.stipend || 'Тохиролцоно', 80);
      const duration = clip(body.duration || '3 сар', 60);
      const deadline = clip(body.deadline || 'Нээлттэй', 40);
      const description = clip(body.description, 3000);

      if (title.length < 3 || !company) {
        return sendJSON(res, 400, { error: 'Дадлагын гарчиг болон байгууллагын нэрийг заавал бөглөнө үү.' });
      }

      const requirements = list(body.requirements, []);
      const responsibilities = list(body.responsibilities, [
        'Төслийн өдөр тутмын үйл ажиллагаанд оролцох',
        'Менторын өгсөн даалгаврыг чанартай биелүүлэх'
      ]);
      const benefits = list(body.benefits, ['Туршлага хуримтлуулах', 'Тодорхойлолт олгоно']);
      const tags = list(body.tags, [category]).slice(0, 8);

      const id = 'job-' + crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const logoText = company.length >= 2 ? company.substring(0, 2).toUpperCase() : company.toUpperCase();

      db.prepare(`
        INSERT INTO internships (
          id, title, company, logoText, logoBg, logoColor, category,
          location, workMode, type, stipend, duration, deadline,
          postedDate, featured, description, requirements, responsibilities,
          benefits, tags, user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, title, company, logoText, '#2563eb', '#ffffff', category,
        location, workMode, type, stipend, duration, deadline,
        'Дөнгөж сая', 1, description,
        JSON.stringify(requirements), JSON.stringify(responsibilities),
        JSON.stringify(benefits), JSON.stringify(tags),
        session.userId, createdAt
      );

      return sendJSON(res, 201, {
        success: true,
        id,
        internship: {
          id, title, company, logoText, logoBg: '#2563eb', logoColor: '#ffffff',
          category, location, workMode, type, stipend, duration, deadline,
          postedDate: 'Дөнгөж сая', featured: true, description,
          requirements, responsibilities, benefits, tags, user_id: session.userId, created_at: createdAt
        },
        message: 'Дадлагын зар амжилттай нийтлэгдлээ!'
      });
    } catch (err) {
      console.error('Error creating internship:', err);
      return sendJSON(res, 500, { error: 'Зар нийтлэхэд алдаа гарлаа. Дахин оролдоно уу.' });
    }
  }

  // 6.1. Internships: Delete (only the owner company)
  if (pathname.startsWith('/api/internships/') && req.method === 'DELETE') {
    const session = requireSession(req, res, 'company');
    if (!session) return;
    let jobId = '';
    try { jobId = decodeURIComponent(pathname.split('/')[3] || ''); } catch (e) {}

    try {
      const job = db.prepare('SELECT id, user_id, company FROM internships WHERE id = ?').get(jobId);
      if (!job) return sendJSON(res, 404, { error: 'Дадлагын зар олдсонгүй.' });

      const org = (session.organization || '').toLowerCase();
      const orgMatch = org && (job.company || '').toLowerCase().includes(org);
      const owns = job.user_id === session.userId || ((!job.user_id || job.user_id === 'system') && orgMatch);
      if (!owns) return sendJSON(res, 403, { error: 'Та зөвхөн өөрийн байгууллагын зарыг устгах эрхтэй.' });

      db.prepare('DELETE FROM internships WHERE id = ?').run(jobId);
      return sendJSON(res, 200, { success: true, message: 'Дадлагын зар амжилттай устгагдлаа.' });
    } catch (err) {
      console.error('Error deleting internship:', err);
      return sendJSON(res, 500, { error: 'Зар устгахад алдаа гарлаа.' });
    }
  }

  // 7. Applications: List (company -> its own applicants, student -> own applications)
  if (pathname === '/api/applications' && req.method === 'GET') {
    const session = requireSession(req, res);
    if (!session) return;

    let rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    if (session.role === 'company') {
      rows = rows.filter(r => companyOwnsApplication(session, r));
    } else {
      const myEmail = (session.email || '').toLowerCase();
      rows = rows
        .filter(r => r.user_id === session.userId || (r.applicant_email || '').toLowerCase() === myEmail)
        .map(r => ({ ...r, hr_notes: null })); // internal HR notes are never shown to applicants
    }
    rows = rows.map(r => {
      const { cv_stored, ...rest } = r;
      return { ...rest, has_cv_file: Boolean(cv_stored) };
    });

    return sendJSON(res, 200, { count: rows.length, applications: rows });
  }

  // 8. Applications: Submit New Application (student accounts only)
  if (pathname === '/api/applications' && req.method === 'POST') {
    const session = requireSession(req, res, 'student');
    if (!session) return;
    try {
      const body = await parseBody(req, 8 * 1024 * 1024);
      if (body.__tooLarge) {
        return sendJSON(res, 413, { error: 'Илгээсэн файл хэт том байна (5MB-аас бага байх ёстой).' });
      }

      const jobId = clip(body.job_id, 80);
      const job = db.prepare('SELECT id, title, company FROM internships WHERE id = ?').get(jobId);
      if (!job) {
        return sendJSON(res, 404, { error: 'Энэ дадлагын зар олдсонгүй эсвэл хаагдсан байна.' });
      }

      const duplicate = db.prepare('SELECT id FROM applications WHERE job_id = ? AND user_id = ?').get(job.id, session.userId);
      if (duplicate) {
        return sendJSON(res, 409, { error: 'Та энэ дадлагад аль хэдийн анкет илгээсэн байна. Төлөвийг хяналтын самбараас харна уу.' });
      }

      const applicantName = clip(body.applicant_name, 120);
      const applicantEmail = clip(body.applicant_email, 160);
      const applicantPhone = clip(body.applicant_phone, 30);
      if (!applicantName || !applicantPhone || !EMAIL_RE.test(applicantEmail)) {
        return sendJSON(res, 400, { error: 'Нэр, зөв имэйл хаяг болон утасны дугаараа бүрэн бөглөнө үү.' });
      }

      let cvLink = clip(body.cv_link, 300);
      if (cvLink && !/^https?:\/\//i.test(cvLink)) cvLink = 'https://' + cvLink;

      const id = 'app-' + crypto.randomUUID();
      const createdAt = new Date().toISOString();

      // Optional CV file upload (PDF / DOC / DOCX, max 5MB)
      let cvFileName = '';
      let cvStored = '';
      if (body.cv_file_data) {
        const originalName = clip(body.cv_file_name, 120).replace(/[^\w.\-() \u0400-\u04FF]/g, '_') || 'cv';
        const ext = path.extname(originalName).toLowerCase();
        if (!['.pdf', '.doc', '.docx'].includes(ext)) {
          return sendJSON(res, 400, { error: 'CV файл нь зөвхөн PDF, DOC, DOCX форматтай байх ёстой.' });
        }
        const base64 = String(body.cv_file_data).replace(/^data:[^;]*;base64,/, '');
        const buf = Buffer.from(base64, 'base64');
        const looksValid =
          (ext === '.pdf' && buf.slice(0, 4).toString('latin1') === '%PDF') ||
          (ext === '.docx' && buf[0] === 0x50 && buf[1] === 0x4B) ||
          (ext === '.doc' && buf[0] === 0xD0 && buf[1] === 0xCF);
        if (buf.length === 0 || buf.length > 5 * 1024 * 1024 || !looksValid) {
          return sendJSON(res, 400, { error: 'CV файл буруу эсвэл 5MB-аас том байна.' });
        }
        cvStored = id + ext;
        fs.writeFileSync(path.join(UPLOAD_DIR, cvStored), buf);
        cvFileName = originalName;
      }

      db.prepare(`
        INSERT INTO applications (
          id, job_id, job_title, company_name, user_id, applicant_name,
          applicant_email, applicant_phone, applicant_school, applicant_major,
          applicant_year, cv_link, cv_file_name, cv_stored, notes, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, job.id, job.title, job.company, session.userId,
        applicantName, applicantEmail.toLowerCase(), applicantPhone,
        clip(body.applicant_school, 160), clip(body.applicant_major, 160), clip(body.applicant_year, 40),
        cvLink, cvFileName, cvStored, clip(body.notes, 2000), 'reviewing', createdAt
      );

      return sendJSON(res, 201, { success: true, id, message: 'Таны анкет амжилттай бүртгэгдлээ!' });
    } catch (err) {
      console.error('Error creating application:', err);
      return sendJSON(res, 500, { error: 'Анкет илгээхэд алдаа гарлаа. Дахин оролдоно уу.' });
    }
  }

  // 8.1. Applications: Export to CSV (company accounts only, Excel compatible UTF-8 BOM)
  if (pathname === '/api/applications/export' && req.method === 'GET') {
    const session = requireSession(req, res, 'company');
    if (!session) return;
    const rows = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all()
      .filter(r => companyOwnsApplication(session, r));

    const headers = ['Нэр', 'Имэйл', 'Утас', 'Сургууль', 'Мэргэжил', 'Курс', 'Дадлагын_нэр', 'Компани', 'Статус', 'Ярилцлагын_огноо', 'Ярилцлагын_байршил', 'CV_линк', 'Тэмдэглэл', 'Огноо'];
    const csvRows = [headers.join(',')];

    // Escape quotes and neutralise spreadsheet formula injection (= + - @)
    const escape = (val) => {
      let s = (val || '').toString();
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };

    for (const r of rows) {
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

    // UTF-8 BOM so Microsoft Excel opens Mongolian Cyrillic correctly
    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="anketuud_' + Date.now() + '.csv"',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(csvContent);
  }

  // 8.2. Applications: Download the uploaded CV file (owning company or the applicant)
  if (/^\/api\/applications\/[^/]+\/cv$/.test(pathname) && req.method === 'GET') {
    const session = requireSession(req, res);
    if (!session) return;
    const appRow = db.prepare('SELECT * FROM applications WHERE id = ?').get(pathname.split('/')[3]);
    if (!appRow || !appRow.cv_stored) return sendJSON(res, 404, { error: 'CV файл олдсонгүй.' });

    const isOwnerStudent = appRow.user_id === session.userId;
    if (!isOwnerStudent && !companyOwnsApplication(session, appRow)) {
      return sendJSON(res, 403, { error: 'Энэ файлыг үзэх эрхгүй байна.' });
    }

    const filePath = path.join(UPLOAD_DIR, path.basename(appRow.cv_stored));
    if (!fs.existsSync(filePath)) return sendJSON(res, 404, { error: 'CV файл серверээс олдсонгүй.' });

    const ext = path.extname(filePath).toLowerCase();
    const types = { '.pdf': 'application/pdf', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(appRow.cv_file_name || ('cv' + ext))}`,
      'Cache-Control': 'private, no-store',
      'Access-Control-Allow-Origin': '*'
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Helper: load an application the signed-in company is allowed to manage
  const loadManagedApplication = (appId) => {
    const session = requireSession(req, res, 'company');
    if (!session) return null;
    const appRow = db.prepare('SELECT * FROM applications WHERE id = ?').get(appId);
    if (!appRow) { sendJSON(res, 404, { error: 'Анкет олдсонгүй.' }); return null; }
    if (!companyOwnsApplication(session, appRow)) {
      sendJSON(res, 403, { error: 'Энэ анкетыг удирдах эрх танд байхгүй байна.' });
      return null;
    }
    return appRow;
  };

  // 9. Applications: Update Status (Reviewing, Interview, Accepted, Rejected)
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/status') && req.method === 'PATCH') {
    const appRow = loadManagedApplication(pathname.split('/')[3]);
    if (!appRow) return;
    const body = await parseBody(req);
    const { status } = body;

    if (!['reviewing', 'interview', 'accepted', 'rejected'].includes(status)) {
      return sendJSON(res, 400, { error: 'Буруу статус утга.' });
    }

    db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, appRow.id);
    return sendJSON(res, 200, { success: true, message: 'Анкетын статус амжилттай шинэчлэгдлээ!' });
  }

  // 9.1. Applications: Schedule Interview
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/interview') && req.method === 'PATCH') {
    const appRow = loadManagedApplication(pathname.split('/')[3]);
    if (!appRow) return;
    const body = await parseBody(req);
    const interviewDate = clip(body.interview_date, 40);

    if (!interviewDate || Number.isNaN(Date.parse(interviewDate))) {
      return sendJSON(res, 400, { error: 'Ярилцлагын огноо, цагийг зөв оруулна уу.' });
    }

    db.prepare(`
      UPDATE applications 
      SET status = 'interview', interview_date = ?, interview_location = ?
      WHERE id = ?
    `).run(interviewDate, clip(body.interview_location, 200) || 'Google Meet', appRow.id);

    return sendJSON(res, 200, { success: true, message: 'Ярилцлага амжилттай товлогдлоо!' });
  }

  // 9.2. Applications: Update HR Internal Notes
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/notes') && req.method === 'PATCH') {
    const appRow = loadManagedApplication(pathname.split('/')[3]);
    if (!appRow) return;
    const body = await parseBody(req);

    db.prepare('UPDATE applications SET hr_notes = ? WHERE id = ?').run(clip(body.hr_notes, 2000), appRow.id);
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
    const session = requireSession(req, res, 'student');
    if (!session) return;
    const body = await parseBody(req);
    const company_name = clip(body.company_name, 160);
    const title = clip(body.title, 160);
    const content = clip(body.content, 3000);
    const rating = Math.min(5, Math.max(1, parseFloat(body.rating) || 0));
    const pros = clip(body.pros, 500);
    const cons = clip(body.cons, 500);
    const score = (v) => Math.min(5, Math.max(1, parseFloat(v) || 5));

    if (!company_name || !title || !content || !body.rating) {
      return sendJSON(res, 400, { error: 'Компани, гарчиг, сэтгэгдэл, үнэлгээ заавал шаардлагатай.' });
    }

    const id = 'rev-' + crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO reviews (
        id, company_name, author_name, role, rating, title,
        content, pros, cons, mentorship_rating, culture_rating, stipend_rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, company_name, clip(body.author_name, 80) || session.name, clip(body.role, 120) || 'Дадлагажигч',
      rating, title, content, pros, cons,
      score(body.mentorship_rating), score(body.culture_rating), score(body.stipend_rating), createdAt
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

  // Unknown API routes return JSON, not an HTML page
  if (pathname.startsWith('/api/')) {
    return sendJSON(res, 404, { error: 'API хаяг олдсонгүй.' });
  }

  // =========================================================================
  // STATIC FILE SERVER (whitelist only: HTML pages in the root + /assets/*)
  // The database, server code, uploads and dotfiles are never served.
  // =========================================================================
  const sendNotFound = () => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="mn">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>404 - Хуудас олдсонгүй | Дадлага.mn</title><link rel="stylesheet" href="/assets/css/style.css"></head>
<body style="display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:24px;">
  <div>
    <div style="font-size:4.5rem; font-weight:800; color:var(--primary); line-height:1;">404</div>
    <p style="font-size:1.2rem; margin:14px 0 8px 0; font-weight:700;">Уучлаарай, хайсан хуудас олдсонгүй.</p>
    <p style="color:var(--text-muted); margin-bottom:24px;">Хаяг буруу эсвэл хуудас устгагдсан байж магадгүй.</p>
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
      <a href="/" class="btn btn-primary">Нүүр хуудас</a>
      <a href="/internships.html" class="btn btn-outline">Дадлага хайх</a>
    </div>
  </div>
</body>
</html>`);
  };

  let decodedPath;
  try { decodedPath = decodeURIComponent(pathname); } catch (e) { return sendNotFound(); }
  if (decodedPath.includes('\0') || decodedPath.includes('..') || decodedPath.includes('\\')) return sendNotFound();
  if (decodedPath === '/') decodedPath = '/index.html';

  const segments = decodedPath.split('/').filter(Boolean);
  const ext = path.extname(decodedPath).toLowerCase();
  const isAsset = segments[0] === 'assets' && segments.length >= 2;
  const isRootPage = segments.length === 1 && ['.html', '.txt', '.xml', '.ico', '.png', '.svg', '.webp'].includes(ext);
  const hasDotSegment = segments.some(seg => seg.startsWith('.'));
  if (!MIME_TYPES[ext] || hasDotSegment || !(isAsset || isRootPage)) return sendNotFound();

  const filePath = path.join(__dirname, decodedPath);
  if (!filePath.startsWith(__dirname + path.sep)) return sendNotFound();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) return sendNotFound();

    const etag = '"' + stats.size.toString(16) + '-' + Math.floor(stats.mtimeMs).toString(16) + '"';
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, { ETag: etag });
      return res.end();
    }

    const headers = {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'ETag': etag
    };

    const stream = fs.createReadStream(filePath);
    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(200, headers);
      stream.pipe(zlib.createGzip()).pipe(res);
    } else {
      headers['Content-Length'] = stats.size;
      res.writeHead(200, headers);
      stream.pipe(res);
    }
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
