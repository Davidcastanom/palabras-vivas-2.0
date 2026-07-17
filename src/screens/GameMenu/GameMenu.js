/**
 * Game Menu Screen
 * Pantalla de selección de juegos para una categoría
 */

import Screen from '../../components/layout/Screen/Screen.js';
import { categoryMeta } from '../../data/words.js';
import gameIntroData from '../../data/games.js';
import './GameMenu.css';

class GameMenuScreen {
  /**
   * @param {Object} options
   * @param {string} options.category - ID de la categoría
   * @param {Function} options.onGameSelect - Callback al seleccionar juego
   * @param {Function} options.onBack - Callback para volver
   */
  constructor(options = {}) {
    this.options = {
      category: null,
      onGameSelect: null,
      onBack: null,
      ...options
    };

    this.screen = null;

    this.games = [
      { id: 'learn', name: 'Aprender', icon: 'fa-book-open', description: 'Escucha y repite las palabras', difficulty: 0, isLearn: true },
      { id: 'complete-word', name: 'Encuentra la Palabra', icon: 'fa-images', description: 'Toca la imagen correcta', difficulty: 1 },
      { id: 'association', name: 'Escucha y Elige', icon: 'fa-ear-listen', description: 'Escucha y toca la imagen', difficulty: 1 },
      { id: 'memory', name: 'Memoria', icon: 'fa-brain', description: 'Encuentra los pares', difficulty: 2 },
      { id: 'sort-letters', name: 'Ordena las Sílabas', icon: 'fa-sort-amount-down', description: 'Ordena las sílabas', difficulty: 2 },
      { id: 'syllables', name: 'Letras y Sílabas', icon: 'fa-font', description: 'Aprende a separar palabras', difficulty: 1 },
      { id: 'word-search', name: 'Sopa de Letras', icon: 'fa-search', description: 'Encuentra palabras ocultas', difficulty: 3 }
    ];
  }

  render() {
    this.screen = new Screen({
      id: 'game-menu-screen',
      className: 'game-menu',
      content: this.buildContent()
    });

    return this.screen.render();
  }

  buildContent() {
    const meta = categoryMeta[this.options.category];
    const categoryName = meta?.name || this.options.category;
    const categoryIcon = meta?.icon || 'fa-folder';
    const categoryColor = meta?.cssColor || 'var(--color-primary)';

    return `
      <div class="game-menu__header">
        <div class="game-menu__category-title">
          <i class="game-menu__category-icon fa-solid ${categoryIcon}" style="color: ${categoryColor}"></i>
          <h1 class="game-menu__category-name">${categoryName}</h1>
        </div>
        <p class="game-menu__subtitle">Elige un juego</p>
      </div>

      <div class="game-menu__games">
        <div class="game-menu__grid">
          ${this.renderGames()}
        </div>
      </div>
    `;
  }

  renderGames() {
    return this.games.map(game => `
      <button 
        class="game-card"
        data-game="${game.id}"
      >
        <div class="game-card__icon">
          <i class="fa-solid ${game.icon}"></i>
        </div>
        <h3 class="game-card__name">${game.name}</h3>
        <p class="game-card__description">${game.description}</p>
        <div class="game-card__difficulty">
          ${this.renderStars(game.difficulty)}
        </div>
      </button>
    `).join('');
  }

  renderStars(difficulty) {
    const stars = [];
    for (let i = 1; i <= 3; i++) {
      stars.push(`
        <i class="game-card__star fa-solid fa-star ${i > difficulty ? 'game-card__star--empty' : ''}"></i>
      `);
    }
    return stars.join('');
  }

  mount(container) {
    this.screen.mount(container);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const cards = this.screen.getElement().querySelectorAll('.game-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.game;
        if (this.options.onGameSelect) {
          this.options.onGameSelect(gameId);
        }
      });
    });
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

export default GameMenuScreen;
