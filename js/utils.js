/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Utility Helpers
   ============================================ */

// SVG Icons
const ICONS = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 1 0 24 12.056A12.014 12.014 0 0 0 11.944 0Zm5.654 7.025c-.125.69-1.835 10.35-1.835 10.35s-.066.43-.394.445a.61.61 0 0 1-.453-.19c-.63-.535-2.854-1.88-3.356-2.222a.162.162 0 0 1-.008-.274c.392-.32 4.083-3.705 4.175-4.008.012-.038.023-.179-.067-.254s-.222-.048-.318-.028c-.137.028-2.311 1.468-6.525 4.312a.97.97 0 0 1-.543.153c-.172-.01-1.026-.239-1.026-.239s-.621-.244-.43-.549c.04-.063.12-.127.358-.262C9.064 13.584 12.865 11.79 13.76 11.385c2.79-1.26 2.79-1.14 2.79-1.14l.002-.003a1.198 1.198 0 0 1 1.046-3.217Z"/></svg>'
};

// Debounce
function debounce(fn, ms = 300) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// Lazy Load Images
function setupLazyLoad() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const img = e.target;
                if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
                img.classList.add('loaded');
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });
    document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
}

// Create Slider with arrows
function initSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        const track = container.querySelector('.slider-track');
        const leftBtn = container.querySelector('.slider-arrow--left');
        const rightBtn = container.querySelector('.slider-arrow--right');
        if (!track) return;
        const scrollAmt = track.clientWidth * 0.75;
        if (leftBtn) leftBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
        if (rightBtn) rightBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
    });
}

// Toast notification
function showToast(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// Animate elements on scroll
function setupScrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animate-fadeInUp');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
}

// Generate placeholder poster color based on title
function getPosterGradient(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) { hash = title.charCodeAt(i) + ((hash << 5) - hash); }
    const h = Math.abs(hash) % 360;
    return `linear-gradient(135deg, hsl(${h},70%,15%) 0%, hsl(${(h + 40) % 360},60%,8%) 100%)`;
}

// Create placeholder poster SVG
function getPlaceholderPoster(title) {
    const h = Math.abs([...title].reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) % 360;
    const initials = title.split(' ').map(w => w[0]).join('').substr(0, 2).toUpperCase();
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:hsl(${h},70%,20%)"/><stop offset="100%" style="stop-color:hsl(${(h + 40) % 360},60%,8%)"/></linearGradient></defs><rect width="300" height="450" fill="url(#g)"/><text x="150" y="225" font-family="sans-serif" font-size="64" font-weight="bold" fill="rgba(255,255,255,0.15)" text-anchor="middle" dominant-baseline="central">${initials}</text><text x="150" y="380" font-family="sans-serif" font-size="16" font-weight="600" fill="rgba(255,255,255,0.6)" text-anchor="middle">${title.length > 20 ? title.substring(0, 20) + '...' : title}</text></svg>`)}`;
}

// Movie card HTML generator
function createMovieCardHTML(movie) {
    const poster = movie.poster || getPlaceholderPoster(movie.title);
    // Platform badge
    let platformBadge = '';
    if (movie.ottPlatform) {
        const platforms = getOTTPlatforms();
        const plat = platforms.find(p => p.name === movie.ottPlatform);
        const color = plat ? plat.color : '#555';
        const logo = plat && plat.logo;
        if (logo) {
            platformBadge = `<div class="movie-card__platform-badge"><img src="${logo}" alt="" onerror="this.style.display='none'">${movie.ottPlatform}</div>`;
        } else {
            platformBadge = `<div class="movie-card__platform-badge"><span class="dot" style="background:${color}"></span>${movie.ottPlatform}</div>`;
        }
    }
    return `
    <div class="movie-card" data-id="${movie.id}" onclick="window.location.href='movie.html?id=${movie.id}'">
      <img class="movie-card__poster" src="${poster}" alt="${movie.title}" loading="lazy">
      ${platformBadge}
      <div class="movie-card__badges">
        ${movie.quality ? `<span class="badge badge-quality">${movie.quality}</span>` : ''}
        ${movie.language ? `<span class="badge badge-lang">${movie.language}</span>` : ''}
      </div>
      <div class="movie-card__play">${ICONS.play}</div>
      <div class="movie-card__overlay">
        <span class="movie-card__title">${movie.title}</span>
        <div class="movie-card__meta">
          <span style="font-size:var(--fs-xs);color:var(--text-muted)">${movie.year || ''}</span>
        </div>
      </div>
    </div>`;
}

// Create slider section
function createSliderSection(title, movies) {
    if (!movies.length) return '';
    return `
    <section class="slider-section animate-on-scroll">
      <div class="slider-section__header">
        <h3 class="slider-section__title">${title}</h3>
      </div>
      <div class="slider-container">
        <button class="slider-arrow slider-arrow--left">${ICONS.chevronLeft}</button>
        <div class="slider-track">${movies.map(m => createMovieCardHTML(m)).join('')}</div>
        <button class="slider-arrow slider-arrow--right">${ICONS.chevronRight}</button>
      </div>
    </section>`;
}

// Page transition
function pageTransition(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => window.location.href = url, 300);
}

// ── Theme Toggle ──
function initTheme() {
    const saved = localStorage.getItem('cs_theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    // Apply admin theme settings
    applyDynamicTheme();

    // Bind toggle buttons on all pages
    document.addEventListener('DOMContentLoaded', () => {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('cs_theme', next);
            });
        }
    });
}

// Apply dynamic theme from admin settings
function applyDynamicTheme() {
    if (typeof getThemeSettings !== 'function') return;
    const t = getThemeSettings();
    const r = document.documentElement;
    if (t.primaryColor) r.style.setProperty('--accent-red', t.primaryColor);
    if (t.accentColor) r.style.setProperty('--accent-neon', t.accentColor);
    if (t.bgColor && t.bgColor !== '#0a0a0a') r.style.setProperty('--bg-primary', t.bgColor);
    if (t.cardRadius !== undefined) r.style.setProperty('--radius-lg', t.cardRadius + 'px');
    if (t.glassIntensity !== undefined) r.style.setProperty('--glass-blur', t.glassIntensity + 'px');
    if (t.fontFamily && t.fontFamily !== 'Inter') {
        r.style.setProperty('--font-primary', t.fontFamily + ', sans-serif');
    }
}

// Run immediately so theme loads before paint
initTheme();

