import audioService from '../../../services/AudioService.js';

export function renderSyllables(gameArea, gameInstance, gamePlay) {
  const syllables = gameInstance.getSyllables();
  const selected = gameInstance.getSelectedSyllables();
  const currentWord = gameInstance.state.currentWord;

  gameArea.innerHTML = `
    <div class="syllables-hint">
      <img class="syllables-hint__img" src="${currentWord.img}" alt="${currentWord.word}"
           onerror="this.style.display='none'" loading="lazy">
    </div>

    <div class="syllables-display">
      <div class="syllables-word">
        ${selected.map(s => `<span class="syllable-selected">${s.syllable}</span>`).join('')}
      </div>
    </div>

    <div class="syllables-options">
      ${syllables.map((syllable, index) => `
        <button class="syllable-btn" data-index="${index}" data-syllable="${syllable}" aria-label="Sílaba ${syllable}">
          ${syllable}
        </button>
      `).join('')}
    </div>

    <div class="syllables-controls">
      <button class="button button--secondary button--md" id="clear-syllables" aria-label="Limpiar selección">
        <i class="fa-solid fa-eraser"></i>
        Limpiar
      </button>
      <button class="button button--primary button--md" id="check-syllables" aria-label="Verificar respuesta">
        <i class="fa-solid fa-check"></i>
        Verificar
      </button>
    </div>
  `;

  gameArea.querySelectorAll('.syllable-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const syllable = e.target.dataset.syllable;
      gameInstance.selectSyllable(syllable, index);
      e.target.classList.add('selected');
      updateSyllablesDisplay(gameArea, gameInstance);
    });
  });

  gamePlay.element.querySelector('#clear-syllables')?.addEventListener('click', () => {
    gameInstance.clearSelection();
    updateSyllablesDisplay(gameArea, gameInstance);
    gameArea.querySelectorAll('.syllable-btn').forEach(btn => btn.classList.remove('selected'));
  });

  gamePlay.element.querySelector('#check-syllables')?.addEventListener('click', async () => {
    const btn = gamePlay.element.querySelector('#check-syllables');
    if (btn) btn.disabled = true;

    const isCorrect = gameInstance.checkSyllables();
    
    if (isCorrect) {
      await audioService.playCorrect();
      await audioService.playCelebration();
      gamePlay.showFeedback(true);
      setTimeout(() => gamePlay.nextRound(), 1500);
    } else {
      audioService.playWrong();
      gamePlay.showFeedback(false);
      if (btn) btn.disabled = false;
    }
  });
}

export function updateSyllablesDisplay(gameArea, gameInstance) {
  if (!gameInstance || !gameArea) return;
  const selected = gameInstance.getSelectedSyllables();
  const display = gameArea.querySelector('.syllables-word');
  
  if (display) {
    display.innerHTML = selected.map(s => 
      `<span class="syllable-selected">${s.syllable}</span>`
    ).join('');
  }
}
