import audioService from '../../../services/AudioService.js';

export function renderAssociation(gameArea, gameInstance, gamePlay) {
  const target = gameInstance.getTarget();
  const options = gameInstance.getOptions();

  const instruction = gamePlay.element.querySelector('#game-instruction');
  if (instruction) {
    instruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-ear-listen"></i>
        <span>Escucha y toca la imagen correcta</span>
      </div>
    `;
    setTimeout(() => {
      audioService.speak('Toca... ' + target.word);
    }, 1000);
  }

  gameArea.innerHTML = `
    <div class="game-options-grid">
      ${options.map((opt, index) => `
        <button class="game-image-option" data-index="${index}" data-id="${opt.id}" aria-label="${opt.word}">
          <div class="game-image-option__img">
            <img src="${opt.img}" alt="${opt.word}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'" loading="lazy">
          </div>
          <div class="game-image-option__word">${opt.word}</div>
        </button>
      `).join('')}
    </div>
  `;

  gameArea.querySelectorAll('.game-image-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const selected = options.find(o => o.id === id);
      const isCorrect = gameInstance.checkAnswer(selected);

      if (isCorrect) {
        gamePlay.showFeedback(true);
        gamePlay.addStarToApp();
        audioService.speak('¡Muy bien!');
        setTimeout(() => gamePlay.nextRound(), 1500);
      } else {
        gamePlay.showFeedback(false);
        audioService.speak('Oh, no. Inténtalo de nuevo');
      }
    });
  });
}
