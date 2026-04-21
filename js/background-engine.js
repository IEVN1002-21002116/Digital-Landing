const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrameId;

// Configuración ajustada para convivir con Realidad Aumentada
const config = {
  particleCount: 80, // Ligeramente menos para no saturar la RAM con la cámara encendida
  connectionDistance: 170,
  colors: ["#8646f4", "#f271d9", "#2a0a4a"],
  particleBaseSize: 1.5,
  speedFactor: 0.08, // <-- Velocidad drásticamente reducida para compensar los FPS de AR
};

function resizeCanvas() {
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * config.speedFactor;
    this.vy = (Math.random() - 0.5) * config.speedFactor;
    this.radius = Math.random() * config.particleBaseSize + 1;
    this.color =
      config.colors[Math.floor(Math.random() * config.colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Rebote en los bordes
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initNetwork() {
  particles = [];
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle());
  }
}

function hexToRgba(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.connectionDistance) {
        const opacity = 1 - distance / config.connectionDistance;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);

        let grad = ctx.createLinearGradient(
          particles[i].x,
          particles[i].y,
          particles[j].x,
          particles[j].y,
        );
        grad.addColorStop(0, hexToRgba(particles[i].color, opacity * 0.4));
        grad.addColorStop(1, hexToRgba(particles[j].color, opacity * 0.4));

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  // EL FIX VISUAL: Opacidad en 0.15 para dejar el rastro de neón elegante en vez de borrar de tajo (1)
  ctx.fillStyle = "rgba(2, 1, 8, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawConnections();
  animationFrameId = requestAnimationFrame(animate);
}

// Evento Resize
window.addEventListener("resize", () => {
  resizeCanvas();
  // FIX TÉCNICO: Eliminé el initNetwork() de aquí.
  // Ahora cuando AR.js redimensione la cámara invisiblemente, las partículas no se van a volver locas.
});

// Arrancar motor
resizeCanvas();
initNetwork();
animate();
