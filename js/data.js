/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Data Layer (Dynamic CMS)
   ============================================ */

const DB = {
  MOVIES: 'cs_m', CATS: 'cs_c', OTT: 'cs_o', PIN: 'cs_p', INIT: 'cs_i',
  SITE: 'cs_site', THEME: 'cs_theme_cfg', SECTIONS: 'cs_sections',
  BANNERS: 'cs_banners', HERO_CFG: 'cs_hero_cfg', PAGES: 'cs_pages',
  SEO: 'cs_seo', PLAYER: 'cs_player', ANNOUNCE: 'cs_announce',
  MAINT: 'cs_maint', ANALYTICS: 'cs_analytics', ADS: 'cs_ads'
};

const gid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
const gs = k => { try { const d = localStorage.getItem(k); return d ? JSON.parse(d) : null; } catch { return null; } };
const ss = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ── Movies ── */
function getMovies() { return gs(DB.MOVIES) || []; }
function getVisibleMovies() {
  const now = Date.now();
  return getMovies().filter(m => m.visible !== false && (!m.scheduledAt || m.scheduledAt <= now));
}
function getMovieById(id) { return getMovies().find(m => m.id === id) || null; }
function getMoviesByCategory(cat) { return getVisibleMovies().filter(m => m.category === cat || (m.categories && m.categories.includes(cat))); }
function getMoviesByOTT(name) { return getVisibleMovies().filter(m => m.ottPlatform === name); }
function getFeaturedMovies() { return getVisibleMovies().filter(m => m.featured).sort((a, b) => (a.displayPriority || 99) - (b.displayPriority || 99)); }
function getTrendingMovies() { return getVisibleMovies().filter(m => m.trending).sort((a, b) => (a.displayPriority || 99) - (b.displayPriority || 99)); }
function getLatestMovies() { return getVisibleMovies().sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)).slice(0, 20); }
function getTopRatedMovies() { return getVisibleMovies().filter(m => m.topRated); }
function getMoviesByIds(ids) { return ids.map(id => getMovieById(id)).filter(Boolean).filter(m => m.visible !== false); }
function searchMovies(q) {
  q = q.toLowerCase().trim(); if (!q) return [];
  return getVisibleMovies().filter(m => m.title.toLowerCase().includes(q) ||
    (m.description || '').toLowerCase().includes(q) || (m.language || '').toLowerCase().includes(q) ||
    (m.category || '').toLowerCase().includes(q) || (m.ottPlatform || '').toLowerCase().includes(q));
}
function addMovie(movie) {
  const movies = getMovies();
  const n = { ...movie, id: gid(), addedAt: Date.now(), visible: true, displayPriority: movie.displayPriority || 50 };
  movies.push(n); ss(DB.MOVIES, movies); return n;
}
function updateMovie(id, updates) {
  const movies = getMovies(); const i = movies.findIndex(m => m.id === id);
  if (i === -1) return null; movies[i] = { ...movies[i], ...updates, updatedAt: Date.now() };
  ss(DB.MOVIES, movies); return movies[i];
}
function deleteMovie(id) { ss(DB.MOVIES, getMovies().filter(m => m.id !== id)); }
function toggleMovieVisibility(id) { const m = getMovieById(id); return m ? updateMovie(id, { visible: !m.visible }) : null; }
function toggleMovieFeatured(id) { const m = getMovieById(id); return m ? updateMovie(id, { featured: !m.featured }) : null; }

/* ── Categories ── */
function getCategories() { return gs(DB.CATS) || []; }
function addCategory(name) {
  const cats = getCategories(); if (cats.find(c => c.name.toLowerCase() === name.toLowerCase())) return null;
  const c = { id: gid(), name }; cats.push(c); ss(DB.CATS, cats); return c;
}
function deleteCategory(id) { ss(DB.CATS, getCategories().filter(c => c.id !== id)); }

/* ── OTT Platforms ── */
function getOTTPlatforms() { return gs(DB.OTT) || []; }
function addOTTPlatform(p) { const ps = getOTTPlatforms(); const n = { ...p, id: gid() }; ps.push(n); ss(DB.OTT, ps); return n; }
function removeOTTPlatform(id) { ss(DB.OTT, getOTTPlatforms().filter(p => p.id !== id)); }

/* ── Admin PIN ── */
function getAdminPin() { return gs(DB.PIN) || '1234'; }
function setAdminPin(pin) { ss(DB.PIN, pin); }

/* ── Site Settings ── */
function getSiteSettings() {
  return gs(DB.SITE) || {
    siteName: 'CineStream', logoUrl: '', faviconUrl: '', footerText: '© 2025 CineStream. All rights reserved.',
    telegramLink: 'https://t.me/cinestream', socialLinks: { twitter: '', instagram: '', youtube: '' }
  };
}
function saveSiteSettings(s) { ss(DB.SITE, s); }

/* ── Theme Settings ── */
function getThemeSettings() {
  return gs(DB.THEME) || {
    primaryColor: '#e50914', accentColor: '#ff3d5a', bgColor: '#0a0a0a',
    cardRadius: 12, glassIntensity: 20, fontFamily: 'Inter',
    darkMode: true
  };
}
function saveThemeSettings(t) { ss(DB.THEME, t); }

/* ── Homepage Sections ── */
function getHomepageSections() {
  return gs(DB.SECTIONS) || [];
}
function saveHomepageSections(sections) { ss(DB.SECTIONS, sections); }
function addHomepageSection(section) {
  const sections = getHomepageSections();
  const maxOrder = sections.reduce((max, s) => Math.max(max, s.order || 0), 0);
  const n = { ...section, id: gid(), order: maxOrder + 1, enabled: true };
  sections.push(n); ss(DB.SECTIONS, sections); return n;
}
function updateHomepageSection(id, updates) {
  const sections = getHomepageSections(); const i = sections.findIndex(s => s.id === id);
  if (i === -1) return null; sections[i] = { ...sections[i], ...updates };
  ss(DB.SECTIONS, sections); return sections[i];
}
function deleteHomepageSection(id) { ss(DB.SECTIONS, getHomepageSections().filter(s => s.id !== id)); }
function reorderSection(id, direction) {
  const sections = getHomepageSections().sort((a, b) => a.order - b.order);
  const idx = sections.findIndex(s => s.id === id);
  if (idx === -1) return;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= sections.length) return;
  const tmpOrder = sections[idx].order;
  sections[idx].order = sections[swapIdx].order;
  sections[swapIdx].order = tmpOrder;
  ss(DB.SECTIONS, sections);
}

/* ── Hero Banners ── */
function getHeroBanners() { return gs(DB.BANNERS) || []; }
function getHeroConfig() {
  return gs(DB.HERO_CFG) || { enabled: true, autoSlide: true, speed: 5000 };
}
function saveHeroConfig(cfg) { ss(DB.HERO_CFG, cfg); }
function addHeroBanner(banner) {
  const banners = getHeroBanners();
  const maxOrder = banners.reduce((max, b) => Math.max(max, b.order || 0), 0);
  const n = { ...banner, id: gid(), order: maxOrder + 1, enabled: true };
  banners.push(n); ss(DB.BANNERS, banners); return n;
}
function updateHeroBanner(id, updates) {
  const banners = getHeroBanners(); const i = banners.findIndex(b => b.id === id);
  if (i === -1) return null; banners[i] = { ...banners[i], ...updates };
  ss(DB.BANNERS, banners); return banners[i];
}
function deleteHeroBanner(id) { ss(DB.BANNERS, getHeroBanners().filter(b => b.id !== id)); }

/* ── Custom Pages ── */
function getCustomPages() { return gs(DB.PAGES) || []; }
function getCustomPageBySlug(slug) { return getCustomPages().find(p => p.slug === slug && p.enabled !== false) || null; }
function addCustomPage(page) {
  const pages = getCustomPages();
  const n = { ...page, id: gid(), enabled: true, createdAt: Date.now() };
  pages.push(n); ss(DB.PAGES, pages); return n;
}
function updateCustomPage(id, updates) {
  const pages = getCustomPages(); const i = pages.findIndex(p => p.id === id);
  if (i === -1) return null; pages[i] = { ...pages[i], ...updates, updatedAt: Date.now() };
  ss(DB.PAGES, pages); return pages[i];
}
function deleteCustomPage(id) { ss(DB.PAGES, getCustomPages().filter(p => p.id !== id)); }

/* ── SEO Settings ── */
function getSEOSettings() {
  return gs(DB.SEO) || {
    metaTitle: 'CineStream — Watch Movies Free | Premium Streaming',
    metaDescription: 'Stream the latest movies for free. No signup required. Enjoy trending, action, sci-fi, thriller, and regional movies in HD and 4K quality.',
    ogImage: ''
  };
}
function saveSEOSettings(s) { ss(DB.SEO, s); }

/* ── Player Settings ── */
function getPlayerSettings() {
  return gs(DB.PLAYER) || {
    embedEnabled: true, fallbackMsg: 'Video is currently unavailable. Please try again later.',
    prePlayWarning: '', loadingAnimation: true
  };
}
function savePlayerSettings(s) { ss(DB.PLAYER, s); }

/* ── Announcement ── */
function getAnnouncement() { return gs(DB.ANNOUNCE) || { enabled: false, message: '', type: 'info' }; }
function saveAnnouncement(a) { ss(DB.ANNOUNCE, a); }

/* ── Maintenance Mode ── */
function getMaintenanceMode() { return gs(DB.MAINT) || { enabled: false, message: 'We are currently performing maintenance. Please check back shortly.' }; }
function saveMaintenanceMode(m) { ss(DB.MAINT, m); }

/* ── Analytics ── */
function getAnalytics() { return gs(DB.ANALYTICS) || { views: {}, sectionClicks: {}, totalPageViews: 0 }; }
function saveAnalytics(a) { ss(DB.ANALYTICS, a); }
function trackMovieView(movieId) {
  const a = getAnalytics();
  a.views[movieId] = (a.views[movieId] || 0) + 1;
  a.totalPageViews = (a.totalPageViews || 0) + 1;
  saveAnalytics(a);
}
function trackSectionClick(sectionId) {
  const a = getAnalytics();
  a.sectionClicks[sectionId] = (a.sectionClicks[sectionId] || 0) + 1;
  saveAnalytics(a);
}
function getMovieViewCount(movieId) { return (getAnalytics().views || {})[movieId] || 0; }
function getMostWatchedMovies(limit = 10) {
  const a = getAnalytics();
  const sorted = Object.entries(a.views || {}).sort((a, b) => b[1] - a[1]).slice(0, limit);
  return sorted.map(([id, views]) => ({ movie: getMovieById(id), views })).filter(e => e.movie);
}

/* ── Ads ── */
function getAds() { return gs(DB.ADS) || []; }
function getActiveAds() { return getAds().filter(a => a.is_active); }
function getAdsByType(type) { return getActiveAds().filter(a => a.type === type); }
function addAd(ad) {
  const ads = getAds();
  const n = { ...ad, id: gid(), is_active: true, created_at: Date.now() };
  ads.push(n); ss(DB.ADS, ads); return n;
}
function updateAd(id, updates) {
  const ads = getAds(); const i = ads.findIndex(a => a.id === id);
  if (i === -1) return null; ads[i] = { ...ads[i], ...updates };
  ss(DB.ADS, ads); return ads[i];
}
function deleteAd(id) { ss(DB.ADS, getAds().filter(a => a.id !== id)); }
function toggleAdActive(id) { const a = getAds().find(x => x.id === id); return a ? updateAd(id, { is_active: !a.is_active }) : null; }

/* ── Continue Watching ── */
const CW_KEY = 'continue_watching';
const CW_MAX = 10;
function getContinueWatching() {
  try { return JSON.parse(localStorage.getItem(CW_KEY)) || []; } catch { return []; }
}
function addToContinueWatching(entry) {
  // entry: { movie_id, title, poster_url, last_watched_time, timestamp }
  let list = getContinueWatching();
  // Remove existing entry for same movie (dedup)
  list = list.filter(e => e.movie_id !== entry.movie_id);
  // Add to front (most recent first)
  list.unshift({ ...entry, timestamp: Date.now() });
  // Cap at max
  if (list.length > CW_MAX) list = list.slice(0, CW_MAX);
  localStorage.setItem(CW_KEY, JSON.stringify(list));
}
function removeContinueWatching(movieId) {
  const list = getContinueWatching().filter(e => e.movie_id !== movieId);
  localStorage.setItem(CW_KEY, JSON.stringify(list));
}

/* ── View Count / Top 10 Today ── */
function incrementViewCount(movieId) {
  // Reset counts daily
  const dateKey = 'cs_views_date';
  const today = new Date().toDateString();
  if (localStorage.getItem(dateKey) !== today) {
    // New day — reset all view counts
    const movies = getMovies();
    movies.forEach(m => m.view_count = 0);
    ss(DB.MOVIES, movies);
    localStorage.setItem(dateKey, today);
  }
  const movies = getMovies();
  const i = movies.findIndex(m => m.id === movieId);
  if (i !== -1) {
    movies[i].view_count = (movies[i].view_count || 0) + 1;
    ss(DB.MOVIES, movies);
  }
}
function getTop10Today() {
  return getVisibleMovies()
    .filter(m => (m.view_count || 0) > 0)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 10);
}

/* ── Watch History ── */
const WH_KEY = 'watch_history';
const WH_MAX = 15;
function getWatchHistory() {
  try { return JSON.parse(localStorage.getItem(WH_KEY)) || []; } catch { return []; }
}
function addToWatchHistory(entry) {
  // entry: { movie_id, title, poster, platform, watched_at }
  let list = getWatchHistory();
  list = list.filter(e => e.movie_id !== entry.movie_id);
  list.unshift({ ...entry, watched_at: Date.now() });
  if (list.length > WH_MAX) list = list.slice(0, WH_MAX);
  localStorage.setItem(WH_KEY, JSON.stringify(list));
}
function removeFromWatchHistory(movieId) {
  const list = getWatchHistory().filter(e => e.movie_id !== movieId);
  localStorage.setItem(WH_KEY, JSON.stringify(list));
}

/* ── Movie Requests ── */
function getRequests() { return gs('cs_requests') || []; }
function addRequest(req) {
  const list = getRequests();
  const n = { ...req, id: gid(), status: 'pending', created_at: Date.now() };
  list.push(n); ss('cs_requests', list);
  return n;
}
function updateRequestStatus(id, status) {
  const list = getRequests(); const i = list.findIndex(r => r.id === id);
  if (i === -1) return null; list[i].status = status;
  ss('cs_requests', list); return list[i];
}
function deleteRequest(id) { ss('cs_requests', getRequests().filter(r => r.id !== id)); }
function getMostRequested() {
  const list = getRequests().filter(r => r.status === 'pending');
  const counts = {};
  list.forEach(r => {
    const key = r.movie_name.toLowerCase().trim();
    counts[key] = counts[key] || { name: r.movie_name, count: 0 };
    counts[key].count++;
  });
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 10);
}
function canSubmitRequest(movieName) {
  // Check 30s cooldown
  const lastSubmit = parseInt(localStorage.getItem('cs_req_last') || '0');
  if (Date.now() - lastSubmit < 30000) return { ok: false, reason: 'Please wait 30 seconds between requests.' };
  // Check duplicate within 24h
  const name = movieName.toLowerCase().trim();
  const recent = getRequests().filter(r =>
    r.movie_name.toLowerCase().trim() === name && (Date.now() - r.created_at) < 86400000
  );
  if (recent.length) return { ok: false, reason: 'This movie was already requested in the last 24 hours.' };
  return { ok: true };
}

/* ── Seed Data ── */
function seedData() {
  if (gs(DB.INIT)) return;

  const cats = ['Trending', 'Latest', 'Action', 'Science Fiction', 'Thriller', 'Top Rated', 'Regional', 'Drama', 'Horror', 'Comedy', 'Romance'];
  ss(DB.CATS, cats.map(name => ({ id: gid(), name })));

  ss(DB.OTT, [
    { id: gid(), name: 'Netflix', color: '#E50914', icon: 'N', logo: '' },
    { id: gid(), name: 'Prime Video', color: '#00A8E1', icon: 'P', logo: '' },
    { id: gid(), name: 'Disney+ Hotstar', color: '#1A73E8', icon: 'D', logo: '' },
    { id: gid(), name: 'JioCinema', color: '#E8118A', icon: 'J', logo: '' },
    { id: gid(), name: 'Zee5', color: '#8230C6', icon: 'Z', logo: '' },
    { id: gid(), name: 'SonyLIV', color: '#070707', icon: 'S', logo: '' },
    { id: gid(), name: 'MX Player', color: '#0D5CFF', icon: 'M', logo: '' },
    { id: gid(), name: 'Voot', color: '#EE1C4A', icon: 'V', logo: '' }
  ]);

  // Default homepage sections
  ss(DB.SECTIONS, [
    { id: gid(), type: 'trending', title: '🔥 Trending Now', enabled: true, order: 1, config: {} },
    { id: gid(), type: 'latest', title: '🆕 Latest Releases', enabled: true, order: 2, config: {} },
    { id: gid(), type: 'category', title: '💥 Action Movies', enabled: true, order: 3, config: { category: 'Action' } },
    { id: gid(), type: 'category', title: '🚀 Science Fiction', enabled: true, order: 4, config: { category: 'Science Fiction' } },
    { id: gid(), type: 'category', title: '🔪 Thriller', enabled: true, order: 5, config: { category: 'Thriller' } },
    { id: gid(), type: 'topRated', title: '⭐ Top Rated', enabled: true, order: 6, config: {} },
    { id: gid(), type: 'category', title: '🎭 Regional Cinema', enabled: true, order: 7, config: { category: 'Regional' } }
  ]);

  // Default hero banners (linked to first 3 featured movies after seeding)
  // Will be populated after movies seed

  const M = (t, d, cat, lang, q, yr, f, tr, top, g, ott) => ({
    id: gid(), title: t, description: d, category: cat, language: lang, quality: q, year: yr,
    featured: f, trending: tr, topRated: top, visible: true, poster: '', banner: '',
    telegramLink: 'https://t.me/cinestream', genres: g, ottPlatform: ott || '',
    displayPriority: 50, badges: q === '4K' ? ['4K'] : ['HD'], categories: [cat],
    addedAt: Date.now() - Math.random() * 100000
  });

  const movies = [
    M('Shadow Realm', 'A warrior crosses dimensions to save worlds from ancient darkness.', 'Action', 'English', '4K', 2025, true, true, true, ['Action', 'Fantasy', 'Adventure'], 'Netflix'),
    M('Neon Nights', 'In a cyberpunk city, a hacker uncovers a conspiracy that could reshape society.', 'Science Fiction', 'English', 'HD', 2025, true, true, false, ['Sci-Fi', 'Thriller', 'Cyberpunk'], 'Prime Video'),
    M('The Last Heist', 'A retired thief is pulled back for one final job that defines his fate.', 'Thriller', 'English', 'HD', 2024, true, false, true, ['Thriller', 'Crime', 'Drama'], 'Netflix'),
    M('Crimson Dawn', 'An elite team faces an impossible mission behind enemy lines.', 'Action', 'English', '4K', 2025, true, true, false, ['Action', 'War', 'Drama'], 'Disney+ Hotstar'),
    M('Echoes of Tomorrow', 'A scientist communicates with her future self with devastating consequences.', 'Science Fiction', 'English', 'HD', 2024, true, false, true, ['Sci-Fi', 'Drama', 'Mystery'], 'Prime Video'),
    M('Blade of Fury', 'A legendary swordsman returns from exile to protect his village.', 'Action', 'Hindi', 'HD', 2024, false, true, false, ['Action', 'Martial Arts'], 'JioCinema'),
    M('Whispers in the Dark', 'A paranormal investigator faces her most terrifying case yet.', 'Thriller', 'English', 'HD', 2024, false, true, false, ['Thriller', 'Horror', 'Mystery'], 'Netflix'),
    M('Stardust Protocol', 'Astronauts discover an alien signal leading to a gateway beyond known space.', 'Science Fiction', 'English', '4K', 2025, false, true, true, ['Sci-Fi', 'Adventure', 'Space'], 'Prime Video'),
    M('Inferno Run', 'Survivors cross burning wastelands to reach the last safe city.', 'Action', 'English', 'HD', 2025, false, false, false, ['Action', 'Survival', 'Dystopian'], 'Disney+ Hotstar'),
    M('The Silent Witness', 'A deaf woman must outsmart a killer who knows she saw everything.', 'Thriller', 'English', 'HD', 2024, false, false, true, ['Thriller', 'Suspense'], 'Zee5'),
    M('RRR: Rise Roar Revolt', 'Two revolutionaries forge an epic friendship against the British Empire.', 'Regional', 'Telugu', '4K', 2022, false, true, true, ['Action', 'Drama', 'Historical'], 'JioCinema'),
    M('Pushpa: The Rule', 'The ruthless smuggler returns with greater ambitions and enemies.', 'Regional', 'Telugu', 'HD', 2024, false, true, false, ['Action', 'Crime', 'Drama'], 'JioCinema'),
    M('Jawan', 'A man infiltrates a corrupt system to fight for justice.', 'Regional', 'Hindi', 'HD', 2023, false, false, true, ['Action', 'Thriller', 'Drama'], 'Netflix'),
    M('Quantum Break', 'Reality fractures when a quantum experiment goes catastrophically wrong.', 'Science Fiction', 'English', 'HD', 2025, false, false, false, ['Sci-Fi', 'Thriller'], 'SonyLIV'),
    M('Blood Contract', 'A former assassin is forced back when her dark past is threatened.', 'Action', 'English', 'HD', 2024, false, false, false, ['Action', 'Crime', 'Thriller'], 'MX Player'),
    M('The Vanishing Act', "Audience members start disappearing during a magician's sold-out show.", 'Thriller', 'English', 'HD', 2024, false, false, false, ['Thriller', 'Mystery'], 'Zee5'),
    M('Vortex Rising', 'Storm chasers race to deploy a device before a superstorm destroys the coast.', 'Action', 'English', '4K', 2025, false, false, false, ['Action', 'Disaster', 'Thriller'], 'Voot'),
    M('Kalki 2898 AD', 'In a dystopian future, heroes protect humanity from an immortal tyrant.', 'Regional', 'Telugu', '4K', 2024, false, true, true, ['Sci-Fi', 'Action', 'Mythology'], 'Disney+ Hotstar'),
    M('Midnight Protocol', 'A cyber-security expert discovers a network controlling world governments.', 'Thriller', 'English', 'HD', 2025, false, false, false, ['Thriller', 'Cyber', 'Espionage'], 'Prime Video'),
    M("Dragon's Path", 'A young orphan discovers she is the last descendant of dragon riders.', 'Action', 'English', 'HD', 2025, false, false, false, ['Fantasy', 'Adventure', 'Action'], 'Netflix')
  ];
  ss(DB.MOVIES, movies);

  // Seed hero banners from first 3 featured
  const featured = movies.filter(m => m.featured).slice(0, 3);
  ss(DB.BANNERS, featured.map((m, i) => ({
    id: gid(), movieId: m.id, image: '', heading: m.title,
    subtext: m.description, enabled: true, order: i + 1
  })));

  // Seed custom pages
  ss(DB.PAGES, [
    { id: gid(), slug: 'about', title: 'About Us', content: '# About CineStream\n\nCineStream is a free movie streaming platform. Watch the latest movies without any signup or subscription.', enabled: true, createdAt: Date.now() },
    { id: gid(), slug: 'privacy', title: 'Privacy Policy', content: '# Privacy Policy\n\nWe respect your privacy. CineStream does not collect personal data.', enabled: true, createdAt: Date.now() },
    { id: gid(), slug: 'terms', title: 'Terms of Service', content: '# Terms of Service\n\nBy using CineStream, you agree to our terms of service.', enabled: true, createdAt: Date.now() },
    { id: gid(), slug: 'contact', title: 'Contact', content: '# Contact Us\n\nReach us on Telegram: @cinestream', enabled: true, createdAt: Date.now() }
  ]);

  ss(DB.PIN, '1234');
  ss(DB.INIT, true);
}
seedData();

/* ── Migration: seed missing stores for existing installs ── */
function migrateData() {
  // Seed homepage sections if missing
  if (!gs(DB.SECTIONS) || gs(DB.SECTIONS).length === 0) {
    ss(DB.SECTIONS, [
      { id: gid(), type: 'trending', title: '🔥 Trending Now', enabled: true, order: 1, config: {} },
      { id: gid(), type: 'latest', title: '🆕 Latest Releases', enabled: true, order: 2, config: {} },
      { id: gid(), type: 'category', title: '💥 Action Movies', enabled: true, order: 3, config: { category: 'Action' } },
      { id: gid(), type: 'category', title: '🚀 Science Fiction', enabled: true, order: 4, config: { category: 'Science Fiction' } },
      { id: gid(), type: 'category', title: '🔪 Thriller', enabled: true, order: 5, config: { category: 'Thriller' } },
      { id: gid(), type: 'topRated', title: '⭐ Top Rated', enabled: true, order: 6, config: {} },
      { id: gid(), type: 'category', title: '🎭 Regional Cinema', enabled: true, order: 7, config: { category: 'Regional' } }
    ]);
  }

  // Seed hero banners if missing
  if (!gs(DB.BANNERS) || gs(DB.BANNERS).length === 0) {
    const featured = getMovies().filter(m => m.featured).slice(0, 3);
    if (featured.length) {
      ss(DB.BANNERS, featured.map((m, i) => ({
        id: gid(), movieId: m.id, image: '', heading: m.title,
        subtext: m.description, enabled: true, order: i + 1
      })));
    }
  }

  // Seed custom pages if missing
  if (!gs(DB.PAGES) || gs(DB.PAGES).length === 0) {
    ss(DB.PAGES, [
      { id: gid(), slug: 'about', title: 'About Us', content: '# About CineStream\n\nCineStream is a free movie streaming platform.', enabled: true, createdAt: Date.now() },
      { id: gid(), slug: 'privacy', title: 'Privacy Policy', content: '# Privacy Policy\n\nWe respect your privacy.', enabled: true, createdAt: Date.now() },
      { id: gid(), slug: 'terms', title: 'Terms of Service', content: '# Terms of Service\n\nBy using CineStream, you agree to our terms.', enabled: true, createdAt: Date.now() },
      { id: gid(), slug: 'contact', title: 'Contact', content: '# Contact Us\n\nReach us on Telegram: @cinestream', enabled: true, createdAt: Date.now() }
    ]);
  }

  // Ensure movies have required new fields
  const movies = getMovies();
  let updated = false;
  movies.forEach(m => {
    if (m.visible === undefined) { m.visible = true; updated = true; }
    if (!m.displayPriority) { m.displayPriority = 50; updated = true; }
    if (!m.badges) { m.badges = m.quality === '4K' ? ['4K'] : ['HD']; updated = true; }
    if (!m.categories) { m.categories = m.category ? [m.category] : []; updated = true; }
  });
  if (updated) ss(DB.MOVIES, movies);
}
migrateData();
