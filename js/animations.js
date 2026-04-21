document.addEventListener("DOMContentLoaded", () => {
  // Registramos ScrollTrigger de GSAP
  gsap.registerPlugin(ScrollTrigger);

  // 1. Animación del Hero (Entrada inicial)
  gsap.from(".hero-content > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2,
  });

  // 2. Animación de Tarjetas de Soluciones
  gsap.from(".solutions-content .solution-item", {
    scrollTrigger: {
      trigger: ".solutions-section",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  });

  // 3. Animación de Cascada en la Línea de Tiempo
  gsap.from(".timeline-step", {
    scrollTrigger: {
      trigger: ".process-section",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  // 4. Animación del Bloque de Contacto
  gsap.from(".contact-glass", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  });
});

// 5. Animación del Banner VR (Showroom Access)
gsap.from(".vr-banner", {
  scrollTrigger: {
    trigger: ".vr-banner-section",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  scale: 0.85, // Empieza ligeramente más pequeño
  opacity: 0,
  duration: 1.2,
  ease: "back.out(1.5)", // Efecto de rebote elástico
});

// --- 6. Animación del Módulo IA (Scroll) ---
gsap.from(".ia-visual", {
  scrollTrigger: {
    trigger: ".ia-section",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
  x: -50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
});

gsap.from(".ia-feature-item", {
  scrollTrigger: {
    trigger: ".ia-section",
    start: "top 70%",
    toggleActions: "play none none reverse",
  },
  x: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
});

// --- 7. Efecto Typewriter para la Interfaz de IA ---
const textToType =
  "Generando asistente virtual 3D...\nModelo NLP cargado al 100%.\nRenderizando entorno inmersivo...";
const typewriterElement = document.getElementById("typewriter-text");

if (typewriterElement) {
  let i = 0;
  function typeWriter() {
    if (i < textToType.length) {
      // Agregar soporte para saltos de línea
      if (textToType.charAt(i) === "\n") {
        typewriterElement.innerHTML += "<br>";
      } else {
        typewriterElement.innerHTML += textToType.charAt(i);
      }
      i++;
      setTimeout(typeWriter, 50); // Velocidad de escritura
    } else {
      // Loop: Borrar y volver a empezar después de 4 segundos
      setTimeout(() => {
        typewriterElement.innerHTML = "";
        i = 0;
        typeWriter();
      }, 4000);
    }
  }

  // Iniciar el efecto solo cuando la sección es visible
  ScrollTrigger.create({
    trigger: ".ia-section",
    start: "top 75%",
    once: true, // Solo iniciamos el loop una vez
    onEnter: () => typeWriter(),
  });
}
