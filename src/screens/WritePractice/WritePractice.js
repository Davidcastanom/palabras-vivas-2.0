/**
 * WritePractice Screen
 * Platform for learning to write with syllable pronunciation
 */

import Screen from '../../components/layout/Screen/Screen.js';
import { getWordsForCategory, categoryMeta } from '../../data/words.js';
import audioService from '../../services/AudioService.js';
import './WritePractice.css';

class WritePracticeScreen {
  constructor(options = {}) {
    this.options = {
      category: null,
      onBack: null,
      onComplete: null,
      ...options
    };

    this.screen = null;
    this.words = [];
    this.currentIndex = 0;
    this.currentWord = null;
    this.syllables = [];
    this.letters = [];
    this.selectedLetters = [];
    this.isComplete = false;
  }

  render() {
    this.words = getWordsForCategory(this.options.category);
    this.shuffleArray(this.words);
    this.currentIndex = 0;
    this.loadWord();

    this.screen = new Screen({
      id: 'write-practice',
      className: 'write-practice',
      animated: true,
      content: this.buildContent()
    });

    return this.screen.render();
  }

  loadWord() {
    this.currentWord = this.words[this.currentIndex];
    this.syllables = this.currentWord.syllables.split('-');
    this.selectedLetters = [];
    this.isComplete = false;

    const wordLetters = this.currentWord.word.split('');
    this.letters = this.shuffleArray([...wordLetters]);
  }

  buildContent() {
    const total = this.words.length;
    const progress = ((this.currentIndex) / total) * 100;

    return `
      <div class="write-practice__progress">
        <div class="write-practice__progress-bar">
          <div class="write-practice__progress-fill" style="width: ${progress}%"></div>
        </div>
        <span class="write-practice__progress-text">Palabra ${this.currentIndex + 1} de ${total}</span>
      </div>

      <div class="write-practice__image-wrapper">
        <img 
          src="${this.currentWord.img}" 
          alt="${this.currentWord.word}"
          class="write-practice__image"
          loading="lazy"
        >
      </div>

      <div class="write-practice__syllables" data-syllables>
        ${this.syllables.map((s, i) => `
          <button class="write-practice__syllable-btn" data-syllable-index="${i}">
            <i class="fa-solid fa-volume-high"></i>
            ${s}
          </button>
        `).join('')}
      </div>

      <div class="write-practice__writing-area">
        <div class="write-practice__word-display" data-word-display>
          ${this.renderWordDisplay()}
        </div>

        <div class="write-practice__slots" data-slots>
          ${this.renderSlots()}
        </div>

        <div class="write-practice__letters" data-letters>
          ${this.renderLetterButtons()}
        </div>

        <div class="write-practice__controls">
          <button class="write-practice__btn write-practice__btn--listen" data-listen>
            <i class="fa-solid fa-headphones"></i>
            Escuchar
          </button>
          <button class="write-practice__btn write-practice__btn--clear" data-clear>
            <i class="fa-solid fa-eraser"></i>
            Limpiar
          </button>
        </div>
      </div>
    `;
  }

  renderWordDisplay() {
    const word = this.currentWord.word;
    const display = word.split('').map((letter, i) => {
      if (letter === ' ') return ' ';
      if (i < this.selectedLetters.length) {
        return `<span style="color: var(--color-success)">${this.selectedLetters[i]}</span>`;
      }
      return `<span style="color: var(--text-tertiary)">_</span>`;
    }).join('');
    return display;
  }

  renderSlots() {
    return this.currentWord.word.split('').map((letter, i) => {
      if (letter === ' ') {
        return '<div class="write-practice__slot write-practice__slot--space"></div>';
      }
      const filled = i < this.selectedLetters.length;
      const isSelected = filled;
      let cls = 'write-practice__slot';
      if (isSelected) cls += ' write-practice__slot--filled';
      return `<div class="${cls}" data-slot-index="${i}">${filled ? this.selectedLetters[i] : ''}</div>`;
    }).join('');
  }

  renderLetterButtons() {
    return this.letters.map((letter, i) => {
      const used = this.isLetterUsed(i);
      let cls = 'write-practice__letter-btn';
      if (used) cls += ' write-practice__letter-btn--used';
      return `<button class="${cls}" data-letter-index="${i}" data-letter="${letter}">${letter}</button>`;
    }).join('');
  }

  isLetterUsed(index) {
    const letter = this.letters[index];
    let count = 0;
    for (let i = 0; i < this.selectedLetters.length; i++) {
      if (this.selectedLetters[i] === letter) count++;
    }
    let totalInWord = 0;
    for (const l of this.currentWord.word) {
      if (l === letter) totalInWord++;
    }
    let usedCount = 0;
    for (let i = 0; i <= index; i++) {
      if (this.letters[i] === letter) usedCount++;
    }
    return count >= totalInWord || (count > 0 && usedCount <= count);
  }

  mount(container) {
    this.screen.mount(container);
    this.setupEventListeners();
    this.autoPlayWord();
  }

  autoPlayWord() {
    setTimeout(() => {
      audioService.playWord(this.currentWord);
    }, 300);
  }

  setupEventListeners() {
    const el = this.screen.getElement();

    el.querySelectorAll('[data-syllable-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.syllableIndex);
        this.playSyllable(idx, btn);
      });
    });

    el.querySelector('[data-listen]').addEventListener('click', () => {
      audioService.playWord(this.currentWord);
    });

    el.querySelector('[data-clear]').addEventListener('click', () => {
      this.clearSelection();
    });

    el.querySelectorAll('[data-letter-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('write-practice__letter-btn--used')) return;
        const idx = parseInt(btn.dataset.letterIndex);
        this.selectLetter(idx);
      });
    });
  }

  async playSyllable(index, btnElement) {
    btnElement.classList.add('playing');
    await audioService.playIndividualSyllable(this.syllables[index]);
    btnElement.classList.remove('playing');
  }

  selectLetter(letterIndex) {
    if (this.isComplete) return;

    const letter = this.letters[letterIndex];
    const nextSlotIndex = this.selectedLetters.length;

    if (nextSlotIndex >= this.currentWord.word.length) return;

    const expectedLetter = this.currentWord.word[nextSlotIndex];

    this.selectedLetters.push(letter);

    if (letter === expectedLetter) {
      audioService.playCorrect();
      this.updateUI();

      if (this.selectedLetters.length === this.currentWord.word.replace(/ /g, '').length) {
        this.onWordComplete();
      }
    } else {
      audioService.playWrong();
      this.updateUI();

      setTimeout(() => {
        this.selectedLetters.pop();
        this.updateUI();
        this.flashWrongSlot(nextSlotIndex);
      }, 500);
    }
  }

  flashWrongSlot(index) {
    const el = this.screen.getElement();
    const slot = el.querySelector(`[data-slot-index="${index}"]`);
    if (slot) {
      slot.classList.add('write-practice__slot--wrong');
      setTimeout(() => slot.classList.remove('write-practice__slot--wrong'), 500);
    }
  }

  clearSelection() {
    this.selectedLetters = [];
    this.updateUI();
  }

  updateUI() {
    const el = this.screen.getElement();

    const wordDisplay = el.querySelector('[data-word-display]');
    if (wordDisplay) wordDisplay.innerHTML = this.renderWordDisplay();

    const slots = el.querySelector('[data-slots]');
    if (slots) slots.innerHTML = this.renderSlots();

    const letters = el.querySelector('[data-letters]');
    if (letters) letters.innerHTML = this.renderLetterButtons();

    el.querySelectorAll('[data-letter-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('write-practice__letter-btn--used')) return;
        const idx = parseInt(btn.dataset.letterIndex);
        this.selectLetter(idx);
      });
    });
  }

  async onWordComplete() {
    this.isComplete = true;
    await audioService.playCelebration();

    setTimeout(() => {
      if (this.currentIndex < this.words.length - 1) {
        this.nextWord();
      } else {
        this.showCompletion();
      }
    }, 1200);
  }

  nextWord() {
    this.currentIndex++;
    this.loadWord();
    this.updateFullUI();
    this.autoPlayWord();
  }

  updateFullUI() {
    const el = this.screen.getElement();
    el.innerHTML = this.buildContent();
    this.setupEventListeners();
  }

  showCompletion() {
    const el = this.screen.getElement();
    const overlay = document.createElement('div');
    overlay.className = 'write-practice__completion';
    overlay.innerHTML = `
      <div class="write-practice__completion-card">
        <div class="write-practice__completion-icon">🎉</div>
        <h3 class="write-practice__completion-title">¡Increíble!</h3>
        <p class="write-practice__completion-subtitle">
          Has completado todas las palabras de ${categoryMeta[this.options.category]?.name || 'esta categoría'}
        </p>
        <button class="write-practice__btn write-practice__btn--next" data-finish>
          <i class="fa-solid fa-check"></i>
          ¡Listo!
        </button>
      </div>
    `;
    el.appendChild(overlay);

    overlay.querySelector('[data-finish]').addEventListener('click', () => {
      overlay.remove();
      if (this.options.onComplete) {
        this.options.onComplete();
      }
    });
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  unmount() {
    audioService.stopAll();
    this.screen.unmount();
  }

  destroy() {
    audioService.stopAll();
    if (this.screen) {
      this.screen.destroy();
    }
  }
}

export default WritePracticeScreen;
