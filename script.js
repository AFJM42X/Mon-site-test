/* ========================
   VARIABLES GLOBALES
======================== */
const navbar = document.getElementById('navbar');
const navLogoBadge = document.getElementById('navLogoBadge');
let lastScrollTop = 0;
let isAutoScrolling = false; // distingue scroll auto vs manuel

const DESKTOP_BREAKPOINT = 1024;

/* ========================
   CARROUSEL SLIDER SMOOTH
======================== */
const carousel = document.querySelector('.carousel');
const slidesContainer = document.querySelector('.slides-container');
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsContainer = document.querySelector('.dots');
const prevControl = document.querySelector('.carousel-control.prev');
const nextControl = document.querySelector('.carousel-control.next');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let currentSlide = 0;
let autoSlideTimer = null;
let dots = [];

if (slides.length && dotsContainer) {
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => setSlide(index));
    dotsContainer.appendChild(dot);
  });
  dots = Array.from(dotsContainer.querySelectorAll('span'));
}

function updateSlidePosition() {
  if (!slidesContainer) return;
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentSlide]) {
    dots[currentSlide].classList.add('active');
  }
}

function setSlide(index, { resetTimer = true } = {}) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  updateSlidePosition();
  updateDots();
  if (resetTimer) {
    resetAutoSlide();
  }
}

function startAutoSlide() {
  if (prefersReducedMotion.matches || slides.length <= 1 || autoSlideTimer) {
    return;
  }
  autoSlideTimer = window.setInterval(() => setSlide(currentSlide + 1, { resetTimer: false }), 5000);
}

function stopAutoSlide() {
  if (!autoSlideTimer) return;
  window.clearInterval(autoSlideTimer);
  autoSlideTimer = null;
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

const handleMotionPreferenceChange = event => {
  if (event.matches) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
};

if (prefersReducedMotion.addEventListener) {
  prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
} else if (prefersReducedMotion.addListener) {
  prefersReducedMotion.addListener(handleMotionPreferenceChange);
}

if (prevControl) {
  prevControl.addEventListener('click', () => setSlide(currentSlide - 1));
}

if (nextControl) {
  nextControl.addEventListener('click', () => setSlide(currentSlide + 1));
}

if (carousel) {
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);
  carousel.addEventListener('touchstart', stopAutoSlide, { passive: true });
  carousel.addEventListener('touchend', startAutoSlide);
}

document.addEventListener('keydown', event => {
  if (!carousel || document.body.classList.contains('overlay-active')) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    setSlide(currentSlide - 1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    setSlide(currentSlide + 1);
  }
});

updateSlidePosition();
updateDots();
startAutoSlide();

/* ========================
   ANIMATIONS SCROLL
======================== */
const faders = document.querySelectorAll('.fade-in, .slide-in');
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;
  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('visible');
    }
  });
});

/* ========================
   NAVBAR HIDE/SHOW (ignore scroll auto)
======================== */
const applyNavState = scrollTop => {
  if (!navbar) return;

  if (window.innerWidth <= DESKTOP_BREAKPOINT) {
    navbar.classList.remove('nav-hidden');
    document.body.classList.remove('show-mini-logo');
    return;
  }

  const isScrollingDown = scrollTop > lastScrollTop;
  const shouldHide = scrollTop > 120 && isScrollingDown;

  navbar.classList.toggle('nav-hidden', shouldHide);
  document.body.classList.toggle('show-mini-logo', shouldHide);
};

window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;

  if (isAutoScrolling) {
    if (Math.abs(st - lastScrollTop) > 5) {
      isAutoScrolling = false;
    } else {
      lastScrollTop = st;
      return;
    }
  }

  applyNavState(st);
  lastScrollTop = st <= 0 ? 0 : st;
});

/* ========================
   SCROLL AUTO VIA NAVBAR
======================== */
document.querySelectorAll('.nav-links a, .overlay-content a').forEach(link => {
  link.addEventListener('click', () => {
    isAutoScrolling = true;
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  });
});

/* ========================
   LOGO -> REMONTE EN HAUT
======================== */
const logo = document.getElementById('logo');
if (logo) {
  logo.addEventListener('click', () => {
    isAutoScrolling = true;
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================
   MENU BURGER OVERLAY
======================== */
const burger = document.querySelector('.burger');
const overlayBurger = document.querySelector('.overlay-burger');
const mobileMenu = document.getElementById('mobileMenu');

const setMenuState = open => {
  if (!mobileMenu) return;
  mobileMenu.classList.toggle('show', open);
  document.body.classList.toggle('overlay-active', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  if (burger) {
    burger.setAttribute('aria-expanded', String(open));
  }
};

const toggleMenu = () => {
  if (!mobileMenu) return;
  setMenuState(!mobileMenu.classList.contains('show'));
};

if (burger) {
  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });
}

if (overlayBurger) {
  overlayBurger.addEventListener('click', () => setMenuState(false));
}

document.querySelectorAll('.overlay-content a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

const handleResize = () => {
  if (window.innerWidth > 900) {
    setMenuState(false);
  }
  applyNavState(window.pageYOffset || document.documentElement.scrollTop || 0);
};

window.addEventListener('resize', handleResize);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    setMenuState(false);
  }
});

if (navLogoBadge) {
  navLogoBadge.addEventListener('click', event => {
    event.preventDefault();
    setMenuState(false);
    isAutoScrolling = true;
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

setMenuState(false);
applyNavState(window.pageYOffset || document.documentElement.scrollTop || 0);
handleResize();

/* ========================
   BOUTON RETOUR EN HAUT
======================== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    isAutoScrolling = true;
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
