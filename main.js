document.documentElement.classList.add("js");

// ================================
// ELEMENTOS GLOBALES
// ================================
const header = document.getElementById("header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const projectHero = document.querySelector(".project-hero");
const projectBanner = projectHero
  ? projectHero.querySelector(".project-hero__banner")
  : null;

let lastScroll = 0;
let ticking = false;

// ================================
// IDIOMA ACTUAL (helper compartido)
// ================================
function getPreferredLang() {
  return (
    localStorage.getItem("preferred-language") ||
    (navigator.language.startsWith("es") ? "es" : "en")
  );
}

// ================================
// SCROLL HANDLER CONSOLIDADO
// ================================
function handleScroll() {
  const currentScroll = window.pageYOffset;

  // Header scroll effect
  if (currentScroll > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (currentScroll >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  if (projectHero && projectBanner) {
    const heroHeight = projectHero.offsetHeight;

    if (currentScroll < heroHeight) {
      projectBanner.style.transform = `scale(1.1) translateY(${
        currentScroll * 0.3
      }px)`;

      if (currentScroll > 50) {
        projectHero.classList.add("scrolled");
      } else {
        projectHero.classList.remove("scrolled");
      }
    }
  }

  lastScroll = currentScroll;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
});

// ================================
// SCROLL REVEAL ANIMATIONS
// ================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".scroll-reveal");
  revealElements.forEach((el) => observer.observe(el));

  // Las animaciones del hero ya las hace la clase .animate-fadeInUp desde el
  // CSS. Repetirlas aqui con un style inline solo anadia un opacity: 0 que
  // deja el bloque invisible si la animacion no llega a ejecutarse.
});

// ================================
// FILTROS DE PROYECTOS
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("[data-category]");

  if (filterButtons.length === 0 || projectCards.length === 0) {
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");

        if (filterValue === "all" || cardCategory === filterValue) {
          card.classList.remove("hidden");
          card.style.animation = "fadeInUp 0.5s ease";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
});

// ================================
// MOBILE MENU
// ================================
// ================================
// ICONOS
// ================================
// Los iconos son <svg><use href="#ic-nombre"> dentro de un <i class="fas fa-x">.
// Cambiar de icono es cambiar la referencia del <use>, no solo la clase.
function cambiarIcono(elemento, de, a) {
  if (!elemento) return;
  elemento.classList.remove("fa-" + de);
  elemento.classList.add("fa-" + a);
  const uso = elemento.querySelector("use");
  if (uso) uso.setAttribute("href", "#ic-" + a);
}

function marcaDeIcono(nombre) {
  return (
    '<i class="fas fa-' + nombre + '" aria-hidden="true">' +
    '<svg class="ico" focusable="false"><use href="#ic-' + nombre + '"></use></svg></i>'
  );
}

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinksContainer = document.querySelector(".nav-links");

if (mobileMenuBtn && navLinksContainer) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");

    const icon = mobileMenuBtn.querySelector("i");
    const abierto = navLinksContainer.classList.contains("active");
    cambiarIcono(icon, abierto ? "bars" : "times", abierto ? "times" : "bars");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksContainer.classList.remove("active");
      mobileMenuBtn.classList.remove("active");

      cambiarIcono(mobileMenuBtn.querySelector("i"), "times", "bars");
    });
  });
}

// ================================
// EXTERNAL LINKS
// ================================
document.querySelectorAll('a[href^="http"]').forEach((link) => {
  if (!link.href.includes(window.location.hostname)) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  }
});

// ================================
// FORM VALIDATION
// ================================
const forms = document.querySelectorAll("form");

forms.forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    if (isValid) {
      console.log("Form is valid");
    }
  });
});

// ================================
// DEBOUNCE HELPER
// ================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ================================
// CONSOLE MESSAGE
// ================================
console.log(
  "%c👋 ¡Hola! ",
  "font-size: 20px; font-weight: bold; color: #5B2C6F;"
);
console.log(
  "%c¿Interesado en el código? Visita mi GitHub: https://github.com/GabrielaSemidey",
  "font-size: 12px; color: #14B8A6;"
);
console.log(
  "%cEste portfolio está hecho con HTML, CSS y JavaScript vanilla. Sin frameworks, solo código limpio. 💜",
  "font-size: 12px; color: #64748b;"
);

// ================================
// ERROR HANDLING
// ================================
window.addEventListener("error", (e) => {
  console.error("Error detectado:", e.message);
});

// ================================
// LIGHTBOX PARA IMÁGENES
// ================================
(function () {
  "use strict";

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox ? lightbox.querySelector(".lightbox__close") : null;

  if (!lightbox) return;

  // .sin-visor queda fuera a proposito: son imagenes servidas a baja
  // resolucion para que su contenido no se pueda leer, y el visor existe
  // justamente para leerlas de cerca.
  const lightboxImages = document.querySelectorAll(
    ".visual-resource:not(.visual-resource--sin-visor) img, .gallery-item img"
  );

  let currentImages = [];
  let currentIndex = 0;

  function updateLightboxA11yLabels() {
    const lang = getPreferredLang();
    const viewText =
      (translations[lang] && translations[lang]["a11y.lightbox-view-image"]) ||
      "Ver imagen";
    const noDescText =
      (translations[lang] &&
        translations[lang]["a11y.lightbox-no-description"]) ||
      "Sin descripción";

    lightboxImages.forEach((img) => {
      img.setAttribute("aria-label", `${viewText}: ${img.alt || noDescText}`);
    });
  }

  function openLightbox(imgElement, index) {
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;

    // Mostrar caption si existe
    const caption =
      imgElement.getAttribute("alt") ||
      imgElement
        .closest(".visual-resource, .gallery-item")
        ?.querySelector(".image-caption")?.textContent ||
      "";
    lightboxCaption.textContent = caption;

    currentIndex = index;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  lightboxImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentImages = Array.from(lightboxImages);
      openLightbox(img, index);
    });

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        currentImages = Array.from(lightboxImages);
        openLightbox(img, index);
      }
    });

    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
  });

  updateLightboxA11yLabels();

  // Volver a traducir los aria-label cuando se cambia de idioma
  const langToggleBtn = document.querySelector(".language-toggle__btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setTimeout(updateLightboxA11yLabels, 50);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "ArrowRight" && currentIndex < currentImages.length - 1) {
      openLightbox(currentImages[currentIndex + 1], currentIndex + 1);
    }

    if (e.key === "ArrowLeft" && currentIndex > 0) {
      openLightbox(currentImages[currentIndex - 1], currentIndex - 1);
    }
  });
})();

// ================================
// READING PROGRESS BAR
// ================================
(function () {
  "use strict";

  const progressBar = document.querySelector(".reading-progress");
  const progressBarFill = document.querySelector(".reading-progress__bar");

  if (!progressBar || !progressBarFill) return;

  let ticking = false;

  function updateProgressBar() {
    // Calcular el progreso de lectura
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const scrollableHeight = documentHeight - windowHeight;

    const scrollPercentage = (scrollTop / scrollableHeight) * 100;

    progressBarFill.style.width = `${Math.min(scrollPercentage, 100)}%`;

    progressBar.setAttribute("aria-valuenow", Math.round(scrollPercentage));

    if (scrollTop > 100) {
      progressBar.classList.add("visible");
    } else {
      progressBar.classList.remove("visible");
    }

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgressBar);
      ticking = true;
    }
  });

  window.addEventListener("resize", debounce(updateProgressBar, 250));

  updateProgressBar();
})();

/* ================================
   LANGUAGE SWITCHER
   ================================ */

(function () {
  "use strict";

  const savedLang =
    localStorage.getItem("preferred-language") ||
    (navigator.language.startsWith("es") ? "es" : "en");

  let currentLang = savedLang;

  // Elementos
  const langBtn = document.querySelector(".language-toggle__btn");
  const langFlag = document.querySelector(".language-toggle__flag");
  const langText = document.querySelector(".language-toggle__text");

  if (!langBtn) return;

  // Etiquetas de formato permitidas dentro de un valor de traduccion.
  // El mensaje completo vive en una sola clave, con su enfasis dentro:
  // partir una frase en varias claves impide traducirla a idiomas con otro
  // orden de palabras. Cualquier otra etiqueta se descarta antes de insertar.
  const INLINE_PERMITIDO = /<(?!\/?(?:strong|em|b|i|br)\b)[^>]*>/gi;
  const LLEVA_FORMATO = /<(strong|em|b|i|br)\b/i;

  function translateElement(element, key) {
    if (!translations[currentLang] || !translations[currentLang][key]) {
      console.warn(`Translation missing for key: ${key}`);
      return;
    }
    const valor = translations[currentLang][key];
    if (LLEVA_FORMATO.test(valor)) {
      element.innerHTML = valor.replace(INLINE_PERMITIDO, "");
    } else {
      element.textContent = valor;
    }
  }

  function updateCvDownloadLinks() {
    const cvFile =
      currentLang === "en"
        ? "./assets/CV_Portfolio_PO-PM_EN.pdf"
        : "./assets/CV_Portfolio_PO-PM_ES.pdf";
    const cvDownloadName =
      currentLang === "en"
        ? "Gabriela_Ojeda_Semidey_CV_EN.pdf"
        : "Gabriela_Ojeda_Semidey_CV_ES.pdf";
    document.querySelectorAll(".cv-download-link").forEach((link) => {
      link.setAttribute("href", cvFile);
      link.setAttribute("download", cvDownloadName);
    });
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      translateElement(element, key);
    });

    if (currentLang === "en") {
      langFlag.textContent = "🇬🇧";
      langText.textContent = "EN";
      langBtn.setAttribute("title", "Cambiar a Español");
      langBtn.setAttribute("data-lang", "en");
    } else {
      langFlag.textContent = "🇪🇸";
      langText.textContent = "ES";
      langBtn.setAttribute("title", "Switch to English");
      langBtn.setAttribute("data-lang", "es");
    }

    document.documentElement.setAttribute("lang", currentLang);
    updateCvDownloadLinks();
  }

  function switchLanguage() {
    // Animación
    langBtn.classList.add("changing");
    setTimeout(() => langBtn.classList.remove("changing"), 300);

    currentLang = currentLang === "es" ? "en" : "es";

    localStorage.setItem("preferred-language", currentLang);

    applyTranslations();

    console.log(
      `%c🌐 Idioma cambiado a: ${currentLang.toUpperCase()}`,
      "color: #14B8A6; font-weight: bold;"
    );
  }

  langBtn.addEventListener("click", switchLanguage);

  applyTranslations();

  console.log(
    `%c🌐 Idioma inicial: ${currentLang.toUpperCase()}`,
    "color: #5B2C6F; font-weight: bold;"
  );
})();

// ================================
// PARALLAX HERO
// ================================
(function () {
  "use strict";

  const hero = document.querySelector(".hero");
  if (!hero) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
      const photo = hero.querySelector(".hero__photo");
      const leftContent = hero.querySelector(".hero__left");
      const stack = hero.querySelector(".hero__stack");

      if (photo) {
        photo.style.setProperty("--parallax-photo", `${scrolled * 0.3}px`);
      }

      if (leftContent) {
        leftContent.style.setProperty(
          "--parallax-text",
          `${scrolled * 0.15}px`
        );
      }

      if (stack) {
        stack.style.setProperty("--parallax-stack", `${scrolled * 0.1}px`);
      }

      hero.classList.add("parallax-active");
    } else {
      hero.classList.remove("parallax-active");
    }

    ticking = false;
  }

  // Solo aplicar parallax en desktop
  if (window.innerWidth > 768) {
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
})();

// ================================
// SKILL PILLS - Tooltips con nivel (Multiidioma)
// ================================
(function () {
  "use strict";

  const skillPills = document.querySelectorAll(".skill-pill");

  function updateTooltips() {
    const currentLang = getPreferredLang();

    skillPills.forEach((pill) => {
      let levelKey = "intermediate";
      if (pill.classList.contains("skill-pill--advanced")) {
        levelKey = "advanced";
      } else if (pill.classList.contains("skill-pill--learning")) {
        levelKey = "learning";
      }

      const translationKey = `skills.level.${levelKey}`;
      const levelText = translations[currentLang]?.[translationKey] || 
                       translations["es"][translationKey]; 

      pill.setAttribute("data-level", levelText);
    });
  }

  updateTooltips();


  const langBtn = document.querySelector(".language-toggle__btn");
  if (langBtn) {
    langBtn.addEventListener("click", function() {
      setTimeout(updateTooltips, 50);
    });
  }

  console.log(
    "%c✨ Skill Pills tooltips inicializados con soporte multiidioma",
    "color: #14B8A6; font-weight: bold;"
  );
})();

// ================================
// SWIPE INDICATOR
// ================================
(function () {
  "use strict";

  if (window.innerWidth > 768) return; // Solo en mobile

  const projectsGrid = document.querySelector(".projects__grid");
  if (!projectsGrid) return;

  function getSwipeHintText() {
    const lang = getPreferredLang();
    return (
      (translations[lang] && translations[lang]["mobile.swipe-hint"]) ||
      "Desliza para ver más proyectos"
    );
  }

  const indicator = document.createElement("div");
  indicator.className = "swipe-indicator";
  indicator.innerHTML = `${marcaDeIcono("arrow-right")} ${getSwipeHintText()}`;

  projectsGrid.parentElement.insertBefore(indicator, projectsGrid.nextSibling);

  const langToggleBtn = document.querySelector(".language-toggle__btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      setTimeout(() => {
        const textNode = indicator.querySelector("i").nextSibling;
        if (textNode) {
          textNode.textContent = ` ${getSwipeHintText()}`;
        }
      }, 50);
    });
  }

  let hasScrolled = false;
  projectsGrid.addEventListener(
    "scroll",
    () => {
      if (!hasScrolled) {
        hasScrolled = true;
        indicator.style.opacity = "0";
        setTimeout(() => {
          indicator.style.display = "none";
        }, 300);
      }
    },
    { once: true }
  );
})();

// ================================
// SMOOTH SCROLL PARA NAVEGACIÓN (incluye cierre de menú móvil)
// ================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (href === "#") return;

    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();

      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Cerrar mobile menu si está abierto
      const navLinks = document.querySelector(".nav-links");
      const mobileBtn = document.querySelector(".mobile-menu-btn");
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (mobileBtn) mobileBtn.classList.remove("active");
      }
    }
  });
});

/* ==========================================
   Funcionalidad del acordeón de LumiCoins
   ========================================== */

// Función para toggle del acordeón de recompensas
function toggleRewards() {
  const accordion = document.getElementById("rewardsAccordion");

  if (accordion) {
    accordion.classList.toggle("active");

    const content = accordion.querySelector(".rewards-accordion__content");

    if (accordion.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";

      setTimeout(() => {
        content.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300);
    } else {
      content.style.maxHeight = "0";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const accordionHeader = document.querySelector(".rewards-accordion__header");

  if (accordionHeader && !accordionHeader.hasAttribute("onclick")) {
    accordionHeader.addEventListener("click", toggleRewards);
  }

  // Añadir accesibilidad con teclado
  if (accordionHeader) {
    accordionHeader.setAttribute("tabindex", "0");
    accordionHeader.setAttribute("role", "button");
    accordionHeader.setAttribute("aria-expanded", "false");

    accordionHeader.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRewards();

        // Actualizar aria-expanded
        const isExpanded = document
          .getElementById("rewardsAccordion")
          .classList.contains("active");
        accordionHeader.setAttribute("aria-expanded", isExpanded);
      }
    });
  }

  observeElements(".learning-card", "animate-fadeIn");
  observeElements(".value-card", "animate-fadeIn");
  observeElements(".timeline-step", "animate-fadeIn");
  observeElements(".ai-tool-card", "animate-fadeIn");
});

function observeElements(selector, animationClass) {
  const elements = document.querySelectorAll(selector);

  if (elements.length === 0) return;

  // Sin IntersectionObserver no se oculta nada: mas vale sin animacion que
  // con el contenido invisible ocupando sitio.
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add(animationClass));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animationClass);
          }, index * 100); // Delay progresivo
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // El ocultado vive en el CSS (.js .fade-on-view), no en un style inline:
  // asi una sola regla lo destapa si hace falta y respeta prefers-reduced-motion.
  elements.forEach((element) => {
    element.classList.add("fade-on-view");
    observer.observe(element);
  });
}

// La animacion fadeInUp vive ahora en styles/base.css

// ================================
// AÑO DEL COPYRIGHT (siempre actualizado)
// ================================
(function () {
  "use strict";

  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll("footer p").forEach((el) => {
    // Se cambia solo el nodo de texto que contiene el ano: reescribir el
    // innerHTML entero destruiria los hijos del parrafo.
    const paseo = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let nodo;
    while ((nodo = paseo.nextNode())) {
      if (/\b(19|20)\d{2}\b/.test(nodo.nodeValue)) {
        nodo.nodeValue = nodo.nodeValue.replace(/\b(19|20)\d{2}\b/, currentYear);
        break;
      }
    }
  });
})();
