/**
 * Container Component
 * Contenedor centrado con max-width responsive
 */

import './Container.css';

class Container {
  /**
   * @param {Object} options
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg' | 'xl' | 'full')
   * @param {boolean} options.fluid - Ancho completo con padding
   * @param {boolean} options.noPadding - Sin padding horizontal
   * @param {string|HTMLElement} options.children - Contenido del container
   * @param {string} options.className - Clases adicionales
   * @param {string} options.id - ID del elemento
   */
  constructor(options = {}) {
    this.options = {
      size: null,
      fluid: false,
      noPadding: false,
      children: null,
      className: '',
      id: null,
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();

    if (this.options.id) {
      this.element.id = this.options.id;
    }

    // Children
    if (this.options.children) {
      if (typeof this.options.children === 'string') {
        this.element.innerHTML = this.options.children;
      } else if (this.options.children instanceof HTMLElement) {
        this.element.appendChild(this.options.children);
      } else if (Array.isArray(this.options.children)) {
        this.options.children.forEach(child => {
          if (child instanceof HTMLElement) {
            this.element.appendChild(child);
          }
        });
      }
    }

    return this.element;
  }

  buildClasses() {
    const classes = ['container'];

    if (this.options.size) classes.push(`container--${this.options.size}`);
    if (this.options.fluid) classes.push('container--fluid');
    if (this.options.noPadding) classes.push('container--no-padding');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  // Public methods
  setContent(content) {
    this.element.innerHTML = '';
    if (typeof content === 'string') {
      this.element.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.element.appendChild(content);
    }
  }

  append(child) {
    if (child instanceof HTMLElement) {
      this.element.appendChild(child);
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

/**
 * Helper: Crear container rápido
 */
Container.create = (content, options = {}) => {
  return new Container({ children: content, ...options });
};

export default Container;
