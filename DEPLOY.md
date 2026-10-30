# 🚀 Дадлага.mn - GitHub & Render.com руу байршуулах (Deploy) заавар

Энэхүү төсөл нь **Node.js + SQLite** суурьтай бие даасан сервер тул **Render.com, Railway, Fly.io, Heroku** зэрэг дурын үнэгүй үүлэн серверт шууд ажиллахаар бүрэн бэлтгэгдсэн.

---

## АЛХАМ 1: GitHub руу кодоо оруулах (Push to GitHub)

> [!NOTE]
> Бид таны компьютерийн энэ хавтсанд `git init`, `git add .`, `git commit` хийж бэлдсэн байгаа тул та зөвхөн GitHub дээрх хаягаа холбоод л push хийхэд хангалттай!

1. [GitHub.com](https://github.com) руу ороод нэвтэрч, баруун дээд талын **"+" ➔ "New repository"** дарж шинэ репозитор үүсгэнэ (Жишээ нэр: `dadlaga-mn` эсвэл `dadlagiin-site`, Public эсвэл Private).
2. Үүсгэсэн репозиторынхоо URL линкийг хуулж аваад (Жишээ нь: `https://github.com/таны-нэр/dadlaga-mn.git`), өөрийн энэ хавтас дээрээ терминал (PowerShell) нээж дараах 2 коммандыг ажиллуулна:

```bash
git remote add origin https://github.com/таны-хэрэглэгчийн-нэр/dadlaga-mn.git
git push -u origin main
```

*(Хэрэв өмнө нь origin тохируулсан гэсэн алдаа гарвал `git remote set-url origin https://...` гэж бичээд `git push -u origin main` хийнэ).*

---

## АЛХАМ 2: Render.com дээр 1 товшилтоор үнэгүй холбох (Deploy)

1. [Render.com](https://render.com) сайт руу орж **"Sign in with GitHub"** товчоор нэвтэрнэ.
2. Render Dashboard дээрх цэнхэр **"New +"** товч дарж **"Web Service"**-ийг сонгоно.
3. Сая үүсгэсэн **`dadlaga-mn`** репозитороо хараад **"Connect"** дарна.
4. Тохиргооны хэсэгт:
   * **Name:** `dadlaga-mn` (Таны сайтын хаяг болно)
   * **Region:** `Singapore` (Монголоос хамгийн хурдан уншина)
   * **Branch:** `main`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Instance Type:** `Free` (0$/сар үнэгүй)
5. **Environment Variables** (Хүрээлэн буй орчны хувьсагч) хэсэгт нэмэх (заавал):
   * `NODE_VERSION` = `22.12.0`
6. Доод талын **"Deploy Web Service"** товчийг дарна!

🎉 **1-2 минутын дараа таны веб сайт:**  
`https://dadlaga-mn.onrender.com` гэсэн албан ёсны онлайн хаягтайгаар интернетэд дэлхий даяар ажиллаж эхэлнэ! Та энэ линкээ найзууддаа болон багшдаа шууд илгээх боломжтой болно.

---

## 🛠️ Локал дээр тестлэх коммандууд:

```bash
# Серверийг асаах:
node server.js

# Хөтөч дээрээ нээх:
http://localhost:3000
```

### 🔑 Бэлэн Демо Хэрэглэгчид (Testing Accounts):
* **Оюутны эрх:** `student@dadlaga.mn` / нууц үг: `demo123`
* **Компанийн эрх (Голомт Банк HR):** `hr@golomtbank.com` / нууц үг: `demo123`
