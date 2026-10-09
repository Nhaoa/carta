/* =========================================================
   EFEITOS VISUAIS E ÁUDIO
========================================================= */

window.initFXCanvas = function() {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

window.createFloatingParticles = function(x, y, count = 12) {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  const emojis = ['💖', '✨', '🐾', '🎀'];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 1.2) * 5,
      alpha: 1,
      char: emojis[Math.floor(Math.random() * emojis.length)],
      size: 16 + Math.random() * 12
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      if (p.alpha > 0) {
        active = true;
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.char, p.x, p.y);
      }
    });
    ctx.globalAlpha = 1;
    if (active) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(frame);
};

window.playPaperSound = function() {};
window.playMeowSound = function() {};/* =========================================================
   CANVAS 2D: EFEITOS DE CARINHO COM FOLHAS ANATÔMICAS,
   CORAÇÕES E ESTRELAS
========================================================= */

const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
const particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createFloatingParticles(x, y, count = 5) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 20 - 10),
      vx: Math.random() * 2 - 1,
      vy: -(Math.random() * 2 + 1.5),
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.08,
      size: Math.random() * 12 + 12,
      alpha: 0.95,
      decay: Math.random() * 0.015 + 0.012,
      type: activeEffect,
      color: effectColor
    });
  }
}

function drawParticle(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;

  if (p.type === 'heart') {
    const topH = p.size * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, topH);
    ctx.bezierCurveTo(0, 0, -p.size/2, 0, -p.size/2, topH);
    ctx.bezierCurveTo(-p.size/2, (p.size+topH)/2, 0, p.size, 0, p.size);
    ctx.bezierCurveTo(0, p.size, p.size/2, (p.size+topH)/2, p.size/2, topH);
    ctx.bezierCurveTo(p.size/2, 0, 0, 0, 0, topH);
    ctx.fill();
  } else if (p.type === 'leaf') {
    // Folha real anatômica
    const w = p.size * 0.6;
    const h = p.size * 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.bezierCurveTo(w, -h/4, w*0.8, h/3, 0, h/2);
    ctx.bezierCurveTo(-w*0.8, h/3, -w, -h/4, 0, -h/2);
    ctx.fill();

    // Nervura central da folha
    ctx.strokeStyle = "rgba(43, 39, 37, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -h/2 + 2);
    ctx.lineTo(0, h/2 - 2);
    ctx.stroke();
  } else if (p.type === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(p.size * 0.7, 0);
      ctx.lineTo(p.size * 0.22, p.size * 0.22);
    }
    ctx.fill();
  }

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i];
    drawParticle(pt);
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.rot += pt.vrot;
    pt.alpha -= pt.decay;
    if (pt.alpha <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(animate);
}
animate();
