# 🚀 Дадлага.mn - GitHub & Render.com руу байршуулах (Deploy) заавар

Энэхүү төсөл нь **Node.js + SQLite** суурьтай бие даасан сервер тул **Render.com, Railway, Fly.io, Heroku** зэрэг дурын үнэгүй үүлэн серверт шууд ажиллахаар бүрэн бэлтгэгдсэн.

---

## АЛХАМ 1: GitHub руу кодоо оруулах (Push to GitHub)

1. [GitHub.com](https://github.com) дээр нэвтэрч ороод баруун дээд талын **"New repository"** товчийг дарж шинэ репозитор үүсгэнэ (Жишээ нэр: `dadlagiin-site`, Public эсвэл Private).
2. Өөрийн компьютер дээрээ терминал (PowerShell) нээж төслийн хавтас дотроо дараах коммандуудыг дараалан ажиллуулна:

```bash
git init
git add .
git commit -m "feat: complete full-stack internship platform with SQLite, ATS and Auth"
git branch -M main
git remote add origin https://github.com/таны-хэрэглэгчийн-нэр/dadlagiin-site.git
git push -u origin main
```

---

## АЛХАМ 2: Render.com дээр 1 товшилтоор үнэгүй асаах (Deploy)

1. [Render.com](https://render.com) сайт руу орж **GitHub эрхээрээ нэвтэрнэ** (Sign in with GitHub).
2. Render Dashboard дээр **"New +"** товч дарж **"Web Service"** сонголтыг сонгоно.
3. Сая үүсгэсэн **`dadlagiin-site`** репозитороо сонгоод **"Connect"** товчийг дарна.
4. Тохиргооны хэсэгт дараах зүйлсийг шалгана:
   * **Name:** `dadlagiin-site` (эсвэл хүссэн нэр)
   * **Region:** `Singapore` (Монголоос хамгийн хурдан)
   * **Branch:** `main`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
   * **Instance Type:** `Free` (0$/сар)
5. Хуудасны доор байрлах **"Create Web Service"** товчийг дарна!

🎉 **1-2 минутын дараа таны веб сайт:**  
`https://dadlagiin-site.onrender.com` гэсэн албан ёсны онлайн хаягтайгаар интернэтэд бүрэн ажиллаж эхэлнэ!

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
