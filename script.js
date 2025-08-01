/* ========================
   VARIABLES GLOBALES
======================== */
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;
let isAutoScrolling = false; // flag pour distinguer scroll auto vs manuel

/* ========================
   CARROUSEL SLIDER SMOOTH
======================== */
const slidesContainer = document.querySelector(".slides-container");
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
let currentSlide = 0;

// Créer les dots pour chaque slide
slides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => showSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll("span");

function showSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach(dot => dot.classList.remove("active"));
  dots[currentSlide].classList.add("active");
}

// Auto-slide toutes les 3s
setInterval(() => showSlide(currentSlide + 1), 3000);

/* ========================
   ANIMATIONS SCROLL
======================== */
const faders = document.querySelectorAll('.fade-in, .slide-in');
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;
  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) el.classList.add('visible');
  });
});

/* ========================
   NAVBAR HIDE/SHOW 
   (ignore le scroll auto)
======================== */
window.addEventListener("scroll", () => {
  let st = window.pageYOffset || document.documentElement.scrollTop;

  // Si on est en scroll automatique (clic navBar)
  if (isAutoScrolling) {
    // Si le scroll change brusquement (interaction manuelle détectée)
    if (Math.abs(st - lastScrollTop) > 5) {
      isAutoScrolling = false; // repasse en mode manuel
    } else {
      lastScrollTop = st;
      return; // ignore le hide pendant le scroll auto
    }
  }

  // Logique normale : hide on scroll down, show on scroll up
  navbar.style.top = (st > lastScrollTop) ? "-90px" : "0";
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
document.getElementById('logo').addEventListener('click', () => {
  isAutoScrolling = true;
  lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menu burger overlay
const burger = document.querySelector(".burger");
const overlayBurger = document.querySelector(".overlay-burger");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu() {
  mobileMenu.classList.toggle("show");
}

burger.addEventListener("click", toggleMenu);
overlayBurger.addEventListener("click", toggleMenu);

// Fermer l'overlay quand on clique sur un lien
document.querySelectorAll(".overlay-content a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("show"));
});


/* ========================
   BOUTON RETOUR EN HAUT
======================== */
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  // Afficher le bouton si on a scrollé de 400px
  if (window.scrollY > 400) {
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }
});

backToTop.addEventListener("click", () => {
  isAutoScrolling = true;
  lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  window.scrollTo({ top: 0, behavior: "smooth" });
});