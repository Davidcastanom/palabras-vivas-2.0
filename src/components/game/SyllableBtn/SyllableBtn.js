/**
 * SyllableBtn Component
 * Botón de sílaba para juegos de construcción de palabras
 */

import './SyllableBtn.css';

class SyllableBtn {
  /**
   * @param {Object} options
   * @param {string} options.text - Texto de la sílaba
   * @param {string} options.color - Color ('primary' | 'secondary' | 'accent')
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {boolean} options.selected - Estado seleccionado
   * @param {boolean} options.used - Estado usado
   * @param {boolean} options.disabled - Deshabilitado
   * @param {Function} options.onClick - Callback al hacer click
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      text: '',
      color: 'primary',
      size: 'md',
      selected: false,
      used: false,
      disabled: false,
      onClick: null,
      className: '',
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.element.className = this.buildClasses();
    this.element.textContent = this.options.text;
    
    if (this.options.disabled) {
      this.element.disabled = true;
    }

    this.setupEventListeners();
    return this.element;
  }

  buildClasses() {
    const classes = [
      'syllable-btn',
      `syllable-btn--${this.options.color}`,
      `syllable-btn--${this.options.size}`
    ];
    
    if (this.options.selected) classes.push('selected');
    if (this.options.used) classes.push('used');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  setupEventListeners() {
    this.element.addEventListener('click', () => {
      if (this.options.disabled || this.options.used) return;
      
      // Toggle selected
      this.options.selected = !this.options.selected;
      this.element.classList.toggle('selected', this.options.selected);
      
      // Add pulse animation
      this.element.classList.add('pulse');
      setTimeout(() => {
        this.element.classList.remove('pulse');
      }, 300);
      
      if (this.options.onClick) {
        this.options.onClick(this.options.text, this.options.selected);
      }
    });
  }

  // Public methods
  setSelected(selected) {
    this.options.selected = selected;
    this.element.classList.toggle('selected', selected);
  }

  setUsed(used) {
    this.options.used = used;
    this.element.classList.toggle('used', used);
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
  }

  setText(text) {
    this.options.text = text;
    this.element.textContent = text;
  }

  getText() {
    return this.options.text;
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

export default SyllableBtn;
