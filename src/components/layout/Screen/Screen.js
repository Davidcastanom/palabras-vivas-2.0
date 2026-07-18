/**
 * Screen Component
 * Layout base para todas las pantallas
 */

import './Screen.css';

class Screen {
  /**
   * @param {Object} options
   * @param {string} options.id - ID de la pantalla
   * @param {string} options.className - Clases adicionales
   * @param {boolean} options.centered - Centrar contenido
   * @param {boolean} options.animated - Animación de entrada
   * @param {Function} options.onMount - Callback al montar
   * @param {Function} options.onUnmount - Callback al desmontar
   */
  constructor(options = {}) {
    this.options = {
      id: null,
      className: '',
      centered: false,
      animated: true,
      onMount: null,
      onUnmount: null,
      ...options
    };

    this.element = null;
    this.isMounted = false;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    
    if (this.options.id) {
      this.element.id = this.options.id;
    }

    this.element.innerHTML = this.buildContent();

    return this.element;
  }

  buildClasses() {
    const classes = ['screen'];

    if (this.options.centered) classes.push('screen--centered');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    return `
      <div class="screen__content">
        ${this.options.content || ''}
      </div>
    `;
  }

  mount(container) {
    if (this.isMounted) return;

    container.appendChild(this.element);
    this.isMounted = true;

    if (this.options.animated) {
      this.element.classList.add('screen--entering');
    }

    if (this.options.onMount) {
      this.options.onMount();
    }
  }

  unmount() {
    if (!this.isMounted || !this.element) return;

    if (this.options.animated) {
      this.element.classList.add('screen--exiting');
      
      setTimeout(() => {
        this.element.remove();
        this.isMounted = false;

        if (this.options.onUnmount) {
          this.options.onUnmount();
        }
      }, 200);
    } else {
      this.element.remove();
      this.isMounted = false;

      if (this.options.onUnmount) {
        this.options.onUnmount();
      }
    }
  }

  setContent(content) {
    const contentEl = this.element.querySelector('.screen__content');
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }

  getElement() {
    return this.element;
  }

  destroy() {
    this.unmount();
    this.element = null;
  }
}

export default Screen;
