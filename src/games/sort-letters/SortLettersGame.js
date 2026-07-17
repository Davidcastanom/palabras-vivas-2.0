/**
 * SortLetters Game
 * Juego de ordenar letras para formar palabras
 */

import BaseGame from '../base/BaseGame.js';

class SortLettersGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'sort-letters',
      totalRounds: 5,
      ...config
    });

    this.shuffledLetters = [];
    this.selectedLetters = [];
  }

  init() {
    super.init();
    this.generateLetters();
    return this.state;
  }

  /**
   * Generar letras mezcladas
   */
  generateLetters() {
    const word = this.state.currentWord.word;
    this.shuffledLetters = word.split('').map((letter, index) => ({
      letter,
      originalIndex: index,
      isSelected: false,
      isPlaced: false
    }));

    // Mezclar letras
    this.shuffledLetters = this.shuffleArray(this.shuffledLetters);
    this.selectedLetters = [];
  }

  /**
   * Seleccionar letra
   */
  selectLetter(index) {
    const letterData = this.shuffledLetters[index];
    if (letterData.isSelected || letterData.isPlaced) return null;

    letterData.isSelected = true;
    this.selectedLetters.push({
      ...letterData,
      selectedIndex: this.selectedLetters.length
    });

    this.notifyStateChange();
    return letterData;
  }

  /**
   * Remover letra seleccionada
   */
  removeLetter(index) {
    const letterToRemove = this.selectedLetters[index];
    if (!letterToRemove) return null;

    // Encontrar letra en shuffledLetters y restaurar estado
    const originalIndex = this.shuffledLetters.findIndex(
      l => l.letter === letterToRemove.letter && l.isSelected
    );

    if (originalIndex !== -1) {
      this.shuffledLetters[originalIndex].isSelected = false;
    }

    this.selectedLetters.splice(index, 1);

    // Actualizar índices
    this.selectedLetters.forEach((l, i) => {
      l.selectedIndex = i;
    });

    this.notifyStateChange();
    return letterToRemove;
  }

  /**
   * Verificar si la palabra formada es correcta
   */
  checkWord() {
    const formedWord = this.selectedLetters.map(l => l.letter).join('');
    const targetWord = this.state.currentWord.word;

    if (this.normalizeString(formedWord) === this.normalizeString(targetWord)) {
      this.handleCorrectAnswer({ word: targetWord });
      return true;
    }

    this.handleWrongAnswer({ word: targetWord });
    return false;
  }

  /**
   * Limpiar selección
   */
  clearSelection() {
    this.shuffledLetters.forEach(l => {
      l.isSelected = false;
    });
    this.selectedLetters = [];
    this.notifyStateChange();
  }

  /**
   * Obtener letras mezcladas
   */
  getShuffledLetters() {
    return this.shuffledLetters;
  }

  /**
   * Obtener letras seleccionadas
   */
  getSelectedLetters() {
    return this.selectedLetters;
  }

  /**
   * Avanzar a siguiente ronda
   */
  nextRound() {
    super.nextRound();
    if (!this.state.isComplete) {
      this.generateLetters();
    }
  }

  /**
   * Reiniciar juego
   */
  reset() {
    super.reset();
    this.generateLetters();
  }
}

export default SortLettersGame;
