export function renderWordSearch(gameArea, gameInstance, gamePlay) {
  const grid = gameInstance.getGrid();
  const currentWord = gameInstance.getCurrentWord();

  const instruction = gamePlay.element.querySelector('#game-instruction');
  if (instruction) {
    instruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-search"></i>
        <span>Busca la palabra en la cuadrícula</span>
      </div>
    `;
  }

  gameArea.innerHTML = `
    <div class="word-search-hint">
      <img class="word-search-hint__img" src="${currentWord.img}" alt="${currentWord.word}" 
           onerror="this.style.display='none'" loading="lazy">
      <div class="word-search-hint__word">Busca: <strong>${currentWord.word.toUpperCase()}</strong></div>
    </div>

    <div class="word-search-grid">
      ${grid.map((row, rowIndex) => `
        <div class="word-search-row">
          ${row.map((cell, colIndex) => `
            <button class="word-search-cell ${cell.isSelected ? 'selected' : ''} ${cell.isFound ? 'found' : ''}" 
                    data-row="${rowIndex}" data-col="${colIndex}"
                    aria-label="Letra ${cell.letter}, fila ${rowIndex + 1}, columna ${colIndex + 1}">
              ${cell.letter}
            </button>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <div class="word-search-selected">
      Seleccionado: <span id="selected-word"></span>
    </div>

    <div class="word-search-controls">
      <button class="button button--secondary button--md" id="clear-word-search" aria-label="Limpiar selección">
        <i class="fa-solid fa-eraser"></i>
        Limpiar
      </button>
      <button class="button button--primary button--md" id="check-word-search" aria-label="Verificar palabra">
        <i class="fa-solid fa-check"></i>
        Verificar
      </button>
    </div>
  `;

  gameArea.querySelectorAll('.word-search-cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const row = parseInt(e.target.dataset.row);
      const col = parseInt(e.target.dataset.col);
      gameInstance.selectLetter(row, col);
      updateWordSearchDisplay(gameArea, gameInstance);
    });
  });

  gamePlay.element.querySelector('#clear-word-search')?.addEventListener('click', () => {
    gameInstance.clearSelection();
    updateWordSearchDisplay(gameArea, gameInstance);
  });

  gamePlay.element.querySelector('#check-word-search')?.addEventListener('click', () => {
    const isCorrect = gameInstance.checkSelection();
    
    if (isCorrect) {
      gamePlay.showFeedback(true);
      gameInstance.nextWord();
      gamePlay.renderGame();
    } else {
      gamePlay.showFeedback(false);
    }
  });
}

export function updateWordSearchDisplay(gameArea, gameInstance) {
  if (!gameInstance || !gameArea) return;
  const selected = gameInstance.getSelectedLetters();
  const grid = gameInstance.getGrid();
  const selectedWordEl = gameArea.querySelector('#selected-word');

  if (selectedWordEl) {
    selectedWordEl.textContent = selected.map(l => l.letter).join('');
  }

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = gameArea.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
      if (cellElement) {
        cellElement.classList.toggle('selected', cell.isSelected);
        cellElement.classList.toggle('found', cell.isFound);
      }
    });
  });
}
