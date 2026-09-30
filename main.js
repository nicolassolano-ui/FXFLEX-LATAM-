(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const $ = (s, r = document) => r.querySelector(s);

  // Los iconos (Material Symbols) se muestran recién cuando carga la fuente
  const iconsReady = () => document.documentElement.classList.add('icons-ready');
  if (document.fonts && document.fonts.load) {
    document.fonts.load('24px "Material Symbols Outlined"').then(iconsReady, iconsReady);
    setTimeout(iconsReady, 3000);
  } else iconsReady();

  // Pestañas de aplicaciones por sector
  const ON = ['bg-primary', 'text-pure-white', 'shadow-sm'];
  const OFF = ['bg-pure-white', 'text-on-surface-variant'];
  const tabs = $$('.app-tab-btn');
  const panels = $$('.app-panel');
  tabs.forEach((btn) => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(btn.classList.contains('bg-primary')));
    btn.addEventListener('click', () => {
      tabs.forEach((b) => {
        b.classList.remove(...ON); b.classList.add(...OFF);
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add(...ON); btn.classList.remove(...OFF);
      btn.setAttribute('aria-selected', 'true');
      panels.forEach((p) => p.classList.add('hidden'));
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.remove('hidden');
    });
  });

  // Preguntas frecuentes
  const toggles = $$('.faq-toggle');
  toggles.forEach((t) => {
    t.setAttribute('aria-expanded', 'false');
    t.addEventListener('click', () => {
      const content = t.nextElementSibling;
      const willOpen = content.classList.contains('hidden');
      $$('.faq-content').forEach((c) => c.classList.add('hidden'));
      toggles.forEach((x) => {
        x.setAttribute('aria-expanded', 'false');
        $('.material-symbols-outlined', x).classList.remove('rotate-180');
      });
      if (willOpen) {
        content.classList.remove('hidden');
        t.setAttribute('aria-expanded', 'true');
        $('.material-symbols-outlined', t).classList.add('rotate-180');
      }
    });
  });

  // Menú móvil
  const btn = $('#menu-btn');
  const menu = $('#mobile-menu');
  if (btn && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      $('.material-symbols-outlined', btn).textContent = open ? 'close' : 'menu';
    };
    btn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // Sección activa en la navegación
  const spyLinks = $$('a[data-spy]');
  const setActive = (id) => spyLinks.forEach((a) => {
    const active = a.getAttribute('href') === '#' + id;
    a.classList.toggle('text-primary', active);
    a.classList.toggle('font-semibold', active);
    a.classList.toggle('text-on-surface-variant', !active);
    if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  // Año del pie
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
