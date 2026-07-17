/**
 * Association Game
 * Juego de asociar imágenes con palabras
 */

import BaseGame from '../base/BaseGame.js';

class AssociationGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'association',
      totalRounds: 5,
      ...config
    });

    this.options = [];
    this.selectedOption = null;
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.shuffledWords = [];
  }

  init() {
    super.init();
    this.totalPairs = Math.min(this.config.totalRounds, this.config.words.length);
    this.generateOptions();
    return this.state;
  }

  /**
   * Generar opciones para asociar
   */
  generateOptions() {
    const currentWord = this.state.currentWord;
    
    // Obtener palabras incorrectas
    const incorrectWords = this.config.words
      .filter(w => w.word !== currentWord.word)
      .slice(0, 3);

    // Crear opciones
    this.options = [
      { word: currentWord.word, image: currentWord.image, isCorrect: true },
      ...incorrectWords.map(w => ({ word: w.word, image: w.image, isCorrect: false }))
    ];

    // Mezclar opciones
    this.options = this.shuffleArray(this.options);
  }

  /**
   * Seleccionar opción
   */
  selectOption(optionIndex) {
    const option = this.options[optionIndex];
    if (!option) return null;

    this.selectedOption = option;
    this.notifyStateChange();
    return option;
  }

  /**
   * Verificar selección
   */
  checkSelection() {
    if (!this.selectedOption) return false;

    const isCorrect = this.selectedOption.isCorrect;

    if (isCorrect) {
      this.matchedPairs++;
      this.state.score += 10;
      this.state.streak++;

      if (this.config.onCorrectAnswer) {
        this.config.onCorrectAnswer({
          word: this.selectedOption.word,
          points: 10,
          streak: this.state.streak
        });
      }

      // Verificar si el juego terminó
      if (this.matchedPairs >= this.totalPairs) {
        this.completeGame();
      }
    } else {
      this.state.streak = 0;
      this.state.mistakes++;

      if (this.config.onWrongAnswer) {
        this.config.onWrongAnswer({
          word: this.selectedOption.word,
          mistakes: this.state.mistakes
        });
      }
    }

    this.selectedOption = null;
    this.notifyStateChange();
    return isCorrect;
  }

  /**
   * Obtener opciones
   */
  getOptions() {
    return this.options;
  }

  /**
   * Obtener selección actual
   */
  getSelectedOption() {
    return this.selectedOption;
  }

  /**
   * Obtener progreso de pares
   */
  getMatchProgress() {
    return {
      matched: this.matchedPairs,
      total: this.totalPairs,
      percentage: Math.round((this.matchedPairs / this.totalPairs) * 100)
    };
  }

  /**
   * Avanzar a siguiente ronda
   */
  nextRound() {
    super.nextRound();
    if (!this.state.isComplete) {
      this.generateOptions();
    }
  }

  /**
   * Reiniciar juego
   */
  reset() {
    super.reset();
    this.matchedPairs = 0;
    this.selectedOption = null;
    this.generateOptions();
  }
}

export default AssociationGame;
