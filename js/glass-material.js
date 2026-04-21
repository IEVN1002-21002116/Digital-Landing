// Registramos el componente de vidrio fotorrealista seguro para A-Frame 1.2.0
AFRAME.registerComponent("glass-material", {
  init: function () {
    const el = this.el;

    // Definición de material optimizado: Transparente, brillante y estético
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1, // Bajo metal para evitar que se oscurezca demasiado
      roughness: 0.01, // Superficie lisa para reflejos nítidos
      opacity: 0.15, // Alta transparencia para efecto de cristal premium
      transparent: true,
      emissive: 0xffffff, // Un ligero brillo propio para resaltar
      emissiveIntensity: 0.1,
      clearcoat: 1.0, // Capa de barniz para brillo extra
      clearcoatRoughness: 0.05,
      // Eliminados thickness y transmission por incompatibilidad con A-Frame 1.2.0
    });

    const applyMaterial = () => {
      const mesh = el.getObject3D("mesh");
      if (mesh) {
        mesh.traverse((node) => {
          if (node.isMesh) {
            node.material = glassMat;
          }
        });
      }
    };

    if (el.getObject3D("mesh")) {
      applyMaterial();
    } else {
      el.addEventListener("loaded", applyMaterial);
      el.addEventListener("model-loaded", applyMaterial);
    }
  },
});

// Inyectar la escena 3D en el contenedor con iluminación reforzada
document.addEventListener("DOMContentLoaded", () => {
  const vrContainer = document.getElementById("vr-container");
  if (vrContainer) {
    vrContainer.innerHTML = `
            <a-scene embedded vr-mode-ui="enabled: false" renderer="antialias: true; colorManagement: true;">
                <a-light type="ambient" color="#444"></a-light>
                <a-light type="directional" position="2 4 3" intensity="6" color="#f271d9"></a-light>
                <a-light type="directional" position="-2 -2 -2" intensity="4" color="#8646f4"></a-light>
                
                <a-entity position="0 0 -4" animation="property: rotation; to: 0 360 0; loop: true; dur: 25000; easing: linear">
                    <a-sphere radius="0.5" glass-material></a-sphere>
                    
                    <a-torus radius="0.8" radius-tubular="0.005" rotation="60 45 0" color="#f271d9" material="opacity: 0.4; transparent: true" 
                             animation="property: rotation; to: 420 405 0; loop: true; dur: 10000; easing: linear"></a-torus>
                    <a-torus radius="1.1" radius-tubular="0.003" rotation="-30 60 0" color="#8646f4" material="opacity: 0.3; transparent: true" 
                             animation="property: rotation; to: 330 420 0; loop: true; dur: 15000; easing: linear"></a-torus>
                </a-entity>
                
                <a-camera position="0 0 0" look-controls="enabled: false" wasd-controls="enabled: false"></a-camera>
            </a-scene>
        `;
  }
});
