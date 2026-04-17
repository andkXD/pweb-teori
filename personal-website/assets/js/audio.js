// ============================================
// GLOBAL AUDIO PLAYER — seamless across pages
// Playlist loops: nc17 → Von → nc17 → ...
// ============================================

(function () {
  // ── Resolve base path ────────────────────────
  const cssLink = document.querySelector('link[href*="assets/css"]');
  const prefix  = cssLink
    ? cssLink.getAttribute('href').replace('assets/css/style.css', '')
    : '../';

  const PLAYLIST = [
    { name: 'nc17', path: prefix + 'assets/audio/nc17.mp3' },
    { name: 'Von',  path: prefix + 'assets/audio/Von.mp3'  },
  ];

  // ── Restore state from sessionStorage ────────
  let currentIndex = parseInt(sessionStorage.getItem('ap_index') || '0', 10);
  let currentTime  = parseFloat(sessionStorage.getItem('ap_time')  || '0');
  let isMuted      = sessionStorage.getItem('ap_muted') === 'true';

  // ── Build widget ─────────────────────────────
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
    <span class="np-text">Now playing — "${PLAYLIST[currentIndex].name}"</span>
  `;
  document.body.appendChild(widget);

  // ── Audio setup ──────────────────────────────
  const audio = new Audio();
  audio.volume = 0.35;
  audio.muted  = isMuted;

  function loadTrack(index, startTime) {
    audio.src = PLAYLIST[index].path;
    audio.currentTime = startTime || 0;
    const textEl = widget.querySelector('.np-text');
    textEl.textContent = isMuted
      ? `Muted — "${PLAYLIST[index].name}"`
      : `Now playing — "${PLAYLIST[index].name}"`;
  }

  function playTrack(index, startTime) {
    loadTrack(index, startTime);
    audio.play().catch(() => {});
  }

  // On track end → advance to next
  audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % PLAYLIST.length;
    sessionStorage.setItem('ap_index', currentIndex);
    sessionStorage.setItem('ap_time', '0');
    playTrack(currentIndex, 0);
  });

  // Save position every second
  setInterval(() => {
    if (!audio.paused) {
      sessionStorage.setItem('ap_time',  audio.currentTime.toFixed(2));
      sessionStorage.setItem('ap_index', currentIndex);
      sessionStorage.setItem('ap_muted', isMuted);
    }
  }, 1000);

  // Save right before navigating away
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('ap_time',  audio.currentTime.toFixed(2));
    sessionStorage.setItem('ap_index', currentIndex);
    sessionStorage.setItem('ap_muted', isMuted);
  });

  // ── Initial play ──────────────────────────────
  function tryPlay() {
    loadTrack(currentIndex, currentTime);
    audio.play().catch(() => {
      const unlock = () => {
        audio.play();
        ['click','keydown','wheel'].forEach(e => document.removeEventListener(e, unlock));
      };
      ['click','keydown','wheel'].forEach(e => document.addEventListener(e, unlock));
    });
  }

  tryPlay();

  // ── Mute / unmute on click ────────────────────
  widget.addEventListener('click', () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    sessionStorage.setItem('ap_muted', isMuted);
    widget.classList.toggle('muted', isMuted);
    const textEl = widget.querySelector('.np-text');
    textEl.textContent = isMuted
      ? `Muted — "${PLAYLIST[currentIndex].name}"`
      : `Now playing — "${PLAYLIST[currentIndex].name}"`;
  });

  if (isMuted) widget.classList.add('muted');
})();
