/**
 * Flashcard Component
 * Tarjeta de aprendizaje con imagen, palabra y sílabas
 */

import './Flashcard.css';

class Flashcard {
  /**
   * @param {Object} options
   * @param {string} options.image - URL de la imagen
   * @param {string} options.word - Palabra a mostrar
   * @param {Array} options.syllables - Array de sílabas
   * @param {boolean} options.showSyllables - Mostrar sílabas
   * @param {Function} options.onSyllableClick - Callback al hacer click en sílaba
   * @param {Function} options.onAudioPlay - Callback al reproducir audio
   * @param {Function} options.onRecord - Callback al grabar audio
   * @param {string} options.className - Clases adicionales
   */
  constructor(options = {}) {
    this.options = {
      image: null,
      word: '',
      syllables: [],
      showSyllables: true,
      onSyllableClick: null,
      onAudioPlay: null,
      onRecord: null,
      className: '',
      ...options
    };

    this.element = null;
    this.isRecording = false;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = `flashcard ${this.options.className}`;
    this.element.innerHTML = this.buildContent();

    this.setupEventListeners();
    return this.element;
  }

  buildContent() {
    return `
      <div class="flashcard__image-container">
        ${this.options.image 
          ? `<img src="${this.options.image}" alt="${this.options.word}" class="flashcard__image">`
          : `<div class="flashcard__placeholder">
              <i class="flashcard__placeholder-icon fa-solid fa-image"></i>
              <span>Imagen</span>
            </div>`
        }
      </div>

      <div class="flashcard__word">${this.options.word}</div>

      ${this.options.showSyllables && this.options.syllables.length > 0 
        ? `<div class="flashcard__syllables">
            ${this.renderSyllables()}
          </div>`
        : ''
      }

      <div class="flashcard__audio">
        <button class="flashcard__audio-btn" data-action="play" aria-label="Escuchar palabra">
          <i class="fa-solid fa-volume-high"></i>
        </button>
        <button class="flashcard__audio-btn" data-action="record" aria-label="Decir palabra">
          <i class="fa-solid fa-microphone"></i>
        </button>
      </div>
    `;
  }

  renderSyllables() {
    return this.options.syllables.map((syllable, index) => `
      <button class="flashcard__syllable" data-syllable="${syllable}" data-index="${index}">
        ${syllable}
      </button>
    `).join('');
  }

  setupEventListeners() {
    // Syllable clicks
    const syllableBtns = this.element.querySelectorAll('.flashcard__syllable');
    syllableBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const syllable = btn.dataset.syllable;
        const index = parseInt(btn.dataset.index);
        
        // Toggle active state
        syllableBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (this.options.onSyllableClick) {
          this.options.onSyllableClick(syllable, index);
        }
      });
    });

    // Audio play button
    const playBtn = this.element.querySelector('[data-action="play"]');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (this.options.onAudioPlay) {
          this.options.onAudioPlay(this.options.word);
        }
      });
    }

    // Record button
    const recordBtn = this.element.querySelector('[data-action="record"]');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => {
        this.toggleRecording();
        if (this.options.onRecord) {
          this.options.onRecord(!this.isRecording);
        }
      });
    }
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    const recordBtn = this.element.querySelector('[data-action="record"]');
    
    if (recordBtn) {
      recordBtn.classList.toggle('recording', this.isRecording);
      
      // Change icon
      const icon = recordBtn.querySelector('i');
      if (icon) {
        icon.className = this.isRecording 
          ? 'fa-solid fa-stop' 
          : 'fa-solid fa-microphone';
      }
    }
  }

  // Public methods
  setImage(imageUrl) {
    this.options.image = imageUrl;
    const imgContainer = this.element.querySelector('.flashcard__image-container');
    if (imgContainer) {
      imgContainer.innerHTML = `<img src="${imageUrl}" alt="${this.options.word}" class="flashcard__image">`;
    }
  }

  setWord(word) {
    this.options.word = word;
    const wordEl = this.element.querySelector('.flashcard__word');
    if (wordEl) wordEl.textContent = word;
  }

  setSyllables(syllables) {
    this.options.syllables = syllables;
    const syllablesContainer = this.element.querySelector('.flashcard__syllables');
    if (syllablesContainer) {
      syllablesContainer.innerHTML = this.renderSyllables();
      this.setupEventListeners();
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

export default Flashcard;
