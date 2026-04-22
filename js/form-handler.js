document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-contacto");
  const cyberAlert = document.getElementById("cyber-alert");
  const btnEnviar = document.getElementById("btn-enviar");

  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evita que la página se recargue

      const datos = new FormData(formulario);
      btnEnviar.innerText = "PROCESANDO...";
      btnEnviar.style.pointerEvents = "none";

      try {
        const respuesta = await fetch(formulario.action, {
          method: "POST",
          body: datos,
          headers: { Accept: "application/json" },
        });

        if (respuesta.ok) {
          // Mostramos nuestro Alert Temático
          cyberAlert.style.display = "flex";
          formulario.reset(); // Limpiamos los campos
        } else {
          alert("Hubo un error. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error en el envío:", error);
      } finally {
        btnEnviar.innerText = "ENVIAR MENSAJE";
        btnEnviar.style.pointerEvents = "auto";
      }
    });
  }
});

// Función para cerrar el modal
function cerrarAlert() {
  document.getElementById("cyber-alert").style.display = "none";
}
