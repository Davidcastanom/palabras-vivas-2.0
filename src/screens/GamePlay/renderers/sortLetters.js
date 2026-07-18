import audioService from '../../../services/AudioService.js';

export function renderSortLetters(gameArea, gameInstance, gamePlay) {
  const shuffled = gameInstance.getShuffledLetters();
  const selected = gameInstance.getSelectedLetters();
  const currentWord = gameInstance.state.currentWord;

  const instruction = gamePlay.element.querySelector('#game-instruction');
  if (instruction) {
    instruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-sort-amount-down"></i>
        <span>Ordena las letras para formar la palabra</span>
      </div>
    `;
  }

  gameArea.innerHTML = `
    <div class="sort-letters-hint">
      <img class="sort-letters-hint__img" src="${currentWord.img}" alt="${currentWord.word}" 
           onerror="this.style.display='none'" loading="lazy">
    </div>

    <div class="sort-letters-display">
      <div class="sort-letters-word">
        ${selected.map(s => `<span class="letter-selected">${s.letter}</span>`).join('')}
      </div>
    </div>

    <div class="sort-letters-options">
      ${shuffled.map((item, index) => `
        <button class="letter-btn ${item.isSelected ? 'selected' : ''}" 
                data-index="${index}" 
                ${item.isSelected ? 'disabled' : ''}
                aria-label="Letra ${item.letter}">
          ${item.letter}
        </button>
      `).join('')}
    </div>

    <div class="sort-letters-controls">
      <button class="btn btn-secondary" id="clear-sort" aria-label="Limpiar selección">Limpiar</button>
      <button class="btn btn-primary" id="check-sort" aria-label="Verificar palabra">Verificar</button>
    </div>
  `;

  gameArea.querySelectorAll('.letter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      gameInstance.selectLetter(index);
      updateSortLettersDisplay(gameArea, gameInstance);
    });
  });

  gamePlay.element.querySelector('#clear-sort')?.addEventListener('click', () => {
    gameInstance.clearSelection();
    updateSortLettersDisplay(gameArea, gameInstance);
  });

  gamePlay.element.querySelector('#check-sort')?.addEventListener('click', async () => {
    const isCorrect = gameInstance.checkWord();
    
    if (isCorrect) {
      await audioService.playCorrect();
      await audioService.playCelebration();
      gamePlay.showFeedback(true);
      setTimeout(() => gamePlay.nextRound(), 1500);
    } else {
      audioService.playWrong();
      gamePlay.showFeedback(false);
    }
  });
}

export function updateSortLettersDisplay(gameArea, gameInstance) {
  if (!gameInstance || !gameArea) return;
  const selected = gameInstance.getSelectedLetters();
  const shuffled = gameInstance.getShuffledLetters();
  const display = gameArea.querySelector('.sort-letters-word');

  if (display) {
    display.innerHTML = selected.map(s => 
      `<span class="letter-selected">${s.letter}</span>`
    ).join('');
  }

  gameArea.querySelectorAll('.letter-btn').forEach((btn, index) => {
    btn.classList.toggle('selected', shuffled[index].isSelected);
    btn.disabled = shuffled[index].isSelected;
  });
}
