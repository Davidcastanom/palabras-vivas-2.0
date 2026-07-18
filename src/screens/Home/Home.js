/**
 * Home Screen
 * Pantalla principal con selección de categorías
 */

import Screen from '../../components/layout/Screen/Screen.js';
import { categoryMeta, categories } from '../../data/words.js';
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
    this.categories = Object.entries(categoryMeta).map(([id, meta]) => ({
      id,
      name: meta.name,
      icon: meta.icon,
      color: meta.cssColor,
      count: categories[id]?.words?.length ?? 0
    }));
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
        <span class="home-hero__badge animate-fadeInUp">
          <i class="fa-solid fa-child-reaching"></i>
          Para niños de 4 a 6 años
        </span>
        <h1 class="home-hero__title animate-fadeInUp animation-delay-50">
          Aprende palabras y sílabas jugando
        </h1>
        <p class="home-hero__subtitle animate-fadeInUp animation-delay-100">
          Herramienta interactiva para que los más pequeños aprendan vocabulario, sílabas y sonidos a través de imágenes, audio y juegos.
        </p>
        <div class="home-hero__stats animate-fadeInUp animation-delay-100">
          <span class="home-hero__stat"><i class="fa-solid fa-spell-check"></i> 62 palabras</span>
          <span class="home-hero__stat"><i class="fa-solid fa-globe"></i> 5 mundos</span>
          <span class="home-hero__stat"><i class="fa-solid fa-gamepad"></i> 7 juegos</span>
        </div>
        <h2 class="home-hero__section-title animate-fadeInUp animation-delay-100">¡Elige un mundo!</h2>
      </div>

      <div class="home-illustration animate-fadeInUp animation-delay-100">
        <img 
          src="https://res.cloudinary.com/dwhe4jadc/image/upload/v1784331231/ChatGPT_Image_17_jul_2026_18_31_28_agt7kt.png" 
          alt="Ilustración de Palabras Vivas" 
          class="home-illustration__img"
          loading="eager"
        >
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
      <div class="category-card-wrapper" data-category="${cat.id}">
        <button 
          class="category-card"
          data-action="games"
          style="--category-color: ${cat.color}"
        >
          <i class="category-card__icon fa-solid ${cat.icon}" style="color: ${cat.color}"></i>
          <h3 class="category-card__name">${cat.name}</h3>
          <span class="category-card__count">${cat.count} palabras</span>
        </button>
        <button 
          class="category-card__write-btn"
          data-action="write"
          data-category-id="${cat.id}"
          title="Aprender a escribir"
        >
          <i class="fa-solid fa-pen-fancy"></i>
          Escribir
        </button>
      </div>
    `).join('');
  }

  mount(container) {
    this.screen.mount(container);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const el = this.screen.getElement();

    el.querySelectorAll('[data-action="games"]').forEach(card => {
      card.addEventListener('click', () => {
        const wrapper = card.closest('.category-card-wrapper');
        const categoryId = wrapper.dataset.category;
        if (this.options.onCategorySelect) {
          this.options.onCategorySelect(categoryId);
        }
      });
    });

    el.querySelectorAll('[data-action="write"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryId = btn.dataset.categoryId;
        if (this.options.onWriteSelect) {
          this.options.onWriteSelect(categoryId);
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
