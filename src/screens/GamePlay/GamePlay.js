/**
 * GamePlay Screen
 * Pantalla principal de juego
 */

import Screen from '../../components/layout/Screen/Screen.js';
import Container from '../../components/layout/Container/Container.js';
import CompleteWordGame from '../../games/complete-word/CompleteWordGame.js';
import MemoryGame from '../../games/memory/MemoryGame.js';
import SyllablesGame from '../../games/syllables/SyllablesGame.js';
import WordSearchGame from '../../games/word-search/WordSearchGame.js';
import SortLettersGame from '../../games/sort-letters/SortLettersGame.js';
import AssociationGame from '../../games/association/AssociationGame.js';

class GamePlay {
  constructor(app) {
    this.app = app;
    this.container = null;
    this.gameInstance = null;
    this.currentGameId = null;
  }

  async render() {
    const screen = new Screen({
      id: 'game-play',
      className: 'screen-game-play',
      showHeader: false,
      showBackButton: true,
      onBack: () => this.handleBack()
    });

    this.container = new Container({
      className: 'game-play-container',
      padding: 'md'
    });

    const content = document.createElement('div');
    content.className = 'game-play-content';

    content.innerHTML = `
      <div class="game-play-header">
        <button class="game-play-pause-btn" id="pause-btn">
          <i class="fas fa-pause"></i>
        </button>
        
        <div class="game-play-progress">
          <div class="game-play-progress-bar">
            <div class="game-play-progress-fill" id="progress-fill"></div>
          </div>
          <span class="game-play-progress-text" id="progress-text">1/5</span>
        </div>

        <div class="game-play-score">
          <i class="fas fa-star"></i>
          <span id="score-text">0</span>
        </div>
      </div>

      <div class="game-play-instruction" id="game-instruction"></div>

      <div class="game-play-area" id="game-area"></div>

      <div class="game-play-controls" id="game-controls"></div>
    `;

    this.container.appendChild(content);
    screen.addContent(this.container);

    return screen.render();
  }

  async init(gameId, category) {
    this.currentGameId = gameId;
    
    // Obtener palabras de la categoría
    const words = this.app.state.categories[category] || [];
    
    if (words.length === 0) {
      this.app.showToast('No hay palabras disponibles', 'error');
      return;
    }

    // Crear instancia del juego
    this.gameInstance = this.createGameInstance(gameId, words, category);
    
    if (!this.gameInstance) {
      this.app.showToast('Juego no encontrado', 'error');
      return;
    }

    // Configurar callbacks
    this.gameInstance.config.onStateChange = (state) => this.updateUI(state);
    this.gameInstance.config.onGameComplete = (result) => this.handleGameComplete(result);
    this.gameInstance.config.onCorrectAnswer = (data) => this.handleCorrectAnswer(data);
    this.gameInstance.config.onWrongAnswer = (data) => this.handleWrongAnswer(data);

    // Iniciar juego
    this.gameInstance.init();
    
    // Renderizar juego específico
    this.renderGame();
  }

  createGameInstance(gameId, words, category) {
    const config = {
      words,
      category,
      totalRounds: Math.min(5, words.length)
    };

    switch (gameId) {
      case 'complete-word':
        return new CompleteWordGame(config);
      case 'memory':
        return new MemoryGame(config);
      case 'syllables':
        return new SyllablesGame(config);
      case 'word-search':
        return new WordSearchGame(config);
      case 'sort-letters':
        return new SortLettersGame(config);
      case 'association':
        return new AssociationGame(config);
      default:
        return null;
    }
  }

  renderGame() {
    const gameArea = document.getElementById('game-area');
    const gameInstruction = document.getElementById('game-instruction');
    const gameControls = document.getElementById('game-controls');

    if (!gameArea || !this.gameInstance) return;

    const state = this.gameInstance.getState();
    const word = state.currentWord;

    // Mostrar instrucción
    gameInstruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-lightbulb"></i>
        <span>Selecciona la opción correcta</span>
      </div>
    `;

    // Renderizar según tipo de juego
    switch (this.currentGameId) {
      case 'complete-word':
        this.renderCompleteWord(gameArea, gameControls);
        break;
      case 'memory':
        this.renderMemory(gameArea, gameControls);
        break;
      case 'syllables':
        this.renderSyllables(gameArea, gameControls);
        break;
      case 'word-search':
        this.renderWordSearch(gameArea, gameControls);
        break;
      case 'sort-letters':
        this.renderSortLetters(gameArea, gameControls);
        break;
      case 'association':
        this.renderAssociation(gameArea, gameControls);
        break;
    }
  }

  renderCompleteWord(gameArea, gameControls) {
    const wordDisplay = this.gameInstance.getWordWithMissing();
    const options = this.gameInstance.getOptions();

    gameArea.innerHTML = `
      <div class="complete-word-display">
        ${wordDisplay.map(item => `
          <span class="letter-slot ${item.isMissing ? 'missing' : ''}" 
                ${item.isMissing ? 'id="missing-letter"' : ''}>
            ${item.isVisible ? item.letter : '_'}
          </span>
        `).join('')}
      </div>

      <div class="complete-word-options">
        ${options.map((letter, index) => `
          <button class="complete-word-option" data-index="${index}" data-letter="${letter}">
            ${letter}
          </button>
        `).join('')}
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.complete-word-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const letter = e.target.dataset.letter;
        const isCorrect = this.gameInstance.checkAnswer(this.gameInstance.state.currentWord.word);
        
        if (isCorrect) {
          this.showFeedback(true);
          setTimeout(() => this.nextRound(), 1500);
        } else {
          this.showFeedback(false);
        }
      });
    });
  }

  renderMemory(gameArea, gameControls) {
    const cards = this.gameInstance.getCards();

    gameArea.innerHTML = `
      <div class="memory-grid">
        ${cards.map(card => `
          <div class="memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}" 
               data-id="${card.id}">
            <div class="memory-card-front">
              <i class="fas fa-question"></i>
            </div>
            <div class="memory-card-back">
              ${card.type === 'image' 
                ? `<img src="${card.content}" alt="${card.text}">`
                : `<span>${card.content}</span>`
              }
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.memory-card').forEach(card => {
      card.addEventListener('click', () => {
        const cardId = card.dataset.id;
        const flippedCard = this.gameInstance.flipCard(cardId);
        
        if (flippedCard) {
          card.classList.add('flipped');
          
          if (this.gameInstance.getFlippedCards().length === 2) {
            setTimeout(() => this.updateMemoryCards(), 1000);
          }
        }
      });
    });
  }

  updateMemoryCards() {
    const cards = this.gameInstance.getCards();
    const gameArea = document.getElementById('game-area');
    
    if (!gameArea) return;

    cards.forEach(card => {
      const cardElement = gameArea.querySelector(`[data-id="${card.id}"]`);
      if (cardElement) {
        cardElement.classList.toggle('flipped', card.isFlipped);
        cardElement.classList.toggle('matched', card.isMatched);
      }
    });
  }

  renderSyllables(gameArea, gameControls) {
    const syllables = this.gameInstance.getSyllables();
    const selected = this.gameInstance.getSelectedSyllables();

    gameArea.innerHTML = `
      <div class="syllables-display">
        <div class="syllables-word">
          ${selected.map(s => `<span class="syllable-selected">${s.syllable}</span>`).join('')}
        </div>
      </div>

      <div class="syllables-options">
        ${syllables.map((syllable, index) => `
          <button class="syllable-btn" data-index="${index}" data-syllable="${syllable}">
            ${syllable}
          </button>
        `).join('')}
      </div>

      <div class="syllables-controls">
        <button class="btn btn-secondary" id="clear-syllables">Limpiar</button>
        <button class="btn btn-primary" id="check-syllables">Verificar</button>
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.syllable-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const syllable = e.target.dataset.syllable;
        this.gameInstance.selectSyllable(syllable, index);
        e.target.classList.add('selected');
        this.updateSyllablesDisplay();
      });
    });

    document.getElementById('clear-syllables')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateSyllablesDisplay();
      gameArea.querySelectorAll('.syllable-btn').forEach(btn => btn.classList.remove('selected'));
    });

    document.getElementById('check-syllables')?.addEventListener('click', () => {
      const isCorrect = this.gameInstance.checkSyllables();
      
      if (isCorrect) {
        this.showFeedback(true);
        setTimeout(() => this.nextRound(), 1500);
      } else {
        this.showFeedback(false);
      }
    });
  }

  updateSyllablesDisplay() {
    const selected = this.gameInstance.getSelectedSyllables();
    const display = document.querySelector('.syllables-word');
    
    if (display) {
      display.innerHTML = selected.map(s => 
        `<span class="syllable-selected">${s.syllable}</span>`
      ).join('');
    }
  }

  renderWordSearch(gameArea, gameControls) {
    const grid = this.gameInstance.getGrid();
    const currentWord = this.gameInstance.getCurrentWord();

    gameArea.innerHTML = `
      <div class="word-search-word">
        Busca: <strong>${currentWord.word.toUpperCase()}</strong>
      </div>

      <div class="word-search-grid">
        ${grid.map((row, rowIndex) => `
          <div class="word-search-row">
            ${row.map((cell, colIndex) => `
              <button class="word-search-cell ${cell.isSelected ? 'selected' : ''} ${cell.isFound ? 'found' : ''}" 
                      data-row="${rowIndex}" data-col="${colIndex}">
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
        <button class="btn btn-secondary" id="clear-word-search">Limpiar</button>
        <button class="btn btn-primary" id="check-word-search">Verificar</button>
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.word-search-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        this.gameInstance.selectLetter(row, col);
        this.updateWordSearchDisplay();
      });
    });

    document.getElementById('clear-word-search')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateWordSearchDisplay();
    });

    document.getElementById('check-word-search')?.addEventListener('click', () => {
      const isCorrect = this.gameInstance.checkSelection();
      
      if (isCorrect) {
        this.showFeedback(true);
        this.gameInstance.nextWord();
        this.renderGame();
      } else {
        this.showFeedback(false);
      }
    });
  }

  updateWordSearchDisplay() {
    const selected = this.gameInstance.getSelectedLetters();
    const grid = this.gameInstance.getGrid();
    const selectedWordEl = document.getElementById('selected-word');
    const gameArea = document.getElementById('game-area');

    if (selectedWordEl) {
      selectedWordEl.textContent = selected.map(l => l.letter).join('');
    }

    // Actualizar estado visual de celdas
    if (gameArea) {
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
  }

  renderSortLetters(gameArea, gameControls) {
    const shuffled = this.gameInstance.getShuffledLetters();
    const selected = this.gameInstance.getSelectedLetters();

    gameArea.innerHTML = `
      <div class="sort-letters-display">
        <div class="sort-letters-word">
          ${selected.map(s => `<span class="letter-selected">${s.letter}</span>`).join('')}
        </div>
      </div>

      <div class="sort-letters-options">
        ${shuffled.map((item, index) => `
          <button class="letter-btn ${item.isSelected ? 'selected' : ''}" 
                  data-index="${index}" 
                  ${item.isSelected ? 'disabled' : ''}>
            ${item.letter}
          </button>
        `).join('')}
      </div>

      <div class="sort-letters-controls">
        <button class="btn btn-secondary" id="clear-sort">Limpiar</button>
        <button class="btn btn-primary" id="check-sort">Verificar</button>
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.letter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.gameInstance.selectLetter(index);
        this.updateSortLettersDisplay();
      });
    });

    document.getElementById('clear-sort')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateSortLettersDisplay();
    });

    document.getElementById('check-sort')?.addEventListener('click', () => {
      const isCorrect = this.gameInstance.checkWord();
      
      if (isCorrect) {
        this.showFeedback(true);
        setTimeout(() => this.nextRound(), 1500);
      } else {
        this.showFeedback(false);
      }
    });
  }

  updateSortLettersDisplay() {
    const selected = this.gameInstance.getSelectedLetters();
    const shuffled = this.gameInstance.getShuffledLetters();
    const display = document.querySelector('.sort-letters-word');
    const gameArea = document.getElementById('game-area');

    if (display) {
      display.innerHTML = selected.map(s => 
        `<span class="letter-selected">${s.letter}</span>`
      ).join('');
    }

    if (gameArea) {
      gameArea.querySelectorAll('.letter-btn').forEach((btn, index) => {
        btn.classList.toggle('selected', shuffled[index].isSelected);
        btn.disabled = shuffled[index].isSelected;
      });
    }
  }

  renderAssociation(gameArea, gameControls) {
    const options = this.gameInstance.getOptions();

    gameArea.innerHTML = `
      <div class="association-word">
        <h3>${this.gameInstance.state.currentWord.word}</h3>
      </div>

      <div class="association-options">
        ${options.map((option, index) => `
          <button class="association-option" data-index="${index}">
            <img src="${option.image}" alt="${option.word}">
            <span>${option.word}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Event listeners
    gameArea.querySelectorAll('.association-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.association-option').dataset.index);
        this.gameInstance.selectOption(index);
        
        const isCorrect = this.gameInstance.checkSelection();
        
        if (isCorrect) {
          this.showFeedback(true);
          this.updateAssociationDisplay();
          
          if (!this.gameInstance.state.isComplete) {
            setTimeout(() => this.nextRound(), 1500);
          }
        } else {
          this.showFeedback(false);
        }
      });
    });
  }

  updateAssociationDisplay() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    const progress = this.gameInstance.getMatchProgress();
    gameArea.querySelectorAll('.association-option').forEach(btn => {
      btn.classList.remove('selected', 'correct', 'wrong');
    });
  }

  updateUI(state) {
    // Actualizar barra de progreso
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const scoreText = document.getElementById('score-text');

    if (progressFill && state.currentRound) {
      const progress = (state.currentRound / 5) * 100;
      progressFill.style.width = `${progress}%`;
    }

    if (progressText && state.currentRound) {
      progressText.textContent = `${state.currentRound}/5`;
    }

    if (scoreText && state.score !== undefined) {
      scoreText.textContent = state.score;
    }
  }

  showFeedback(isCorrect) {
    const feedback = document.createElement('div');
    feedback.className = `game-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.innerHTML = `
      <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
      <span>${isCorrect ? '¡Correcto!' : 'Intenta de nuevo'}</span>
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1500);
  }

  nextRound() {
    if (this.gameInstance) {
      this.gameInstance.nextRound();
      this.renderGame();
    }
  }

  handleCorrectAnswer(data) {
    this.app.showToast(`+${data.points} puntos`, 'success');
  }

  handleWrongAnswer(data) {
    this.app.showToast('¡Inténtalo de nuevo!', 'warning');
  }

  handleGameComplete(result) {
    // Guardar resultado
    this.app.saveGameResult(result);
    
    // Mostrar pantalla de resultados
    this.showResults(result);
  }

  showResults(result) {
    const gameArea = document.getElementById('game-area');
    const gameControls = document.getElementById('game-controls');

    if (!gameArea) return;

    gameArea.innerHTML = `
      <div class="game-results">
        <div class="results-stars">
          ${[1, 2, 3].map(star => `
            <i class="fas fa-star ${star <= result.stars ? 'earned' : ''}"></i>
          `).join('')}
        </div>

        <h2 class="results-title">¡Juego Completado!</h2>

        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-value">${result.score}</span>
            <span class="stat-label">Puntos</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${result.accuracy}%</span>
            <span class="stat-label">Precisión</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${result.streak}</span>
            <span class="stat-label">Mejor racha</span>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn btn-secondary" id="play-again">Jugar de nuevo</button>
          <button class="btn btn-primary" id="back-to-menu">Volver al menú</button>
        </div>
      </div>
    `;

    if (gameControls) {
      gameControls.innerHTML = '';
    }

    // Event listeners
    document.getElementById('play-again')?.addEventListener('click', () => {
      this.gameInstance.reset();
      this.renderGame();
    });

    document.getElementById('back-to-menu')?.addEventListener('click', () => {
      this.handleBack();
    });
  }

  handleBack() {
    if (this.gameInstance) {
      this.gameInstance.pause();
    }
    this.app.navigateTo('gameMenu');
  }

  destroy() {
    if (this.gameInstance) {
      this.gameInstance.destroy();
      this.gameInstance = null;
    }
  }
}

export default GamePlay;
