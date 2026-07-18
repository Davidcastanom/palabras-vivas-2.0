/**
 * WordSearch Game
 * Juego de buscar palabras en cuadrícula
 */

import BaseGame from '../base/BaseGame.js';

class WordSearchGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'word-search',
      totalRounds: 5,
      ...config
    });

    this.grid = [];
    this.gridSize = 10;
    this.foundLetters = [];
    this.selectedLetters = [];
    this.currentWordIndex = 0;
    this.wordsToFind = [];
  }

  init() {
    super.init();
    const shuffledWords = this.shuffleArray([...this.config.words]);
    this.wordsToFind = shuffledWords.slice(0, this.config.totalRounds);
    this.currentWordIndex = 0;
    this.generateGrid();
    return this.state;
  }

  /**
   * Generar cuadrícula de búsqueda
   */
  generateGrid() {
    const word = this.wordsToFind[this.currentWordIndex].word.toUpperCase();
    this.gridSize = Math.max(8, word.length + 4);
    this.grid = [];
    this.foundLetters = [];
    this.selectedLetters = [];

    // Inicializar cuadrícula con letras aleatorias
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j] = {
          letter: this.getRandomLetter(),
          isSelected: false,
          isFound: false,
          position: { row: i, col: j }
        };
      }
    }

    // Colocar palabra en la cuadrícula
    this.placeWord(word);
  }

  /**
   * Colocar palabra en la cuadrícula
   */
  placeWord(word) {
    const directions = [
      { dr: 0, dc: 1 },   // horizontal
      { dr: 1, dc: 0 },   // vertical
      { dr: 1, dc: 1 },   // diagonal
      { dr: -1, dc: 1 }   // diagonal inversa
    ];

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * (this.gridSize - word.length));
      const startCol = Math.floor(Math.random() * (this.gridSize - word.length));

      if (this.canPlaceWord(word, startRow, startCol, direction)) {
        this.placeWordAtPosition(word, startRow, startCol, direction);
        placed = true;
      }
      attempts++;
    }
  }

  /**
   * Verificar si se puede colocar la palabra
   */
  canPlaceWord(word, startRow, startCol, direction) {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * direction.dr;
      const col = startCol + i * direction.dc;

      if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
        return false;
      }

      if (this.grid[row][col].isFound) {
        return false;
      }
    }
    return true;
  }

  /**
   * Colocar palabra en posición específica
   */
  placeWordAtPosition(word, startRow, startCol, direction) {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * direction.dr;
      const col = startCol + i * direction.dc;
      this.grid[row][col].letter = word[i];
    }
  }

  /**
   * Obtener letra aleatoria
   */
  getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  }

  /**
   * Seleccionar letra
   */
  selectLetter(row, col) {
    const letter = this.grid[row][col];
    if (letter.isFound) return null;

    letter.isSelected = !letter.isSelected;

    if (letter.isSelected) {
      this.selectedLetters.push({ row, col, letter: letter.letter });
    } else {
      this.selectedLetters = this.selectedLetters.filter(
        l => !(l.row === row && l.col === col)
      );
    }

    this.notifyStateChange();
    return letter;
  }

  /**
   * Verificar si la selección es correcta
   */
  checkSelection() {
    const selectedWord = this.selectedLetters.map(l => l.letter).join('');
    const targetWord = this.wordsToFind[this.currentWordIndex].word.toUpperCase();

    if (selectedWord === targetWord) {
      // Marcar letras como encontradas
      this.selectedLetters.forEach(l => {
        this.grid[l.row][l.col].isFound = true;
        this.grid[l.row][l.col].isSelected = false;
      });

      this.foundLetters.push(...this.selectedLetters);
      this.selectedLetters = [];
      this.state.score += 10;
      this.state.streak++;

      if (this.config.onCorrectAnswer) {
        this.config.onCorrectAnswer({
          word: this.wordsToFind[this.currentWordIndex].word,
          points: 10,
          streak: this.state.streak
        });
      }

      return true;
    }

    return false;
  }

  /**
   * Avanzar a siguiente palabra
   */
  nextWord() {
    this.currentWordIndex++;
    if (this.currentWordIndex >= this.wordsToFind.length) {
      this.completeGame();
    } else {
      this.generateGrid();
    }
  }

  /**
   * Obtener cuadrícula
   */
  getGrid() {
    return this.grid;
  }

  /**
   * Obtener palabra actual
   */
  getCurrentWord() {
    return this.wordsToFind[this.currentWordIndex];
  }

  /**
   * Obtener letras seleccionadas
   */
  getSelectedLetters() {
    return this.selectedLetters;
  }

  /**
   * Reiniciar juego
   */
  reset() {
    super.reset();
    this.currentWordIndex = 0;
    const shuffledWords = this.shuffleArray([...this.config.words]);
    this.wordsToFind = shuffledWords.slice(0, this.config.totalRounds);
    this.generateGrid();
  }
}

export default WordSearchGame;
