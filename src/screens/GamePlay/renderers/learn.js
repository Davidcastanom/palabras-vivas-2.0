import audioService from '../../../services/AudioService.js';

export function renderLearn(gamePlay) {
  const gameArea = gamePlay.element.querySelector('#game-area');
  const gameInstruction = gamePlay.element.querySelector('#game-instruction');
  const progressFill = gamePlay.element.querySelector('#progress-fill');
  const progressText = gamePlay.element.querySelector('#progress-text');
  const scoreText = gamePlay.element.querySelector('#score-text');
  const controls = gamePlay.element.querySelector('#game-controls');

  if (!gameArea) return;

  const word = gamePlay.learnWords[gamePlay.learnIndex];
  const total = gamePlay.learnWords.length;
  const syllablesArray = word.syllables.split('-');

  if (progressFill) progressFill.style.width = `${((gamePlay.learnIndex + 1) / total) * 100}%`;
  if (progressText) progressText.textContent = `${gamePlay.learnIndex + 1}/${total}`;
  if (scoreText) scoreText.textContent = gamePlay.learnIndex + 1;

  if (gameInstruction) {
    gameInstruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-ear-listen"></i>
        <span>Escucha y repite la palabra</span>
      </div>
    `;
  }

  gameArea.innerHTML = `
    <div class="learn-flashcard">
      <div class="learn-image-container">
        <img src="${word.img}" alt="${word.word}" class="learn-image" onerror="this.style.display='none'" loading="lazy">
      </div>
      <div class="learn-word">${word.word}</div>
      <div class="learn-syllables">
        ${syllablesArray.map((s, i) => `
          <button class="learn-syllable-btn" data-index="${i}" aria-label="Sílaba ${s}">${s}</button>
        `).join('')}
      </div>
    </div>
  `;

  if (controls) {
    controls.innerHTML = `
      <div class="learn-controls">
        <button class="btn btn-secondary learn-nav-btn" id="learn-prev" ${gamePlay.learnIndex === 0 ? 'disabled' : ''} aria-label="Palabra anterior">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="btn btn-primary learn-audio-btn" id="learn-play" aria-label="Escuchar palabra">
          <i class="fas fa-volume-high"></i> Escuchar
        </button>
        <button class="btn btn-secondary learn-nav-btn" id="learn-next" ${gamePlay.learnIndex === total - 1 ? 'disabled' : ''} aria-label="Siguiente palabra">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
  }

  gamePlay.element.querySelector('#learn-play')?.addEventListener('click', () => {
    audioService.playWordSequence(word);
  });

  gamePlay.element.querySelector('#learn-prev')?.addEventListener('click', () => {
    if (gamePlay.learnIndex > 0) {
      gamePlay.learnIndex--;
      renderLearn(gamePlay);
    }
  });

  gamePlay.element.querySelector('#learn-next')?.addEventListener('click', () => {
    if (gamePlay.learnIndex < total - 1) {
      gamePlay.learnIndex++;
      renderLearn(gamePlay);
    }
  });

  gameArea.querySelectorAll('.learn-syllable-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audioService.playSyllables(word);
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 500);
    });
  });

  setTimeout(() => audioService.playWordSequence(word), 300);
}
