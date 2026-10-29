// Shared behaviour for every page. Loaded as an ES module; pages work without it.

const root = document.documentElement;

// Theme: an explicit choice is stored; with no choice the CSS follows prefers-color-scheme.
const themeBtn = document.querySelector('.theme-toggle');
const dark = matchMedia('(prefers-color-scheme: dark)');
const currentTheme = () => root.dataset.theme || (dark.matches ? 'dark' : 'light');
const syncTheme = () => {
  const isDark = currentTheme() === 'dark';
  themeBtn?.setAttribute('aria-pressed', String(isDark));
  themeBtn?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
};
themeBtn?.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch { /* storage blocked: choice lasts this visit */ }
  syncTheme();
});
dark.addEventListener('change', syncTheme);
syncTheme();

// Mobile navigation
const navBtn = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
const setNav = (open) => {
  navBtn?.setAttribute('aria-expanded', String(open));
  navList?.classList.toggle('is-open', open);
};
navBtn?.addEventListener('click', () => setNav(navBtn.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navBtn?.getAttribute('aria-expanded') === 'true') { setNav(false); navBtn.focus(); }
});
navList?.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });

// Section entrances (CSS skips them entirely under prefers-reduced-motion)
const reveal = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach((node) => reveal.observe(node));

// Screenshot lightbox: native <dialog> gives focus trapping and Escape to close.
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  document.querySelectorAll('.shot').forEach((btn) => btn.addEventListener('click', () => {
    const thumb = btn.querySelector('img');
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    caption.textContent = btn.closest('figure')?.querySelector('figcaption')?.textContent ?? '';
    lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
}

// Project cards from data/projects.json
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null) node.setAttribute(key, value);
  }
  node.append(...children.filter((c) => c != null));
  return node;
}

function projectCard(p) {
  const links = el('p', { class: 'card-links' });
  if (p.caseStudy) links.append(el('a', { href: p.caseStudy }, 'Read the case study'));
  if (p.live) links.append(el('a', { href: p.live, rel: 'noopener' }, 'Visit live site'));
  if (p.repo) links.append(el('a', { href: p.repo, rel: 'noopener' }, 'View source on GitHub'));

  return el('article', { class: `card${p.flagship ? ' card--flagship' : ''}` },
    p.image ? el('img', { src: p.image, alt: p.imageAlt, width: 1200, height: 675, loading: 'lazy', decoding: 'async' }) : null,
    el('div', { class: 'card-body' },
      el('h3', {}, p.name),
      el('p', { class: 'card-type' }, `${p.type} · ${p.year}`),
      el('p', {}, p.summary),
      el('ul', { class: 'tags', 'aria-label': 'Built with' }, ...p.tech.map((t) => el('li', {}, t))),
      links));
}

const projectMounts = document.querySelectorAll('[data-projects]');
if (projectMounts.length) {
  fetch('data/projects.json')
    .then((res) => { if (!res.ok) throw new Error(res.status); return res.json(); })
    .then((projects) => {
      projectMounts.forEach((mount) => {
        const list = mount.dataset.projects === 'featured' ? projects.filter((p) => p.featured) : projects;
        mount.replaceChildren(...list.map(projectCard));
        mount.setAttribute('aria-busy', 'false');
      });
    })
    .catch(() => projectMounts.forEach((mount) => {
      mount.setAttribute('aria-busy', 'false');
      mount.replaceChildren(el('p', {}, 'Projects could not be loaded. ',
        el('a', { href: 'https://github.com/theyyluvpreeths' }, 'See them on GitHub instead.')));
    }));
}
