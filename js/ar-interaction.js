// =========================================================
// 1. COMPONENTE OMNISCIENTE (Bypass del mouse de A-Frame)
// =========================================================
AFRAME.registerComponent("botones-interactivos", {
  init: function () {
    const el = this.el;
    const sceneEl = document.querySelector("a-scene");

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ---------------------------------------------------------
    // 🗺️  MAPA DE BOTONES
    // Clave   → nombre exacto del mesh en el .glb (en mayúsculas)
    // Valor   → URL de destino
    // Para agregar un botón nuevo: añade una línea aquí y listo.
    // ---------------------------------------------------------
    const MAPA_BOTONES = {
      CUBE007_1: "https://www.instagram.com/digital.boost_mx/", // Redes sociales
      CUBE006_1: "https://tu-sitio-web.com", // Sitio web
      CUBE005_1: "https://tu-portafolio.com", // Portafolio
      CUBE004_1: "https://tu-sitio.com/nosotros", // Nosotros
    };

    // ---------------------------------------------------------
    // 📱  APERTURA DE URL SEGURA PARA MÓVIL
    //
    // window.open() es bloqueado por Safari/Chrome iOS cuando el
    // navegador sospecha que la llamada no viene de un gesto
    // "inmediato". Crear un <a> y hacer .click() en el mismo
    // frame del evento siempre se trata como navegación directa
    // del usuario → nunca bloqueado.
    // ---------------------------------------------------------
    const abrirURL = (url) => {
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer"; // buena práctica de seguridad
      // El elemento no necesita estar en el DOM para ser clickeable
      enlace.click();
    };

    // ---------------------------------------------------------
    // UTILIDADES DEL RAYCASTER
    // ---------------------------------------------------------

    // Convierte el toque/mouse en coordenadas NDC exactas
    const calcularMouse = (evt) => {
      const canvas = document.querySelector(".a-canvas");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      let clientX = evt.clientX;
      let clientY = evt.clientY;

      if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
      }

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Dispara el rayo y devuelve el nombre de la malla si intersecta
    // con un botón registrado en MAPA_BOTONES; null en caso contrario.
    const lanzarRayo = () => {
      const threeCamera = sceneEl.camera;
      if (!threeCamera) return null;

      raycaster.setFromCamera(mouse, threeCamera);

      // true → recorre todo el grafo de escena buscando hijos
      const intersects = raycaster.intersectObject(el.object3D, true);

      for (let i = 0; i < intersects.length; i++) {
        const nombre = intersects[i].object.name;
        if (!nombre || nombre.trim() === "") continue;

        const nombreSeguro = nombre.toUpperCase();

        // Solo devolvemos nombres que estén registrados en el mapa
        if (Object.prototype.hasOwnProperty.call(MAPA_BOTONES, nombreSeguro)) {
          return nombreSeguro;
        }
      }
      return null;
    };

    // ---------------------------------------------------------
    // 🖱️  HOVER: cambia el cursor en escritorio en tiempo real
    // ---------------------------------------------------------
    window.addEventListener("mousemove", (evt) => {
      calcularMouse(evt);
      document.body.style.cursor = lanzarRayo() ? "pointer" : "default";
    });

    // ---------------------------------------------------------
    // 👆  CLIC / TOQUE: ejecuta la acción
    // ---------------------------------------------------------
    const procesarInteraccion = (evt) => {
      // Ignorar toques sobre la UI HTML (header, botones, etc.)
      if (evt.target.closest(".btn") || evt.target.closest(".ar-header"))
        return;

      calcularMouse(evt);
      const nombreMalla = lanzarRayo();

      if (nombreMalla) {
        const url = MAPA_BOTONES[nombreMalla];

        console.log(
          `%c🔥 PIEZA TOCADA: ${nombreMalla}  →  ${url}`,
          "background: #00ff00; color: black; font-weight: bold; padding: 6px;",
        );

        abrirURL(url);
      }
    };

    // Escuchamos en la ventana global para que nada lo intercepte
    window.addEventListener("mousedown", procesarInteraccion);
    window.addEventListener("touchstart", procesarInteraccion, {
      passive: false,
    });
  },
});

// =========================================================
// 2. LÓGICA DE LA PÁGINA Y ESCENA MIND-AR
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-ar-btn");
  const scannerIdle = document.getElementById("scanner-idle");
  const arView = document.getElementById("ar-view");
  const corners = document.querySelectorAll(".corner");

  let isCameraActive = false;

  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      background-color: transparent !important;
      margin: 0; padding: 0; overflow: hidden !important;
    }
    .ar-standalone {
      position: absolute !important;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: 9999 !important;
      pointer-events: none !important;
    }
    .ar-header, .btn, #scanner-idle {
      pointer-events: auto !important;
    }
    .scanner-frame, #ar-view {
      background: transparent !important;
      border: none !important;
    }
  `;
  document.head.appendChild(style);

  function _buildARScene() {
    return `
      <a-scene
        mindar-image="imageTargetSrc: assets/tarjeta/targets.mind; filterMinCF: 0.0001; filterBeta: 0.001;"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item id="animacion-final" src="assets/tarjeta/Tarjeta_Digital_Spot_Buttons3.glb"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-light type="ambient" intensity="2.5"></a-light>
          <a-light type="directional" position="0 5 0" intensity="3"></a-light>

          <a-entity
            id="modelo-interactivo"
            botones-interactivos
            gltf-model="#animacion-final"
            position="-0.3 0 0"
            scale="13 13 13"
            rotation="-90 0 180"
            animation-mixer>
          </a-entity>
        </a-entity>
      </a-scene>
    `;
  }

  function _setCorners(active) {
    corners.forEach((c) => {
      c.style.borderColor = active ? "#f271d9" : "var(--primary-purple)";
      c.style.boxShadow = active ? "0 0 15px rgba(242, 113, 217, 0.4)" : "none";
    });
  }

  function _startAR() {
    if (startBtn) {
      startBtn.textContent = "ABRIENDO LENTE...";
      startBtn.style.pointerEvents = "none";
    }

    _setCorners(true);
    if (scannerIdle) scannerIdle.style.display = "none";

    arView.style.display = "block";
    arView.classList.remove("ar-view-hidden");
    arView.innerHTML = _buildARScene();

    isCameraActive = true;
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (!isCameraActive) _startAR();
    });
  }
});
