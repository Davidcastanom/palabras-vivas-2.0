/**
 * CompleteWord Game
 * Juego de completar palabras eligiendo la letra correcta
 */

import BaseGame from '../base/BaseGame.js';

class CompleteWordGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'complete-word',
      totalRounds: 5,
      ...config
    });

    this.missingLetterIndex = -1;
    this.options = [];
  }

  init() {
    super.init();
    this.generateOptions();
    return this.state;
  }

  /**
   * Generar opciones para la letra faltante
   */
  generateOptions() {
    const word = this.state.currentWord.word;
    
    // Seleccionar posición aleatoria para la letra faltante
    this.missingLetterIndex = Math.floor(Math.random() * word.length);
    const missingLetter = word[this.missingLetterIndex];

    // Generar opciones (letra correcta + 3 distractoras)
    const incorrectLetters = this.generateDistractors(missingLetter);
    this.options = [missingLetter, ...incorrectLetters];
    
    // Mezclar opciones
    this.options = this.shuffleArray(this.options);
  }

  /**
   * Generar letras distractores
   */
  generateDistractors(correctLetter) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const distractors = [];
    
    while (distractors.length < 3) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (randomLetter !== correctLetter && !distractors.includes(randomLetter)) {
        distractors.push(randomLetter);
      }
    }
    
    return distractors;
  }

  /**
   * Verificar respuesta
   */
  checkAnswer(answer) {
    const isCorrect = super.checkAnswer(answer);
    
    if (isCorrect || this.state.mistakes < 3) {
      // Si es correcto o aún tiene intentos
      return isCorrect;
    }
    
    return false;
  }

  /**
   * Obtener palabra con letra faltante
   */
  getWordWithMissing() {
    const word = this.state.currentWord.word;
    return word.split('').map((letter, index) => ({
      letter,
      isMissing: index === this.missingLetterIndex,
      isVisible: index !== this.missingLetterIndex
    }));
  }

  /**
   * Obtener opciones
   */
  getOptions() {
    return this.options;
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
    this.generateOptions();
  }
}

export default CompleteWordGame;
