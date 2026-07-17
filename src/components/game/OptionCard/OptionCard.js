/**
 * OptionCard Component
 * Tarjeta de opción para juegos de selección
 */

import './OptionCard.css';

class OptionCard {
  /**
   * @param {Object} options
   * @param {string} options.id - ID de la opción
   * @param {string} options.text - Texto de la opción
   * @param {string} options.image - URL de imagen
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {boolean} options.disabled - Deshabilitado
   * @param {Function} options.onClick - Callback al hacer click
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      id: null,
      text: '',
      image: null,
      size: 'md',
      disabled: false,
      onClick: null,
      className: '',
      ...options
    };

    this.element = null;
    this.state = 'default'; // default, selected, correct, wrong
    this.render();
  }

  render() {
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.element.className = this.buildClasses();
    
    if (this.options.id) {
      this.element.dataset.optionId = this.options.id;
    }

    this.element.innerHTML = this.buildContent();

    if (this.options.disabled) {
      this.element.disabled = true;
    }

    this.setupEventListeners();
    return this.element;
  }

  buildClasses() {
    const classes = ['option-card', `option-card--${this.options.size}`];
    
    if (this.state !== 'default') {
      classes.push(this.state);
    }
    
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  buildContent() {
    const parts = [];

    if (this.options.image) {
      parts.push(`<img src="${this.options.image}" alt="${this.options.text}" class="option-card__image">`);
    }

    if (this.options.text) {
      parts.push(`<span class="option-card__text">${this.options.text}</span>`);
    }

    return parts.join('');
  }

  setupEventListeners() {
    this.element.addEventListener('click', () => {
      if (this.options.disabled) return;
      
      if (this.options.onClick) {
        this.options.onClick(this.options.id, this.options.text);
      }
    });
  }

  // Public methods
  setState(state) {
    this.state = state;
    this.element.className = this.buildClasses();
  }

  setSelected() {
    this.setState('selected');
  }

  setCorrect() {
    this.setState('correct');
  }

  setWrong() {
    this.setState('wrong');
  }

  reset() {
    this.setState('default');
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
  }

  setText(text) {
    this.options.text = text;
    const textEl = this.element.querySelector('.option-card__text');
    if (textEl) textEl.textContent = text;
  }

  setImage(imageUrl) {
    this.options.image = imageUrl;
    const imgEl = this.element.querySelector('.option-card__image');
    if (imgEl) {
      imgEl.src = imageUrl;
    }
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

export default OptionCard;
