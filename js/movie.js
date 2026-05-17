/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Movie Detail Logic
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { window.location.href = 'index.html'; return; }

    const movie = getMovieById(id);
    if (!movie) { window.location.href = 'index.html'; return; }

    // Set page title
    document.title = `${movie.title} — CineStream`;

    // Banner
    const poster = movie.banner || movie.poster || getPlaceholderPoster(movie.title);
    document.getElementById('bannerImg').src = poster;
    document.getElementById('bannerImg').alt = movie.title;

    // Title
    document.getElementById('movieTitle').textContent = movie.title;

    // Meta
    const metaItems = [];
    if (movie.year) metaItems.push(`<span class="movie-detail__meta-item">${movie.year}</span>`);
    if (movie.language) metaItems.push(`<span class="movie-detail__meta-item"><span class="badge badge-lang">${movie.language}</span></span>`);
    if (movie.quality) metaItems.push(`<span class="movie-detail__meta-item"><span class="badge badge-quality">${movie.quality}</span></span>`);
    if (movie.category) metaItems.push(`<span class="movie-detail__meta-item">${movie.category}</span>`);
    document.getElementById('movieMeta').innerHTML = metaItems.join('<span class="movie-detail__meta-divider"></span>');

    // Genres
    if (movie.genres && movie.genres.length) {
        document.getElementById('movieGenres').innerHTML = movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
    }

    // Description
    document.getElementById('movieDesc').textContent = movie.description || 'No description available.';

    // Telegram direct link
    const directLink = document.getElementById('telegramDirectLink');
    if (movie.telegramLink) {
        directLink.href = movie.telegramLink;
    } else {
        directLink.style.display = 'none';
    }

    // ── Telegram Player Embed ──
    initTelegramPlayer(movie.telegramLink);

    // Related movies
    const related = getMoviesByCategory(movie.category).filter(m => m.id !== movie.id);
    if (related.length) {
        document.getElementById('relatedSection').style.display = '';
        document.getElementById('relatedTrack').innerHTML = related.map(m => createMovieCardHTML(m)).join('');
    }

    // Init sliders and animations
    initSliders();

    // Save to Continue Watching
    if (typeof addToContinueWatching === 'function') {
        addToContinueWatching({
            movie_id: movie.id,
            title: movie.title,
            poster_url: movie.poster || movie.banner || '',
            telegram_link: movie.telegramLink || '',
            last_watched_time: 0,
            timestamp: Date.now()
        });
    }

    // Save to Watch History
    if (typeof addToWatchHistory === 'function') {
        addToWatchHistory({
            movie_id: movie.id,
            title: movie.title,
            poster: movie.poster || movie.banner || '',
            platform: movie.ottPlatform || '',
            watched_at: Date.now()
        });
    }

    // Increment view count for Top 10 Today
    if (typeof incrementViewCount === 'function') {
        incrementViewCount(movie.id);
    }

    // Page fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => document.body.style.opacity = '1');
});

// ── Parse Telegram link → post ID ──
function parseTelegramPost(url) {
    if (!url) return null;
    // Match patterns:
    // https://t.me/channelname/123
    // https://telegram.me/channelname/123
    // t.me/channelname/123
    const match = url.match(/(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([^\/\s]+\/\d+)/i);
    return match ? match[1] : null;
}

// ── Initialize Telegram Player ──
function initTelegramPlayer(telegramLink) {
    const loading = document.getElementById('playerLoading');
    const error = document.getElementById('playerError');
    const embed = document.getElementById('playerEmbed');
    const fallback = document.getElementById('playerFallbackLink');
    const section = document.getElementById('playerSection');

    const postId = parseTelegramPost(telegramLink);

    if (!postId) {
        // No valid Telegram link: show error state
        loading.style.display = 'none';
        error.style.display = 'flex';
        if (telegramLink) {
            fallback.href = telegramLink;
        } else {
            fallback.style.display = 'none';
        }
        return;
    }

    // Set fallback link
    fallback.href = telegramLink;

    // Create the Telegram embed script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-post', postId);
    script.setAttribute('data-width', '100%');

    // Track load/error
    let loaded = false;

    script.onload = () => {
        loaded = true;
        // Give the widget time to render
        setTimeout(() => {
            loading.style.display = 'none';
            const iframe = embed.querySelector('iframe');
            if (iframe) {
                embed.style.opacity = '0';
                embed.style.transition = 'opacity 0.5s ease';
                requestAnimationFrame(() => embed.style.opacity = '1');
            } else {
                // Widget loaded but no iframe appeared — might be private
                checkEmbedRendered();
            }
        }, 2000);
    };

    script.onerror = () => {
        loading.style.display = 'none';
        error.style.display = 'flex';
    };

    embed.appendChild(script);

    // Fallback timeout: if nothing renders in 8s, show error
    setTimeout(() => {
        if (!loaded || !embed.querySelector('iframe')) {
            checkEmbedRendered();
        }
    }, 8000);
}

function checkEmbedRendered() {
    const loading = document.getElementById('playerLoading');
    const error = document.getElementById('playerError');
    const embed = document.getElementById('playerEmbed');

    const hasContent = embed.querySelector('iframe') || embed.querySelector('.telegram-post');
    if (!hasContent) {
        loading.style.display = 'none';
        error.style.display = 'flex';
    } else {
        loading.style.display = 'none';
    }
}

// ── Scroll to player ──
function scrollToPlayer() {
    const section = document.getElementById('playerSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief glow highlight
        const container = document.getElementById('playerContainer');
        container.style.boxShadow = '0 0 30px rgba(229,9,20,0.4), 0 4px 30px rgba(0,0,0,0.5)';
        setTimeout(() => {
            container.style.transition = 'box-shadow 1s ease';
            container.style.boxShadow = '';
        }, 1500);
    }
}
