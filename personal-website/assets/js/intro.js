// ============================================
// INTRO — only shows on first visit per session
// ============================================

(function () {
  // Skip intro if already visited this session
  if (sessionStorage.getItem('intro_done')) return;

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.innerHTML = `
    <div class="intro-inner">
      <p class="intro-name">Arya Satya Andhika Akbar</p>
      <div class="intro-line"></div>
      <p class="intro-sub">Loading experience</p>
      <div class="intro-loader">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Dismiss after 2.6s
  setTimeout(() => {
    overlay.classList.add('hide');
    setTimeout(() => {
      overlay.remove();
    }, 850);
  }, 2600);

  sessionStorage.setItem('intro_done', '1');
})();
