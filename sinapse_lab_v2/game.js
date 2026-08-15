/* ===================== JOGO: TEMPO DE REAÇÃO ===================== */
const gameBox = document.getElementById('gameBox');
const gameTitle = document.getElementById('gameTitle');
const gameSub = document.getElementById('gameSub');
const statLast = document.getElementById('statLast');
const statBest = document.getElementById('statBest');
const statAvg = document.getElementById('statAvg');
const gameHistory = document.getElementById('gameHistory');

let gameState = 'idle'; // idle -> waiting -> ready -> done
let timeoutId = null;
let startTime = 0;
let results = [];

function resetBoxStyle(){
  gameBox.classList.remove('go', 'early');
  gameBox.classList.add('wait');
}

function startRound(){
  gameState = 'waiting';
  resetBoxStyle();
  gameTitle.textContent = 'Espere...';
  gameSub.textContent = 'O quadro vai ficar verde em instantes. Não clique ainda!';
  const delay = 1200 + Math.random() * 2500;
  timeoutId = setTimeout(() => {
    gameState = 'ready';
    gameBox.classList.remove('wait');
    gameBox.classList.add('go');
    gameTitle.textContent = 'CLIQUE AGORA!';
    gameSub.textContent = '';
    startTime = performance.now();
  }, delay);
}

function registerResult(ms){
  results.push(ms);
  const best = Math.min(...results);
  const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
  statLast.textContent = ms;
  statBest.textContent = best;
  statAvg.textContent = avg;

  const chip = document.createElement('span');
  chip.textContent = ms + ' ms';
  gameHistory.prepend(chip);
  while (gameHistory.children.length > 8) gameHistory.removeChild(gameHistory.lastChild);
}

gameBox.addEventListener('click', () => {
  if (gameState === 'idle' || gameState === 'done') {
    startRound();
    return;
  }
  if (gameState === 'waiting') {
    clearTimeout(timeoutId);
    gameState = 'done';
    gameBox.classList.remove('wait');
    gameBox.classList.add('early');
    gameTitle.textContent = 'Cedo demais!';
    gameSub.textContent = 'Clique para tentar de novo — espere o verde aparecer.';
    return;
  }
  if (gameState === 'ready') {
    const ms = Math.round(performance.now() - startTime);
    registerResult(ms);
    gameState = 'done';
    resetBoxStyle();
    gameBox.classList.remove('wait', 'go');
    gameTitle.textContent = ms + ' ms';
    gameSub.textContent = 'Clique para tentar novamente.';
  }
});
