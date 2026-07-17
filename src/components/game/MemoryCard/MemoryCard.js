/**
 * MemoryCard Component
 * Tarjeta de memoria con efecto flip 3D
 */

import './MemoryCard.css';

class MemoryCard {
  /**
   * @param {Object} options
   * @param {string} options.id - ID único de la carta
   * @param {string} options.pairId - ID del par
   * @param {string} options.image - URL de imagen
   * @param {string} options.text - Texto de la carta
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {Function} options.onFlip - Callback al voltear
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      id: null,
      pairId: null,
      image: null,
      text: '',
      size: 'md',
      onFlip: null,
      className: '',
      ...options
    };

    this.element = null;
    this.isFlipped = false;
    this.isMatched = false;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    
    if (this.options.id) {
      this.element.dataset.cardId = this.options.id;
      this.element.dataset.pairId = this.options.pairId;
    }

    this.element.innerHTML = this.buildContent();
    this.setupEventListeners();

    return this.element;
  }

  buildClasses() {
    const classes = ['memory-card', `memory-card--${this.options.size}`];
    
    if (this.isFlipped) classes.push('flipped');
    if (this.isMatched) classes.push('matched');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    return `
      <div class="memory-card__inner">
        <div class="memory-card__face memory-card__front">
          <i class="memory-card__front-icon fa-solid fa-question"></i>
        </div>
        <div class="memory-card__face memory-card__back">
          <div class="memory-card__back-content">
            ${this.options.image 
              ? `<img src="${this.options.image}" alt="${this.options.text}" class="memory-card__image">`
              : ''
            }
            ${this.options.text 
              ? `<span class="memory-card__text">${this.options.text}</span>`
              : ''
            }
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.element.addEventListener('click', () => {
      if (this.isFlipped || this.isMatched) return;
      
      this.flip();
      
      if (this.options.onFlip) {
        this.options.onFlip(this);
      }
    });
  }

  flip() {
    this.isFlipped = true;
    this.element.classList.add('flipped');
  }

  unflip() {
    this.isFlipped = false;
    this.element.classList.remove('flipped');
    this.element.classList.remove('wrong');
  }

  setMatched() {
    this.isMatched = true;
    this.element.classList.add('matched');
  }

  setWrong() {
    this.element.classList.add('wrong');
    setTimeout(() => {
      this.unflip();
    }, 1000);
  }

  reset() {
    this.isFlipped = false;
    this.isMatched = false;
    this.element.classList.remove('flipped', 'matched', 'wrong');
  }

  getPairId() {
    return this.options.pairId;
  }

  getElement() {
    return this.element;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default MemoryCard;
