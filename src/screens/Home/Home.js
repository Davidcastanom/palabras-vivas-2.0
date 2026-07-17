/**
 * Home Screen
 * Pantalla principal con selección de categorías
 */

import Screen from '../../components/layout/Screen/Screen.js';
import './Home.css';

class HomeScreen {
  /**
   * @param {Object} options
   * @param {Function} options.onCategorySelect - Callback al seleccionar categoría
   */
  constructor(options = {}) {
    this.options = {
      onCategorySelect: null,
      ...options
    };

    this.screen = null;
    this.categories = [
      { id: 'animales', name: 'Animales', icon: 'fa-paw', color: 'var(--color-category-animals)', count: 15 },
      { id: 'frutas', name: 'Frutas', icon: 'fa-apple-whole', color: 'var(--color-category-fruits)', count: 12 },
      { id: 'objetos', name: 'Objetos', icon: 'fa-cube', color: 'var(--color-category-objects)', count: 12 },
      { id: 'familia', name: 'Familia', icon: 'fa-people-roof', color: 'var(--color-category-family)', count: 11 },
      { id: 'cuerpo', name: 'Cuerpo', icon: 'fa-person', color: 'var(--color-category-body)', count: 12 }
    ];
  }

  render() {
    this.screen = new Screen({
      id: 'home-screen',
      className: 'home-screen',
      content: this.buildContent()
    });

    return this.screen.render();
  }

  buildContent() {
    return `
      <div class="home-hero">
        <h1 class="home-hero__title animate-fadeInUp">¡Elige un mundo!</h1>
        <p class="home-hero__subtitle animate-fadeInUp animation-delay-100">
          Aprende jugando con palabras increíbles
        </p>
      </div>

      <div class="home-categories">
        <div class="home-categories__grid">
          ${this.renderCategories()}
        </div>
      </div>
    `;
  }

  renderCategories() {
    return this.categories.map(cat => `
      <button 
        class="category-card"
        data-category="${cat.id}"
        style="--category-color: ${cat.color}"
      >
        <i class="category-card__icon fa-solid ${cat.icon}" style="color: ${cat.color}"></i>
        <h3 class="category-card__name">${cat.name}</h3>
        <span class="category-card__count">${cat.count} palabras</span>
      </button>
    `).join('');
  }

  mount(container) {
    this.screen.mount(container);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const cards = this.screen.getElement().querySelectorAll('.category-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const categoryId = card.dataset.category;
        if (this.options.onCategorySelect) {
          this.options.onCategorySelect(categoryId);
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

export default HomeScreen;
