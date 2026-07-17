/**
 * Toast Component
 * Notificaciones feedback no intrusivas
 */

import './Toast.css';

class Toast {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.maxToasts = 5;
    this.defaultDuration = 3000;
    
    this.init();
  }

  init() {
    // Crear container si no existe
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Mostrar toast
   * @param {Object} options
   * @param {string} options.message - Mensaje a mostrar
   * @param {string} options.type - Tipo ('success' | 'error' | 'warning' | 'info')
   * @param {number} options.duration - Duración en ms
   * @param {boolean} options.showClose - Mostrar botón cerrar
   * @param {Function} options.onClose - Callback al cerrar
   * @returns {HTMLElement} Elemento del toast
   */
  show(options = {}) {
    const config = {
      message: '',
      type: 'info',
      duration: this.defaultDuration,
      showClose: true,
      onClose: null,
      ...options
    };

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast toast--${config.type}`;
    toast.innerHTML = this.buildContent(config);

    // Agregar al container
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Limitar cantidad de toasts
    if (this.toasts.length > this.maxToasts) {
      const oldToast = this.toasts.shift();
      this.dismiss(oldToast);
    }

    // Event listeners
    if (config.showClose) {
      const closeBtn = toast.querySelector('.toast__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.dismiss(toast);
          if (config.onClose) config.onClose();
        });
      }
    }

    // Auto dismiss
    if (config.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
        if (config.onClose) config.onClose();
      }, config.duration);
    }

    return toast;
  }

  buildContent(config) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const parts = [];

    // Icon
    parts.push(`<i class="toast__icon fa-solid ${icons[config.type] || icons.info}"></i>`);

    // Message
    parts.push(`<span class="toast__message">${config.message}</span>`);

    // Close
    if (config.showClose) {
      parts.push(`<button class="toast__close" aria-label="Cerrar"><i class="fa-solid fa-times"></i></button>`);
    }

    return parts.join('');
  }

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.add('toast--exiting');
    
    setTimeout(() => {
      toast.remove();
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }

  // ========================================
  // SHORTCUT METHODS
  // ========================================

  success(message, options = {}) {
    return this.show({ message, type: 'success', ...options });
  }

  error(message, options = {}) {
    return this.show({ message, type: 'error', ...options });
  }

  warning(message, options = {}) {
    return this.show({ message, type: 'warning', ...options });
  }

  info(message, options = {}) {
    return this.show({ message, type: 'info', ...options });
  }

  // ========================================
  // CLEAR ALL
  // ========================================

  clear() {
    this.toasts.forEach(toast => this.dismiss(toast));
  }
}

// Singleton
const toastInstance = new Toast();
export default toastInstance;
