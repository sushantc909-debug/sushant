/* ============================================================
   SUSHANT STUDIOS — interactions
   3D anti-gravity particles · LUT Lab slider · tilt · PWA
   ============================================================ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- LUT data ---------------- */
const LUTS = {
  amber: {
    name: 'Amber',
    scene: 'images/scene-amber.jpg',
    desc: 'Warm amber highlights with clean blue shadow separation for rainy city nights.',
    filter: 'saturate(1.18) contrast(1.07) sepia(0.2) hue-rotate(-8deg) brightness(1.03)',
  },
  green: {
    name: 'Pale Green',
    scene: 'images/scene-green.jpg',
    desc: 'Soft pale-green shadows, muted highlights and a quiet editorial finish for overcast streets.',
    filter: 'saturate(0.88) contrast(1.05) hue-rotate(42deg) brightness(1.04)',
  },
  harbour: {
    name: 'Harbour Blue',
    scene: 'images/scene-harbour.jpg',
    desc: 'Clean harbour blues, restrained contrast and cool atmospheric depth for waterfront views.',
    filter: 'saturate(1.08) contrast(1.06) hue-rotate(14deg) brightness(1.02)',
  },
  cyan: {
    name: 'Island Cyan',
    scene: 'images/scene-cyan.jpg',
    desc: 'Fresh cyan tones, luminous highlights and relaxed tropical contrast for summer travel footage.',
    filter: 'saturate(1.3) contrast(1.06) hue-rotate(-12deg) brightness(1.06)',
  },
  avenue: {
    name: 'Avenue Star',
    scene: 'images/scene-avenue.jpg',
    desc: 'Warm urban highlights, balanced night contrast and a subtle cinematic glow for city nights.',
    filter: 'saturate(1.22) contrast(1.12) sepia(0.14) brightness(1.04)',
  },
  mongkok: {
    name: 'Mong Kok',
    scene: 'images/scene-mongkok.jpg',
    desc: 'Dense color, vivid practical lights and energetic contrast inspired by neon market streets.',
    filter: 'saturate(1.5) contrast(1.2) hue-rotate(-6deg) brightness(1.02)',
  },
};

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg, ms = 3600) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ---------------- scroll progress + nav ---------------- */
(function () {
  const bar = $('#progress');
  const nav = $('#nav');
  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 40);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ---------------- mobile menu ---------------- */
(function () {
  const btn = $('#menuBtn');
  const menu = $('#mobileMenu');
  function set(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', () => set(!menu.classList.contains('open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
})();

/* ---------------- reveal on scroll ---------------- */
(function () {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------------- 3D tilt (fine pointers only) ---------------- */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches || reducedMotion) return;
  $$('.tilt').forEach((el) => {
    let raf = null;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(950px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
        raf = null;
      });
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // subtle parallax tilt for the hero
  const hero = $('#heroTilt');
  const heroSec = $('#hero');
  if (hero && heroSec) {
    heroSec.addEventListener('mousemove', (e) => {
      const r = heroSec.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    });
    heroSec.addEventListener('mouseleave', () => { hero.style.transform = ''; });
  }
})();

/* ============================================================
   ANTI-GRAVITY PARTICLE FIELD (hero canvas)
   ============================================================ */
(function () {
  const canvas = $('#gravity');
  const hero = $('#hero');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    '255, 179, 71',   // amber
    '245, 192, 101',  // gold
    '77, 227, 255',   // cyan
    '150, 240, 255',  // ice
  ];

  // pre-render glow sprites (fast)
  function makeSprite(rgb) {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, `rgba(${rgb}, 0.95)`);
    grad.addColorStop(0.25, `rgba(${rgb}, 0.4)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    return c;
  }
  const sprites = COLORS.map(makeSprite);

  let W = 0, H = 0, parts = [];
  const mouse = { x: -9999, y: -9999 };
  let running = !reducedMotion;
  let visible = true;

  function spawn(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 20 + Math.random() * 120,
      z: 0.25 + Math.random() * 0.75,
      r: 1.4 + Math.random() * 3.2,
      c: sprites[(Math.random() * sprites.length) | 0],
      rgb: COLORS[(Math.random() * COLORS.length) | 0],
      vy: 0.14 + Math.random() * 0.55,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 10 + Math.random() * 30,
      swaySpd: 0.4 + Math.random() * 0.9,
    };
  }

  function seed() {
    const n = Math.min(110, Math.max(30, Math.round((W * H) / 17000)));
    parts = Array.from({ length: n }, () => spawn(true));
  }

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function frame(t) {
    if (!running || !visible || document.hidden) { requestAnimationFrame(frame); return; }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.y -= p.vy * p.z;
      p.sway += 0.012 * p.swaySpd;
      let px = p.x + Math.sin(p.sway) * p.swayAmp * p.z;

      // anti-gravity: cursor repels the orbs
      const dx = px - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      const R = 150;
      if (d2 < R * R && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) * 12;
        px += (dx / d) * f;
        p.y += (dy / d) * f;
      }

      if (p.y < -40) parts[i] = p = spawn(false);

      const size = p.r * p.z * 7;
      ctx.globalAlpha = 0.35 + p.z * 0.55;
      ctx.drawImage(p.c, px - size / 2, p.y - size / 2, size, size);
      // bright core
      ctx.globalAlpha = 0.5 + p.z * 0.5;
      ctx.fillStyle = `rgba(${p.rgb}, 0.9)`;
      ctx.beginPath();
      ctx.arc(px, p.y, Math.max(0.6, p.r * p.z * 0.55), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  if (reducedMotion) {
    // draw one static frame
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const size = p.r * p.z * 7;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(p.c, p.x - size / 2, p.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  } else {
    requestAnimationFrame(frame);
  }
})();

/* ============================================================
   LUT LAB — before / after compare slider
   ============================================================ */
(function () {
  const compare = $('#compare');
  const imgRaw = $('#imgRaw');
  const imgGraded = $('#imgGraded');
  const nameEl = $('#lutName');
  const descEl = $('#lutDesc');
  const getEl = $('#getLut');
  const chips = $$('#lutChips .chip');
  if (!compare) return;

  let current = 'amber';

  /* ----- slider ----- */
  let dragging = false;
  function setPos(clientX) {
    const r = compare.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    compare.style.setProperty('--pos', p + '%');
    compare.setAttribute('aria-valuenow', String(Math.round(p)));
  }
  compare.addEventListener('pointerdown', (e) => {
    dragging = true;
    compare.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  });
  compare.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
  ['pointerup', 'pointercancel'].forEach((ev) =>
    compare.addEventListener(ev, () => { dragging = false; })
  );
  compare.addEventListener('keydown', (e) => {
    const now = parseFloat(compare.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(compare.getBoundingClientRect().left + ((now - 5) / 100) * compare.getBoundingClientRect().width); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPos(compare.getBoundingClientRect().left + ((now + 5) / 100) * compare.getBoundingClientRect().width); }
  });

  /* ----- LUT switching ----- */
  function setLut(key) {
    const L = LUTS[key];
    if (!L || key === current) return;
    current = key;

    chips.forEach((c) => {
      const on = c.dataset.lut === key;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });

    // crossfade the scene
    imgRaw.classList.add('switching');
    imgGraded.classList.add('switching');
    const apply = () => {
      imgRaw.src = L.scene;
      imgGraded.src = L.scene;
      imgGraded.style.filter = L.filter;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        imgRaw.classList.remove('switching');
        imgGraded.classList.remove('switching');
      }));
    };
    const pre = new Image();
    pre.src = L.scene;
    pre.onload = apply;
    pre.onerror = apply;

    // meta
    nameEl.textContent = L.name;
    descEl.textContent = L.desc;
    getEl.href = 'mailto:hello@sushant.studio?subject=' + encodeURIComponent('Get the ' + L.name + ' LUT pack');
  }
  chips.forEach((c) => c.addEventListener('click', () => setLut(c.dataset.lut)));

  // initial LUT filter on the graded layer
  imgGraded.style.filter = LUTS.amber.filter;
})();

/* ---------------- contact form (mailto) ---------------- */
(function () {
  const form = $('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name') || '').toString();
    const msg = (d.get('msg') || '').toString();
    window.location.href =
      'mailto:hello@sushant.studio' +
      '?subject=' + encodeURIComponent('LUT + AI project from ' + (name || 'the website')) +
      '&body=' + encodeURIComponent(msg + '\n\n— ' + name);
    toast('Opening your email app… the message is ready to send ✦');
  });
})();

/* ============================================================
   PWA — install prompt + service worker
   ============================================================ */
(function () {
  const installBtns = $$('[id^="installBtn"]');
  let deferred = null;

  function showBtns() { installBtns.forEach((b) => (b.hidden = false)); }
  function hideBtns() { installBtns.forEach((b) => (b.hidden = true)); }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    showBtns();
  });

  async function install() {
    if (!deferred) {
      toast('On your phone: open this page in Chrome → tap ⋮ → “Install app”. On laptop: click the install icon in the address bar.');
      return;
    }
    deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    hideBtns();
    if (choice.outcome === 'accepted') {
      toast('Installed! Find the Sushant icon on your home screen ✦');
    }
  }
  installBtns.forEach((b) => b.addEventListener('click', install));

  window.addEventListener('appinstalled', () => {
    hideBtns();
    toast('App installed — Sushant Studios is on your home screen ✦');
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('in-app');
    hideBtns();
  }

  // register offline service worker (needs https or localhost)
  const secure =
    window.isSecureContext &&
    'serviceWorker' in navigator &&
    (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname));
  if (secure) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('js/sw.js').catch(() => {});
    });
  }
})();
