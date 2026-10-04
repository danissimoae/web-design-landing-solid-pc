(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Задание 1: тёмная тема ===== */
  const KEY = 'theme';
  const toggle = document.querySelector('.theme-toggle');
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const stored = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const applyTheme = (t) => {
    root.dataset.theme = t;
    toggle.setAttribute('aria-pressed', String(t === 'dark'));
    toggle.textContent = t === 'dark' ? '☀' : '☾';
  };
  applyTheme(stored() || (mq.matches ? 'dark' : 'light'));
  toggle.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(t);
    try { localStorage.setItem(KEY, t); } catch {}
  });
  mq.addEventListener('change', (e) => { if (!stored()) applyTheme(e.matches ? 'dark' : 'light'); });

  /* ===== Задание 2: мобильное меню ===== */
  const menu = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  const closeBtn = menu.querySelector('.menu__close');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    (open ? closeBtn : burger).focus({ preventScroll: true });
  };
  burger.addEventListener('click', () => setMenu(true));
  closeBtn.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ===== Задание 3: анимации при скролле ===== */
  // Появление блоков (fade-in + slide-up)
  const items = document.querySelectorAll('.hero, .section-head, .pc, .review, .cta');
  if (!reduce && 'IntersectionObserver' in window) {
    items.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  // Прогресс-бар и параллакс hero
  const bar = document.querySelector('.progress span');
  const heroBg = document.querySelector('.hero__bg');
  let ticking = false;
  const update = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (heroBg && !reduce) heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
})();
