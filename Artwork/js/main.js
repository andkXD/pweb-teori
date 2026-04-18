// ============================================
// main.js — cursor, transitions, nav active
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // Cursor
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .work-row').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });

  // Page transition overlay
  const pt = document.createElement('div');
  pt.className = 'pt';
  document.body.appendChild(pt);

  // On load: play exit animation
  pt.style.transformOrigin = 'top';
  pt.style.transform = 'scaleY(1)';
  requestAnimationFrame(() => {
    pt.classList.add('out');
    pt.addEventListener('animationend', () => {
      pt.classList.remove('out');
      pt.style.transform = 'scaleY(0)';
    }, { once: true });
  });

  // Intercept clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      pt.style.transform = '';
      pt.style.transformOrigin = 'bottom';
      pt.classList.add('in');
      pt.addEventListener('animationend', () => { window.location.href = href; }, { once: true });
    });
  });

  // Active nav
  const path = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (
      (h.includes('works/index') && path.includes('works')) ||
      (h.includes('info') && path.includes('info')) ||
      (h === 'index.html' && (path.endsWith('/') || path.endsWith('index.html'))) ||
      (h === '../index.html' && (path.endsWith('/') || path.endsWith('index.html')))
    ) {
      a.classList.add('active');
    }
  });
});
