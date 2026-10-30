/**
 * Дадлага.mn (Dadlaga.mn) - Next-Gen Interactive Core Script
 * Theme Switcher, Ambient Background, Card 3D Tilt, Animated Counter,
 * Filtering, Easy Apply, Bookmarking, and Toast Notifications
 */

// Global API Base URL (Supports http://localhost:3000, other dev ports, and file:// protocol)
const API_BASE_URL = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000'))
  ? 'http://localhost:3000'
  : '';

// SVG Icon Pack (Clean, crisp, standalone vector graphics)
const ICONS = {
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  bookmarkFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  sparkle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  clock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  bank: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/></svg>`,
  palette: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/></svg>`,
  building: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`,
  wrench: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  cpu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>`,
  heartPulse: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 11l6 5.5"/></svg>`,
  scale: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>`,
  users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  compass: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  graduationCap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  leaf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/></svg>`
};

// ==========================================================================
// 1. Theme Controller (Dark / Light Mode with LocalStorage memory)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('dadlaga_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonUI(savedTheme);

  // Bind all theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('dadlaga_theme', next);
  updateThemeButtonUI(next);
  showToast(next === 'dark' ? '🌙 Харанхуй горим идэвхжлээ' : '☀️ Гэрэлтэй горим идэвхжлээ', 'info');
}

function updateThemeButtonUI(theme) {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Гэрэлтэй горим руу шилжих' : 'Харанхуй горим руу шилжих');
  });
}

// ==========================================================================
// 2. Ambient Mesh Background Injector
// ==========================================================================
function initAmbientBackground() {
  if (document.querySelector('.ambient-bg')) return;
  const ambientDiv = document.createElement('div');
  ambientDiv.className = 'ambient-bg';
  ambientDiv.innerHTML = `
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>
    <div class="grid-overlay"></div>
  `;
  document.body.prepend(ambientDiv);
}

// ==========================================================================
// 3. Animated Number Counters
// ==========================================================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.getAttribute('data-target') || el.innerText;
        const targetNumber = parseInt(rawText.replace(/[^0-9]/g, '')) || 0;
        const suffix = rawText.replace(/[0-9,]/g, '');

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeOut * targetNumber);

          el.innerHTML = currentVal.toLocaleString() + `<span>${suffix}</span>`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.innerHTML = targetNumber.toLocaleString() + `<span>${suffix}</span>`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => {
    counter.setAttribute('data-target', counter.innerText.trim());
    counter.innerText = '0';
    observer.observe(counter);
  });
}

// ==========================================================================
// 4. Interactive 3D Card Hover Tilt (Subtle, sleek)
// ==========================================================================
function initCardTilt() {
  const cards = document.querySelectorAll('.job-card, .category-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;
      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ==========================================================================
// 5. Toast Notification System
// ==========================================================================
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span style="display:flex; align-items:center;">${type === 'success' ? ICONS.check : type === 'error' ? '⚠️' : '✨'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px) scale(0.95)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 6. Job Card HTML Generation with High-End Badge System
// ==========================================================================
function createJobCardHTML(job) {
  if (!job) return '';
  const savedIds = typeof getSavedJobIds === 'function' ? getSavedJobIds() : [];
  const isSaved = savedIds.includes(job.id);

  let typeBadgeClass = 'badge-paid';
  if (job.type === 'Цалингүй') typeBadgeClass = 'badge-unpaid';
  if (job.type === 'Урамшуулалтай') typeBadgeClass = 'badge-paid';

  const tagsHTML = (job.tags || []).slice(0, 3).map(t => 
    `<span class="badge" style="background:var(--bg-subtle); color:var(--text-muted);">#${t}</span>`
  ).join('');

  const company = job.company || 'Байгууллага';
  const logoText = job.logoText || (company.length >= 2 ? company.substring(0, 2).toUpperCase() : 'CO');

  const isRecent = job.postedDate === 'Дөнгөж сая' || (job.created_at && (Date.now() - new Date(job.created_at).getTime()) < 86400000);
  const newBadge = isRecent ? `<span class="badge" style="background:rgba(37,99,235,0.15); color:var(--primary); font-weight:800; border:1px solid var(--border-glow);">✨ Шинэ</span>` : '';

  return `
    <div class="job-card ${job.featured ? 'featured-card' : ''}" onclick="openJobDetailModal('${job.id}')">
      <div class="job-card-header">
        <div class="company-badge">
          <div class="company-logo" style="background-color: ${job.logoBg || '#0f172a'}; color: ${job.logoColor || '#ffffff'}">
            ${logoText}
          </div>
          <div class="company-info">
            <h4>${company}</h4>
            <span>${job.location || 'Улаанбаатар'}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          ${newBadge}
          <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="handleBookmarkClick(event, '${job.id}')" title="Хадгалах">
            ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
          </button>
        </div>
      </div>

      <h3 class="job-title">${job.title || 'Дадлагажигч'}</h3>
      <p class="job-description-short">${job.description || ''}</p>

      <div class="job-tags">
        <span class="badge ${typeBadgeClass}">${job.type || 'Цалинтай'}</span>
        <span class="badge badge-remote">${job.workMode || 'Оффис'}</span>
        <span class="badge badge-category">${job.category || 'Мэдээллийн технологи'}</span>
        ${tagsHTML}
      </div>

      <div class="job-card-footer">
        <div class="job-stipend">
          <span>Стипенд / Цалин</span>
          ${job.stipend || 'Тохиролцоно'}
        </div>
        <div class="job-date">
          ${ICONS.clock} ${job.duration || '2-3 сар'}
        </div>
      </div>
    </div>
  `;
}

// Handle Bookmark Toggle
function handleBookmarkClick(event, jobId) {
  event.stopPropagation();
  const isSaved = toggleSavedJobId(jobId);
  const btn = event.currentTarget;
  if (isSaved) {
    btn.classList.add('saved');
    btn.innerHTML = ICONS.bookmarkFilled;
    showToast('Дадлагын зарыг хадгаллаа!');
  } else {
    btn.classList.remove('saved');
    btn.innerHTML = ICONS.bookmark;
    showToast('Хадгалсан заруудаас хаслаа.', 'info');
  }
}

// ==========================================================================
// 7. Modals: Detail View & Easy Apply (International Standard)
// ==========================================================================
let currentDetailJob = null;
let currentUploadedCvFile = null;

function calculateMatchScore(job) {
  if (!job) return 85;
  let score = 85;
  if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
    const user = Auth.getUser();
    if (user) {
      const cat = (job.category || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      const major = (user.major || '').toLowerCase();
      if (major && (cat.includes(major) || title.includes(major))) {
        score += 10;
      }
      if (user.school) score += 3;
    }
  }
  return Math.min(score, 98);
}

function copyJobLink(jobId) {
  const url = `${window.location.origin}/internships.html?keyword=${encodeURIComponent(jobId)}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast('🔗 Зарын холбоосыг хууллаа! Найзуудтайгаа хуваалцаарай.');
  }).catch(() => {
    showToast('Холбоос хуулагдлаа.', 'info');
  });
}

function shareJob(platform) {
  if (!currentDetailJob) return;
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Дадлага.mn: ${currentDetailJob.company} - ${currentDetailJob.title} дадлагын зар`);
  
  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  } else if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  } else if (platform === 'telegram') {
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  }
}

function openJobDetailModal(jobId) {
  const allAvailable = (window.serverJobs && window.serverJobs.length > 0) ? window.serverJobs : getStoredInternships();
  const job = allAvailable.find(j => j.id === jobId) || getStoredInternships().find(j => j.id === jobId);
  if (!job) return;
  currentDetailJob = job;

  const modalBackdrop = document.getElementById('jobDetailModal');
  if (!modalBackdrop) return;

  const titleEl = document.getElementById('modalJobTitle');
  const companyEl = document.getElementById('modalCompanyName');
  const locationEl = document.getElementById('modalJobLocation');
  const typeEl = document.getElementById('modalJobType');
  const modeEl = document.getElementById('modalJobMode');
  const stipendEl = document.getElementById('modalJobStipend');
  const durationEl = document.getElementById('modalJobDuration');
  const deadlineEl = document.getElementById('modalJobDeadline');
  const descEl = document.getElementById('modalJobDesc');
  const reqList = document.getElementById('modalJobRequirements');
  const respList = document.getElementById('modalJobResponsibilities');
  const benList = document.getElementById('modalJobBenefits');
  const logoEl = document.getElementById('modalCompanyLogo');
  const applyBtn = document.getElementById('modalApplyBtn');
  const matchScoreEl = document.getElementById('modalMatchScore');
  const similarContainer = document.getElementById('modalSimilarInternships');

  if (titleEl) titleEl.textContent = job.title;
  if (companyEl) companyEl.textContent = job.company;
  if (locationEl) locationEl.textContent = job.location;
  if (typeEl) typeEl.textContent = job.type;
  if (modeEl) modeEl.textContent = job.workMode;
  if (stipendEl) stipendEl.textContent = job.stipend;
  if (durationEl) durationEl.textContent = job.duration;
  if (deadlineEl) deadlineEl.textContent = job.deadline || 'Нээлттэй';
  if (descEl) descEl.textContent = job.description;

  const matchPercent = calculateMatchScore(job);
  if (matchScoreEl) {
    matchScoreEl.innerHTML = `✨ <strong>${matchPercent}%</strong> Тохирох магадлалтай`;
  }

  if (logoEl) {
    logoEl.style.backgroundColor = job.logoBg || '#0f172a';
    logoEl.style.color = job.logoColor || '#ffffff';
    logoEl.textContent = job.logoText || job.company.substring(0, 2).toUpperCase();
  }

  if (reqList) {
    reqList.innerHTML = (job.requirements || []).map(r => `<li>${r}</li>`).join('');
  }
  if (respList) {
    respList.innerHTML = (job.responsibilities || []).map(r => `<li>${r}</li>`).join('');
  }
  if (benList) {
    benList.innerHTML = (job.benefits || []).map(b => `<li>${b}</li>`).join('');
  }

  // Similar internships recommendations
  if (similarContainer) {
    const similar = jobs.filter(j => j.category === job.category && j.id !== job.id).slice(0, 2);
    if (similar.length > 0) {
      similarContainer.innerHTML = `
        <div style="margin-top:24px; padding-top:20px; border-top:1px solid var(--border-light);">
          <div style="font-size:0.9rem; font-weight:800; color:var(--text-main); margin-bottom:12px;">Төстэй өөр боломжууд (${job.category}):</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            ${similar.map(s => `
              <div style="background:var(--bg-subtle); padding:12px; border-radius:var(--radius-sm); cursor:pointer; border:1px solid var(--border-light);" onclick="openJobDetailModal('${s.id}')">
                <div style="font-weight:700; font-size:0.85rem; color:var(--text-main);">${s.title}</div>
                <div style="font-size:0.75rem; color:var(--primary); font-weight:600;">${s.company} &bull; ${s.stipend}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      similarContainer.innerHTML = '';
    }
  }

  if (applyBtn) {
    applyBtn.onclick = () => {
      closeModal('jobDetailModal');
      openApplyModal(job);
    };
  }

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function handleCvFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    showToast('Файлын хэмжээ 10MB-аас бага байх ёстой.', 'error');
    return;
  }

  currentUploadedCvFile = file;
  renderCvFilePill(file);
}

function renderCvFilePill(file) {
  const container = document.getElementById('uploadedCvPillContainer');
  if (!container) return;

  const sizeKb = Math.round(file.size / 1024);
  container.innerHTML = `
    <div class="cv-file-pill">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.4rem;">📄</span>
        <div>
          <div style="font-weight:700; font-size:0.88rem; color:var(--text-main);">${file.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${sizeKb} KB &bull; Илгээхэд бэлэн</div>
        </div>
      </div>
      <button type="button" onclick="removeCvFile()" style="background:none; border:none; color:var(--danger); font-size:1.1rem; cursor:pointer;" title="Хасах">&times;</button>
    </div>
  `;
}

function removeCvFile() {
  currentUploadedCvFile = null;
  const input = document.getElementById('applicantCvFile');
  if (input) input.value = '';
  const container = document.getElementById('uploadedCvPillContainer');
  if (container) container.innerHTML = '';
}

function openApplyModal(job) {
  const modal = document.getElementById('applyModal');
  if (!modal) return;

  const targetTitle = document.getElementById('applyTargetJobTitle');
  const targetCompany = document.getElementById('applyTargetCompany');
  const hiddenJobId = document.getElementById('applyJobId');
  const verifiedBanner = document.getElementById('applyVerifiedUserBanner');

  if (targetTitle) targetTitle.textContent = job.title;
  if (targetCompany) targetCompany.textContent = job.company;
  if (hiddenJobId) hiddenJobId.value = job.id;

  // Auto-fill student profile details if logged in
  if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
    const user = Auth.getUser();
    if (user) {
      if (verifiedBanner) {
        verifiedBanner.style.display = 'flex';
        verifiedBanner.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span>✨</span>
            <span>Та <strong>${user.name}</strong> (${user.school || 'Оюутан'}) нэрээр нэвтэрсэн байна. Мэдээллийг автоматаар бөглөлөө.</span>
          </div>
        `;
      }

      const nameInput = document.getElementById('applicantName');
      const emailInput = document.getElementById('applicantEmail');
      const phoneInput = document.getElementById('applicantPhone');
      const schoolInput = document.getElementById('applicantSchool');
      const majorInput = document.getElementById('applicantMajor');
      const yearSelect = document.getElementById('applicantYear');

      if (nameInput) nameInput.value = user.name || '';
      if (emailInput) emailInput.value = user.email || '';
      if (phoneInput) phoneInput.value = user.phone || '';
      if (schoolInput) schoolInput.value = user.school || '';
      if (majorInput) majorInput.value = user.major || '';
      if (yearSelect && user.year) yearSelect.value = user.year;
    }
  } else {
    if (verifiedBanner) verifiedBanner.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Global Backdrop Click Handler
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Setup Mobile Menu
function setupMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
}

// Setup Quick Apply Form Submission
function setupApplyForm() {
  const form = document.getElementById('quickApplyForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('applicantName')?.value.trim();
    const email = document.getElementById('applicantEmail')?.value.trim();
    const phone = document.getElementById('applicantPhone')?.value.trim();
    const school = document.getElementById('applicantSchool')?.value.trim();
    const major = document.getElementById('applicantMajor')?.value.trim();
    const year = document.getElementById('applicantYear')?.value;
    const cvLink = document.getElementById('applicantCvLink')?.value.trim();
    const notes = document.getElementById('applicantNotes')?.value.trim();
    const jobId = document.getElementById('applyJobId')?.value;
    const jobTitle = document.getElementById('applyTargetJobTitle')?.textContent || 'Дадлага';
    const companyName = document.getElementById('applyTargetCompany')?.textContent || 'Байгууллага';

    if (!name || !email || !phone) {
      showToast('Нэр, имэйл болон утсаа гүйцэд оруулна уу.', 'error');
      return;
    }

    const appPayload = {
      job_id: jobId,
      job_title: jobTitle,
      company_name: companyName,
      applicant_name: name,
      applicant_email: email,
      applicant_phone: phone,
      applicant_school: school,
      applicant_major: major,
      applicant_year: year,
      cv_link: cvLink,
      cv_file_name: currentUploadedCvFile ? currentUploadedCvFile.name : '',
      notes: notes
    };

    // Try sending to SQLite backend
    try {
      await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appPayload)
      });
    } catch (err) {
      // Offline fallback
    }

    // Always record locally as well
    recordApplication({
      jobId,
      name,
      email,
      phone,
      school,
      major,
      year,
      cvLink,
      notes
    });

    closeModal('applyModal');
    form.reset();
    removeCvFile();
    showToast('Таны анкет амжилттай бүртгэгдлээ! Ажил олгогч тантай холбогдох болно.');
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAmbientBackground();
  setupMobileMenu();
  setupApplyForm();
  initCounterAnimations();
  setTimeout(initCardTilt, 200);
});
