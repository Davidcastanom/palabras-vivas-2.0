/**
 * Icon Component
 * Wrapper para iconos Font Awesome con estilos predefinidos
 */

import './Icon.css';

class Icon {
  /**
   * @param {Object} options
   * @param {string} options.name - Nombre del icono Font Awesome (ej: 'star', 'play')
   * @param {string} options.prefix - Prefijo ('fas' | 'far' | 'fab')
   * @param {string} options.size - Tamaño ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
   * @param {string} options.color - Color predefinido ('primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning' | 'muted')
   * @param {string} options.customColor - Color CSS personalizado
   * @param {string} options.animation - Animación ('spin' | 'spin-slow' | 'pulse' | 'float' | 'glow')
   * @param {boolean} options.hasBackground - Fondo circular
   * @param {string} options.className - Clases adicionales
   * @param {string} options.ariaLabel - Label de accesibilidad
   */
  constructor(options = {}) {
    this.options = {
      name: 'star',
      prefix: 'fas',
      size: 'md',
      color: null,
      customColor: null,
      animation: null,
      hasBackground: false,
      bgSize: null,
      className: '',
      ariaLabel: null,
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    const icon = document.createElement('i');

    // Classes
    icon.className = this.buildClasses();

    // Style
    if (this.options.customColor) {
      icon.style.color = this.options.customColor;
    }

    // Aria Label
    if (this.options.ariaLabel) {
      icon.setAttribute('aria-hidden', 'false');
      icon.setAttribute('role', 'img');
      icon.setAttribute('aria-label', this.options.ariaLabel);
    } else {
      icon.setAttribute('aria-hidden', 'true');
    }

    this.element = icon;
    return icon;
  }

  buildClasses() {
    const classes = ['icon'];

    // Font Awesome classes
    classes.push(this.options.prefix);
    classes.push(`fa-${this.options.name}`);

    // Size
    classes.push(`icon--${this.options.size}`);

    // Color
    if (this.options.color) {
      classes.push(`icon--${this.options.color}`);
    }

    // Animation
    if (this.options.animation) {
      classes.push(`icon--${this.options.animation}`);
    }

    // Background
    if (this.options.hasBackground) {
      classes.push('icon--bg');
      if (this.options.bgSize) {
        classes.push(`icon--bg-${this.options.bgSize}`);
      }
    }

    // Custom class
    if (this.options.className) {
      classes.push(this.options.className);
    }

    return classes.join(' ');
  }

  // Public methods
  setName(name) {
    this.options.name = name;
    this.element.className = this.buildClasses();
  }

  setColor(color) {
    this.options.color = color;
    this.element.className = this.buildClasses();
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

/**
 * Helper: Crear icono rápido
 */
Icon.create = (name, options = {}) => {
  return new Icon({ name, ...options });
};

/**
 * Helper: Crear icono con fondo
 */
Icon.withBackground = (name, options = {}) => {
  return new Icon({ name, hasBackground: true, ...options });
};

export default Icon;
