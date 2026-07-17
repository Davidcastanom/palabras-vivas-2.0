/**
 * LetterSlot Component
 * Slot para letras individuales en juegos de construcción
 */

import './LetterSlot.css';

class LetterSlot {
  /**
   * @param {Object} options
   * @param {string} options.letter - Letra esperada
   * @param {number} options.position - Posición en la palabra
   * @param {string} options.size - Tamaño ('sm' | 'md' | 'lg')
   * @param {boolean} options.disabled - Deshabilitado
   * @param {Function} options.onDrop - Callback al soltar letra
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      letter: '',
      position: 0,
      size: 'md',
      disabled: false,
      onDrop: null,
      className: '',
      ...options
    };

    this.element = null;
    this.currentLetter = '';
    this.state = 'empty'; // empty, filled, correct, wrong
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = this.buildClasses();
    this.element.dataset.position = this.options.position;
    
    if (this.options.disabled) {
      this.element.setAttribute('aria-disabled', 'true');
    }

    this.setupEventListeners();
    return this.element;
  }

  buildClasses() {
    const classes = ['letter-slot', `letter-slot--${this.options.size}`];
    
    if (this.currentLetter) classes.push('filled');
    if (this.state !== 'empty' && this.state !== 'filled') classes.push(this.state);
    if (this.options.className) classes.push(this.options.className);

    return classes.join(' ');
  }

  setupEventListeners() {
    // Allow drop
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.element.classList.add('active');
    });

    this.element.addEventListener('dragleave', () => {
      this.element.classList.remove('active');
    });

    this.element.addEventListener('drop', (e) => {
      e.preventDefault();
      this.element.classList.remove('active');
      
      const letter = e.dataTransfer.getData('text/plain');
      this.setLetter(letter);
      
      if (this.options.onDrop) {
        this.options.onDrop(letter, this.options.position);
      }
    });

    // Click to clear
    this.element.addEventListener('click', () => {
      if (this.currentLetter && !this.options.disabled) {
        this.clear();
      }
    });
  }

  setLetter(letter) {
    this.currentLetter = letter;
    this.element.textContent = letter;
    this.element.className = this.buildClasses();
    
    // Add pop animation
    this.element.classList.add('pop');
    setTimeout(() => {
      this.element.classList.remove('pop');
    }, 300);
  }

  clear() {
    this.currentLetter = '';
    this.state = 'empty';
    this.element.textContent = '';
    this.element.className = this.buildClasses();
  }

  setState(state) {
    this.state = state;
    this.element.className = this.buildClasses();
  }

  setCorrect() {
    this.setState('correct');
  }

  setWrong() {
    this.setState('wrong');
  }

  reset() {
    this.clear();
  }

  getLetter() {
    return this.currentLetter;
  }

  isCorrect() {
    return this.currentLetter.toLowerCase() === this.options.letter.toLowerCase();
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

export default LetterSlot;
