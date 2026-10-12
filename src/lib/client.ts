import type { Lens } from '@/data/profile';

const root = document.documentElement;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  set(k: string, v: string) {
    try { localStorage.setItem(k, v); } catch { /* private mode */ }
  },
};

type Listener = (lens: Lens) => void;
const lensListeners = new Set<Listener>();
export const onLensChange = (fn: Listener) => { lensListeners.add(fn); return () => lensListeners.delete(fn); };
export const currentLens = (): Lens => (root.dataset.lens === 'quant' ? 'quant' : 'ai');

function syncLensUI() {
  const lens = currentLens();
  document.querySelectorAll<HTMLElement>('[data-set-lens]').forEach((b) =>
    b.setAttribute('aria-checked', String(b.dataset.setLens === lens)),
  );
  document.querySelectorAll<HTMLAnchorElement>('[data-cv-link]').forEach((a) => {
    a.href = lens === 'quant' ? '/Meet_Babariya_Quant_CV.pdf' : '/Meet_Babariya_AI_CV.pdf';
  });
}

function setLens(lens: Lens) {
  if (lens === currentLens()) return;
  const run = () => {
    root.dataset.lens = lens;
    syncLensUI();
    lensListeners.forEach((fn) => fn(lens));
  };
  store.set('lens', lens);
  const url = new URL(location.href);
  url.searchParams.set('lens', lens);
  history.replaceState(history.state, '', url);
  // Cross-fade the whole page where supported; otherwise switch instantly.
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduced()) doc.startViewTransition(run);
  else run();
}

/** Event delegation — registered once for the lifetime of the tab. */
export function initGlobal() {
  // A ?lens= link should stick for the rest of the visit.
  store.set('lens', currentLens());

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const lensBtn = t.closest<HTMLElement>('[data-set-lens]');
    if (lensBtn) return setLens(lensBtn.dataset.setLens as Lens);

    if (t.closest('[data-theme-toggle]')) {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      store.set('theme', next);
      return;
    }

    const copy = t.closest<HTMLElement>('[data-copy]');
    if (copy) {
      navigator.clipboard?.writeText(copy.dataset.copy ?? '').then(() => {
        const label = copy.textContent;
        copy.toggleAttribute('data-done', true);
        copy.textContent = 'Copied';
        setTimeout(() => { copy.textContent = label; copy.removeAttribute('data-done'); }, 1600);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'l') setLens(currentLens() === 'ai' ? 'quant' : 'ai');
  });

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.classList.toggle('scrolled', scrollY > 8);
      ticking = false;
    });
  }, { passive: true });
}

let pageCleanup: Array<() => void> = [];

/** Runs on first load and after every client-side navigation. */
export function initPage() {
  pageCleanup.forEach((fn) => fn());
  pageCleanup = [];
  syncLensUI();
  root.classList.toggle('scrolled', scrollY > 8);

  // Reveal on scroll. Content is visible without JS; the .js class opts in.
  const pending = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (reduced() || !('IntersectionObserver' in window)) {
    pending.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    pending.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    // Never leave content hidden if the observer is throttled (background tab, preview tools).
    const t = setTimeout(() => pending.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in');
    }), 1500);
    pageCleanup.push(() => { io.disconnect(); clearTimeout(t); });
  }

  // Stuttgart clock
  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
    const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
    tick();
    const id = setInterval(tick, 15_000);
    pageCleanup.push(() => clearInterval(id));
  }
}

export const registerCleanup = (fn: () => void) => pageCleanup.push(fn);
