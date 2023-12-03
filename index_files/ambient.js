const ambientCanvas = document.createElement('canvas');
document.body.appendChild(ambientCanvas);
const ambientCtx = ambientCanvas.getContext('2d');

ambientCanvas.style.position = 'fixed';
ambientCanvas.style.top = '0';
ambientCanvas.style.left = '0';
ambientCanvas.style.width = '100%';
ambientCanvas.style.height = '100%';
ambientCanvas.style.zIndex = '-1'; // Send it to the back; adjust as needed
ambientCanvas.width = window.innerWidth;
ambientCanvas.height = window.innerHeight;

let ambientParticles = [];

class AmbientParticle {
  constructor() {
    this.x = Math.random() * ambientCanvas.width;
    this.y = Math.random() * ambientCanvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.alpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Loop particles around the canvas
    if (this.x < 0 || this.x > ambientCanvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > ambientCanvas.height) this.speedY *= -1;
  }

  draw() {
    ambientCtx.save();
    ambientCtx.globalAlpha = this.alpha;
    ambientCtx.fillStyle = 'purple';
    ambientCtx.beginPath();
    ambientCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ambientCtx.fill();
    ambientCtx.restore();
  }
}

function handleAmbientParticles() {
  for (let i = 0; i < ambientParticles.length; i++) {
    ambientParticles[i].update();
    ambientParticles[i].draw();
    if (ambientParticles[i].alpha <= 0) {
      ambientParticles[i] = new AmbientParticle();
    }
  }
}

function animateAmbient() {
  console.log('Animating ambient particles'); // Debugging log
  ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
  handleAmbientParticles();
  requestAnimationFrame(animateAmbient);
}


function initAmbient() {
  ambientParticles = [];
  for (let i = 0; i < 50; i++) {
    ambientParticles.push(new AmbientParticle());
  }
  animateAmbient();
}

window.addEventListener('resize', function () {
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
});

initAmbient();
