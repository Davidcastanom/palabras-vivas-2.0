/**
 * GamePlay Screen
 * Pantalla principal de juego
 */

import './GamePlay.css';
import CompleteWordGame from '../../games/complete-word/CompleteWordGame.js';
import MemoryGame from '../../games/memory/MemoryGame.js';
import SyllablesGame from '../../games/syllables/SyllablesGame.js';
import WordSearchGame from '../../games/word-search/WordSearchGame.js';
import SortLettersGame from '../../games/sort-letters/SortLettersGame.js';
import AssociationGame from '../../games/association/AssociationGame.js';
import audioService from '../../services/AudioService.js';

class GamePlay {
  constructor(app) {
    this.app = app;
    this.element = null;
    this.gameInstance = null;
    this.currentGameId = null;
    this.isMounted = false;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'screen screen-game-play';
    this.element.innerHTML = `
      <div class="screen__content">
        <div class="game-play-container">
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
        </div>
      </div>
    `;
    return this.element;
  }

  mount(container) {
    this.isMounted = true;
    const pauseBtn = this.element.querySelector('#pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.handleBack());
    }
  }

  unmount() {
    if (this.gameInstance) {
      this.gameInstance.destroy();
      this.gameInstance = null;
    }
    audioService.stopAll();
    this.isMounted = false;
  }

  initLearn(category) {
    this.learnWords = this.app.getWordsForCategory(category);
    this.learnIndex = 0;
    this.learnCategory = category;
    
    if (this.learnWords.length === 0) {
      this.app.showToast('No hay palabras disponibles', 'error');
      return;
    }

    this.renderLearn();
  }

  renderLearn() {
    const gameArea = this.element.querySelector('#game-area');
    const gameInstruction = this.element.querySelector('#game-instruction');
    const progressFill = this.element.querySelector('#progress-fill');
    const progressText = this.element.querySelector('#progress-text');
    const scoreText = this.element.querySelector('#score-text');
    const controls = this.element.querySelector('#game-controls');

    if (!gameArea) return;

    const word = this.learnWords[this.learnIndex];
    const total = this.learnWords.length;
    const syllablesArray = word.syllables.split('-');

    if (progressFill) progressFill.style.width = `${((this.learnIndex + 1) / total) * 100}%`;
    if (progressText) progressText.textContent = `${this.learnIndex + 1}/${total}`;
    if (scoreText) scoreText.textContent = this.learnIndex + 1;

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
          <img src="${word.img}" alt="${word.word}" class="learn-image" onerror="this.style.display='none'">
        </div>
        <div class="learn-word">${word.word}</div>
        <div class="learn-syllables">
          ${syllablesArray.map((s, i) => `
            <button class="learn-syllable-btn" data-index="${i}">${s}</button>
          `).join('')}
        </div>
      </div>
    `;

    if (controls) {
      controls.innerHTML = `
        <div class="learn-controls">
          <button class="btn btn-secondary learn-nav-btn" id="learn-prev" ${this.learnIndex === 0 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="btn btn-primary learn-audio-btn" id="learn-play">
            <i class="fas fa-volume-high"></i> Escuchar
          </button>
          <button class="btn btn-secondary learn-nav-btn" id="learn-next" ${this.learnIndex === total - 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      `;
    }

    // Event listeners
    this.element.querySelector('#learn-play')?.addEventListener('click', () => {
      audioService.playWordSequence(word);
    });

    this.element.querySelector('#learn-prev')?.addEventListener('click', () => {
      if (this.learnIndex > 0) {
        this.learnIndex--;
        this.renderLearn();
      }
    });

    this.element.querySelector('#learn-next')?.addEventListener('click', () => {
      if (this.learnIndex < total - 1) {
        this.learnIndex++;
        this.renderLearn();
      }
    });

    gameArea.querySelectorAll('.learn-syllable-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        audioService.playSyllables(word);
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 500);
      });
    });

    // Auto-play on first load
    setTimeout(() => audioService.playWordSequence(word), 300);
  }

  init(gameId, category) {
    this.currentGameId = gameId;
    
    if (gameId === 'learn') {
      this.initLearn(category);
      return;
    }
    
    const words = this.app.getWordsForCategory(category);
    
    if (words.length === 0) {
      this.app.showToast('No hay palabras disponibles', 'error');
      return;
    }

    this.gameInstance = this.createGameInstance(gameId, words, category);
    
    if (!this.gameInstance) {
      this.app.showToast('Juego no encontrado', 'error');
      return;
    }

    this.gameInstance.config.onStateChange = (state) => this.updateUI(state);
    this.gameInstance.config.onGameComplete = (result) => this.handleGameComplete(result);
    this.gameInstance.config.onCorrectAnswer = (data) => this.handleCorrectAnswer(data);
    this.gameInstance.config.onWrongAnswer = (data) => this.handleWrongAnswer(data);

    this.gameInstance.init();
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
    const gameArea = this.element.querySelector('#game-area');
    const gameInstruction = this.element.querySelector('#game-instruction');

    if (!gameArea || !this.gameInstance) return;

    gameInstruction.innerHTML = `
      <div class="instruction-text">
        <i class="fas fa-lightbulb"></i>
        <span>Selecciona la opcion correcta</span>
      </div>
    `;

    switch (this.currentGameId) {
      case 'complete-word':
        this.renderCompleteWord(gameArea);
        break;
      case 'memory':
        this.renderMemory(gameArea);
        break;
      case 'syllables':
        this.renderSyllables(gameArea);
        break;
      case 'word-search':
        this.renderWordSearch(gameArea);
        break;
      case 'sort-letters':
        this.renderSortLetters(gameArea);
        break;
      case 'association':
        this.renderAssociation(gameArea);
        break;
    }
  }

  renderCompleteWord(gameArea) {
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

    gameArea.querySelectorAll('.complete-word-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const letter = e.target.dataset.letter;
        const targetWord = this.gameInstance.state.currentWord.word;
        const isCorrect = this.gameInstance.checkAnswer(targetWord);
        
        if (isCorrect) {
          this.showFeedback(true);
          setTimeout(() => this.nextRound(), 1500);
        } else {
          this.showFeedback(false);
        }
      });
    });
  }

  renderMemory(gameArea) {
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
                ? `<span class="memory-card-emoji">${card.content}</span>`
                : `<span>${card.content}</span>`
              }
            </div>
          </div>
        `).join('')}
      </div>
    `;

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
    if (!this.gameInstance || !this.element) return;
    const cards = this.gameInstance.getCards();
    const gameArea = this.element.querySelector('#game-area');
    
    if (!gameArea) return;

    cards.forEach(card => {
      const cardElement = gameArea.querySelector(`[data-id="${card.id}"]`);
      if (cardElement) {
        cardElement.classList.toggle('flipped', card.isFlipped);
        cardElement.classList.toggle('matched', card.isMatched);
      }
    });
  }

  renderSyllables(gameArea) {
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

    gameArea.querySelectorAll('.syllable-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const syllable = e.target.dataset.syllable;
        this.gameInstance.selectSyllable(syllable, index);
        e.target.classList.add('selected');
        this.updateSyllablesDisplay();
      });
    });

    this.element.querySelector('#clear-syllables')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateSyllablesDisplay();
      gameArea.querySelectorAll('.syllable-btn').forEach(btn => btn.classList.remove('selected'));
    });

    this.element.querySelector('#check-syllables')?.addEventListener('click', () => {
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
    if (!this.gameInstance || !this.element) return;
    const selected = this.gameInstance.getSelectedSyllables();
    const display = this.element.querySelector('.syllables-word');
    
    if (display) {
      display.innerHTML = selected.map(s => 
        `<span class="syllable-selected">${s.syllable}</span>`
      ).join('');
    }
  }

  renderWordSearch(gameArea) {
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

    gameArea.querySelectorAll('.word-search-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        this.gameInstance.selectLetter(row, col);
        this.updateWordSearchDisplay();
      });
    });

    this.element.querySelector('#clear-word-search')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateWordSearchDisplay();
    });

    this.element.querySelector('#check-word-search')?.addEventListener('click', () => {
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
    if (!this.gameInstance || !this.element) return;
    const selected = this.gameInstance.getSelectedLetters();
    const grid = this.gameInstance.getGrid();
    const selectedWordEl = this.element.querySelector('#selected-word');
    const gameArea = this.element.querySelector('#game-area');

    if (selectedWordEl) {
      selectedWordEl.textContent = selected.map(l => l.letter).join('');
    }

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

  renderSortLetters(gameArea) {
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

    gameArea.querySelectorAll('.letter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.gameInstance.selectLetter(index);
        this.updateSortLettersDisplay();
      });
    });

    this.element.querySelector('#clear-sort')?.addEventListener('click', () => {
      this.gameInstance.clearSelection();
      this.updateSortLettersDisplay();
    });

    this.element.querySelector('#check-sort')?.addEventListener('click', () => {
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
    if (!this.gameInstance || !this.element) return;
    const selected = this.gameInstance.getSelectedLetters();
    const shuffled = this.gameInstance.getShuffledLetters();
    const display = this.element.querySelector('.sort-letters-word');
    const gameArea = this.element.querySelector('#game-area');

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

  renderAssociation(gameArea) {
    const options = this.gameInstance.getOptions();

    gameArea.innerHTML = `
      <div class="association-word">
        <h3>${this.gameInstance.state.currentWord.word}</h3>
      </div>

      <div class="association-options">
        ${options.map((option, index) => `
          <button class="association-option" data-index="${index}">
            <span class="association-option-emoji">${option.image}</span>
            <span>${option.word}</span>
          </button>
        `).join('')}
      </div>
    `;

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
    if (!this.element) return;
    const gameArea = this.element.querySelector('#game-area');
    if (!gameArea) return;

    gameArea.querySelectorAll('.association-option').forEach(btn => {
      btn.classList.remove('selected', 'correct', 'wrong');
    });
  }

  updateUI(state) {
    if (!this.element) return;
    const progressFill = this.element.querySelector('#progress-fill');
    const progressText = this.element.querySelector('#progress-text');
    const scoreText = this.element.querySelector('#score-text');

    if (progressFill && state.currentRound) {
      const progress = (state.currentRound / this.gameInstance.config.totalRounds) * 100;
      progressFill.style.width = `${progress}%`;
    }

    if (progressText && state.currentRound) {
      progressText.textContent = `${state.currentRound}/${this.gameInstance.config.totalRounds}`;
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

  handleWrongAnswer() {
    this.app.showToast('¡Intentalo de nuevo!', 'warning');
  }

  handleGameComplete(result) {
    this.app.saveGameResult(result);
    this.showResults(result);
  }

  showResults(result) {
    const gameArea = this.element.querySelector('#game-area');
    const gameControls = this.element.querySelector('#game-controls');

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
            <span class="stat-label">Precision</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${result.streak}</span>
            <span class="stat-label">Mejor racha</span>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn btn-secondary" id="play-again">Jugar de nuevo</button>
          <button class="btn btn-primary" id="back-to-menu">Volver al menu</button>
        </div>
      </div>
    `;

    if (gameControls) {
      gameControls.innerHTML = '';
    }

    this.element.querySelector('#play-again')?.addEventListener('click', () => {
      this.gameInstance.reset();
      this.renderGame();
    });

    this.element.querySelector('#back-to-menu')?.addEventListener('click', () => {
      this.app.goBack();
    });
  }

  destroy() {
    if (this.gameInstance) {
      this.gameInstance.destroy();
      this.gameInstance = null;
    }
    this.isMounted = false;
  }
}

export default GamePlay;
