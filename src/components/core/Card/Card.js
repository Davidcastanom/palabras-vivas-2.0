/**
 * Card Component
 * Componente de tarjeta reutilizable
 */

import './Card.css';

class Card {
  /**
   * @param {Object} options
   * @param {string} options.variant - Variante ('default' | 'elevated' | 'outlined' | 'flat')
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg' | 'xl')
   * @param {boolean} options.interactive - Clickable con hover effect
   * @param {boolean} options.glow - Efecto de brillo en hover
   * @param {string} options.borderPosition - Borde coloreado ('left' | 'top' | null)
   * @param {string} options.borderColor - Color del borde
   * @param {boolean} options.fullWidth - Ancho completo
   * @param {boolean} options.centered - Contenido centrado
   * @param {Function} options.onClick - Callback de click
   * @param {string} options.className - Clases adicionales
   * @param {string} options.id - ID del elemento
   * @param {string} options.title - Título de la card
   * @param {string} options.body - Contenido de la card
   * @param {string} options.footer - Footer de la card
   * @param {string} options.image - URL de imagen
   * @param {string} options.icon - Clase de icono Font Awesome
   * @param {string} options.iconColor - Color del icono
   */
  constructor(options = {}) {
    this.options = {
      variant: 'default',
      size: 'md',
      interactive: false,
      glow: false,
      borderPosition: null,
      borderColor: 'var(--color-primary)',
      fullWidth: false,
      centered: false,
      onClick: null,
      className: '',
      id: null,
      title: null,
      body: null,
      footer: null,
      image: null,
      icon: null,
      iconColor: null,
      ...options
    };

    this.element = null;
    this.render();
  }

  render() {
    const card = document.createElement('div');

    // ID
    if (this.options.id) {
      card.id = this.options.id;
    }

    // Classes
    card.className = this.buildClasses();

    // Border color
    if (this.options.borderPosition && this.options.borderColor) {
      const borderProp = `border-${this.options.borderPosition}`;
      card.style[borderProp === 'border-left' ? 'borderLeftColor' : 'borderTopColor'] = this.options.borderColor;
    }

    // Content
    card.innerHTML = this.buildContent();

    // Event Listener
    if (this.options.onClick) {
      card.addEventListener('click', this.options.onClick);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.options.onClick();
        }
      });
    }

    this.element = card;
    return card;
  }

  buildClasses() {
    const classes = ['card', `card--${this.options.variant}`, `card--${this.options.size}`];

    if (this.options.interactive) classes.push('card--interactive');
    if (this.options.glow) classes.push('card--glow');
    if (this.options.borderPosition) classes.push(`card--border-${this.options.borderPosition}`);
    if (this.options.fullWidth) classes.push('card--full');
    if (this.options.centered) classes.push('card--center');
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    const parts = [];

    // Image
    if (this.options.image) {
      parts.push(`<img src="${this.options.image}" alt="" class="card__image">`);
    }

    // Icon
    if (this.options.icon) {
      const colorStyle = this.options.iconColor ? `color: ${this.options.iconColor}` : '';
      parts.push(`<div class="card__icon" style="${colorStyle}"><i class="fa-solid ${this.options.icon}"></i></div>`);
    }

    // Title
    if (this.options.title) {
      parts.push(`<h3 class="card__title">${this.options.title}</h3>`);
    }

    // Body
    if (this.options.body) {
      parts.push(`<div class="card__body">${this.options.body}</div>`);
    }

    // Footer
    if (this.options.footer) {
      parts.push(`<div class="card__footer">${this.options.footer}</div>`);
    }

    return parts.join('');
  }

  // Public methods
  setTitle(title) {
    this.options.title = title;
    const titleEl = this.element.querySelector('.card__title');
    if (titleEl) titleEl.textContent = title;
  }

  setBody(body) {
    this.options.body = body;
    const bodyEl = this.element.querySelector('.card__body');
    if (bodyEl) bodyEl.innerHTML = body;
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

export default Card;
