// ============================================
// GLOBAL AUDIO PLAYER — persists across pages
// ============================================

(function () {
  // Resolve audio path relative to current page
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  // if inside /pages/ depth will be higher → need ../assets
  const prefix = document.querySelector('link[href*="assets/css"]')
    ?.getAttribute('href')
    ?.replace('assets/css/style.css', '') || '../';

  const SONG_NAME = 'nc17';
  const SONG_PATH = prefix + 'assets/audio/nc17.mp3';

  // ── Inject widget HTML ──────────────────────
  const widget = document.createElement('div');
  widget.className = 'now-playing';
  widget.id = 'nowPlaying';
  widget.innerHTML = `
    <div class="np-bars">
      <div class="np-bar"></div>
      <div class="np-bar"></div>
      <div class="np-bar"></div>
      <div class="np-bar"></div>
    </div>
    <span class="np-dot"></span>
    <span class="np-text">Now playing — "${SONG_NAME}"</span>
  `;
  document.body.appendChild(widget);

  // ── Audio setup ─────────────────────────────
  const audio = new Audio(SONG_PATH);
  audio.loop   = true;
  audio.volume = 0.35;

  let muted = false;

  // Try autoplay; browsers may block until interaction
  function tryPlay() {
    audio.play().catch(() => {
      // If blocked, play on first user interaction
      const unlock = () => {
        audio.play();
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
        document.removeEventListener('wheel', unlock);
      };
      document.addEventListener('click', unlock);
      document.addEventListener('keydown', unlock);
      document.addEventListener('wheel', unlock);
    });
  }

  tryPlay();

  // ── Click to mute / unmute ──────────────────
  widget.addEventListener('click', () => {
    muted = !muted;
    audio.muted = muted;
    widget.classList.toggle('muted', muted);

    const textEl = widget.querySelector('.np-text');
    textEl.textContent = muted
      ? `Muted — "${SONG_NAME}"`
      : `Now playing — "${SONG_NAME}"`;
  });
})();
