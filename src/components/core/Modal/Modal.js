/**
 * Modal Component
 * Modal reutilizable con overlay y animaciones
 */

import './Modal.css';

class Modal {
  /**
   * @param {Object} options
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg' | 'xl')
   * @param {string} options.title - Título del modal
   * @param {string|HTMLElement} options.body - Contenido del modal
   * @param {string|HTMLElement} options.footer - Footer del modal
   * @param {boolean} options.showClose - Mostrar botón cerrar
   * @param {boolean} options.closeOnOverlay - Cerrar al hacer click en overlay
   * @param {boolean} options.closeOnEsc - Cerrar con tecla Escape
   * @param {Function} options.onClose - Callback al cerrar
   * @param {string} options.className - Clases adicionales
   * @param {string} options.id - ID del modal
   */
  constructor(options = {}) {
    this.options = {
      size: 'md',
      title: null,
      body: null,
      footer: null,
      showClose: true,
      closeOnOverlay: true,
      closeOnEsc: true,
      onClose: null,
      className: '',
      id: null,
      ...options
    };

    this.overlay = null;
    this.content = null;
    this.isOpen = false;
    this.handleEsc = this.handleEsc.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    
    this.render();
  }

  render() {
    // Overlay
    this.overlay = document.createElement('div');
    this.overlay.className = `modal-overlay ${this.options.className}`;
    if (this.options.id) {
      this.overlay.id = this.options.id;
    }

    // Content
    this.content = document.createElement('div');
    this.content.className = `modal-content modal-content--${this.options.size}`;
    this.content.innerHTML = this.buildContent();

    this.overlay.appendChild(this.content);

    // Event Listeners
    if (this.options.closeOnOverlay) {
      this.overlay.addEventListener('click', this.handleOverlayClick);
    }

    if (this.options.showClose) {
      const closeBtn = this.content.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
    }
  }

  buildContent() {
    const parts = [];

    // Close button
    if (this.options.showClose) {
      parts.push(`<button class="modal-close" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>`);
    }

    // Header
    if (this.options.title) {
      parts.push(`
        <div class="modal-header">
          <h2 class="modal-title">${this.options.title}</h2>
        </div>
      `);
    }

    // Body
    if (this.options.body) {
      const bodyContent = typeof this.options.body === 'string' 
        ? this.options.body 
        : '';
      parts.push(`<div class="modal-body">${bodyContent}</div>`);
    }

    // Footer
    if (this.options.footer) {
      const footerContent = typeof this.options.footer === 'string'
        ? this.options.footer
        : '';
      parts.push(`<div class="modal-footer">${footerContent}</div>`);
    }

    return parts.join('');
  }

  handleOverlayClick(e) {
    if (e.target === this.overlay) {
      this.close();
    }
  }

  handleEsc(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;

    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
    });

    // ESC listener
    if (this.options.closeOnEsc) {
      document.addEventListener('keydown', this.handleEsc);
    }

    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;

    this.overlay.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      this.overlay.remove();
      if (this.options.onClose) {
        this.options.onClose();
      }
    }, 300);

    // ESC listener
    document.removeEventListener('keydown', this.handleEsc);

    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Public methods
  setTitle(title) {
    this.options.title = title;
    const titleEl = this.content.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = title;
  }

  setBody(body) {
    this.options.body = body;
    const bodyEl = this.content.querySelector('.modal-body');
    if (bodyEl) {
      bodyEl.innerHTML = typeof body === 'string' ? body : '';
    }
  }

  setFooter(footer) {
    this.options.footer = footer;
    const footerEl = this.content.querySelector('.modal-footer');
    if (footerEl) {
      footerEl.innerHTML = typeof footer === 'string' ? footer : '';
    }
  }

  getElement() {
    return this.overlay;
  }

  destroy() {
    this.close();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
}

/**
 * Modal estático - Mostrar modal rápido
 */
Modal.show = (options) => {
  const modal = new Modal(options);
  modal.open();
  return modal;
};

/**
 * Modal de confirmación
 */
Modal.confirm = (options) => {
  return new Promise((resolve) => {
    const modal = new Modal({
      size: 'sm',
      title: options.title || 'Confirmar',
      body: options.message || '',
      footer: `
        <button class="button button--ghost button--md" data-action="cancel">${options.cancelText || 'Cancelar'}</button>
        <button class="button button--primary button--md" data-action="confirm">${options.confirmText || 'Confirmar'}</button>
      `,
      onClose: () => resolve(false),
      ...options
    });

    modal.open();

    // Button handlers
    const cancelBtn = modal.content.querySelector('[data-action="cancel"]');
    const confirmBtn = modal.content.querySelector('[data-action="confirm"]');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        modal.close();
        resolve(false);
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        modal.close();
        resolve(true);
      });
    }
  });
};

export default Modal;
