/* ========================================
   script.js — Ranjani S Portfolio v2
   ======================================== */

/* ---- LOADER ---- */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initScrollReveal();
    initHeroStats();
  }, 2000);
});

/* ---- CUSTOM CURSOR ---- */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function ringFollow() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(ringFollow);
})();

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 50);
  updateActiveNav();
  toggleScrollTop();
  lastScroll = y;
});

/* ---- ACTIVE NAV ---- */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('[data-nav]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ---- MOBILE MENU ---- */
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose   = document.getElementById('mobileClose');
const mobileLinks   = document.querySelectorAll('.mobile-link');

function openMobile() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobile);
mobileClose.addEventListener('click', closeMobile);
mobileOverlay.addEventListener('click', closeMobile);
mobileLinks.forEach(l => l.addEventListener('click', closeMobile));

/* ---- TYPEWRITER ---- */
const phrases = [
  'SEO Strategies',
  'Google & Meta Ads',
  'Content Marketing',
  'Lead Generation Funnels',
  'Brand Growth Campaigns',
];
let pIdx = 0, cIdx = 0, deleting = false;
const typeEl = document.getElementById('typeTarget');

function typeLoop() {
  const phrase = phrases[pIdx];
  typeEl.textContent = deleting
    ? phrase.slice(0, --cIdx)
    : phrase.slice(0, ++cIdx);

  let delay = deleting ? 48 : 80;
  if (!deleting && cIdx === phrase.length) {
    delay = 2000; deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    delay = 450;
  }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 1800);

/* ---- SCROLL REVEAL ---- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal-up'));
      const delay = siblings.indexOf(el) * 90;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

  /* skill bars */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.sbar-fill').forEach(fill => {
        fill.style.width = fill.dataset.w + '%';
      });
      barObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.sbar-group').forEach(g => barObs.observe(g));
}

/* ---- HERO STAT COUNT-UP ---- */
function initHeroStats() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.hstat-num').forEach(el => {
        countUp(el, 0, +el.dataset.count, 1200);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  const block = document.querySelector('.hero-stats');
  if (block) obs.observe(block);
}
function countUp(el, from, to, dur) {
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * (to - from) + from);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to;
  })(start);
}

/* ---- LIGHTBOX ---- */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');

document.querySelectorAll('.proj-shot').forEach(shot => {
  shot.addEventListener('click', () => {
    const src = shot.dataset.img;
    const cap = shot.dataset.caption || '';
    if (!src) { showToast('✦ Add a screenshot path to data-img'); return; }
    lbImg.src = src; lbImg.alt = cap; lbCaption.textContent = cap;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});
function closeLB() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 350);
}
lbClose.addEventListener('click', closeLB);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

/* ---- SCROLL TO TOP ---- */
const scrollTopBtn = document.getElementById('scrollTop');
function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- CONTACT FORM ---- */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const msg     = document.getElementById('fmsg').value.trim();
  if (!name || !email) return;
  const body = `Hi Ranjani,\n\nName: ${name}\nEmail: ${email}\n\n${msg}`;
  const link = `mailto:ranjanismarketing@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Enquiry')}&body=${encodeURIComponent(body)}`;
  window.location.href = link;
  showToast('✦ Opening your mail client…');
  this.reset();
});

/* ---- TOAST ---- */
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- PROJECT CARD 3D TILT ---- */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-8px) rotateY(${dx * 3.5}deg) rotateX(${-dy * 3.5}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---- FILM GRAIN OVERLAY ---- */
(function addGrain() {
  const c = document.createElement('canvas');
  c.width = 200; c.height = 200;
  c.style.cssText = `
    position:fixed;inset:0;width:100vw;height:100vh;
    pointer-events:none;z-index:9000;opacity:0.018;mix-blend-mode:overlay;
  `;
  const ctx = c.getContext('2d');
  const d = ctx.createImageData(200, 200);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255;
    d.data[i] = d.data[i+1] = d.data[i+2] = v;
    d.data[i+3] = 255;
  }
  ctx.putImageData(d, 0, 0);
  document.body.appendChild(c);
})();

/* ---- TAG PILLS HOVER STAGGER ---- */
document.querySelectorAll('.tag-cloud').forEach(cloud => {
  const pills = cloud.querySelectorAll('.tag-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = (i * 25) + 'ms';
  });
});
const card = document.querySelector('.hero-card-visual');

document.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;
  card.style.transform = `translate(${x}px, ${y}px)`;
});