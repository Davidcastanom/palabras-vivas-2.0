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
import audioService from '../../services/AudioService.js';
import Modal from '../../components/core/Modal/Modal.js';

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
            <div class="game-play-header__left">
              <button class="game-play-pause-btn" id="pause-btn">
                <i class="fas fa-pause"></i>
              </button>
              <button class="game-play-reset-btn" id="reset-btn" title="Reiniciar juego">
                <i class="fas fa-rotate-right"></i>
              </button>
            </div>
            
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
    if (container && this.element) {
      container.appendChild(this.element);
    }
    const pauseBtn = this.element.querySelector('#pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.handlePause());
    }

    const resetBtn = this.element.querySelector('#reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.handleReset());
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
        return new CompleteWordGame({ ...config, id: 'association' });
      default:
        return null;
    }
  }

  renderGame() {
    const gameArea = this.element.querySelector('#game-area');
    const gameInstruction = this.element.querySelector('#game-instruction');

    if (!gameArea || !this.gameInstance) return;

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

    this.updateUI(this.gameInstance.state || this.gameInstance.getState());
  }

  renderCompleteWord(gameArea) {
    const target = this.gameInstance.getTarget();
    const options = this.gameInstance.getOptions();

    const instruction = this.element.querySelector('#game-instruction');
    if (instruction) {
      instruction.innerHTML = `
        <div class="instruction-text">
          <i class="fas fa-lightbulb"></i>
          <span>¿Dónde está <strong>${target.word}</strong>?</span>
        </div>
      `;
      audioService.speak('¿Dónde está ' + target.word + '?');
    }

    gameArea.innerHTML = `
      <div class="game-options-grid">
        ${options.map((opt, index) => `
          <button class="game-image-option" data-index="${index}" data-id="${opt.id}">
            <div class="game-image-option__img">
              <img src="${opt.img}" alt="${opt.word}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
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
        const isCorrect = this.gameInstance.checkAnswer(selected);

        if (isCorrect) {
          this.showFeedback(true);
          this.addStarToApp();
          audioService.speak('¡Muy bien!');
          setTimeout(() => this.renderGame(), 1500);
        } else {
          this.showFeedback(false);
          audioService.speak('Oh, no. Inténtalo de nuevo');
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
                ? `<img src="${card.content}" alt="${card.text}" class="memory-card-image" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'memory-card-emoji\\'>🔍</span>'">`
                : `<span class="memory-card-word">${card.content}</span>`
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

    const instruction = this.element.querySelector('#game-instruction');
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
             onerror="this.style.display='none'">
        <div class="word-search-hint__word">Busca: <strong>${currentWord.word.toUpperCase()}</strong></div>
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
    const currentWord = this.gameInstance.state.currentWord;

    const instruction = this.element.querySelector('#game-instruction');
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
             onerror="this.style.display='none'">
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
    const target = this.gameInstance.getTarget();
    const options = this.gameInstance.getOptions();

    const instruction = this.element.querySelector('#game-instruction');
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
          <button class="game-image-option" data-index="${index}" data-id="${opt.id}">
            <div class="game-image-option__img">
              <img src="${opt.img}" alt="${opt.word}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
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
        const isCorrect = this.gameInstance.checkAnswer(selected);

        if (isCorrect) {
          this.showFeedback(true);
          this.addStarToApp();
          audioService.speak('¡Muy bien!');
          setTimeout(() => this.renderGame(), 1500);
        } else {
          this.showFeedback(false);
          audioService.speak('Oh, no. Inténtalo de nuevo');
        }
      });
    });
  }

  updateUI(state) {
    if (!this.element) return;
    const progressFill = this.element.querySelector('#progress-fill');
    const progressText = this.element.querySelector('#progress-text');
    const scoreText = this.element.querySelector('#score-text');

    const totalRounds = this.gameInstance.config.totalRounds;
    const currentRound = state.currentRound || 0;

    if (progressFill && totalRounds) {
      const progress = (currentRound / totalRounds) * 100;
      progressFill.style.width = `${progress}%`;
    }

    if (progressText && totalRounds) {
      progressText.textContent = `${currentRound}/${totalRounds}`;
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
      if (typeof this.gameInstance.nextRound === 'function') {
        this.gameInstance.nextRound();
      }
      this.renderGame();
    }
  }

  handleCorrectAnswer(data) {
    this.app.showToast(`+${data.points} puntos`, 'success');
    this.updateUI(this.gameInstance.state || this.gameInstance.getState());
  }

  handleWrongAnswer() {
    this.app.showToast('¡Intentalo de nuevo!', 'warning');
  }

  addStarToApp() {
    if (this.app && typeof this.app.addStar === 'function') {
      this.app.addStar();
    } else if (this.app && this.app.state) {
      this.app.state.stars++;
      if (this.app.header) {
        this.app.header.setStars(this.app.state.stars);
      }
      localStorage.setItem('pv-stars', this.app.state.stars.toString());
    }
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

  async handlePause() {
    const confirmed = await Modal.confirm({
      title: '¿Salir del juego?',
      message: 'Perderás el progreso de esta partida.',
      confirmText: 'Salir',
      cancelText: 'Seguir jugando'
    });
    if (confirmed) {
      audioService.stopAll();
      this.app.goBack();
    }
  }

  async handleReset() {
    if (!this.gameInstance || this.currentGameId === 'learn') return;

    const confirmed = await Modal.confirm({
      title: '¿Reiniciar juego?',
      message: 'Se perderá el progreso actual.',
      confirmText: 'Reiniciar',
      cancelText: 'Cancelar'
    });
    if (confirmed) {
      audioService.stopAll();
      this.gameInstance.reset();
      this.renderGame();
    }
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
