/* =========================================================
   MINIJOGO SOLO E BASE PARA JOGOS MULTIPLAYER
========================================================= */

let gameInterval = null;

function openMinigame(e) {
  if (e) e.stopPropagation();
  document.getElementById('game-modal').classList.add('open');
  startMinigame();
}

function closeMinigame(e) {
  if (e) e.stopPropagation();
  document.getElementById('game-modal').classList.remove('open');
  clearInterval(gameInterval);
  const arena = document.getElementById('game-arena');
  if (arena) arena.innerHTML = '';
}

function startMinigame() {
  const arena = document.getElementById('game-arena');
  if (!arena) return;
  arena.innerHTML = '';
  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    if (!document.getElementById('game-modal').classList.contains('open')) return;

    const paw = document.createElement('div');
    paw.className = 'clickable-paw';
    paw.innerText = ['🐾', '🧶', '🐟', '✨'][Math.floor(Math.random() * 4)];
    paw.style.left = `${Math.random() * 80 + 5}%`;
    paw.style.top = `${Math.random() * 70 + 10}%`;

    paw.onclick = () => {
      userPawCoins += 1;
      catStats.happiness = Math.min(100, catStats.happiness + 2);
      saveStats();
      playPaperSound();
      paw.remove();
    };

    arena.appendChild(paw);
    setTimeout(() => paw.remove(), 900);
  }, 700);
}
