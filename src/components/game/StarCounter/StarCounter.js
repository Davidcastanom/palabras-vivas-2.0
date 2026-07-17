/**
 * StarCounter Component
 * Contador de estrellas con animaciones
 */

import './StarCounter.css';

class StarCounter {
  /**
   * @param {Object} options
   * @param {number} options.value - Valor inicial
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {boolean} options.animated - Animar al cambiar
   * @param {boolean} options.showLabel - Mostrar label
   * @param {string} options.label - Texto del label
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      value: 0,
      size: 'md',
      animated: true,
      showLabel: false,
      label: 'Estrellas',
      className: '',
      ...options
    };

    this.element = null;
    this.currentValue = this.options.value;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    this.element.innerHTML = this.buildContent();

    return this.element;
  }

  buildClasses() {
    const classes = ['star-counter', `star-counter--${this.options.size}`];
    
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    return `
      <i class="star-counter__icon fa-solid fa-star"></i>
      <span class="star-counter__value">${this.currentValue}</span>
      ${this.options.showLabel ? `<span class="star-counter__label">${this.options.label}</span>` : ''}
    `;
  }

  // Public methods
  setValue(value, animate = true) {
    const oldValue = this.currentValue;
    this.currentValue = value;
    
    const valueEl = this.element.querySelector('.star-counter__value');
    if (valueEl) {
      valueEl.textContent = value;
    }

    // Animate if value changed
    if (animate && value !== oldValue) {
      this.element.classList.add('star-counter--animated');
      this.element.classList.add('star-counter--bump');
      
      setTimeout(() => {
        this.element.classList.remove('star-counter--animated');
        this.element.classList.remove('star-counter--bump');
      }, 300);
    }
  }

  increment(amount = 1, animate = true) {
    this.setValue(this.currentValue + amount, animate);
  }

  decrement(amount = 1, animate = true) {
    this.setValue(Math.max(0, this.currentValue - amount), animate);
  }

  reset(animate = true) {
    this.setValue(0, animate);
  }

  getValue() {
    return this.currentValue;
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

export default StarCounter;
