/**
 * InstructionBar Component
 * Barra de instrucciones contextual para juegos
 */

import './InstructionBar.css';

class InstructionBar {
  /**
   * @param {Object} options
   * @param {string} options.text - Texto de instrucción
   * @param {string} options.icon - Icono Font Awesome
   * @param {string} options.highlight - Palabra a resaltar
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      text: '',
      icon: 'fa-circle-info',
      highlight: null,
      size: 'md',
      className: '',
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    this.element.innerHTML = this.buildContent();

    return this.element;
  }

  buildClasses() {
    const classes = ['instruction-bar', `instruction-bar--${this.options.size}`];
    
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  buildContent() {
    let text = this.options.text;

    // Highlight specific word
    if (this.options.highlight) {
      const regex = new RegExp(`(${this.options.highlight})`, 'gi');
      text = text.replace(regex, '<span class="instruction-bar__highlight">$1</span>');
    }

    return `
      <div class="instruction-bar__icon">
        <i class="fa-solid ${this.options.icon}"></i>
      </div>
      <p class="instruction-bar__text">${text}</p>
    `;
  }

  // Public methods
  setText(text) {
    this.options.text = text;
    const textEl = this.element.querySelector('.instruction-bar__text');
    if (textEl) {
      let displayText = text;
      if (this.options.highlight) {
        const regex = new RegExp(`(${this.options.highlight})`, 'gi');
        displayText = text.replace(regex, '<span class="instruction-bar__highlight">$1</span>');
      }
      textEl.innerHTML = displayText;
    }
  }

  setIcon(icon) {
    this.options.icon = icon;
    const iconEl = this.element.querySelector('.instruction-bar__icon i');
    if (iconEl) {
      iconEl.className = `fa-solid ${icon}`;
    }
  }

  setHighlight(highlight) {
    this.options.highlight = highlight;
    // Re-render with new highlight
    this.element.innerHTML = this.buildContent();
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

export default InstructionBar;
