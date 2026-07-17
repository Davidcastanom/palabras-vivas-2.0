/**
 * Syllables Game
 * Juego de aprender sílabas
 */

import BaseGame from '../base/BaseGame.js';

class SyllablesGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'syllables',
      totalRounds: 5,
      ...config
    });

    this.currentSyllables = [];
    this.selectedSyllables = [];
  }

  init() {
    super.init();
    this.generateSyllables();
    return this.state;
  }

  /**
   * Generar sílabas para la palabra actual
   */
  generateSyllables() {
    const word = this.state.currentWord;
    // Handle both string 'Pe-rro' and array ['PE-RRO'] formats
    if (typeof word.syllables === 'string') {
      this.currentSyllables = word.syllables.split('-').map(s => s.trim());
    } else {
      this.currentSyllables = word.syllables || this.splitIntoSyllables(word.word);
    }
    this.selectedSyllables = [];
  }

  /**
   * Dividir palabra en sílabas (simplificado)
   */
  splitIntoSyllables(word) {
    const vowels = 'aeiouáéíóú';
    const syllables = [];
    let current = '';
    let lastWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      const isVowel = vowels.includes(char);

      current += word[i];

      if (isVowel && lastWasVowel && current.length >= 2) {
        syllables.push(current);
        current = '';
      } else if (!isVowel && lastWasVowel && i < word.length - 1) {
        syllables.push(current);
        current = '';
      }

      lastWasVowel = isVowel;
    }

    if (current) {
      if (syllables.length > 0 && syllables[syllables.length - 1].length === 1) {
        syllables[syllables.length - 1] += current;
      } else {
        syllables.push(current);
      }
    }

    return syllables.length > 0 ? syllables : [word];
  }

  /**
   * Seleccionar sílaba
   */
  selectSyllable(syllable, index) {
    this.selectedSyllables.push({
      syllable,
      originalIndex: index
    });

    this.notifyStateChange();
    return this.selectedSyllables;
  }

  /**
   * Verificar si las sílabas seleccionadas son correctas
   */
  checkSyllables() {
    const selectedWord = this.selectedSyllables.map(s => s.syllable).join('');
    return this.normalizeString(selectedWord) === this.normalizeString(this.state.currentWord.word);
  }

  /**
   * Obtener sílabas actuales
   */
  getSyllables() {
    return this.currentSyllables;
  }

  /**
   * Obtener sílabas seleccionadas
   */
  getSelectedSyllables() {
    return this.selectedSyllables;
  }

  /**
   * Limpiar selección
   */
  clearSelection() {
    this.selectedSyllables = [];
    this.notifyStateChange();
  }

  /**
   * Avanzar a siguiente ronda
   */
  nextRound() {
    super.nextRound();
    if (!this.state.isComplete) {
      this.generateSyllables();
    }
  }

  /**
   * Reiniciar juego
   */
  reset() {
    super.reset();
    this.generateSyllables();
  }
}

export default SyllablesGame;
