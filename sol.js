// ── Custom Cursor ──────────────────────────────────────────
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .bento-card, .team-card, .location-panel').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

// ── Header scroll state ──────────────────────────────────────
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hero entrance (GSAP) ─────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Set initial hidden states via JS (not CSS) so fallback works
gsap.set('#heroEyebrow',   { opacity: 0, y: 20 });
gsap.set('#heroHeadline',  { opacity: 0, y: 60 });
gsap.set('#heroSub',       { opacity: 0, y: 20 });
gsap.set('#heroDesc',      { opacity: 0, y: 20 });
gsap.set('#heroActions',   { opacity: 0, y: 20 });
gsap.set('#heroScroll',    { opacity: 0 });
gsap.set('#heroLocations', { opacity: 0 });

const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
tl.to('#heroEyebrow',   { opacity: 1, y: 0, duration: 0.9, delay: 0.2 })
  .to('#heroHeadline',  { opacity: 1, y: 0, duration: 1.3 }, '-=0.4')
  .to('#heroSub',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('#heroDesc',      { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('#heroActions',   { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('#heroScroll',    { opacity: 1, duration: 0.8 }, '-=0.3')
  .to('#heroLocations', { opacity: 1, duration: 0.8 }, '-=0.6');

// ── Parallax hero bg ─────────────────────────────────────────
gsap.to('#heroBg', {
  yPercent: 20,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

// ── Scroll-triggered reveals ─────────────────────────────────
function setupReveal(selector, fromVars) {
  document.querySelectorAll(selector).forEach((el) => {
    gsap.set(el, { opacity: 0, ...fromVars });
    gsap.to(el, {
      opacity: 1, x: 0, y: 0, duration: 1,
      ease: 'power3.out',
      delay: parseFloat(el.style.transitionDelay || 0),
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        onEnter: () => gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.style.transitionDelay || 0) })
      }
    });
  });
}
setupReveal('.reveal',       { y: 50 });
setupReveal('.reveal-left',  { x: -60 });
setupReveal('.reveal-right', { x: 60 });

// ── Stat counter animation ────────────────────────────────────
document.querySelectorAll('.stat-number').forEach(el => {
  const text = el.textContent;
  const num  = parseFloat(text);
  if (isNaN(num)) return;
  const suffix = text.replace(num.toString(), '');
  gsap.fromTo({ val: 0 }, { val: num }, {
    duration: 1.8,
    ease: 'power2.out',
    onUpdate: function() { el.innerHTML = Math.round(this.targets()[0].val) + '<span>' + suffix + '</span>'; },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
  });
});

// ── Magnetic buttons ─────────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-cta-large, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  });
});

// ── Bento card tilt ───────────────────────────────────────────
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, duration: 0.5, ease: 'power2.out', transformPerspective: 800 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' });
  });
});

// ── Mobile nav active state ───────────────────────────────────
document.querySelectorAll('.mobile-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ── Metric bar fills ─────────────────────────────────────────
document.querySelectorAll('.metric-bar-fill').forEach(bar => {
  const width = bar.dataset.width;
  ScrollTrigger.create({
    trigger: bar,
    start: 'top 85%',
    once: true,
    onEnter: () => { bar.style.width = width + '%'; }
  });
});

// ── Metric value counters ────────────────────────────────────
document.querySelectorAll('.metric-value[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  gsap.fromTo({ val: 0 }, { val: target }, {
    duration: 2, ease: 'power2.out',
    onUpdate: function() {
      el.innerHTML = Math.round(this.targets()[0].val) + '<span style="font-size:1.8rem">%</span>';
    },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }
  });
});

// ── Before/After tab switching ───────────────────────────────
document.querySelectorAll('.ba-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ba-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ba-panel-group').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.panel);
    if (target) {
      target.classList.add('active');
      gsap.fromTo(target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    }
  });
});

// ── Testimonial Carousel ─────────────────────────────────────
(function() {
  const track  = document.getElementById('tsTrack');
  const prev   = document.getElementById('tsPrev');
  const next   = document.getElementById('tsNext');
  const dotsEl = document.getElementById('tsDots');
  if (!track) return;

  const cards = track.querySelectorAll('.ts-card');
  let perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let current = 0;
  const total = Math.ceil(cards.length / perView);

  // Build dots
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'ts-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const gap = 32;
    const cardW = track.parentElement.offsetWidth / perView - (gap * (perView-1) / perView);
    const offset = current * (cardW + gap) * perView;
    gsap.to(track, { x: -offset, duration: 0.7, ease: 'power3.out' });
    dotsEl.querySelectorAll('.ts-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => {
    perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    goTo(0);
  });
})();

// ── Hide cursor on touch devices ─────────────────────────────
(function() {
  let isTouchDevice = false;
  window.addEventListener('touchstart', () => {
    isTouchDevice = true;
    document.body.style.cursor = 'auto';
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }, { once: true });
})();

// ── Nav hamburger toggle ──────────────────────────────────────
document.getElementById('navToggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav-links');
  if (nav) nav.classList.toggle('nav-open');
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
