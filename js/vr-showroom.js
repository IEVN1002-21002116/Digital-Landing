// Componente para animar el objeto cuando el cursor (mirada) se posa sobre él
AFRAME.registerComponent("vr-hover", {
  init: function () {
    let el = this.el;

    // Cuando el raycaster toca el objeto
    el.addEventListener("mouseenter", function () {
      // Hacemos que el pedestal y su contenido crezcan ligeramente (feedback visual)
      el.setAttribute("animation__scale", {
        property: "scale",
        to: "1.1 1.1 1.1",
        dur: 300,
        easing: "easeOutQuad",
      });

      // Opcional: Podrías reproducir un sonido de "bloop" futurista aquí
    });

    // Cuando la mirada sale del objeto antes de hacer clic
    el.addEventListener("mouseleave", function () {
      // Regresa a su tamaño original
      el.setAttribute("animation__scale", {
        property: "scale",
        to: "1 1 1",
        dur: 300,
        easing: "easeOutQuad",
      });
    });
  },
});

// Reemplaza solo el componente 'link-to' en js/vr-showroom.js
AFRAME.registerComponent("link-to", {
  schema: {
    url: { type: "string", default: "" },
  },
  init: function () {
    let data = this.data;
    let el = this.el;

    el.addEventListener("click", function () {
      if (data.url) {
        // Buscamos la cámara por el ID seguro
        let cameraEl = document.getElementById("player-camera");

        // Validación para evitar el TypeError
        if (cameraEl) {
          cameraEl.setAttribute("animation__zoom", {
            property: "camera.fov",
            to: 20,
            dur: 400,
            easing: "easeInQuad",
          });
        }

        setTimeout(() => {
          window.location.href = data.url;
        }, 400);
      }
    });
  },
});
