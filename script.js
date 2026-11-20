(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = '26097829639', MAIL = 'Sbipel@gmail.com';

  document.documentElement.classList.remove('no-js');
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const menu = $('.menu'), nav = $('#nav');
  const setMenu = open => { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', open); };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); menu.focus(); } });

  // Services accordion (one open at a time)
  const btns = $$('.acc button');
  const toggle = (b, open) => {
    b.setAttribute('aria-expanded', open);
    $('#' + b.getAttribute('aria-controls')).classList.toggle('open', open);
  };
  btns.forEach(b => b.addEventListener('click', () => {
    const willOpen = b.getAttribute('aria-expanded') !== 'true';
    btns.forEach(o => toggle(o, false));
    toggle(b, willOpen);
  }));
  toggle(btns[0], true);

  // Service links pre-select the matching option in the form
  $$('[data-svc]').forEach(a => a.addEventListener('click', () => {
    const box = $(`#chips input[value="${a.dataset.svc}"]`);
    if (box) box.checked = true;
  }));

  // Program-monitor timecode (25 fps)
  const tc = $('#tc');
  if (tc && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const t0 = performance.now(), p = n => String(n).padStart(2, '0');
    const tick = () => {
      const f = Math.floor((performance.now() - t0) / 40), s = Math.floor(f / 25);
      tc.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(f % 25)}`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  // Enquiry form: no backend needed, builds a message for WhatsApp or email
  const form = $('#enq'), err = $('#err');
  const compose = () => {
    const d = new FormData(form), svc = d.getAll('svc');
    if (!d.get('name').trim()) { err.hidden = false; form.name.focus(); return null; }
    err.hidden = true;
    return [
      'Hello SBI Investments Limited, I would like a quote.',
      `Name: ${d.get('name').trim()}`,
      `Event type: ${d.get('type')}`,
      d.get('date') && `Date: ${d.get('date')}`,
      d.get('venue').trim() && `Venue or city: ${d.get('venue').trim()}`,
      svc.length && `Needs: ${svc.join(', ')}`,
      d.get('msg').trim() && `Notes: ${d.get('msg').trim()}`
    ].filter(Boolean).join('\n');
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const m = compose();
    if (m) window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`, '_blank', 'noopener');
  });
  $('#mail').addEventListener('click', () => {
    const m = compose();
    if (m) location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Event quote request')}&body=${encodeURIComponent(m)}`;
  });
})();
