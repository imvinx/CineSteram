/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Admin Panel Logic (Dynamic CMS)
   ============================================ */

/* ── PIN Authentication ── */
function verifyPin() {
    const input = document.getElementById('pinInput');
    const error = document.getElementById('pinError');
    if (input.value === getAdminPin()) { sessionStorage.setItem('cs_auth', '1'); showDashboard(); }
    else { error.style.display = 'block'; input.value = ''; input.focus(); }
}
function showDashboard() {
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('adminDash').style.display = 'flex';
    refreshDashboard(); refreshMoviesTable(); refreshCatsTable(); refreshOTTTable();
    refreshSections(); refreshBanners(); loadThemePanel(); loadSettingsPanel();
    loadSEOPanel(); loadPlayerPanel(); refreshPagesTable(); refreshAnalytics(); refreshAds(); refreshRequests();
}
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('cs_auth') === '1') showDashboard();
    document.getElementById('pinInput').addEventListener('keydown', e => { if (e.key === 'Enter') verifyPin(); });
});

/* ── Tab Switch ── */
function switchTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = '';
    document.querySelectorAll('.admin-nav__item').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-tab="${tab}"]`);
    if (btn) btn.classList.add('active');
    document.getElementById('adminSidebar').classList.remove('open');
}

/* ══════════════════════════════════════
   1. DASHBOARD
   ══════════════════════════════════════ */
function refreshDashboard() {
    const movies = getMovies(), cats = getCategories(), platforms = getOTTPlatforms();
    const sections = getHomepageSections(), pages = getCustomPages();
    document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><div class="stat-card__value">${movies.length}</div><div class="stat-card__label">Movies</div></div>
    <div class="stat-card"><div class="stat-card__value">${movies.filter(m => m.visible !== false).length}</div><div class="stat-card__label">Visible</div></div>
    <div class="stat-card"><div class="stat-card__value">${movies.filter(m => m.featured).length}</div><div class="stat-card__label">Featured</div></div>
    <div class="stat-card"><div class="stat-card__value">${cats.length}</div><div class="stat-card__label">Categories</div></div>
    <div class="stat-card"><div class="stat-card__value">${platforms.length}</div><div class="stat-card__label">Platforms</div></div>
    <div class="stat-card"><div class="stat-card__value">${sections.length}</div><div class="stat-card__label">Sections</div></div>
    <div class="stat-card"><div class="stat-card__value">${pages.length}</div><div class="stat-card__label">Pages</div></div>
    <div class="stat-card"><div class="stat-card__value">${getAnalytics().totalPageViews || 0}</div><div class="stat-card__label">Total Views</div></div>`;
    const recent = movies.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)).slice(0, 5);
    document.getElementById('recentMoviesBody').innerHTML = recent.map(m => `<tr>
    <td><img class="admin-table__poster" src="${m.poster || getPlaceholderPoster(m.title)}" alt=""></td>
    <td>${m.title}</td><td>${m.category || '-'}</td><td>${m.ottPlatform || '-'}</td>
    <td><span class="status-dot ${m.visible !== false ? 'visible' : 'hidden'}"></span>${m.visible !== false ? 'Visible' : 'Hidden'}</td></tr>`).join('');
}

/* ══════════════════════════════════════
   2. HOMEPAGE BUILDER
   ══════════════════════════════════════ */
function refreshSections() {
    const sections = getHomepageSections().sort((a, b) => a.order - b.order);
    const list = document.getElementById('sectionBuilderList');
    if (!sections.length) { list.innerHTML = '<p style="color:var(--text-muted)">No sections yet. Add one to get started.</p>'; return; }
    list.innerHTML = sections.map((s, i) => `
    <div class="section-card ${s.enabled ? '' : 'section-card--disabled'}">
      <div class="section-card__handle">
        <button class="btn-icon" ${i === 0 ? 'disabled' : ''} onclick="moveSection('${s.id}','up')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="18 15 12 9 6 15"/></svg></button>
        <span class="section-card__order">${s.order}</span>
        <button class="btn-icon" ${i === sections.length - 1 ? 'disabled' : ''} onclick="moveSection('${s.id}','down')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg></button>
      </div>
      <div class="section-card__info">
        <strong>${s.title}</strong>
        <span class="section-card__type">${s.type}${s.config?.category ? ' · ' + s.config.category : ''}${s.config?.ottPlatform ? ' · ' + s.config.ottPlatform : ''}</span>
      </div>
      <div class="section-card__actions">
        <button class="btn-toggle ${s.enabled ? '' : 'off'}" title="Toggle" onclick="toggleSection('${s.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="btn-edit" title="Edit" onclick="editSection('${s.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-delete" title="Delete" onclick="delSection('${s.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>
    </div>`).join('');
}
function moveSection(id, dir) { reorderSection(id, dir); refreshSections(); }
function toggleSection(id) { const s = getHomepageSections().find(x => x.id === id); if (s) updateHomepageSection(id, { enabled: !s.enabled }); refreshSections(); }
function delSection(id) { if (confirm('Delete this section?')) { deleteHomepageSection(id); refreshSections(); showToast('Section deleted'); } }
function openSectionModal(id) {
    const modal = document.getElementById('sectionModal');
    const cats = getCategories(), otts = getOTTPlatforms();
    document.getElementById('fSectionCategory').innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    document.getElementById('fSectionOtt').innerHTML = otts.map(o => `<option value="${o.name}">${o.name}</option>`).join('');
    if (id) {
        const s = getHomepageSections().find(x => x.id === id); if (!s) return;
        document.getElementById('sectionModalTitle').textContent = 'Edit Section';
        document.getElementById('editSectionId').value = s.id;
        document.getElementById('fSectionTitle').value = s.title;
        document.getElementById('fSectionType').value = s.type;
        if (s.config?.category) document.getElementById('fSectionCategory').value = s.config.category;
        if (s.config?.ottPlatform) document.getElementById('fSectionOtt').value = s.config.ottPlatform;
        if (s.config?.movieIds) document.getElementById('fSectionMovieIds').value = (s.config.movieIds || []).join(', ');
    } else {
        document.getElementById('sectionModalTitle').textContent = 'Add Section';
        document.getElementById('editSectionId').value = '';
        document.getElementById('fSectionTitle').value = '';
        document.getElementById('fSectionType').value = 'trending';
        document.getElementById('fSectionMovieIds').value = '';
    }
    toggleSectionConfig();
    modal.classList.add('active');
}
function closeSectionModal() { document.getElementById('sectionModal').classList.remove('active'); }
function editSection(id) { openSectionModal(id); }
function toggleSectionConfig() {
    const t = document.getElementById('fSectionType').value;
    document.getElementById('sectionCatConfig').style.display = t === 'category' ? '' : 'none';
    document.getElementById('sectionOttConfig').style.display = t === 'ottPlatform' ? '' : 'none';
    document.getElementById('sectionManualConfig').style.display = t === 'manual' ? '' : 'none';
}
function saveSection() {
    const title = document.getElementById('fSectionTitle').value.trim();
    const type = document.getElementById('fSectionType').value;
    if (!title) { showToast('Title required', 'error'); return; }
    const config = {};
    if (type === 'category') config.category = document.getElementById('fSectionCategory').value;
    if (type === 'ottPlatform') config.ottPlatform = document.getElementById('fSectionOtt').value;
    if (type === 'manual') config.movieIds = document.getElementById('fSectionMovieIds').value.split(',').map(s => s.trim()).filter(Boolean);
    const editId = document.getElementById('editSectionId').value;
    if (editId) { updateHomepageSection(editId, { title, type, config }); showToast('Section updated'); }
    else { addHomepageSection({ title, type, config }); showToast('Section added'); }
    closeSectionModal(); refreshSections();
}

/* ══════════════════════════════════════
   3. HERO BANNERS
   ══════════════════════════════════════ */
function refreshBanners() {
    const cfg = getHeroConfig();
    document.getElementById('heroEnabled').checked = cfg.enabled;
    document.getElementById('heroAutoSlide').checked = cfg.autoSlide;
    document.getElementById('heroSpeed').value = cfg.speed;
    const banners = getHeroBanners().sort((a, b) => a.order - b.order);
    const el = document.getElementById('bannersList');
    if (!banners.length) { el.innerHTML = '<p style="color:var(--text-muted)">No banners added.</p>'; return; }
    el.innerHTML = banners.map(b => {
        const movie = b.movieId ? getMovieById(b.movieId) : null;
        return `<div class="admin-card" style="margin-bottom:var(--space-sm);display:flex;align-items:center;gap:var(--space-md);flex-wrap:wrap">
      <div style="width:60px;height:40px;background:var(--bg-surface);border-radius:var(--radius-sm);overflow:hidden"><img src="${b.image || movie?.poster || getPlaceholderPoster(b.heading || 'B')}" style="width:100%;height:100%;object-fit:cover" alt=""></div>
      <div style="flex:1;min-width:150px"><strong>${b.heading || movie?.title || 'Untitled'}</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">${b.enabled ? 'Enabled' : 'Disabled'} · Order: ${b.order}</span></div>
      <div class="admin-table__actions">
        <button class="btn-toggle ${b.enabled ? '' : 'off'}" onclick="toggleBan('${b.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="btn-edit" onclick="editBanner('${b.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="btn-delete" onclick="delBanner('${b.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>
    </div>`;
    }).join('');
}
function saveHeroSettings() {
    saveHeroConfig({ enabled: document.getElementById('heroEnabled').checked, autoSlide: document.getElementById('heroAutoSlide').checked, speed: parseInt(document.getElementById('heroSpeed').value) || 5000 });
    showToast('Hero settings saved');
}
function openBannerModal(id) {
    const modal = document.getElementById('bannerModal');
    const movies = getMovies();
    document.getElementById('fBannerMovie').innerHTML = '<option value="">— None —</option>' + movies.map(m => `<option value="${m.id}">${m.title}</option>`).join('');
    if (id) {
        const b = getHeroBanners().find(x => x.id === id); if (!b) return;
        document.getElementById('bannerModalTitle').textContent = 'Edit Banner';
        document.getElementById('editBannerId').value = b.id;
        document.getElementById('fBannerMovie').value = b.movieId || '';
        document.getElementById('fBannerHeading').value = b.heading || '';
        document.getElementById('fBannerSubtext').value = b.subtext || '';
        document.getElementById('fBannerImage').value = b.image || '';
    } else {
        document.getElementById('bannerModalTitle').textContent = 'Add Banner';
        document.getElementById('editBannerId').value = '';
        ['fBannerHeading', 'fBannerSubtext', 'fBannerImage'].forEach(f => document.getElementById(f).value = '');
        document.getElementById('fBannerMovie').value = '';
    }
    modal.classList.add('active');
}
function closeBannerModal() { document.getElementById('bannerModal').classList.remove('active'); }
function editBanner(id) { openBannerModal(id); }
function saveBanner() {
    const data = {
        movieId: document.getElementById('fBannerMovie').value || null,
        heading: document.getElementById('fBannerHeading').value.trim(),
        subtext: document.getElementById('fBannerSubtext').value.trim(),
        image: document.getElementById('fBannerImage').value.trim()
    };
    if (!data.heading && !data.movieId) { showToast('Select a movie or enter a heading', 'error'); return; }
    const editId = document.getElementById('editBannerId').value;
    if (editId) { updateHeroBanner(editId, data); showToast('Banner updated'); }
    else { addHeroBanner(data); showToast('Banner added'); }
    closeBannerModal(); refreshBanners();
}
function toggleBan(id) { const b = getHeroBanners().find(x => x.id === id); if (b) updateHeroBanner(id, { enabled: !b.enabled }); refreshBanners(); }
function delBanner(id) { if (confirm('Delete banner?')) { deleteHeroBanner(id); refreshBanners(); showToast('Banner deleted'); } }

/* ══════════════════════════════════════
   4. MOVIES
   ══════════════════════════════════════ */
function refreshMoviesTable() {
    const movies = getMovies().sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    document.getElementById('moviesTableBody').innerHTML = movies.map(m => `<tr>
    <td><img class="admin-table__poster" src="${m.poster || getPlaceholderPoster(m.title)}" alt=""></td>
    <td><strong>${m.title}</strong></td><td>${m.category || '-'}</td><td>${m.ottPlatform || '-'}</td>
    <td><span class="badge badge-quality">${m.quality || '-'}</span></td>
    <td>${m.displayPriority || 50}</td>
    <td><span class="status-dot ${m.visible !== false ? 'visible' : 'hidden'}"></span>${m.visible !== false ? 'Visible' : 'Hidden'}</td>
    <td>${m.featured ? '⭐' : '-'}</td>
    <td><div class="admin-table__actions">
      <button class="btn-edit" onclick="editMovie('${m.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
      <button class="btn-toggle ${m.visible !== false ? '' : 'off'}" onclick="toggleVis('${m.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
      <button class="btn-delete" onclick="delMovie('${m.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
    </div></td></tr>`).join('');
}
function populateOTTDropdown(sel, val) {
    const el = document.getElementById(sel), ps = getOTTPlatforms();
    el.innerHTML = '<option value="">None</option>' + ps.map(p => `<option value="${p.name}" ${val === p.name ? 'selected' : ''}>${p.name}</option>`).join('');
}
function openMovieModal(id) {
    const modal = document.getElementById('movieModal'), cats = getCategories();
    document.getElementById('fCategory').innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    if (id) {
        const m = getMovieById(id); if (!m) return;
        document.getElementById('movieModalTitle').textContent = 'Edit Movie';
        document.getElementById('editMovieId').value = m.id;
        document.getElementById('fTitle').value = m.title || '';
        document.getElementById('fDesc').value = m.description || '';
        document.getElementById('fCategory').value = m.category || '';
        document.getElementById('fLang').value = m.language || '';
        document.getElementById('fQuality').value = m.quality || 'HD';
        document.getElementById('fYear').value = m.year || '';
        document.getElementById('fPoster').value = m.poster || '';
        document.getElementById('fTelegram').value = m.telegramLink || '';
        document.getElementById('fGenres').value = (m.genres || []).join(', ');
        document.getElementById('fBadges').value = (m.badges || []).join(', ');
        document.getElementById('fPriority').value = m.displayPriority || 50;
        document.getElementById('fFeatured').checked = !!m.featured;
        document.getElementById('fTrending').checked = !!m.trending;
        document.getElementById('fTopRated').checked = !!m.topRated;
        document.getElementById('fSchedule').value = m.scheduledAt ? new Date(m.scheduledAt).toISOString().slice(0, 16) : '';
        populateOTTDropdown('fOttPlatform', m.ottPlatform || '');
    } else {
        document.getElementById('movieModalTitle').textContent = 'Add Movie';
        document.getElementById('editMovieId').value = '';
        ['fTitle', 'fDesc', 'fLang', 'fPoster', 'fTelegram', 'fGenres', 'fBadges'].forEach(f => document.getElementById(f).value = '');
        document.getElementById('fYear').value = new Date().getFullYear();
        document.getElementById('fQuality').value = 'HD';
        document.getElementById('fPriority').value = 50;
        document.getElementById('fSchedule').value = '';
        ['fFeatured', 'fTrending', 'fTopRated'].forEach(f => document.getElementById(f).checked = false);
        populateOTTDropdown('fOttPlatform', '');
    }
    modal.classList.add('active');
}
function closeMovieModal() { document.getElementById('movieModal').classList.remove('active'); }
function editMovie(id) { openMovieModal(id); }
function saveMovie() {
    const title = document.getElementById('fTitle').value.trim();
    if (!title) { showToast('Title is required', 'error'); return; }
    const schedVal = document.getElementById('fSchedule').value;
    const data = {
        title, description: document.getElementById('fDesc').value.trim(),
        category: document.getElementById('fCategory').value,
        language: document.getElementById('fLang').value.trim() || 'English',
        quality: document.getElementById('fQuality').value,
        year: parseInt(document.getElementById('fYear').value) || new Date().getFullYear(),
        poster: document.getElementById('fPoster').value.trim(),
        telegramLink: document.getElementById('fTelegram').value.trim() || 'https://t.me/cinestream',
        genres: document.getElementById('fGenres').value.split(',').map(g => g.trim()).filter(Boolean),
        badges: document.getElementById('fBadges').value.split(',').map(g => g.trim()).filter(Boolean),
        featured: document.getElementById('fFeatured').checked,
        trending: document.getElementById('fTrending').checked,
        topRated: document.getElementById('fTopRated').checked,
        ottPlatform: document.getElementById('fOttPlatform').value,
        displayPriority: parseInt(document.getElementById('fPriority').value) || 50,
        scheduledAt: schedVal ? new Date(schedVal).getTime() : null
    };
    const editId = document.getElementById('editMovieId').value;
    if (editId) { updateMovie(editId, data); showToast('Movie updated!'); }
    else { addMovie(data); showToast('Movie added!'); }
    closeMovieModal(); refreshMoviesTable(); refreshDashboard();
}
function toggleVis(id) { toggleMovieVisibility(id); refreshMoviesTable(); refreshDashboard(); }
function delMovie(id) { if (confirm('Delete this movie?')) { deleteMovie(id); refreshMoviesTable(); refreshDashboard(); showToast('Movie deleted'); } }

/* ══════════════════════════════════════
   5. CATEGORIES
   ══════════════════════════════════════ */
function refreshCatsTable() {
    const cats = getCategories(), movies = getMovies();
    document.getElementById('catsTableBody').innerHTML = cats.map(c => {
        const count = movies.filter(m => m.category === c.name).length;
        return `<tr><td><strong>${c.name}</strong></td><td>${count}</td><td><div class="admin-table__actions"><button class="btn-delete" onclick="delCat('${c.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></td></tr>`;
    }).join('');
}
function addCat() { const i = document.getElementById('newCatInput'), n = i.value.trim(); if (!n) return; if (addCategory(n)) { i.value = ''; refreshCatsTable(); refreshDashboard(); showToast('Category added'); } else showToast('Already exists', 'error'); }
function delCat(id) { if (confirm('Delete category?')) { deleteCategory(id); refreshCatsTable(); refreshDashboard(); } }

/* ══════════════════════════════════════
   6. OTT PLATFORMS
   ══════════════════════════════════════ */
function refreshOTTTable() {
    const ps = getOTTPlatforms(), movies = getMovies();
    document.getElementById('ottTableBody').innerHTML = ps.map(p => {
        const count = movies.filter(m => m.ottPlatform === p.name).length;
        return `<tr><td><div class="ott-icon" style="background:${p.color};width:36px;height:36px;font-size:14px;border-radius:8px">${p.icon || p.name[0]}</div></td>
    <td><strong>${p.name}</strong> <span style="color:var(--text-muted);font-size:var(--fs-xs)">(${count})</span></td>
    <td>${p.logo ? `<img src="${p.logo}" style="height:24px;border-radius:4px" onerror="this.outerHTML='—'" alt="">` : '—'}</td>
    <td><span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:${p.color};vertical-align:middle"></span> ${p.color}</td>
    <td><div class="admin-table__actions"><button class="btn-delete" onclick="delOTT('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></td></tr>`;
    }).join('');
}
function openOTTModal() { document.getElementById('ottModal').classList.add('active'); }
function closeOTTModal() { document.getElementById('ottModal').classList.remove('active'); }
function saveOTT() {
    const name = document.getElementById('fOttName').value.trim();
    if (!name) { showToast('Name required', 'error'); return; }
    addOTTPlatform({ name, icon: document.getElementById('fOttIcon').value.trim() || name[0], color: document.getElementById('fOttColor').value, logo: document.getElementById('fOttLogo').value.trim() });
    closeOTTModal(); refreshOTTTable(); showToast('Platform added');
    ['fOttName', 'fOttIcon', 'fOttLogo'].forEach(f => document.getElementById(f).value = '');
}
function delOTT(id) { if (confirm('Remove platform?')) { removeOTTPlatform(id); refreshOTTTable(); } }

/* ══════════════════════════════════════
   7. THEME
   ══════════════════════════════════════ */
function loadThemePanel() {
    const t = getThemeSettings();
    document.getElementById('tPrimary').value = t.primaryColor;
    document.getElementById('tAccent').value = t.accentColor;
    document.getElementById('tBg').value = t.bgColor;
    document.getElementById('tRadius').value = t.cardRadius;
    document.getElementById('tRadiusVal').textContent = t.cardRadius + 'px';
    document.getElementById('tGlass').value = t.glassIntensity;
    document.getElementById('tGlassVal').textContent = t.glassIntensity + 'px';
    document.getElementById('tFont').value = t.fontFamily;
    document.getElementById('tDarkMode').checked = t.darkMode;
    // Live preview on change
    ['tPrimary', 'tAccent', 'tBg'].forEach(id => document.getElementById(id).addEventListener('input', previewTheme));
    document.getElementById('tRadius').addEventListener('input', e => { document.getElementById('tRadiusVal').textContent = e.target.value + 'px'; previewTheme(); });
    document.getElementById('tGlass').addEventListener('input', e => { document.getElementById('tGlassVal').textContent = e.target.value + 'px'; previewTheme(); });
    document.getElementById('tFont').addEventListener('change', previewTheme);
    document.getElementById('tDarkMode').addEventListener('change', previewTheme);
}
function previewTheme() {
    const r = document.documentElement;
    r.style.setProperty('--accent-red', document.getElementById('tPrimary').value);
    r.style.setProperty('--accent-neon', document.getElementById('tAccent').value);
    r.style.setProperty('--radius-lg', document.getElementById('tRadius').value + 'px');
}
function saveTheme() {
    const t = {
        primaryColor: document.getElementById('tPrimary').value,
        accentColor: document.getElementById('tAccent').value,
        bgColor: document.getElementById('tBg').value,
        cardRadius: parseInt(document.getElementById('tRadius').value),
        glassIntensity: parseInt(document.getElementById('tGlass').value),
        fontFamily: document.getElementById('tFont').value,
        darkMode: document.getElementById('tDarkMode').checked
    };
    saveThemeSettings(t); showToast('Theme saved! Changes apply site-wide.');
}
function resetTheme() {
    localStorage.removeItem(DB.THEME); loadThemePanel();
    document.documentElement.style.removeProperty('--accent-red');
    document.documentElement.style.removeProperty('--accent-neon');
    document.documentElement.style.removeProperty('--radius-lg');
    showToast('Theme reset to defaults');
}

/* ══════════════════════════════════════
   8. SETTINGS
   ══════════════════════════════════════ */
function loadSettingsPanel() {
    const s = getSiteSettings(), m = getMaintenanceMode(), a = getAnnouncement();
    document.getElementById('sSiteName').value = s.siteName || '';
    document.getElementById('sLogoUrl').value = s.logoUrl || '';
    document.getElementById('sFavicon').value = s.faviconUrl || '';
    document.getElementById('sFooter').value = s.footerText || '';
    document.getElementById('sTelegram').value = s.telegramLink || '';
    document.getElementById('sSocialTwitter').value = (s.socialLinks || {}).twitter || '';
    document.getElementById('sSocialInsta').value = (s.socialLinks || {}).instagram || '';
    document.getElementById('sSocialYT').value = (s.socialLinks || {}).youtube || '';
    document.getElementById('sMaintenance').checked = m.enabled;
    document.getElementById('sMaintenanceMsg').value = m.message || '';
    document.getElementById('sAnnounce').checked = a.enabled;
    document.getElementById('sAnnounceMsg').value = a.message || '';
    document.getElementById('sAnnounceType').value = a.type || 'info';
}
function saveSettings() {
    saveSiteSettings({
        siteName: document.getElementById('sSiteName').value.trim() || 'CineStream',
        logoUrl: document.getElementById('sLogoUrl').value.trim(),
        faviconUrl: document.getElementById('sFavicon').value.trim(),
        footerText: document.getElementById('sFooter').value.trim(),
        telegramLink: document.getElementById('sTelegram').value.trim(),
        socialLinks: { twitter: document.getElementById('sSocialTwitter').value.trim(), instagram: document.getElementById('sSocialInsta').value.trim(), youtube: document.getElementById('sSocialYT').value.trim() }
    });
    saveMaintenanceMode({ enabled: document.getElementById('sMaintenance').checked, message: document.getElementById('sMaintenanceMsg').value.trim() });
    saveAnnouncement({ enabled: document.getElementById('sAnnounce').checked, message: document.getElementById('sAnnounceMsg').value.trim(), type: document.getElementById('sAnnounceType').value });
    showToast('Settings saved!');
}

/* ══════════════════════════════════════
   9. SEO
   ══════════════════════════════════════ */
function loadSEOPanel() {
    const s = getSEOSettings();
    document.getElementById('seoTitle').value = s.metaTitle || '';
    document.getElementById('seoDesc').value = s.metaDescription || '';
    document.getElementById('seoOg').value = s.ogImage || '';
}
function saveSEO() {
    saveSEOSettings({ metaTitle: document.getElementById('seoTitle').value.trim(), metaDescription: document.getElementById('seoDesc').value.trim(), ogImage: document.getElementById('seoOg').value.trim() });
    showToast('SEO settings saved!');
}

/* ══════════════════════════════════════
   10. PLAYER
   ══════════════════════════════════════ */
function loadPlayerPanel() {
    const p = getPlayerSettings();
    document.getElementById('pEmbed').checked = p.embedEnabled;
    document.getElementById('pLoading').checked = p.loadingAnimation;
    document.getElementById('pWarning').value = p.prePlayWarning || '';
    document.getElementById('pFallback').value = p.fallbackMsg || '';
}
function savePlayerCfg() {
    savePlayerSettings({
        embedEnabled: document.getElementById('pEmbed').checked,
        loadingAnimation: document.getElementById('pLoading').checked,
        prePlayWarning: document.getElementById('pWarning').value.trim(),
        fallbackMsg: document.getElementById('pFallback').value.trim()
    });
    showToast('Player settings saved!');
}

/* ══════════════════════════════════════
   11. PAGES
   ══════════════════════════════════════ */
function refreshPagesTable() {
    const pages = getCustomPages();
    document.getElementById('pagesTableBody').innerHTML = pages.map(p => `<tr>
    <td><strong>${p.title}</strong></td>
    <td><code>/page.html?slug=${p.slug}</code></td>
    <td><span class="status-dot ${p.enabled !== false ? 'visible' : 'hidden'}"></span>${p.enabled !== false ? 'Active' : 'Disabled'}</td>
    <td><div class="admin-table__actions">
      <button class="btn-edit" onclick="editPage('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
      <button class="btn-delete" onclick="delPage('${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
    </div></td></tr>`).join('');
}
function openPageModal(id) {
    const modal = document.getElementById('pageModal');
    if (id) {
        const p = getCustomPages().find(x => x.id === id); if (!p) return;
        document.getElementById('pageModalTitle').textContent = 'Edit Page';
        document.getElementById('editPageId').value = p.id;
        document.getElementById('fPageTitle').value = p.title;
        document.getElementById('fPageSlug').value = p.slug;
        document.getElementById('fPageContent').value = p.content || '';
    } else {
        document.getElementById('pageModalTitle').textContent = 'Add Page';
        document.getElementById('editPageId').value = '';
        ['fPageTitle', 'fPageSlug', 'fPageContent'].forEach(f => document.getElementById(f).value = '');
    }
    modal.classList.add('active');
    // Live preview
    document.getElementById('fPageContent').addEventListener('input', () => {
        document.getElementById('pagePreview').innerHTML = simpleMarkdown(document.getElementById('fPageContent').value);
    });
    document.getElementById('pagePreview').innerHTML = simpleMarkdown(document.getElementById('fPageContent').value);
}
function closePageModal() { document.getElementById('pageModal').classList.remove('active'); }
function editPage(id) { openPageModal(id); }
function savePage() {
    const title = document.getElementById('fPageTitle').value.trim();
    const slug = document.getElementById('fPageSlug').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!title || !slug) { showToast('Title and slug required', 'error'); return; }
    const data = { title, slug, content: document.getElementById('fPageContent').value };
    const editId = document.getElementById('editPageId').value;
    if (editId) { updateCustomPage(editId, data); showToast('Page updated'); }
    else { addCustomPage(data); showToast('Page added'); }
    closePageModal(); refreshPagesTable();
}
function delPage(id) { if (confirm('Delete page?')) { deleteCustomPage(id); refreshPagesTable(); showToast('Page deleted'); } }

// Simple markdown to HTML
function simpleMarkdown(md) {
    if (!md) return '';
    return md.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>').replace(/\n/g, '<br>');
}

/* ══════════════════════════════════════
   12. ANALYTICS
   ══════════════════════════════════════ */
function refreshAnalytics() {
    const a = getAnalytics(), movies = getMovies();
    const totalViews = a.totalPageViews || 0;
    const uniqueViewed = Object.keys(a.views || {}).length;
    const sectionClicks = Object.values(a.sectionClicks || {}).reduce((s, v) => s + v, 0);
    document.getElementById('analyticsStats').innerHTML = `
    <div class="stat-card"><div class="stat-card__value">${totalViews}</div><div class="stat-card__label">Total Page Views</div></div>
    <div class="stat-card"><div class="stat-card__value">${uniqueViewed}</div><div class="stat-card__label">Movies Viewed</div></div>
    <div class="stat-card"><div class="stat-card__value">${sectionClicks}</div><div class="stat-card__label">Section Clicks</div></div>
    <div class="stat-card"><div class="stat-card__value">${movies.length}</div><div class="stat-card__label">Total Library</div></div>`;
    const most = getMostWatchedMovies(10);
    document.getElementById('mostWatchedBody').innerHTML = most.length ? most.map(e => `<tr>
    <td><img class="admin-table__poster" src="${e.movie.poster || getPlaceholderPoster(e.movie.title)}" alt=""></td>
    <td>${e.movie.title}</td><td>${e.views}</td></tr>`).join('') : '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">No views tracked yet</td></tr>';
}

/* ══════════════════════════════════════
   13. SECURITY
   ══════════════════════════════════════ */
function changePin() {
    const cur = document.getElementById('secCurrentPin').value;
    const nw = document.getElementById('secNewPin').value;
    const cf = document.getElementById('secConfirmPin').value;
    if (cur !== getAdminPin()) { showToast('Current PIN incorrect', 'error'); return; }
    if (nw.length < 4) { showToast('New PIN must be at least 4 characters', 'error'); return; }
    if (nw !== cf) { showToast('PINs do not match', 'error'); return; }
    setAdminPin(nw);
    showToast('PIN changed successfully!');
    ['secCurrentPin', 'secNewPin', 'secConfirmPin'].forEach(f => document.getElementById(f).value = '');
}
function exportData() {
    const data = {}; for (const key of Object.values(DB)) { data[key] = gs(key); }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `cinestream-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); showToast('Data exported!');
}
function importData(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!confirm('This will overwrite all current data. Continue?')) return;
            for (const [key, val] of Object.entries(data)) { if (val !== null) ss(key, val); }
            showToast('Data imported! Refreshing...');
            setTimeout(() => location.reload(), 1000);
        } catch { showToast('Invalid backup file', 'error'); }
    };
    reader.readAsText(file);
}
function resetAllData() {
    if (!confirm('This will DELETE all data and reset to defaults. This cannot be undone!')) return;
    if (!confirm('Are you absolutely sure?')) return;
    for (const key of Object.values(DB)) localStorage.removeItem(key);
    showToast('All data reset. Reloading...');
    setTimeout(() => location.reload(), 1000);
}

/* ══════════════════════════════════════
   14. ADS MANAGER
   ══════════════════════════════════════ */
const AD_TYPE_LABELS = { banner: '🖼️ Banner', popup: '💬 Popup', inline: '📄 In-Content', sticky: '📌 Sticky Bottom' };
const AD_POS_LABELS = { 'below-hero': 'Below Hero', 'between-sections': 'Between Sections', 'after-ott': 'After OTT Filter', 'above-footer': 'Above Footer', 'center-popup': 'Center Popup', 'sticky-bottom': 'Sticky Bottom' };
const AD_FREQ_LABELS = { always: 'Always', 'once-session': 'Once/Session', 'once-day': 'Once/Day', 'every-3': 'Every 3rd Visit' };

function refreshAds() {
    const ads = getAds();
    const active = ads.filter(a => a.is_active).length;
    document.getElementById('adsStats').innerHTML = `
    <div class="stat-card"><div class="stat-card__value">${ads.length}</div><div class="stat-card__label">Total Ads</div></div>
    <div class="stat-card"><div class="stat-card__value">${active}</div><div class="stat-card__label">Active</div></div>
    <div class="stat-card"><div class="stat-card__value">${ads.filter(a => a.type === 'banner').length}</div><div class="stat-card__label">Banners</div></div>
    <div class="stat-card"><div class="stat-card__value">${ads.filter(a => a.type === 'popup').length}</div><div class="stat-card__label">Popups</div></div>`;

    const tbody = document.getElementById('adsTableBody');
    if (!ads.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:var(--space-xl)">No ads yet. Click "+ Add Ad" to create one.</td></tr>'; return; }
    tbody.innerHTML = ads.map(a => {
        const created = a.created_at ? new Date(a.created_at).toLocaleDateString() : '—';
        return `<tr>
        <td><span style="font-size:var(--fs-sm)">${AD_TYPE_LABELS[a.type] || a.type}</span>${a.label ? `<br><span style="color:var(--text-muted);font-size:var(--fs-xs)">${a.label}</span>` : ''}</td>
        <td>${AD_POS_LABELS[a.display_position] || a.display_position || '—'}</td>
        <td>${AD_FREQ_LABELS[a.frequency] || a.frequency || 'always'}</td>
        <td><span class="status-dot ${a.is_active ? 'visible' : 'hidden'}"></span>${a.is_active ? 'Active' : 'Disabled'}</td>
        <td>${created}</td>
        <td><div class="admin-table__actions">
          <button class="btn-toggle ${a.is_active ? '' : 'off'}" title="Toggle" onclick="toggleAdStatus('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="btn-edit" title="Edit" onclick="editAd('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="btn-delete" title="Delete" onclick="delAd('${a.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div></td></tr>`;
    }).join('');
}

function openAdModal(id) {
    const modal = document.getElementById('adModal');
    if (id) {
        const a = getAds().find(x => x.id === id); if (!a) return;
        document.getElementById('adModalTitle').textContent = 'Edit Advertisement';
        document.getElementById('editAdId').value = a.id;
        document.getElementById('fAdType').value = a.type || 'banner';
        document.getElementById('fAdPosition').value = a.display_position || 'below-hero';
        document.getElementById('fAdFrequency').value = a.frequency || 'always';
        document.getElementById('fAdLabel').value = a.label || '';
        document.getElementById('fAdContent').value = a.content_html || '';
        document.getElementById('fAdActive').checked = a.is_active;
    } else {
        document.getElementById('adModalTitle').textContent = 'Add Advertisement';
        document.getElementById('editAdId').value = '';
        document.getElementById('fAdType').value = 'banner';
        document.getElementById('fAdPosition').value = 'below-hero';
        document.getElementById('fAdFrequency').value = 'always';
        document.getElementById('fAdLabel').value = '';
        document.getElementById('fAdContent').value = '';
        document.getElementById('fAdActive').checked = true;
    }
    document.getElementById('adPreview').innerHTML = '';
    // Live preview
    const contentEl = document.getElementById('fAdContent');
    contentEl.oninput = () => { document.getElementById('adPreview').innerHTML = contentEl.value; };
    modal.classList.add('active');
}
function closeAdModal() { document.getElementById('adModal').classList.remove('active'); }
function editAd(id) { openAdModal(id); }
function saveAd() {
    const content = document.getElementById('fAdContent').value.trim();
    if (!content) { showToast('Ad content is required', 'error'); return; }
    const data = {
        type: document.getElementById('fAdType').value,
        display_position: document.getElementById('fAdPosition').value,
        frequency: document.getElementById('fAdFrequency').value,
        label: document.getElementById('fAdLabel').value.trim(),
        content_html: content,
        is_active: document.getElementById('fAdActive').checked
    };
    const editId = document.getElementById('editAdId').value;
    if (editId) { updateAd(editId, data); showToast('Ad updated!'); }
    else { addAd(data); showToast('Ad created!'); }
    closeAdModal(); refreshAds();
}
function toggleAdStatus(id) { toggleAdActive(id); refreshAds(); }
function delAd(id) { if (confirm('Delete this ad?')) { deleteAd(id); refreshAds(); showToast('Ad deleted'); } }

/* ══════════════════════════════════════
   15. MOVIE REQUESTS MANAGER
   ══════════════════════════════════════ */
let activeReqFilter = 'all';

function refreshRequests(statusFilter) {
    if (statusFilter) activeReqFilter = statusFilter;
    const all = getRequests();
    const pending = all.filter(r => r.status === 'pending').length;
    const added = all.filter(r => r.status === 'added').length;
    const rejected = all.filter(r => r.status === 'rejected').length;

    document.getElementById('reqStats').innerHTML = `
    <div class="stat-card"><div class="stat-card__value">${all.length}</div><div class="stat-card__label">Total Requests</div></div>
    <div class="stat-card"><div class="stat-card__value" style="color:var(--accent-neon)">${pending}</div><div class="stat-card__label">Pending</div></div>
    <div class="stat-card"><div class="stat-card__value" style="color:var(--accent-green)">${added}</div><div class="stat-card__label">Added</div></div>
    <div class="stat-card"><div class="stat-card__value" style="color:var(--accent-red)">${rejected}</div><div class="stat-card__label">Rejected</div></div>`;

    renderReqTable();
}

function filterRequests(status) {
    if (status) {
        activeReqFilter = status;
        document.querySelectorAll('.req-filter').forEach(b => b.classList.toggle('active', b.getAttribute('data-status') === status));
    }
    renderReqTable();
}

function renderReqTable() {
    let list = getRequests().sort((a, b) => b.created_at - a.created_at);
    // Status filter
    if (activeReqFilter !== 'all') list = list.filter(r => r.status === activeReqFilter);
    // Search filter
    const search = (document.getElementById('reqSearchInput')?.value || '').toLowerCase().trim();
    if (search) list = list.filter(r => r.movie_name.toLowerCase().includes(search));

    const tbody = document.getElementById('reqTableBody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:var(--space-xl)">No requests found.</td></tr>';
        return;
    }

    const statusBadge = (s) => {
        const colors = { pending: 'var(--accent-neon)', added: 'var(--accent-green)', rejected: 'var(--accent-red)' };
        const icons = { pending: '⏳', added: '✅', rejected: '❌' };
        return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:var(--radius-full);font-size:var(--fs-xs);font-weight:600;background:rgba(255,255,255,0.05);color:${colors[s] || 'var(--text-muted)'}">${icons[s] || ''} ${s}</span>`;
    };

    tbody.innerHTML = list.map(r => {
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString() : '—';
        return `<tr>
        <td><strong>${r.movie_name}</strong>${r.notes ? `<br><span style="font-size:var(--fs-xs);color:var(--text-muted)">${r.notes.slice(0, 60)}${r.notes.length > 60 ? '...' : ''}</span>` : ''}${r.email ? `<br><span style="font-size:10px;color:var(--text-muted)">📧 ${r.email}</span>` : ''}</td>
        <td>${r.language || '—'}</td>
        <td>${r.ott_platform || '—'}</td>
        <td>${statusBadge(r.status)}</td>
        <td style="font-size:var(--fs-xs)">${date}</td>
        <td><div class="admin-table__actions" style="flex-wrap:wrap">
          <select class="form-input" style="font-size:11px;padding:4px 8px;min-width:90px" onchange="changeReqStatus('${r.id}',this.value)">
            <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="added" ${r.status === 'added' ? 'selected' : ''}>Added</option>
            <option value="rejected" ${r.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
          <button class="btn-edit" title="Convert to Movie" onclick="convertReqToMovie('${r.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg></button>
          <button class="btn-delete" title="Delete" onclick="delReq('${r.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </div></td></tr>`;
    }).join('');
}

function changeReqStatus(id, status) {
    updateRequestStatus(id, status);
    refreshRequests();
    showToast(`Request marked as ${status}`);
}

function convertReqToMovie(id) {
    const req = getRequests().find(r => r.id === id);
    if (!req) return;
    if (!confirm(`Create movie entry for "${req.movie_name}"?`)) return;
    addMovie({
        title: req.movie_name,
        language: req.language || 'English',
        category: '',
        quality: 'HD',
        year: parseInt(req.year) || new Date().getFullYear(),
        ottPlatform: req.ott_platform || '',
        description: req.notes || '',
        telegramLink: 'https://t.me/cinestream',
        poster: '',
        genres: [],
        badges: [],
        featured: false,
        trending: false,
        topRated: false,
        displayPriority: 50
    });
    updateRequestStatus(id, 'added');
    refreshRequests();
    refreshMoviesTable();
    refreshDashboard();
    showToast(`"${req.movie_name}" added to movies! Edit it in Movies tab.`);
}

function delReq(id) {
    if (confirm('Delete this request?')) { deleteRequest(id); refreshRequests(); showToast('Request deleted'); }
}
