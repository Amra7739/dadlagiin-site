/**
 * Дадлага.mn (Dadlaga.mn) - Global Production-Ready Authentication & User Manager
 * Full-Stack SQLite integration, User Dropdown, Dedicated & Modal Auth, Profile Manager
 */

const API_BASE = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000'))
  ? 'http://localhost:3000'
  : '';

const Auth = {
  TOKEN_KEY: 'dadlaga_auth_token_v1',
  USER_KEY: 'dadlaga_auth_user_v1',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return Boolean(this.getToken() && this.getUser());
  },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.renderHeaderUserUI();
  },

  logout() {
    // Invalidate the server-side session too (fire and forget)
    const token = this.getToken();
    if (token) {
      try {
        fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }).catch(() => {});
      } catch (e) {}
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    if (typeof showToast === 'function') {
      showToast('Системээс амжилттай гарлаа.', 'info');
    }
    this.renderHeaderUserUI();
    // Redirect if currently on a protected page
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('post-internship.html')) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  },

  // Requires a signed-in user (optionally of a given role). Opens the login dialog otherwise.
  requireLogin(role, message) {
    const user = this.getUser();
    if (this.isLoggedIn() && (!role || user.role === role)) return true;
    if (typeof showToast === 'function') {
      if (this.isLoggedIn()) {
        showToast(role === 'student' ? 'Анкет илгээхийн тулд оюутны эрхээр нэвтэрнэ үү.' : 'Энэ үйлдлийг зөвхөн ажил олгогчийн эрхээр хийнэ.', 'error');
      } else {
        showToast(message || 'Үргэлжлүүлэхийн тулд эхлээд нэвтэрнэ үү.', 'info');
      }
    }
    if (!this.isLoggedIn()) this.openModal('login');
    return false;
  },

  // 1-Click Fast Demo Login for instant testing
  async demoLogin(role, redirectUrl) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        this.setSession(data.token, data.user);
        this.closeModal();
        if (typeof showToast === 'function') {
          showToast(`Амжилттай нэвтэрлээ: ${data.user.name}`);
        }
        setTimeout(() => {
          window.location.href = redirectUrl || (window.location.pathname.includes('login.html') ? 'dashboard.html' : window.location.href);
        }, 400);
        return;
      }
      if (typeof showToast === 'function') showToast(data.error || 'Демо хэрэглэгчээр нэвтэрч чадсангүй.', 'error');
    } catch (e) {
      if (typeof showToast === 'function') {
        showToast('Сервертэй холбогдож чадсангүй. Интернэт холболтоо шалгаад дахин оролдоно уу.', 'error');
      }
    }
  },

  // Real Email/Password Login
  async handleLogin(email, password, redirectUrl, submitBtn) {
    if (!email || !password) {
      if (typeof showToast === 'function') showToast('Имэйл болон нууц үгээ оруулна уу.', 'error');
      return;
    }

    let origText = '';
    if (submitBtn) {
      origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Нэвтэрч байна...`;
    }

    try {
      // 1. Try sending to backend server (localhost:3000)
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Имэйл эсвэл нууц үг буруу байна.');

      this.setSession(data.token, data.user);
      this.closeModal();
      if (typeof showToast === 'function') {
        showToast(`Тавтай морил, ${data.user.name}!`);
      }
      setTimeout(() => {
        window.location.href = redirectUrl || (window.location.pathname.includes('login.html') ? 'dashboard.html' : window.location.href);
      }, 500);
      return;
    } catch (err) {
      if (err.message && !err.message.toLowerCase().includes('fetch') && !err.message.toLowerCase().includes('network')) {
        if (typeof showToast === 'function') {
          showToast(err.message, 'error');
        } else {
          alert(err.message);
        }
        return;
      }

      // Server is unreachable / offline
      const msg = '⚠️ Backend сервер унтарсан байна! Өгөгдлийн сантай ажиллахын тулд "start-server.bat" эсвэл "node server.js" ажиллуулаад http://localhost:3000 хаягаар нээнэ үү.';
      if (typeof showToast === 'function') {
        showToast(msg, 'error');
      } else {
        alert(msg);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }
  },

  // Real User Registration
  async handleRegister(formData, redirectUrl, submitBtn) {
    const { email, password, confirmPassword, name, role } = formData;

    if (!email || !password || !name) {
      if (typeof showToast === 'function') showToast('Нэр, имэйл болон нууц үгээ заавал оруулна уу.', 'error');
      return;
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      if (typeof showToast === 'function') showToast('Нууц үг хоорондоо таарахгүй байна.', 'error');
      return;
    }

    if (password.length < 6) {
      if (typeof showToast === 'function') showToast('Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой.', 'error');
      return;
    }

    let origText = '';
    if (submitBtn) {
      origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Бүртгэж байна...`;
    }

    try {
      // 1. Try sending to backend server (localhost:3000)
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Бүртгүүлэхэд алдаа гарлаа.');

      this.setSession(data.token, data.user);
      this.closeModal();
      if (typeof showToast === 'function') {
        showToast(`Бүртгэл амжилттай үүслээ! Тавтай морил, ${data.user.name}`);
      }
      setTimeout(() => {
        window.location.href = redirectUrl || 'dashboard.html';
      }, 600);
      return;
    } catch (err) {
      if (err.message && !err.message.toLowerCase().includes('fetch') && !err.message.toLowerCase().includes('network')) {
        if (typeof showToast === 'function') {
          showToast(err.message, 'error');
        } else {
          alert(err.message);
        }
        return;
      }

      // Server is unreachable / offline
      const msg = '⚠️ Backend сервер унтарсан байна! Өгөгдлийг dadlaga.db санд хадгалахын тулд "start-server.bat" эсвэл "node server.js" ажиллуулаад http://localhost:3000 хаягаар нээнэ үү.';
      if (typeof showToast === 'function') {
        showToast(msg, 'error');
      } else {
        alert(msg);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }
  },

  // Update Profile
  async handleProfileUpdate(updatedData, submitBtn) {
    const token = this.getToken();
    if (!token) return;

    let origText = '';
    if (submitBtn) {
      origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Хадгалж байна...`;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Профайл шинэчлэхэд алдаа гарлаа.');

      // Update session with fresh user data
      this.setSession(token, data.user);
      this.closeProfileModal();
      if (typeof showToast === 'function') {
        showToast('Профайл мэдээлэл амжилттай шинэчлэгдлээ.');
      }
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast(err.message, 'error');
      } else {
        alert(err.message);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }
  },

  // Forgot Password / Reset (email + the phone number saved on the account)
  async handleForgotPassword(email, phone, submitBtn) {
    if (!email || !phone) {
      if (typeof showToast === 'function') showToast('Имэйл болон бүртгэлтэй утасны дугаараа оруулна уу.', 'error');
      return;
    }

    let origText = '';
    if (submitBtn) {
      origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Шалгаж байна...`;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Алдаа гарлаа.');

      alert(`✅ ${data.message}`);
      this.closeForgotPasswordModal();
      const emailInput = document.getElementById('loginEmailInput') || document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassInput') || document.getElementById('loginPassword');
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = data.tempPassword || '';
      if (!emailInput) this.openModal('login');
    } catch (err) {
      if (typeof showToast === 'function') {
        showToast(err.message, 'error');
      } else {
        alert(err.message);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }
  },

  // Password Input Visibility Toggle (Eye Icon)
  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    if (btnEl) {
      btnEl.innerHTML = isPassword ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      `;
    }
  },

  // Password Strength Meter
  evaluatePasswordStrength(password, fillElId, textElId) {
    const fillEl = document.getElementById(fillElId);
    const textEl = document.getElementById(textElId);
    if (!fillEl || !textEl) return;

    if (!password) {
      fillEl.style.width = '0%';
      fillEl.style.background = 'transparent';
      textEl.innerHTML = `<span>Нууц үгийн хүч</span><span>-</span>`;
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 25;

    let label = 'Сул';
    let color = 'var(--danger)';
    if (score >= 75) {
      label = 'Маш хүчтэй';
      color = 'var(--success)';
    } else if (score >= 50) {
      label = 'Хангалттай';
      color = 'var(--primary)';
    } else if (score >= 25) {
      label = 'Дунд зэрэг';
      color = 'var(--warning)';
    }

    fillEl.style.width = `${score}%`;
    fillEl.style.background = color;
    textEl.innerHTML = `<span>Нууц үгийн хүч:</span><span style="color:${color}; font-weight:700;">${label}</span>`;
  },

  // Dropdown Toggle in Header
  toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('headerUserDropdown');
    const pillBtn = document.getElementById('userPillBtn');
    if (dropdown) {
      const isShown = dropdown.classList.contains('show');
      dropdown.classList.toggle('show');
      if (pillBtn) pillBtn.classList.toggle('active', !isShown);
    }
  },

  // Global Header User UI Update across all pages
  renderHeaderUserUI() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    const user = this.getUser();
    const themeBtn = headerActions.querySelector('.theme-toggle');

    if (user) {
      const isCompany = user.role === 'company';
      const initial = escapeHTML((user.name || 'U').charAt(0).toUpperCase());
      const roleText = escapeHTML(isCompany ? (user.organization || 'Байгууллага') : 'Оюутан');
      const roleIcon = isCompany ? '🏢' : '🎓';
      const firstName = escapeHTML((user.name || '').split(' ')[0]);
      const fullName = escapeHTML(user.name);
      const emailSafe = escapeHTML(user.email);

      headerActions.innerHTML = `
        ${themeBtn ? themeBtn.outerHTML : ''}
        ${isCompany ? `<a href="post-internship.html" class="btn btn-outline btn-sm header-post-btn">+ Зар нийтлэх</a>` : ''}

        <!-- Notification Bell -->
        <div class="notif-wrapper" id="notifWrapper">
          <button type="button" class="notif-bell-btn" id="notifBellBtn" onclick="Auth.toggleNotifPanel(event)" aria-label="Мэдэгдлүүд">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span class="notif-badge" id="notifBadge" style="display:none;">0</span>
          </button>
          <div class="notif-panel" id="notifPanel">
            <div class="notif-panel-header">Мэдэгдлүүд</div>
            <div id="notifList"><div class="notif-empty">Ачаалж байна...</div></div>
            <a href="dashboard.html" class="notif-panel-footer">Хяналтын самбар руу очих →</a>
          </div>
        </div>
        
        <!-- User Menu Pill & Dropdown -->
        <div class="user-menu-wrapper" id="userMenuWrapper">
          <button type="button" class="user-pill-btn" id="userPillBtn" onclick="Auth.toggleUserDropdown(event)" aria-label="Хэрэглэгчийн цэс">
            <div class="user-avatar-circle" style="background:${isCompany ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'};">
              ${initial}
            </div>
            <div class="user-pill-meta">
              <span class="user-pill-name">${firstName}</span>
              <span class="user-pill-role">${roleIcon} ${roleText}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <!-- Dropdown Card -->
          <div class="user-dropdown-card" id="headerUserDropdown">
            <div class="user-dropdown-header">
              <div class="user-dropdown-header-name">${fullName}</div>
              <div class="user-dropdown-header-email">${emailSafe}</div>
              <div style="margin-top:6px;">
                <span class="badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem; padding:2px 8px;">
                  ${roleIcon} ${isCompany ? 'Ажил олгогч' : 'Оюутан / Горилогч'}
                </span>
              </div>
            </div>

            <a href="dashboard.html" class="user-dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Хяналтын самбар (ATS)
            </a>

            <button type="button" class="user-dropdown-item" onclick="Auth.openProfileModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Миний профайл засах
            </button>

            ${isCompany ? `
              <a href="post-internship.html" class="user-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Шинэ зар нийтлэх
              </a>
            ` : `
              <a href="dashboard.html" class="user-dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Миний анкетууд
              </a>
            `}

            <div class="user-dropdown-divider"></div>

            <button type="button" class="user-dropdown-item danger" onclick="Auth.logout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Системээс гарах
            </button>
          </div>
        </div>
      `;
    } else {
      headerActions.innerHTML = `
        ${themeBtn ? themeBtn.outerHTML : ''}
        <a href="post-internship.html" class="btn btn-outline btn-sm">Зар нийтлэх</a>
        <a href="login.html" class="btn btn-outline btn-sm">Нэвтрэх</a>
        <a href="register.html" class="btn btn-primary btn-sm">Бүртгүүлэх</a>
      `;
    }

    // Sync Mobile Navigation Drawer if present
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
      const mobileTheme = mobileNav.querySelector('.theme-toggle');
      if (user) {
        mobileNav.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border-light);">
            <div style="font-weight: 700; color: var(--text-main);">
              ${escapeHTML((user.name || '').split(' ')[0])} (${user.role === 'company' ? '🏢 Компани' : '🎓 Оюутан'})
            </div>
            ${mobileTheme ? mobileTheme.outerHTML : ''}
          </div>
          <a href="index.html" class="nav-link">Нүүр</a>
          <a href="internships.html" class="nav-link">Дадлагууд</a>
          <a href="companies.html" class="nav-link">Компаниуд</a>
          <a href="dashboard.html" class="nav-link">Хяналтын самбар</a>
          <a href="tips.html" class="nav-link">Зөвлөгөө & CV</a>
          <button type="button" class="btn btn-outline btn-block" onclick="Auth.openProfileModal()" style="margin-top:10px;">👤 Профайл засах</button>
          ${user.role === 'company' ? `<a href="post-internship.html" class="btn btn-primary btn-block">Зар нийтлэх</a>` : ''}
          <button type="button" class="btn btn-light btn-block" onclick="Auth.logout()" style="color:var(--danger); margin-top:8px;">🚪 Системээс гарах</button>
        `;
      } else {
        mobileNav.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border-light);">
            <span style="font-weight: 700; color: var(--text-main);">Цэс</span>
            ${mobileTheme ? mobileTheme.outerHTML : ''}
          </div>
          <a href="index.html" class="nav-link">Нүүр</a>
          <a href="internships.html" class="nav-link">Дадлагууд</a>
          <a href="companies.html" class="nav-link">Компаниуд</a>
          <a href="dashboard.html" class="nav-link">Хяналтын самбар</a>
          <a href="tips.html" class="nav-link">Зөвлөгөө & CV</a>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px;">
            <a href="login.html" class="btn btn-outline btn-block">Нэвтрэх</a>
            <a href="register.html" class="btn btn-primary btn-block">Бүртгүүлэх</a>
          </div>
        `;
      }
    }

    // Rebind theme controller
    if (typeof initTheme === 'function') {
      initTheme();
    }

    if (user) this.loadNotifications();
  },

  // ----- Notifications (derived from the user's applications) -----
  toggleNotifPanel(e) {
    if (e) e.stopPropagation();
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    const willShow = !panel.classList.contains('show');
    panel.classList.toggle('show', willShow);
    const dropdown = document.getElementById('headerUserDropdown');
    if (dropdown) dropdown.classList.remove('show');
    if (willShow) {
      // Opening the panel marks everything as read
      const user = this.getUser();
      if (user && this._notifKeys) {
        try { localStorage.setItem(`dadlaga_seen_notifs_${user.id}`, JSON.stringify(this._notifKeys)); } catch (err) {}
      }
      const badge = document.getElementById('notifBadge');
      if (badge) badge.style.display = 'none';
    }
  },

  async loadNotifications() {
    const user = this.getUser();
    const list = document.getElementById('notifList');
    if (!user || !list || typeof authFetch !== 'function') return;

    try {
      const res = await authFetch(`${API_BASE}/api/applications`);
      if (!res.ok) { list.innerHTML = '<div class="notif-empty">Мэдэгдэл байхгүй байна.</div>'; return; }
      const data = await res.json();
      const apps = data.applications || [];

      let items;
      if (user.role === 'company') {
        items = apps.filter(a => a.status === 'reviewing').slice(0, 12).map(a => ({
          key: `${a.id}:new`,
          icon: '📥',
          text: `<strong>${escapeHTML(a.applicant_name)}</strong> — ${escapeHTML(a.job_title)} дадлагад анкет илгээлээ`,
          time: a.created_at
        }));
      } else {
        const label = {
          interview: (a) => `🔵 <strong>${escapeHTML(a.company_name)}</strong> таныг <em>${escapeHTML(a.job_title)}</em> дадлагын ярилцлагад урьлаа`,
          accepted: (a) => `🎉 <strong>${escapeHTML(a.company_name)}</strong> таныг <em>${escapeHTML(a.job_title)}</em> дадлагад авлаа. Баяр хүргэе!`,
          rejected: (a) => `<strong>${escapeHTML(a.company_name)}</strong> — ${escapeHTML(a.job_title)}: энэ удаа таны анкетыг сонгосонгүй`
        };
        items = apps.filter(a => label[a.status]).slice(0, 12).map(a => ({
          key: `${a.id}:${a.status}`,
          icon: a.status === 'accepted' ? '🎉' : (a.status === 'interview' ? '📅' : '✉️'),
          text: label[a.status](a),
          time: a.interview_date || a.created_at
        }));
      }

      this._notifKeys = items.map(i => i.key);
      let seen = [];
      try { seen = JSON.parse(localStorage.getItem(`dadlaga_seen_notifs_${user.id}`) || '[]'); } catch (err) {}
      const unread = items.filter(i => !seen.includes(i.key)).length;

      list.innerHTML = items.length === 0
        ? '<div class="notif-empty">Шинэ мэдэгдэл байхгүй байна.</div>'
        : items.map(i => `
            <a href="dashboard.html" class="notif-item ${seen.includes(i.key) ? '' : 'unread'}">
              <span class="notif-item-icon">${i.icon}</span>
              <span class="notif-item-text">${i.text}</span>
            </a>`).join('');

      const badge = document.getElementById('notifBadge');
      if (badge) {
        badge.textContent = unread > 9 ? '9+' : String(unread);
        badge.style.display = unread > 0 ? 'flex' : 'none';
      }
    } catch (err) {
      list.innerHTML = '<div class="notif-empty">Мэдэгдэл ачаалж чадсангүй.</div>';
    }
  },

  // Close dropdown when clicking outside
  setupClickOutside() {
    window.addEventListener('click', (e) => {
      const dropdown = document.getElementById('headerUserDropdown');
      const pillBtn = document.getElementById('userPillBtn');
      if (dropdown && !dropdown.contains(e.target) && pillBtn && !pillBtn.contains(e.target)) {
        dropdown.classList.remove('show');
        pillBtn.classList.remove('active');
      }
      const notifPanel = document.getElementById('notifPanel');
      const notifWrap = document.getElementById('notifWrapper');
      if (notifPanel && notifWrap && !notifWrap.contains(e.target)) {
        notifPanel.classList.remove('show');
      }
    });
  },

  // Open Quick Modal (tab: 'login' or 'register')
  openModal(tab = 'login') {
    let modal = document.getElementById('authModal');
    if (!modal) {
      this.injectAuthModal();
      modal = document.getElementById('authModal');
    }
    this.switchTab(tab);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  switchTab(tab) {
    const loginForm = document.getElementById('authLoginForm');
    const regForm = document.getElementById('authRegisterForm');
    const tabLogin = document.getElementById('tabBtnLogin');
    const tabReg = document.getElementById('tabBtnRegister');

    if (tab === 'login') {
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (tabLogin) {
        tabLogin.style.borderBottom = '2px solid var(--primary)';
        tabLogin.style.color = 'var(--text-main)';
      }
      if (tabReg) {
        tabReg.style.borderBottom = 'none';
        tabReg.style.color = 'var(--text-muted)';
      }
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'block';
      if (tabLogin) {
        tabLogin.style.borderBottom = 'none';
        tabLogin.style.color = 'var(--text-muted)';
      }
      if (tabReg) {
        tabReg.style.borderBottom = '2px solid var(--primary)';
        tabReg.style.color = 'var(--text-main)';
      }
    }
  },

  // Open Profile Edit Modal
  openProfileModal() {
    const user = this.getUser();
    if (!user) {
      this.openModal('login');
      return;
    }

    let modal = document.getElementById('profileEditModal');
    if (!modal) {
      this.injectProfileModal();
      modal = document.getElementById('profileEditModal');
    }

    // Populate fields
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profPhone').value = user.phone || '';
    document.getElementById('profBio').value = user.bio || '';

    const isCompany = user.role === 'company';
    const compWrap = document.getElementById('profCompanyFields');
    const studWrap = document.getElementById('profStudentFields');

    if (isCompany) {
      if (compWrap) compWrap.style.display = 'block';
      if (studWrap) studWrap.style.display = 'none';
      document.getElementById('profOrg').value = user.organization || '';
      document.getElementById('profWebsite').value = user.website || '';
    } else {
      if (compWrap) compWrap.style.display = 'none';
      if (studWrap) studWrap.style.display = 'block';
      document.getElementById('profSchool').value = user.school || '';
      document.getElementById('profMajor').value = user.major || '';
      document.getElementById('profYear').value = user.year || '3-р курс';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeProfileModal() {
    const modal = document.getElementById('profileEditModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Open Forgot Password Modal
  openForgotPasswordModal() {
    this.closeModal();
    let modal = document.getElementById('forgotPassModal');
    if (!modal) {
      this.injectForgotPasswordModal();
      modal = document.getElementById('forgotPassModal');
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeForgotPasswordModal() {
    const modal = document.getElementById('forgotPassModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Global Auth Modal (Works on all pages without reload)
  injectAuthModal() {
    if (document.getElementById('authModal')) return;

    const modalHTML = `
      <div class="modal-backdrop" id="authModal">
        <div class="modal-box" style="max-width: 480px;">
          <div class="modal-header">
            <h3 class="modal-title">Нэвтрэх & Бүртгэл</h3>
            <button class="modal-close" onclick="Auth.closeModal()">&times;</button>
          </div>

          <div class="modal-body" style="padding-top: 14px;">
            <!-- 1-Click Fast Demo Login -->
            <div class="auth-demo-banner">
              <div class="auth-demo-title">
                <span>⚡ 1-Click Demo Login (Шуурхай тест)</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" class="btn btn-outline btn-sm" onclick="Auth.demoLogin('student')" style="background:var(--bg-surface);">
                  🎓 Оюутнаар
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="Auth.demoLogin('company')" style="background:var(--bg-surface);">
                  🏢 Компаниар
                </button>
              </div>
            </div>

            <!-- Tab Switcher -->
            <div style="display: flex; border-bottom: 1px solid var(--border-light); margin-bottom: 20px;">
              <button type="button" id="tabBtnLogin" onclick="Auth.switchTab('login')" style="flex:1; padding: 10px; background:none; border:none; border-bottom: 2px solid var(--primary); font-weight: 700; color: var(--text-main); cursor: pointer;">
                Нэвтрэх
              </button>
              <button type="button" id="tabBtnRegister" onclick="Auth.switchTab('register')" style="flex:1; padding: 10px; background:none; border:none; font-weight: 600; color: var(--text-muted); cursor: pointer;">
                Бүртгүүлэх
              </button>
            </div>

            <!-- Modal Login Form -->
            <form id="authLoginForm" onsubmit="event.preventDefault(); Auth.handleLogin(this.loginEmail.value, this.loginPassword.value, null, this.querySelector('button[type=submit]'));">
              <div class="form-group">
                <label class="form-label">Имэйл хаяг</label>
                <input type="email" id="loginEmail" class="form-control" placeholder="Жишээ: student@dadlaga.mn" required>
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <label class="form-label" style="margin-bottom:0;">Нууц үг</label>
                  <a href="javascript:void(0)" onclick="Auth.openForgotPasswordModal()" style="font-size:0.8rem; color:var(--primary); font-weight:600;">Нууц үгээ мартсан уу?</a>
                </div>
                <div class="password-input-group">
                  <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                  <button type="button" class="password-toggle-btn" onclick="Auth.togglePasswordVisibility('loginPassword', this)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block" style="margin-top: 14px;">Нэвтрэх</button>
              
              <div style="text-align: center; margin-top: 14px; font-size: 0.85rem; color: var(--text-muted);">
                Дэлгэрэнгүй хуудсаар нэвтрэх үү? <a href="login.html" style="color:var(--primary); font-weight:700;">login.html руу очих &rarr;</a>
              </div>
            </form>

            <!-- Modal Register Form -->
            <form id="authRegisterForm" style="display: none;" onsubmit="event.preventDefault(); Auth.handleRegister({
              name: this.regName.value,
              email: this.regEmail.value,
              password: this.regPassword.value,
              role: this.regRole.value,
              organization: this.regOrg ? this.regOrg.value : '',
              phone: this.regPhone.value,
              school: this.regSchool ? this.regSchool.value : '',
              major: this.regMajor ? this.regMajor.value : ''
            }, null, this.querySelector('button[type=submit]'));">

              <div class="form-group">
                <label class="form-label">Бүртгүүлэх төрөл</label>
                <select id="regRole" class="form-control" onchange="document.getElementById('modalOrgField').style.display = this.value === 'company' ? 'block' : 'none'; document.getElementById('modalStudentFields').style.display = this.value === 'company' ? 'none' : 'grid';">
                  <option value="student">🎓 Оюутан / Ажил горилогч</option>
                  <option value="company">🏢 Ажил олгогч байгууллага</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Бүтэн нэр</label>
                <input type="text" id="regName" class="form-control" placeholder="Жишээ: Батбаяр Тэмүүлэн" required>
              </div>

              <div id="modalOrgField" class="form-group" style="display: none;">
                <label class="form-label">Байгууллагын нэр</label>
                <input type="text" id="regOrg" class="form-control" placeholder="Жишээ: Голомт Банк">
              </div>

              <div class="form-group">
                <label class="form-label">Имэйл хаяг</label>
                <input type="email" id="regEmail" class="form-control" placeholder="name@example.com" required>
              </div>

              <div class="form-row form-row-2" id="modalStudentFields">
                <div class="form-group">
                  <label class="form-label">Их сургууль</label>
                  <input type="text" id="regSchool" class="form-control" placeholder="МУИС, ШУТИС г.м">
                </div>
                <div class="form-group">
                  <label class="form-label">Мэргэжил</label>
                  <input type="text" id="regMajor" class="form-control" placeholder="Программ хангамж г.м">
                </div>
              </div>

              <div class="form-row form-row-2">
                <div class="form-group">
                  <label class="form-label">Утасны дугаар</label>
                  <input type="tel" id="regPhone" class="form-control" placeholder="99112233" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Нууц үг</label>
                  <div class="password-input-group">
                    <input type="password" id="regPassword" class="form-control" placeholder="Хамгийн багадаа 6 тэмдэгт" minlength="6" required oninput="Auth.evaluatePasswordStrength(this.value, 'modalPassFill', 'modalPassText')">
                    <button type="button" class="password-toggle-btn" onclick="Auth.togglePasswordVisibility('regPassword', this)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="password-strength-wrapper" style="margin-bottom: 16px;">
                <div class="password-strength-bar">
                  <div class="password-strength-fill" id="modalPassFill"></div>
                </div>
                <div class="password-strength-text" id="modalPassText">
                  <span>Нууц үгийн хүч</span><span>-</span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block">Бүртгэл үүсгэх</button>

              <div style="text-align: center; margin-top: 14px; font-size: 0.85rem; color: var(--text-muted);">
                Дэлгэрэнгүй бүртгүүлэх үү? <a href="register.html" style="color:var(--primary); font-weight:700;">register.html руу очих &rarr;</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  // Inject Profile Edit Modal
  injectProfileModal() {
    if (document.getElementById('profileEditModal')) return;

    const modalHTML = `
      <div class="modal-backdrop" id="profileEditModal">
        <div class="modal-box" style="max-width: 520px;">
          <div class="modal-header">
            <h3 class="modal-title">👤 Профайл мэдээлэл засах</h3>
            <button class="modal-close" onclick="Auth.closeProfileModal()">&times;</button>
          </div>

          <div class="modal-body" style="padding-top: 14px;">
            <form onsubmit="event.preventDefault(); Auth.handleProfileUpdate({
              name: document.getElementById('profName').value,
              phone: document.getElementById('profPhone').value,
              bio: document.getElementById('profBio').value,
              organization: document.getElementById('profOrg') ? document.getElementById('profOrg').value : '',
              website: document.getElementById('profWebsite') ? document.getElementById('profWebsite').value : '',
              school: document.getElementById('profSchool') ? document.getElementById('profSchool').value : '',
              major: document.getElementById('profMajor') ? document.getElementById('profMajor').value : '',
              year: document.getElementById('profYear') ? document.getElementById('profYear').value : ''
            }, this.querySelector('button[type=submit]'));">

              <div class="form-group">
                <label class="form-label">Бүтэн нэр</label>
                <input type="text" id="profName" class="form-control" required>
              </div>

              <div class="form-row form-row-2">
                <div class="form-group">
                  <label class="form-label">Имэйл (Өөрчлөх боломжгүй)</label>
                  <input type="email" id="profEmail" class="form-control" disabled style="opacity: 0.7;">
                </div>
                <div class="form-group">
                  <label class="form-label">Утасны дугаар</label>
                  <input type="tel" id="profPhone" class="form-control" placeholder="99112233">
                </div>
              </div>

              <!-- Student Profile Fields -->
              <div id="profStudentFields">
                <div class="form-row form-row-2">
                  <div class="form-group">
                    <label class="form-label">Их сургууль</label>
                    <input type="text" id="profSchool" class="form-control" placeholder="МУИС">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Мэргэжил</label>
                    <input type="text" id="profMajor" class="form-control" placeholder="Программ хангамж">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Суралцаж буй курс</label>
                  <select id="profYear" class="form-control">
                    <option value="1-р курс">1-р курс</option>
                    <option value="2-р курс">2-р курс</option>
                    <option value="3-р курс">3-р курс</option>
                    <option value="4-р курс">4-р курс</option>
                    <option value="Магистрант">Магистрант</option>
                    <option value="Төгсөгч">Шинэ төгсөгч</option>
                  </select>
                </div>
              </div>

              <!-- Company Profile Fields -->
              <div id="profCompanyFields" style="display: none;">
                <div class="form-group">
                  <label class="form-label">Байгууллагын нэр</label>
                  <input type="text" id="profOrg" class="form-control" placeholder="Компанийн албан ёсны нэр">
                </div>
                <div class="form-group">
                  <label class="form-label">Вэбсайт</label>
                  <input type="url" id="profWebsite" class="form-control" placeholder="https://company.mn">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Товч танилцуулга (Bio / About)</label>
                <textarea id="profBio" class="form-control" rows="3" placeholder="Өөрийн болон байгууллагын тухай товч мэдээлэл..."></textarea>
              </div>

              <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="btn btn-outline" onclick="Auth.closeProfileModal()">Болих</button>
                <button type="submit" class="btn btn-primary">Хадгалах</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  // Inject Forgot Password Modal
  injectForgotPasswordModal() {
    if (document.getElementById('forgotPassModal')) return;

    const modalHTML = `
      <div class="modal-backdrop" id="forgotPassModal">
        <div class="modal-box" style="max-width: 440px;">
          <div class="modal-header">
            <h3 class="modal-title">🔑 Нууц үг сэргээх</h3>
            <button class="modal-close" onclick="Auth.closeForgotPasswordModal()">&times;</button>
          </div>

          <div class="modal-body" style="padding-top: 14px;">
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
              Бүртгэлтэй имэйл хаяг болон бүртгүүлэхдээ оруулсан утасны дугаараа бичнэ үү. Хоёулаа таарвал танд түр нууц үг өгнө.
            </p>
            <form onsubmit="event.preventDefault(); Auth.handleForgotPassword(document.getElementById('forgotEmailInput').value, document.getElementById('forgotPhoneInput').value, this.querySelector('button[type=submit]'));">
              <div class="form-group">
                <label class="form-label">Имэйл хаяг</label>
                <input type="email" id="forgotEmailInput" class="form-control" placeholder="name@domain.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Бүртгэлтэй утасны дугаар</label>
                <input type="tel" id="forgotPhoneInput" class="form-control" placeholder="99112233" required>
              </div>

              <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px;">
                <button type="button" class="btn btn-outline" onclick="Auth.closeForgotPasswordModal()">Болих</button>
                <button type="submit" class="btn btn-primary">Сэргээх</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
};

// Initialize Global Auth Listeners on Load
document.addEventListener('DOMContentLoaded', () => {
  Auth.injectAuthModal();
  Auth.setupClickOutside();
  Auth.renderHeaderUserUI();
});
