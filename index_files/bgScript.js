const canvas = document.getElementById("mouseTrailCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ambientParticles = [];
let mouseParticles = [];
let mouseTrail = [];
let trailEnabled = true;

class Particle3 {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.alpha = 1;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      this.alpha -= 0.005; // Slower fade
    }
  
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.alpha = 1;
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.05;
    }
  
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) {
        particles[i] = new Particle3(); // Replace the dead particle
      }
    }
  }

  function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  function drawMouseTrail() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "purple";
  
    ctx.beginPath();
    for (let i = 0; i < mouseTrail.length; i++) {
      ctx.save();
      ctx.globalAlpha = mouseTrail[i].alpha;
      if (i == 0) {
        ctx.moveTo(mouseTrail[i].x, mouseTrail[i].y);
      } else {
        ctx.lineTo(mouseTrail[i].x, mouseTrail[i].y);
      }
      ctx.restore();
    }
    ctx.stroke();
  }

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleAmbientParticles();
  handleMouseParticles();

  if (trailEnabled) {
    for (let i = 0; i < mouseTrail.length; i++) {
      mouseTrail[i].alpha -= 0.1;
      if (mouseTrail[i].alpha <= 0) {
        mouseTrail.splice(i, 1);
        i--;
      }
    }
    drawMouseTrail();
  }

  requestAnimationFrame(animate);
}

document.addEventListener("mousemove", function (event) {
  if (trailEnabled) {
    for (let i = 0; i < 10; i++) {
      mouseParticles.push(new Particle(event.x, event.y));
    }
    mouseTrail.push({ x: event.x, y: event.y, alpha: 1 });
    if (mouseTrail.length > 10) {
      mouseTrail.shift();
    }
  }
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

function init() {
  ambientParticles = [];
  for (let i = 0; i < 50; i++) {
    ambientParticles.push(new Particle3());
  }
}

function disableMouseTrail() {
  trailEnabled = false;
}

function enableMouseTrail() {
  trailEnabled = true;
}

document.querySelectorAll('.layout-content, .layout-list-item').forEach(element => {
  element.addEventListener('mouseenter', disableMouseTrail);
  element.addEventListener('mouseleave', enableMouseTrail);
});

init();
animate();
