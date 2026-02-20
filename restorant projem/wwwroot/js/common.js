// Global loader (tüm sayfalarda kullanılabilir)
window.__loaderCount = 0;

function ensureLoaderElement() {
    let overlay = document.getElementById('global-loader');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-loader';
        overlay.className = 'loader-overlay';
        overlay.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(overlay);
    }
    return overlay;
}

function showLoader() {
    const overlay = ensureLoaderElement();
    window.__loaderCount = (window.__loaderCount || 0) + 1;
    overlay.classList.add('visible');
}

function hideLoader() {
    const overlay = document.getElementById('global-loader');
    if (!overlay) return;
    window.__loaderCount = Math.max((window.__loaderCount || 0) - 1, 0);
    if (window.__loaderCount === 0) {
        overlay.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa açılır açılmaz loader elemanını hazırla ama gizli bırak.
    ensureLoaderElement();
});


