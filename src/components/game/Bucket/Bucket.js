/**
 * Bucket Component
 * Contenedor para drag & drop de sílabas/letras
 */

import './Bucket.css';

class Bucket {
  /**
   * @param {Object} options
   * @param {string} options.id - ID del bucket
   * @param {string} options.label - Label del bucket
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {Function} options.onDrop - Callback al soltar item
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      id: null,
      label: 'Soltar aquí',
      size: 'md',
      onDrop: null,
      className: '',
      ...options
    };

    this.element = null;
    this.items = [];
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    
    if (this.options.id) {
      this.element.dataset.bucketId = this.options.id;
    }

    this.element.innerHTML = this.buildContent();
    this.setupEventListeners();

    return this.element;
  }

  buildClasses() {
    const classes = ['bucket', `bucket--${this.options.size}`];
    
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  buildContent() {
    return `
      <i class="bucket__icon fa-solid fa-inbox"></i>
      <span class="bucket__label">${this.options.label}</span>
      <div class="bucket__content"></div>
    `;
  }

  setupEventListeners() {
    // Drag over
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.element.classList.add('drag-over');
    });

    // Drag leave
    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('drag-over');
    });

    // Drop
    this.element.addEventListener('drop', (e) => {
      e.preventDefault();
      this.element.classList.remove('drag-over');
      
      const data = e.dataTransfer.getData('text/plain');
      this.addItem(data);
      
      // Add animation
      this.element.classList.add('drop-animation');
      setTimeout(() => {
        this.element.classList.remove('drop-animation');
      }, 300);
      
      if (this.options.onDrop) {
        this.options.onDrop(data, this.options.id);
      }
    });
  }

  addItem(item) {
    this.items.push(item);
    this.updateContent();
    this.element.classList.add('filled');
  }

  removeItem(item) {
    this.items = this.items.filter(i => i !== item);
    this.updateContent();
    if (this.items.length === 0) {
      this.element.classList.remove('filled');
    }
  }

  clear() {
    this.items = [];
    this.updateContent();
    this.element.classList.remove('filled', 'correct', 'wrong');
  }

  updateContent() {
    const contentEl = this.element.querySelector('.bucket__content');
    if (contentEl) {
      contentEl.innerHTML = this.items.map(item => `
        <span class="bucket__item">${item}</span>
      `).join('');
    }
  }

  setState(state) {
    this.element.classList.remove('correct', 'wrong');
    if (state) {
      this.element.classList.add(state);
    }
  }

  setCorrect() {
    this.setState('correct');
  }

  setWrong() {
    this.setState('wrong');
  }

  getItems() {
    return [...this.items];
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

export default Bucket;
