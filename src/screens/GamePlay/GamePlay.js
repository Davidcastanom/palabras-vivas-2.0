/**
 * GamePlay Screen
 * Pantalla principal de juego - Orquestador delgado
 */

import './GamePlay.css';
import CompleteWordGame from '../../games/complete-word/CompleteWordGame.js';
import MemoryGame from '../../games/memory/MemoryGame.js';
import SyllablesGame from '../../games/syllables/SyllablesGame.js';
import WordSearchGame from '../../games/word-search/WordSearchGame.js';
import SortLettersGame from '../../games/sort-letters/SortLettersGame.js';
import audioService from '../../services/AudioService.js';
import Modal from '../../components/core/Modal/Modal.js';

import { renderLearn } from './renderers/learn.js';
import { renderCompleteWord } from './renderers/completeWord.js';
import { renderMemory, updateMemoryCards as updateMemoryCardsImpl } from './renderers/memory.js';
import { renderSyllables, updateSyllablesDisplay as updateSyllablesDisplayImpl } from './renderers/syllables.js';
import { renderWordSearch, updateWordSearchDisplay as updateWordSearchDisplayImpl } from './renderers/wordSearch.js';
import { renderSortLetters, updateSortLettersDisplay as updateSortLettersDisplayImpl } from './renderers/sortLetters.js';
import { renderAssociation } from './renderers/association.js';

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
              <button class="game-play-pause-btn" id="pause-btn" aria-label="Pausar juego">
                <i class="fas fa-pause"></i>
              </button>
              <button class="game-play-reset-btn" id="reset-btn" title="Reiniciar juego" aria-label="Reiniciar juego">
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

    renderLearn(this);
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

    if (!gameArea || !this.gameInstance) return;

    switch (this.currentGameId) {
      case 'complete-word':
        renderCompleteWord(gameArea, this.gameInstance, this);
        break;
      case 'memory':
        renderMemory(gameArea, this.gameInstance);
        break;
      case 'syllables':
        renderSyllables(gameArea, this.gameInstance, this);
        break;
      case 'word-search':
        renderWordSearch(gameArea, this.gameInstance, this);
        break;
      case 'sort-letters':
        renderSortLetters(gameArea, this.gameInstance, this);
        break;
      case 'association':
        renderAssociation(gameArea, this.gameInstance, this);
        break;
    }

    this.updateUI(this.gameInstance.state || this.gameInstance.getState());
  }

  updateMemoryCards() {
    updateMemoryCardsImpl(this.element.querySelector('#game-area'), this.gameInstance);
  }

  updateSyllablesDisplay() {
    updateSyllablesDisplayImpl(this.element.querySelector('#game-area'), this.gameInstance);
  }

  updateWordSearchDisplay() {
    updateWordSearchDisplayImpl(this.element.querySelector('#game-area'), this.gameInstance);
  }

  updateSortLettersDisplay() {
    updateSortLettersDisplayImpl(this.element.querySelector('#game-area'), this.gameInstance);
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
      if (!this.gameInstance.state.isComplete) {
        this.renderGame();
      }
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

        <p class="results-hint">Cada vez que juegues, el orden de las palabras sera diferente</p>

        <div class="results-actions">
          <button class="button button--primary button--md results-actions__play" id="play-again">
            <i class="fa-solid fa-rotate-right"></i>
            Jugar de nuevo
          </button>
          <button class="button button--secondary button--md" id="back-to-menu">
            <i class="fa-solid fa-arrow-left"></i>
            Volver al menú
          </button>
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
