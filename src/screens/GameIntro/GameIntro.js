/**
 * GameIntro Screen
 * Pantalla de introducción antes de iniciar un juego
 */

import Screen from '../../components/layout/Screen/Screen.js';
import gameIntroData from '../../data/games.js';
import './GameIntro.css';

class GameIntroScreen {
  /**
   * @param {Object} options
   * @param {string} options.gameId - ID del juego
   * @param {string} options.category - ID de la categoría
   * @param {Function} options.onStart - Callback al iniciar juego
   * @param {Function} options.onBack - Callback para volver
   */
  constructor(options = {}) {
    this.options = {
      gameId: null,
      category: null,
      onStart: null,
      onBack: null,
      app: null,
      ...options
    };

    this.screen = null;
    this.gameData = gameIntroData[this.options.gameId];
    this.bestScore = this.options.app?.getBestScore(this.options.gameId, this.options.category) || null;
  }

  render() {
    if (!this.gameData) {
      console.error('Game data not found:', this.options.gameId);
      return null;
    }

    this.screen = new Screen({
      id: 'game-intro-screen',
      className: 'game-intro',
      content: this.buildContent()
    });

    return this.screen.render();
  }

  buildContent() {
    const game = this.gameData;

    return `
      <div class="game-intro__header">
        <div class="game-intro__icon" style="--icon-color: ${game.iconColor}">
          <i class="fa-solid ${game.icon}"></i>
        </div>
        <h1 class="game-intro__title">${game.title}</h1>
        <p class="game-intro__description">${game.description}</p>
      </div>

      <div class="game-intro__content">
        <!-- How to Play -->
        <div class="game-intro__card">
          <div class="game-intro__card-header">
            <div class="game-intro__card-icon">
              <i class="fa-solid fa-gamepad"></i>
            </div>
            <h2 class="game-intro__card-title">Cómo se Juega</h2>
          </div>
          <ol class="game-intro__steps">
            ${this.renderSteps()}
          </ol>
        </div>

        <!-- Tip -->
        <div class="game-intro__tip">
          <div class="game-intro__tip-header">
            <i class="game-intro__tip-icon fa-solid fa-lightbulb"></i>
            <h3 class="game-intro__tip-title">Consejo</h3>
          </div>
          <p class="game-intro__tip-text">${game.tip}</p>
        </div>

        <!-- Meta Info -->
        <div class="game-intro__card">
          <div class="game-intro__meta">
            <div class="game-intro__meta-item">
              <i class="game-intro__meta-icon--star fa-solid fa-star"></i>
              <span>Gana hasta ${game.reward} estrellas</span>
            </div>
            <div class="game-intro__meta-item">
              <i class="game-intro__meta-icon--clock fa-solid fa-clock"></i>
              <span>${game.estimatedTime}</span>
            </div>
            <div class="game-intro__meta-item">
              <i class="game-intro__meta-icon--difficulty fa-solid fa-signal"></i>
              <span>${this.renderDifficulty()}</span>
            </div>
          </div>
        </div>

        ${this.bestScore ? `
        <div class="game-intro__best-score">
          <div class="game-intro__best-score-header">
            <i class="fa-solid fa-trophy"></i>
            <span>Tu mejor puntuación</span>
          </div>
          <div class="game-intro__best-score-stars">
            ${[1, 2, 3].map(s => `<i class="fa-solid fa-star ${s <= this.bestScore.stars ? 'earned' : ''}"></i>`).join('')}
          </div>
          <div class="game-intro__best-score-details">
            <span>${this.bestScore.score} puntos</span>
            <span>·</span>
            <span>${this.bestScore.accuracy}% precisión</span>
          </div>
        </div>
        ` : `
        <div class="game-intro__best-score game-intro__best-score--empty">
          <div class="game-intro__best-score-header">
            <i class="fa-solid fa-trophy"></i>
            <span>¡Intenta ganar las ${game.reward} estrellas!</span>
          </div>
        </div>
        `}
      </div>

      <div class="game-intro__action">
        <button class="button button--primary button--xl button--full button--glow" id="start-game-btn">
          <i class="fa-solid fa-play"></i>
          <span>¡A Jugar!</span>
        </button>
      </div>
    `;
  }

  renderSteps() {
    return this.gameData.howToPlay.map((step, index) => `
      <li class="game-intro__step">
        <span class="game-intro__step-number">${index + 1}</span>
        <span class="game-intro__step-text">${step}</span>
      </li>
    `).join('');
  }

  renderDifficulty() {
    const stars = [];
    for (let i = 1; i <= 3; i++) {
      stars.push(`<i class="fa-solid fa-star ${i > this.gameData.difficulty ? 'text-muted' : 'text-accent'}"></i>`);
    }
    return stars.join(' ');
  }

  mount(container) {
    this.screen.mount(container);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const startBtn = this.screen.getElement().querySelector('#start-game-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.options.onStart) {
          this.options.onStart(this.options.gameId, this.options.category);
        }
      });
    }
  }

  unmount() {
    this.screen.unmount();
  }

  destroy() {
    if (this.screen) {
      this.screen.destroy();
    }
  }
}

export default GameIntroScreen;
