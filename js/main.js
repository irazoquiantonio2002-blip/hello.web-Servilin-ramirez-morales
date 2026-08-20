// ═══════════════════════════════════════════════════════
// SERVILIN S.A. DE C.V. — lógica del sitio
// ═══════════════════════════════════════════════════════

// ── Datos del negocio (edita aquí cuando tengas los datos definitivos) ──
const NEGOCIO = {
  telefono: "",          // ej. "5215512345678" (con lada país, sin + ni espacios)
  correo: "",             // ej. "contacto@servilinrm.com"
  direccion: "",           // ej. "Ciudad de México y área metropolitana"
  horario: "",              // ej. "Lunes a viernes, 9:00 a 18:00 h"
  mapaQuery: "",             // ej. "Ciudad de México" (para el iframe de Google Maps)
  facebook: "https://www.facebook.com/share/1CZMYiJGwm/",
};

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initReadProgress();
  initTypedWords();
  initReveal();
  initCounters();
  initMarquee();
  initParticles();
  initWhatsApp();
  initContactForm();
  initFooterData();
  initToTop();
});

// ── Loader ──
function initLoader() {
  const fill = document.querySelector(".loader-bar-fill");
  const text = document.querySelector(".loader-text");
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 18);
    if (fill) fill.style.width = pct + "%";
    if (text) text.setAttribute("data-pct", Math.floor(pct) + "%");
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => document.body.classList.remove("is-loading"), 260);
    }
  }, 140);
  // Failsafe: never leave the loader stuck
  setTimeout(() => document.body.classList.remove("is-loading"), 2600);
}

// ── Navbar: sombra al hacer scroll ──
function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ── Menú móvil ──
function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mob-menu");
  const overlay = document.getElementById("mob-overlay");
  if (!btn || !menu || !overlay) return;

  const close = () => {
    menu.classList.remove("open");
    overlay.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };
  const toggle = () => {
    const open = menu.classList.toggle("open");
    overlay.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", toggle);
  overlay.addEventListener("click", close);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

// ── Barra de progreso de lectura ──
function initReadProgress() {
  const bar = document.getElementById("read-progress");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ── Texto rotativo en el hero ──
function initTypedWords() {
  const el = document.getElementById("typed");
  if (!el) return;
  let words = [];
  try { words = JSON.parse(el.getAttribute("data-words")) || []; } catch (e) { return; }
  if (words.length < 2) return;

  let wordIndex = 0, charIndex = words[0].length, deleting = true;

  const step = () => {
    const current = words[wordIndex];
    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(step, 400);
        return;
      }
    } else {
      charIndex++;
      const next = words[wordIndex];
      el.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) {
        deleting = true;
        setTimeout(step, 2200);
        return;
      }
    }
    setTimeout(step, deleting ? 34 : 52);
  };
  setTimeout(step, 2400);
}

// ── Animaciones al hacer scroll (reveal) ──
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

// ── Contadores numéricos ──
function initCounters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;
  const animate = (el) => {
    const target = parseFloat(el.getAttribute("data-count")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if (!("IntersectionObserver" in window)) {
    nums.forEach(animate);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((el) => io.observe(el));
}

// ── Marquee: contenido inyectado por JS y duplicado para loop infinito ──
function initMarquee() {
  const el = document.getElementById("marquee");
  if (!el) return;
  const items = [
    "Limpieza industrial",
    "Jardinería industrial",
    "Mantenimiento industrial",
    "Registro REPSE vigente",
    "Personal calificado",
    "Servicio a empresas e industria",
  ];
  const build = () =>
    items.map((t) => `<span>${t} <i class="fa-solid fa-circle" aria-hidden="true"></i></span>`).join("");
  el.innerHTML = build() + build();
}

// ── Partículas de fondo (hero + secciones con canvas) ──
function initParticles() {
  document.querySelectorAll("#hero-canvas, .particle-canvas").forEach((canvas) => setupParticleCanvas(canvas));
}

function setupParticleCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const density = parseFloat(canvas.getAttribute("data-density")) || 1;
  const linksOn = canvas.getAttribute("data-links") !== "off";
  let particles = [];
  let w, h, raf;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    const count = Math.round((w * h) / 22000 * density);
    particles = Array.from({ length: Math.max(16, Math.min(90, count)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(240,85,26,0.55)";
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (linksOn) {
      ctx.strokeStyle = "rgba(61,107,255,0.12)";
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    raf = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}

// ── Enlaces de WhatsApp ──
function buildWaLink(message) {
  const phone = NEGOCIO.telefono ? NEGOCIO.telefono.replace(/\D/g, "") : "";
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message || "Hola, me gustaría más información sobre sus servicios.")}`;
}

function initWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.getAttribute("data-wa");
    el.setAttribute("href", buildWaLink(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

// ── Formulario de contacto → WhatsApp ──
function initContactForm() {
  const form = document.getElementById("wa-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("f-name")?.value.trim();
    const equipo = document.getElementById("f-equipo")?.value.trim();
    const interest = document.getElementById("f-interest")?.value;
    const msg = document.getElementById("f-msg")?.value.trim();

    let text = `Hola, mi nombre es ${name || "—"}.`;
    if (interest) text += ` Estoy interesado en: ${interest}.`;
    if (equipo) text += ` Instalación / zona: ${equipo}.`;
    if (msg) text += ` Detalle: ${msg}`;

    window.open(buildWaLink(text), "_blank", "noopener");
  });
}

// ── Datos de contacto + redes sociales en footer/contacto ──
function initFooterData() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (value) {
      el.textContent = value;
    } else {
      el.closest(".ci-item")?.remove();
    }
  };
  setText("ci-direccion", NEGOCIO.direccion);
  setText("ci-horario", NEGOCIO.horario);
  setText("ci-telefonos", NEGOCIO.telefono ? formatPhoneDisplay(NEGOCIO.telefono) : "");
  setText("ci-correo", NEGOCIO.correo);

  const mapFrame = document.getElementById("map-frame");
  const mapEmbed = document.getElementById("mapa-embed");
  if (NEGOCIO.mapaQuery && mapFrame && mapEmbed) {
    mapEmbed.src = `https://www.google.com/maps?q=${encodeURIComponent(NEGOCIO.mapaQuery)}&output=embed`;
    mapFrame.classList.add("active");
  }

  const socials = document.getElementById("footer-socials");
  if (socials && NEGOCIO.facebook) {
    const fb = document.createElement("a");
    fb.className = "footer-soc";
    fb.href = NEGOCIO.facebook;
    fb.target = "_blank";
    fb.rel = "noopener";
    fb.setAttribute("aria-label", "Facebook");
    fb.innerHTML = '<i class="fa-brands fa-facebook-f"></i>';
    socials.appendChild(fb);
  }
}

function formatPhoneDisplay(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 ? `+${digits.slice(0,2)} ${digits.slice(2,4)} ${digits.slice(4,8)} ${digits.slice(8)}` : phone;
}

// ── Botón volver arriba ──
function initToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 600);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
