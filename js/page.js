/* ============================================
   VINX, KEN & ZYNTRI STUDIO
   CineStream — Custom Page Renderer
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const container = document.getElementById('pageContent');

    if (!slug) {
        container.innerHTML = '<div class="page-not-found"><h2>Page not found</h2><p style="color:var(--text-muted)">No page slug specified.</p><a href="index.html">Go Home</a></div>';
        return;
    }

    const page = getCustomPageBySlug(slug);
    if (!page) {
        container.innerHTML = `<div class="page-not-found"><h2>Page not found</h2><p style="color:var(--text-muted)">The page "${slug}" doesn't exist or is disabled.</p><a href="index.html">Go Home</a></div>`;
        return;
    }

    document.title = page.title + ' — CineStream';
    container.innerHTML = renderMarkdown(page.content || '');
});

function renderMarkdown(md) {
    if (!md) return '';
    return md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/m, '<p>$1')
        + '</p>';
}
