/* ===================== NAV / SISTEMA DE ABAS ===================== */
const navEl = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 20);
});
const hamburger = document.getElementById('hamburger');
const tabsEl = document.getElementById('tabs');
hamburger.addEventListener('click', () => tabsEl.classList.toggle('open'));

const tabLinks = document.querySelectorAll('.tab-link');
const pages = document.querySelectorAll('.page');

function showPage(id){
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  tabLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
  window.scrollTo({ top: 0, behavior: 'instant' });
  tabsEl.classList.remove('open');
}
tabLinks.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target)));
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.scroll));
});

/* ===================== SCROLL REVEAL ===================== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===================== HERO NEURON CANVAS ===================== */
const canvas = document.getElementById('neuronCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles;
function resizeCanvas(){
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
function initParticles(){
  const count = Math.min(70, Math.floor(W / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * 0.35, vy: (Math.random() - .5) * 0.35,
    r: Math.random() * 1.6 + 1
  }));
}
function drawParticles(){
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(183,148,246,${0.16 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = Math.random() < 0.002 ? '#f2b134' : '#b794f6';
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
resizeCanvas(); initParticles(); drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

/* ===================== LOGIN MODAL ===================== */
const overlay = document.getElementById('loginOverlay');
document.getElementById('openLogin').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('closeLogin').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('loginMsg').classList.add('show');
});

/* ===================== VIDEO FACADE ===================== */
document.getElementById('playVideo').addEventListener('click', () => {
  const frame = document.getElementById('videoFrame');
  frame.innerHTML = '<iframe src="https://www.youtube.com/embed/LNHBMFCzznE?autoplay=1" title="Vídeo sobre neuroplasticidade" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
});

/* ===================== CEREBRO 3D FACADE (Sketchfab) ===================== */
const brainButton = document.getElementById('loadBrain');
if (brainButton) {
  brainButton.addEventListener('click', () => {
    const stage = document.getElementById('brainStage');
    stage.innerHTML = '<iframe title="Modelo 3D interativo do cérebro" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen ' +
      'src="https://sketchfab.com/models/0aa0e33c5c854d1bab7bac9e1c7acaec/embed?ui_theme=dark&annotations_visible=1"></iframe>';
  });
}

const brainRegions = {
  prefrontal: ['Córtex pré-frontal', 'Participa do planejamento, tomada de decisões, controle executivo e organização de comportamentos orientados a objetivos.'],
  hipocampo: ['Hipocampo', 'Participa da formação e organização de memórias e ajuda a relacionar experiências com seu contexto.'],
  amigdala: ['Amígdala', 'Participa do processamento de estímulos emocionalmente relevantes e de respostas relacionadas a ameaças.'],
  motor: ['Córtex motor', 'Participa do planejamento e controle de movimentos voluntários.'],
  cerebelo: ['Cerebelo', 'Contribui para coordenação, equilíbrio, precisão dos movimentos e aprendizagem motora.'],
  tronco: ['Tronco encefálico', 'Conecta o encéfalo à medula espinhal e participa de funções essenciais, além de vias de comunicação neural.']
};
document.querySelectorAll('[data-brain]').forEach(btn => {
  btn.addEventListener('click', () => {
    const data = brainRegions[btn.dataset.brain];
    if (!data) return;
    document.getElementById('brainInfoTitle').textContent = data[0];
    document.getElementById('brainInfoText').textContent = data[1];
    document.querySelectorAll('[data-brain]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
