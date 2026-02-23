(() => {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId;

  const PARTICLE_COUNT = 80;
  const COLORS = [
    'rgba(255, 215, 0, ',   // gold
    'rgba(139, 92, 246, ',   // purple
    'rgba(6, 182, 212, ',    // cyan
    'rgba(255, 255, 255, ',  // white
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.8 + 0.4,
      color: color,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: Math.random() * 0.003 + 0.001,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.fill();

    // Soft glow
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color + (p.alpha * 0.15) + ')';
    ctx.fill();
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Twinkle
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha >= 0.6) { p.alpha = 0.6; p.alphaDir = -1; }
      if (p.alpha <= 0.05) { p.alpha = 0.05; p.alphaDir = 1; }

      // Wrap around
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    update();
    drawConnections();
    for (const p of particles) {
      drawParticle(p);
    }
    animationId = requestAnimationFrame(animate);
  }

  // Init
  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  // Scroll-aware header
  const header = document.querySelector('.header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.style.background = 'rgba(10, 10, 15, 0.85)';
      header.style.borderBottomColor = 'rgba(255, 215, 0, 0.12)';
    } else {
      header.style.background = '';
      header.style.borderBottomColor = '';
    }
    lastScroll = scrollY;
  }, { passive: true });
})();
