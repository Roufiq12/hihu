const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressFill = document.getElementById('progress-fill');
const slideLabel = document.getElementById('slide-label');
let current = 0;
let letterOpened = false;
let candleBlown = false;
let typingTimer;

const greeting = "May your day be filled with happiness, beautiful memories, and endless smiles. Semoga semua hal baik selalu menemukan jalannya menuju kamu.";
const letter = "Selamat ulang tahun yaa sayang, sehat selalu yaa sayang. Selamat bertambah usianyaa dan semoga bahagia yaa sayang. Semoga kita tetap bersama terus yaa sayang, kita jalani bersama. I love you.";

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeText(element, text, speed = 34) {
  clearInterval(typingTimer);
  if (reduceMotion) { element.textContent = text; return; }
  // Teks yang belum diketik tetap ada tapi disembunyikan, supaya layout tidak loncat.
  element.textContent = '';
  const shown = document.createTextNode('');
  const rest = document.createElement('span');
  rest.className = 'ghost';
  rest.setAttribute('aria-hidden', 'true');
  rest.textContent = text;
  element.append(shown, rest);
  let i = 0;
  typingTimer = setInterval(() => {
    i++;
    shown.data = text.slice(0, i);
    rest.textContent = text.slice(i);
    if (i >= text.length) clearInterval(typingTimer);
  }, speed);
}

function showSlide(index) {
  clearInterval(typingTimer);
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
    dot.setAttribute('aria-current', i === current ? 'true' : 'false');
  });
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  nextBtn.innerHTML = current === slides.length - 1 ? 'End <span>♡</span>' : 'Next <span>→</span>';
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
  slideLabel.textContent = `${String(current + 1).padStart(2, '0')} / 06`;
  if (current === 1) typeText(document.getElementById('greeting-typing'), greeting, 29);
  if (current === 3 && letterOpened) typeText(document.getElementById('letter-text'), letter, 28);
  if (current === 4 && candleBlown) document.getElementById('flame').classList.add('out');
}

function burstConfetti(amount = 90) {
  if (reduceMotion) return;
  const layer = document.getElementById('confetti-layer');
  const colors = ['#f1a9c2', '#f7c9d9', '#fff0a8', '#d9b9e8', '#ffffff', '#e88fae'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.4}s`);
    piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 5500);
  }
}

document.getElementById('open-surprise').addEventListener('click', () => {
  burstConfetti(105);
  showSlide(1);
});
prevBtn.addEventListener('click', () => showSlide(current - 1));
nextBtn.addEventListener('click', () => showSlide(current + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

document.getElementById('envelope').addEventListener('click', () => {
  const envelope = document.getElementById('envelope');
  const paper = document.getElementById('letter-paper');
  const hint = document.getElementById('letter-hint');
  if (!letterOpened) {
    letterOpened = true;
    envelope.classList.add('open');
    setTimeout(() => {
      paper.classList.add('show');
      typeText(document.getElementById('letter-text'), letter, 30);
      hint.textContent = 'A little message, written especially for you ♡';
      envelope.style.display = 'none';
    }, 700);
  }
});

document.getElementById('blow-candle').addEventListener('click', () => {
  if (candleBlown) return;
  candleBlown = true;
  document.getElementById('flame').classList.add('out');
  document.getElementById('cake-message').textContent = 'May all your beautiful wishes come true! ♡';
  const blowBtn = document.getElementById('blow-candle');
  blowBtn.textContent = 'Wish sent with love ♡';
  blowBtn.disabled = true;
  burstConfetti(120);
});

document.getElementById('replay').addEventListener('click', () => {
  letterOpened = false;
  candleBlown = false;
  const envelope = document.getElementById('envelope');
  envelope.style.display = '';
  envelope.classList.remove('open');
  document.getElementById('letter-paper').classList.remove('show');
  document.getElementById('letter-text').textContent = '';
  document.getElementById('letter-hint').textContent = 'Ketuk amplop untuk membuka surat kecil ini.';
  document.getElementById('flame').classList.remove('out');
  document.getElementById('cake-message').textContent = 'Make a wish, Diandra!';
  const blowBtn = document.getElementById('blow-candle');
  blowBtn.innerHTML = 'Tap to blow the candle <span>✧</span>';
  blowBtn.disabled = false;
  showSlide(0);
  burstConfetti(55);
});

// Decorative sparkles, generated once.
const sparkleLayer = document.querySelector('.sparkle-layer');
for (let i = 0; i < 22; i++) {
  const star = document.createElement('span');
  star.className = 'sparkle';
  star.textContent = i % 3 === 0 ? '✧' : '·';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.fontSize = `${8 + Math.random() * 12}px`;
  star.style.animationDelay = `${Math.random() * 3}s`;
  sparkleLayer.appendChild(star);
}

// Keyboard navigation for desktop.
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' && current < slides.length - 1) showSlide(current + 1);
  if (event.key === 'ArrowLeft' && current > 0) showSlide(current - 1);
});

// Swipe kiri/kanan di HP.
let touchX = null;
const stage = document.querySelector('.experience');
stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 60) showSlide(current + (dx < 0 ? 1 : -1));
}, { passive: true });

showSlide(0);
