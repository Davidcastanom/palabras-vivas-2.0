export function renderSyllables(gameArea, gameInstance, gamePlay) {
  const syllables = gameInstance.getSyllables();
  const selected = gameInstance.getSelectedSyllables();

  gameArea.innerHTML = `
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
      <button class="btn btn-secondary" id="clear-syllables" aria-label="Limpiar selección">Limpiar</button>
      <button class="btn btn-primary" id="check-syllables" aria-label="Verificar respuesta">Verificar</button>
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

  gamePlay.element.querySelector('#check-syllables')?.addEventListener('click', () => {
    const isCorrect = gameInstance.checkSyllables();
    
    if (isCorrect) {
      gamePlay.showFeedback(true);
      setTimeout(() => gamePlay.nextRound(), 1500);
    } else {
      gamePlay.showFeedback(false);
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
