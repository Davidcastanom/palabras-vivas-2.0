/**
 * Button Component
 * Componente de botón reutilizable con múltiples variantes
 */

import './Button.css';

class Button {
  /**
   * @param {Object} options
   * @param {string} options.text - Texto del botón
   * @param {string} options.icon - Clase de icono Font Awesome (ej: 'fa-star')
   * @param {string} options.iconPosition - Posición del icono ('left' | 'right')
   * @param {string} options.variant - Variante ('primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger')
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg' | 'xl')
   * @param {boolean} options.fullWidth - Ancho completo
   * @param {boolean} options.rounded - Borde completamente redondeado
   * @param {boolean} options.glow - Efecto de brillo
   * @param {boolean} options.loading - Estado de carga
   * @param {boolean} options.disabled - Deshabilitado
   * @param {Function} options.onClick - Callback de click
   * @param {string} options.className - Clases adicionales
   * @param {string} options.id - ID del elemento
   * @param {string} options.ariaLabel - Label de accesibilidad
   */
  constructor(options = {}) {
    this.options = {
      text: '',
      icon: null,
      iconPosition: 'left',
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      rounded: false,
      glow: false,
      loading: false,
      disabled: false,
      onClick: null,
      className: '',
      id: null,
      ariaLabel: null,
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    const button = document.createElement('button');
    button.type = 'button';

    // ID
    if (this.options.id) {
      button.id = this.options.id;
    }

    // Classes
    const classes = this.buildClasses();
    button.className = classes;

    // Disabled
    if (this.options.disabled) {
      button.disabled = true;
    }

    // Aria Label
    if (this.options.ariaLabel) {
      button.setAttribute('aria-label', this.options.ariaLabel);
    }

    // Content
    button.innerHTML = this.buildContent();

    // Event Listener
    if (this.options.onClick) {
      button.addEventListener('click', this.options.onClick);
    }

    this.element = button;
    return button;
  }

  buildClasses() {
    const classes = ['button', `button--${this.options.variant}`, `button--${this.options.size}`];

    if (this.options.fullWidth) classes.push('button--full');
    if (this.options.rounded) classes.push('button--rounded');
    if (this.options.glow) classes.push('button--glow');
    if (this.options.loading) classes.push('button--loading');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    const parts = [];

    // Icon Left
    if (this.options.icon && this.options.iconPosition === 'left') {
      parts.push(`<i class="fa-solid ${this.options.icon}"></i>`);
    }

    // Text
    if (this.options.text) {
      parts.push(`<span>${this.options.text}</span>`);
    }

    // Icon Right
    if (this.options.icon && this.options.iconPosition === 'right') {
      parts.push(`<i class="fa-solid ${this.options.icon}"></i>`);
    }

    return parts.join('');
  }

  // Public methods
  setLoading(loading) {
    this.options.loading = loading;
    if (loading) {
      this.element.classList.add('button--loading');
      this.element.disabled = true;
    } else {
      this.element.classList.remove('button--loading');
      this.element.disabled = this.options.disabled;
    }
  }

  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
  }

  setText(text) {
    this.options.text = text;
    const span = this.element.querySelector('span');
    if (span) span.textContent = text;
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

export default Button;
