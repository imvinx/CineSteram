/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Home Page Logic (Dynamic CMS)
   ============================================ */
let activeOTTFilter = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check maintenance mode first
    const maint = getMaintenanceMode();
    if (maint.enabled) {
        document.getElementById('maintenanceOverlay').style.display = 'flex';
        document.getElementById('maintenanceMsg').textContent = maint.message;
        return; // Block everything
    }

    applyDynamicSEO();
    applySiteSettings();
    showAnnouncement();
    initNavbar();
    initHeroDynamic();
    initOTTPills();
    initContinueWatching();
    initTop10Today();
    initRecentlyWatched();
    initDynamicSections();
    initSearch();
    initSliders();
    setupScrollAnimations();
    handleURLFilter();
    trackPageView();
    initAds();
    initRequestModal();
    initMostRequested();

    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => document.body.style.opacity = '1');
});

/* ── Apply dynamic SEO ── */
function applyDynamicSEO() {
    const seo = getSEOSettings();
    if (seo.metaTitle) document.title = seo.metaTitle;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && seo.metaDescription) descMeta.content = seo.metaDescription;
}

/* ── Apply site settings ── */
function applySiteSettings() {
    const s = getSiteSettings();
    // Update navbar logo text
    const logoText = document.querySelector('.navbar__logo-text');
    if (logoText && s.siteName && s.siteName !== 'CineStream') {
        logoText.innerHTML = s.siteName;
    }
    // Footer
    const footerText = document.getElementById('footerText');
    if (footerText) footerText.textContent = s.footerText || '';
    const footerLinks = document.getElementById('footerLinks');
    if (footerLinks) {
        let html = '';
        const pages = getCustomPages().filter(p => p.enabled !== false);
        pages.forEach(p => { html += `<a href="page.html?slug=${p.slug}">${p.title}</a>`; });
        if (s.telegramLink) html += `<a href="${s.telegramLink}" target="_blank">Telegram</a>`;
        const social = s.socialLinks || {};
        if (social.twitter) html += `<a href="${social.twitter}" target="_blank">Twitter</a>`;
        if (social.instagram) html += `<a href="${social.instagram}" target="_blank">Instagram</a>`;
        if (social.youtube) html += `<a href="${social.youtube}" target="_blank">YouTube</a>`;
        footerLinks.innerHTML = html;
    }
}

/* ── Announcement ── */
function showAnnouncement() {
    const a = getAnnouncement();
    if (!a.enabled || !a.message) return;
    const bar = document.getElementById('announcementBar');
    bar.style.display = 'flex';
    bar.className = 'announcement-bar announcement-bar--' + (a.type || 'info');
    document.getElementById('announcementMsg').textContent = a.message;
}

/* ── Track page view ── */
function trackPageView() {
    const a = getAnalytics();
    a.totalPageViews = (a.totalPageViews || 0) + 1;
    saveAnalytics(a);
}

/* ── Navbar scroll ── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { nav.classList.toggle('scrolled', window.scrollY > 50); ticking = false; });
            ticking = true;
        }
    });
}

/* ── Hero Banner (Dynamic from admin) ── */
function initHeroDynamic() {
    const cfg = getHeroConfig();
    if (!cfg.enabled) { document.getElementById('heroBanner').style.display = 'none'; return; }

    const banners = getHeroBanners().filter(b => b.enabled).sort((a, b) => a.order - b.order);
    if (!banners.length) {
        // Fallback to featured movies
        initHeroFallback(); return;
    }

    const slidesEl = document.getElementById('heroSlides');
    const dotsEl = document.getElementById('heroDots');

    banners.forEach((b, i) => {
        const movie = b.movieId ? getMovieById(b.movieId) : null;
        const poster = b.image || movie?.poster || movie?.banner || getPlaceholderPoster(b.heading || 'CineStream');
        const title = b.heading || movie?.title || '';
        const desc = b.subtext || movie?.description || '';
        const slide = document.createElement('div');
        slide.className = `hero__slide ${i === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img class="hero__bg" src="${poster}" alt="${title}">
            <div class="hero__gradient"></div>
            <div class="hero__content">
                <div class="hero__tag">
                    ${movie?.quality ? `<span class="badge badge-quality">${movie.quality}</span>` : ''}
                    ${movie?.ottPlatform ? `<span class="badge badge-lang">${movie.ottPlatform}</span>` : ''}
                </div>
                <h1 class="hero__title">${title}</h1>
                <p class="hero__desc">${desc}</p>
                ${movie ? `<div class="hero__actions">
                    <a href="movie.html?id=${movie.id}" class="btn btn-primary btn-lg"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5,3 19,12 5,21"/></svg>Watch Now</a>
                    <a href="movie.html?id=${movie.id}" class="btn btn-secondary">Details</a>
                </div>` : ''}
            </div>`;
        slidesEl.appendChild(slide);

        const dot = document.createElement('button');
        dot.className = `hero__dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(dot);
    });

    let current = 0;
    const slides = slidesEl.querySelectorAll('.hero__slide');
    const dots = dotsEl.querySelectorAll('.hero__dot');

    function goToSlide(n) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = n;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    if (cfg.autoSlide && banners.length > 1) {
        setInterval(() => goToSlide((current + 1) % banners.length), cfg.speed || 5000);
    }
}

function initHeroFallback() {
    const featured = getFeaturedMovies().slice(0, 5);
    if (!featured.length) return;
    const slidesEl = document.getElementById('heroSlides');
    const dotsEl = document.getElementById('heroDots');

    featured.forEach((m, i) => {
        const poster = m.banner || m.poster || getPlaceholderPoster(m.title);
        const slide = document.createElement('div');
        slide.className = `hero__slide ${i === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img class="hero__bg" src="${poster}" alt="${m.title}">
            <div class="hero__gradient"></div>
            <div class="hero__content">
                <div class="hero__tag">
                    ${m.quality ? `<span class="badge badge-quality">${m.quality}</span>` : ''}
                    ${m.ottPlatform ? `<span class="badge badge-lang">${m.ottPlatform}</span>` : ''}
                </div>
                <h1 class="hero__title">${m.title}</h1>
                <p class="hero__desc">${m.description || ''}</p>
                <div class="hero__actions">
                    <a href="movie.html?id=${m.id}" class="btn btn-primary btn-lg"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5,3 19,12 5,21"/></svg>Watch Now</a>
                </div>
            </div>`;
        slidesEl.appendChild(slide);
        const dot = document.createElement('button');
        dot.className = `hero__dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsEl.appendChild(dot);
    });

    let current = 0;
    const slides = slidesEl.querySelectorAll('.hero__slide');
    const dots = dotsEl.querySelectorAll('.hero__dot');
    function goToSlide(n) {
        slides[current].classList.remove('active'); dots[current].classList.remove('active');
        current = n;
        slides[current].classList.add('active'); dots[current].classList.add('active');
    }
    setInterval(() => goToSlide((current + 1) % featured.length), 5000);
}

/* ── OTT Platform Pill Buttons ── */
function initOTTPills() {
    const strip = document.getElementById('ottStrip');
    const platforms = getOTTPlatforms();
    strip.innerHTML = '';
    const allPill = document.createElement('button');
    allPill.className = 'ott-pill active';
    allPill.setAttribute('data-platform', '__all__');
    allPill.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg> All <span class="ott-pill__count">${getVisibleMovies().length}</span>`;
    allPill.addEventListener('click', () => selectOTTPlatform(null));
    strip.appendChild(allPill);
    platforms.forEach(p => {
        const pill = document.createElement('button');
        pill.className = 'ott-pill';
        pill.setAttribute('data-platform', p.name);
        const count = getMoviesByOTT(p.name).length;
        let iconHTML = p.logo
            ? `<img src="${p.logo}" alt="" class="ott-pill__logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="ott-pill__icon" style="background:${p.color};display:none">${p.icon || p.name[0]}</span>`
            : `<span class="ott-pill__icon" style="background:${p.color}">${p.icon || p.name[0]}</span>`;
        pill.innerHTML = `${iconHTML} ${p.name} <span class="ott-pill__count">${count}</span>`;
        pill.addEventListener('click', () => selectOTTPlatform(p.name));
        strip.appendChild(pill);
    });
}

function selectOTTPlatform(platformName) {
    activeOTTFilter = platformName;
    const url = new URL(window.location);
    if (platformName) url.searchParams.set('platform', platformName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    else url.searchParams.delete('platform');
    history.replaceState(null, '', url);

    document.querySelectorAll('.ott-pill').forEach(pill => {
        const pName = pill.getAttribute('data-platform');
        pill.classList.toggle('active', platformName === null ? pName === '__all__' : pName === platformName);
    });

    const section = document.getElementById('ottFilterSection');
    const categoriesWrap = document.getElementById('categoriesWrap');
    if (platformName === null) {
        section.style.display = 'none'; section.innerHTML = '';
        categoriesWrap.style.display = '';
        categoriesWrap.style.opacity = '0'; categoriesWrap.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => categoriesWrap.style.opacity = '1');
    } else {
        categoriesWrap.style.display = 'none';
        showFilteredMovies(platformName);
    }
}

function showFilteredMovies(platformName) {
    const section = document.getElementById('ottFilterSection');
    const movies = getMoviesByOTT(platformName);
    const plat = getOTTPlatforms().find(p => p.name === platformName);
    const color = plat ? plat.color : '#e50914';
    const headerIcon = plat?.logo
        ? `<img src="${plat.logo}" alt="" class="ott-results__title-logo" onerror="this.style.display='none'">`
        : `<span class="ott-results__title-icon" style="background:${color}">${platformName[0]}</span>`;
    let html = `<div class="ott-results__header"><div class="ott-results__title-wrap">${headerIcon}<h2 class="ott-results__title">${platformName} <span style="color:var(--text-muted);font-weight:400;font-size:var(--fs-base)">— ${movies.length} title${movies.length !== 1 ? 's' : ''}</span></h2></div><button class="btn btn-secondary" onclick="selectOTTPlatform(null)" style="font-size:var(--fs-sm)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M18 6 6 18M6 6l12 12"/></svg>Show All</button></div>`;
    if (!movies.length) html += `<div class="ott-results__empty"><p>No movies from <strong>${platformName}</strong> yet.</p></div>`;
    else html += `<div class="ott-results__grid">${movies.map(m => createMovieCardHTML(m)).join('')}</div>`;
    section.innerHTML = html;
    section.style.display = 'block';
    section.style.animation = 'none'; requestAnimationFrame(() => section.style.animation = '');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Dynamic Sections (from admin Homepage Builder) ── */
function initDynamicSections() {
    const wrap = document.getElementById('categoriesWrap');
    const sections = getHomepageSections().filter(s => s.enabled).sort((a, b) => a.order - b.order);

    let html = '';
    sections.forEach(s => {
        let movies = [];
        switch (s.type) {
            case 'trending': movies = getTrendingMovies(); break;
            case 'latest': movies = getLatestMovies(); break;
            case 'featured': movies = getFeaturedMovies(); break;
            case 'topRated': movies = getTopRatedMovies(); break;
            case 'category': movies = getMoviesByCategory(s.config?.category || ''); break;
            case 'ottPlatform': movies = getMoviesByOTT(s.config?.ottPlatform || ''); break;
            case 'manual': movies = getMoviesByIds(s.config?.movieIds || []); break;
        }
        if (movies.length) {
            html += createSliderSection(s.title, movies);
            trackSectionClick(s.id);
        }
    });
    wrap.innerHTML = html;
}

/* ── URL Query Filter ── */
function handleURLFilter() {
    const params = new URLSearchParams(window.location.search);
    const platParam = params.get('platform');
    if (platParam) {
        const match = getOTTPlatforms().find(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === platParam.toLowerCase());
        if (match) selectOTTPlatform(match.name);
    }
}

/* ── Search ── */
function initSearch() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    document.getElementById('searchBtn').addEventListener('click', () => { overlay.classList.add('active'); setTimeout(() => input.focus(), 300); });
    document.getElementById('searchClose').addEventListener('click', () => { overlay.classList.remove('active'); input.value = ''; results.innerHTML = ''; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.classList.remove('active'); input.value = ''; results.innerHTML = ''; } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) overlay.classList.remove('active'); });
    const doSearch = debounce((q) => {
        if (!q.trim()) { results.innerHTML = ''; return; }
        const movies = searchMovies(q);
        if (!movies.length) { results.innerHTML = `<div class="empty-state"><p class="empty-state__text">No movies found for "${q}"</p></div>`; return; }
        results.innerHTML = movies.map(m => {
            const poster = m.poster || getPlaceholderPoster(m.title);
            return `<a href="movie.html?id=${m.id}" class="search-result-item"><img class="search-result-item__poster" src="${poster}" alt="${m.title}"><div class="search-result-item__info"><h4>${m.title}</h4><p>${m.year || ''} • ${m.language || ''} • ${m.quality || ''}${m.ottPlatform ? ' • ' + m.ottPlatform : ''}</p></div></a>`;
        }).join('');
    }, 250);
    input.addEventListener('input', (e) => doSearch(e.target.value));
}

/* ══════════════════════════════════════
   ADVERTISEMENT RENDERING SYSTEM
   ══════════════════════════════════════ */
function initAds() {
    if (typeof getActiveAds !== 'function') return;
    const ads = getActiveAds();
    if (!ads.length) return;

    // Banner ads (below hero)
    renderBannerAds(ads.filter(a => a.type === 'banner'));
    // Popup ads (once per session)
    renderPopupAd(ads.filter(a => a.type === 'popup'));
    // Sticky bottom ads
    renderStickyAd(ads.filter(a => a.type === 'sticky'));
    // Inline ads (between sections)
    renderInlineAds(ads.filter(a => a.type === 'inline'));
}

/* ── Frequency gate ── */
function shouldShowAd(ad) {
    const key = 'cs_ad_shown_' + ad.id;
    switch (ad.frequency) {
        case 'once-session':
            if (sessionStorage.getItem(key)) return false;
            sessionStorage.setItem(key, '1');
            return true;
        case 'once-day': {
            const last = localStorage.getItem(key);
            const today = new Date().toDateString();
            if (last === today) return false;
            localStorage.setItem(key, today);
            return true;
        }
        case 'every-3': {
            let count = parseInt(localStorage.getItem(key) || '0');
            count++;
            localStorage.setItem(key, count.toString());
            return count % 3 === 1;
        }
        default: return true; // 'always'
    }
}

/* ── Inject HTML and run scripts ── */
function injectAdContent(container, html) {
    container.innerHTML = html;
    // Execute any script tags inside the ad content
    container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.async = true;
        } else {
            newScript.textContent = oldScript.textContent;
        }
        oldScript.replaceWith(newScript);
    });
}

/* ── Banner Ads (below hero) ── */
function renderBannerAds(bannerAds) {
    if (!bannerAds.length) return;
    const hero = document.getElementById('heroBanner');
    if (!hero) return;

    bannerAds.forEach(ad => {
        if (!shouldShowAd(ad)) return;
        const container = document.createElement('div');
        container.className = 'cs-ad cs-ad--banner animate-on-scroll';
        container.setAttribute('data-ad-id', ad.id);
        container.innerHTML = '<span class="cs-ad__label">Ad</span><div class="cs-ad__content"></div>';
        hero.insertAdjacentElement('afterend', container);
        // Lazy load
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                injectAdContent(container.querySelector('.cs-ad__content'), ad.content_html);
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(container);
    });
}

/* ── Popup Ad (once per session) ── */
function renderPopupAd(popupAds) {
    if (!popupAds.length) return;
    const ad = popupAds[0]; // Show only first active popup
    if (!shouldShowAd(ad)) return;

    // Delay popup by 3 seconds
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'cs-ad-popup-overlay';
        overlay.innerHTML = `
            <div class="cs-ad-popup">
                <button class="cs-ad-popup__close" title="Close Ad">✕</button>
                <span class="cs-ad__label">Sponsored</span>
                <div class="cs-ad-popup__content"></div>
            </div>`;
        document.body.appendChild(overlay);
        injectAdContent(overlay.querySelector('.cs-ad-popup__content'), ad.content_html);
        // Animate in
        requestAnimationFrame(() => overlay.classList.add('active'));
        // Close handlers
        overlay.querySelector('.cs-ad-popup__close').addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }, 3000);
}

/* ── Sticky Bottom Ad ── */
function renderStickyAd(stickyAds) {
    if (!stickyAds.length) return;
    const ad = stickyAds[0];
    if (!shouldShowAd(ad)) return;

    const bar = document.createElement('div');
    bar.className = 'cs-ad cs-ad--sticky';
    bar.innerHTML = `
        <button class="cs-ad--sticky__close" title="Close" onclick="this.parentElement.remove()">✕</button>
        <div class="cs-ad__content"></div>`;
    document.body.appendChild(bar);
    injectAdContent(bar.querySelector('.cs-ad__content'), ad.content_html);
    requestAnimationFrame(() => bar.classList.add('visible'));
}

/* ── Inline Ads (between sections every 2nd section) ── */
function renderInlineAds(inlineAds) {
    if (!inlineAds.length) return;
    const wrap = document.getElementById('categoriesWrap');
    if (!wrap) return;

    const sections = wrap.querySelectorAll('.slider-section');
    let adIndex = 0;
    sections.forEach((section, i) => {
        // Insert ad after every 2nd section
        if ((i + 1) % 2 === 0 && adIndex < inlineAds.length) {
            const ad = inlineAds[adIndex];
            if (!shouldShowAd(ad)) return;
            const container = document.createElement('div');
            container.className = 'cs-ad cs-ad--inline animate-on-scroll';
            container.innerHTML = '<span class="cs-ad__label">Sponsored</span><div class="cs-ad__content"></div>';
            section.insertAdjacentElement('afterend', container);
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    injectAdContent(container.querySelector('.cs-ad__content'), ad.content_html);
                    observer.disconnect();
                }
            }, { threshold: 0.1 });
            observer.observe(container);
            adIndex++;
        }
    });
}

/* ══════════════════════════════════════
   CONTINUE WATCHING SECTION
   ══════════════════════════════════════ */
function initContinueWatching() {
    if (typeof getContinueWatching !== 'function') return;
    const list = getContinueWatching();
    if (!list.length) return;

    // Only show movies that still exist in the library
    const validItems = list.filter(e => {
        const movie = getMovieById(e.movie_id);
        return movie && movie.visible !== false;
    });
    if (!validItems.length) return;

    const wrap = document.getElementById('categoriesWrap');
    if (!wrap) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'slider-section continue-watching-section animate-on-scroll';
    sectionEl.id = 'continueWatchingSection';
    sectionEl.innerHTML = `
        <div class="slider-header">
            <h2 class="slider-header__title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px;color:var(--accent-red)">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Continue Watching
            </h2>
        </div>
        <div class="slider-container">
            <button class="slider-arrow slider-arrow--left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div class="slider-track" id="continueWatchingTrack"></div>
            <button class="slider-arrow slider-arrow--right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>`;

    const track = sectionEl.querySelector('#continueWatchingTrack');
    track.innerHTML = validItems.map(e => {
        const movie = getMovieById(e.movie_id);
        const poster = e.poster_url || movie?.poster || getPlaceholderPoster(e.title);
        const timeAgo = getTimeAgo(e.timestamp);
        return `<div class="movie-card cw-card" data-cw-id="${e.movie_id}">
            <a href="movie.html?id=${e.movie_id}" class="movie-card__link">
                <div class="movie-card__poster-wrap">
                    <img class="movie-card__poster" src="${poster}" alt="${e.title}" loading="lazy">
                    <div class="movie-card__overlay">
                        <div class="movie-card__play">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                    </div>
                    ${movie?.quality ? `<span class="badge badge-quality movie-card__quality">${movie.quality}</span>` : ''}
                </div>
                <div class="movie-card__info">
                    <h3 class="movie-card__title">${e.title}</h3>
                    <p class="movie-card__meta cw-time">${timeAgo}</p>
                </div>
            </a>
            <button class="cw-remove" title="Remove" onclick="event.stopPropagation();removeCW('${e.movie_id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
        </div>`;
    }).join('');

    // Insert at the top of categories wrap
    wrap.insertBefore(sectionEl, wrap.firstChild);
}

function removeCW(movieId) {
    removeContinueWatching(movieId);
    const card = document.querySelector(`.cw-card[data-cw-id="${movieId}"]`);
    if (card) {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            card.remove();
            // If no more items, hide the section
            const section = document.getElementById('continueWatchingSection');
            const remaining = section?.querySelectorAll('.cw-card');
            if (!remaining || !remaining.length) section?.remove();
        }, 300);
    }
}

function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
}

/* ══════════════════════════════════════
   TOP 10 TODAY SECTION
   ══════════════════════════════════════ */
function initTop10Today() {
    if (typeof getTop10Today !== 'function') return;
    const top10 = getTop10Today();
    if (!top10.length) return;

    const wrap = document.getElementById('categoriesWrap');
    if (!wrap) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'slider-section top10-section animate-on-scroll';
    sectionEl.id = 'top10Section';
    sectionEl.innerHTML = `
        <div class="slider-header">
            <h2 class="slider-header__title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px;color:var(--accent-red)">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Top 10 Today
            </h2>
        </div>
        <div class="slider-container">
            <button class="slider-arrow slider-arrow--left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div class="slider-track top10-track" id="top10Track"></div>
            <button class="slider-arrow slider-arrow--right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>`;

    const track = sectionEl.querySelector('#top10Track');
    track.innerHTML = top10.map((m, i) => {
        const poster = m.poster || getPlaceholderPoster(m.title);
        const rank = i + 1;
        return `<div class="movie-card top10-card">
            <a href="movie.html?id=${m.id}" class="movie-card__link">
                <div class="movie-card__poster-wrap top10-poster-wrap">
                    <span class="top10-rank">${rank}</span>
                    <img class="movie-card__poster" src="${poster}" alt="${m.title}" loading="lazy">
                    <div class="movie-card__overlay">
                        <div class="movie-card__play">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                    </div>
                    ${m.quality ? `<span class="badge badge-quality movie-card__quality">${m.quality}</span>` : ''}
                    <span class="top10-views">${m.view_count} view${m.view_count !== 1 ? 's' : ''}</span>
                </div>
                <div class="movie-card__info">
                    <h3 class="movie-card__title">${m.title}</h3>
                    <p class="movie-card__meta">${m.ottPlatform || m.category || ''}</p>
                </div>
            </a>
        </div>`;
    }).join('');

    // Insert after Continue Watching (or at top if no CW)
    const cwSection = document.getElementById('continueWatchingSection');
    if (cwSection) {
        cwSection.insertAdjacentElement('afterend', sectionEl);
    } else {
        wrap.insertBefore(sectionEl, wrap.firstChild);
    }
}

/* ══════════════════════════════════════
   RECENTLY WATCHED SECTION
   ══════════════════════════════════════ */
function initRecentlyWatched() {
    if (typeof getWatchHistory !== 'function') return;
    const history = getWatchHistory();
    if (!history.length) return;

    // Only show movies that still exist
    const validItems = history.filter(e => {
        const movie = getMovieById(e.movie_id);
        return movie && movie.visible !== false;
    });
    if (!validItems.length) return;

    const wrap = document.getElementById('categoriesWrap');
    if (!wrap) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'slider-section rw-section animate-on-scroll';
    sectionEl.id = 'recentlyWatchedSection';
    sectionEl.innerHTML = `
        <div class="slider-header">
            <h2 class="slider-header__title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px;color:var(--accent-neon)">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                Recently Watched
            </h2>
        </div>
        <div class="slider-container">
            <button class="slider-arrow slider-arrow--left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div class="slider-track" id="recentlyWatchedTrack"></div>
            <button class="slider-arrow slider-arrow--right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>`;

    const track = sectionEl.querySelector('#recentlyWatchedTrack');
    track.innerHTML = validItems.map(e => {
        const movie = getMovieById(e.movie_id);
        const poster = e.poster || movie?.poster || getPlaceholderPoster(e.title);
        const timeAgo = getTimeAgo(e.watched_at);
        return `<div class="movie-card rw-card" data-rw-id="${e.movie_id}">
            <a href="movie.html?id=${e.movie_id}" class="movie-card__link">
                <div class="movie-card__poster-wrap">
                    <img class="movie-card__poster" src="${poster}" alt="${e.title}" loading="lazy">
                    <div class="movie-card__overlay">
                        <div class="movie-card__play">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                    </div>
                    ${movie?.quality ? `<span class="badge badge-quality movie-card__quality">${movie.quality}</span>` : ''}
                    ${e.platform ? `<span class="rw-platform">${e.platform}</span>` : ''}
                </div>
                <div class="movie-card__info">
                    <h3 class="movie-card__title">${e.title}</h3>
                    <p class="movie-card__meta rw-time">${timeAgo}</p>
                </div>
            </a>
            <button class="cw-remove" title="Remove" onclick="event.stopPropagation();removeRW('${e.movie_id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
        </div>`;
    }).join('');

    // Insert after Top 10 (or CW, or at top)
    const top10 = document.getElementById('top10Section');
    const cwSection = document.getElementById('continueWatchingSection');
    const insertAfter = top10 || cwSection;
    if (insertAfter) {
        insertAfter.insertAdjacentElement('afterend', sectionEl);
    } else {
        wrap.insertBefore(sectionEl, wrap.firstChild);
    }
}

function removeRW(movieId) {
    removeFromWatchHistory(movieId);
    const card = document.querySelector(`.rw-card[data-rw-id="${movieId}"]`);
    if (card) {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            card.remove();
            const section = document.getElementById('recentlyWatchedSection');
            const remaining = section?.querySelectorAll('.rw-card');
            if (!remaining || !remaining.length) section?.remove();
        }, 300);
    }
}

/* ══════════════════════════════════════
   MOVIE REQUEST SYSTEM
   ══════════════════════════════════════ */
function initRequestModal() {
    // Populate OTT dropdown from admin platforms
    const sel = document.getElementById('reqPlatform');
    if (sel && typeof getOTTPlatforms === 'function') {
        const platforms = getOTTPlatforms();
        platforms.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name; opt.textContent = p.name;
            sel.appendChild(opt);
        });
    }
}

function openRequestModal() {
    const modal = document.getElementById('requestModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const msg = document.getElementById('reqMessage');
        if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
    }
}
function closeRequestModal() {
    const modal = document.getElementById('requestModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function submitRequest(e) {
    e.preventDefault();
    const btn = document.getElementById('reqSubmitBtn');
    const msg = document.getElementById('reqMessage');

    // Honeypot check
    if (document.getElementById('reqHoneypot')?.value) {
        showReqMsg(msg, 'Request submitted!', 'success'); // Fake success for bots
        return;
    }

    const movieName = document.getElementById('reqMovieName').value.trim();
    if (!movieName || movieName.length < 3) {
        showReqMsg(msg, 'Movie name must be at least 3 characters.', 'error');
        return;
    }

    // Anti-spam validation
    const check = canSubmitRequest(movieName);
    if (!check.ok) {
        showReqMsg(msg, check.reason, 'error');
        return;
    }

    // Disable button with spinner
    btn.disabled = true;
    btn.innerHTML = '<span class="request-spinner"></span> Submitting...';

    // Simulate network delay
    setTimeout(() => {
        const req = {
            movie_name: movieName,
            language: document.getElementById('reqLanguage').value,
            ott_platform: document.getElementById('reqPlatform').value,
            year: document.getElementById('reqYear').value || null,
            notes: document.getElementById('reqNotes').value.trim(),
            email: document.getElementById('reqEmail').value.trim()
        };

        addRequest(req);
        localStorage.setItem('cs_req_last', Date.now().toString());

        showReqMsg(msg, '✅ Your request has been submitted! We\'ll try to add it soon.', 'success');
        document.getElementById('requestForm').reset();

        // Cooldown button for 30s
        let countdown = 30;
        btn.innerHTML = `Wait ${countdown}s`;
        const timer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Submit Request';
            } else {
                btn.innerHTML = `Wait ${countdown}s`;
            }
        }, 1000);
    }, 600);
}

function showReqMsg(el, text, type) {
    el.textContent = text;
    el.className = `request-form__message request-form__message--${type}`;
    el.style.display = 'block';
}

/* ── Most Requested Section (public) ── */
function initMostRequested() {
    if (typeof getMostRequested !== 'function') return;
    const most = getMostRequested();
    if (!most.length) return;

    const wrap = document.getElementById('categoriesWrap');
    if (!wrap) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'slider-section most-requested-section animate-on-scroll';
    sectionEl.innerHTML = `
        <div class="slider-header">
            <h2 class="slider-header__title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px;color:var(--accent-neon)">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Most Requested Movies
            </h2>
            <button class="btn btn-secondary" style="font-size:var(--fs-sm)" onclick="openRequestModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
                Request Movie
            </button>
        </div>
        <div class="most-requested-grid" id="mostRequestedGrid"></div>`;

    const grid = sectionEl.querySelector('#mostRequestedGrid');
    grid.innerHTML = most.map((item, i) => `
        <div class="most-requested-item">
            <span class="most-requested-rank">#${i + 1}</span>
            <span class="most-requested-name">${item.name}</span>
            <span class="most-requested-count">${item.count} request${item.count !== 1 ? 's' : ''}</span>
        </div>
    `).join('');

    // Append near the end
    wrap.appendChild(sectionEl);
}
