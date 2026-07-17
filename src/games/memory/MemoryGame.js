/**
 * Memory Game
 * Juego de encontrar pares de cartas
 */

import BaseGame from '../base/BaseGame.js';

class MemoryGame extends BaseGame {
  constructor(config = {}) {
    super({
      id: 'memory',
      totalRounds: 6,
      ...config
    });

    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.isProcessing = false;
  }

  init() {
    super.init();
    this.totalPairs = Math.min(this.config.totalRounds, this.config.words.length);
    this.generateCards();
    return this.state;
  }

  /**
   * Generar cartas para el juego
   */
  generateCards() {
    const words = this.config.words.slice(0, this.totalPairs);
    this.cards = [];

    // Crear pares de cartas (imagen + palabra)
    words.forEach((word, index) => {
      // Carta de imagen
      this.cards.push({
        id: `img-${index}`,
        pairId: index,
        type: 'image',
        content: word.image,
        text: word.word,
        isFlipped: false,
        isMatched: false
      });

      // Carta de palabra
      this.cards.push({
        id: `word-${index}`,
        pairId: index,
        type: 'word',
        content: word.word,
        text: word.word,
        isFlipped: false,
        isMatched: false
      });
    });

    // Mezclar cartas
    this.cards = this.shuffleArray(this.cards);
  }

  /**
   * Voltear carta
   */
  flipCard(cardId) {
    if (this.isProcessing) return null;

    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return null;

    // Voltear carta
    card.isFlipped = true;
    this.flippedCards.push(card);

    // Si ya hay 2 cartas volteadas
    if (this.flippedCards.length === 2) {
      this.isProcessing = true;
      this.checkMatch();
    }

    return card;
  }

  /**
   * Verificar si hay match
   */
  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.pairId === card2.pairId && card1.id !== card2.id;

    setTimeout(() => {
      if (isMatch) {
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;
        this.handleCorrectAnswer({ word: card1.text });

        if (this.matchedPairs === this.totalPairs) {
          this.completeGame();
        }
      } else {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.handleWrongAnswer({ word: card1.text });
      }

      this.flippedCards = [];
      this.isProcessing = false;
      this.notifyStateChange();
    }, 1000);
  }

  /**
   * Obtener cartas
   */
  getCards() {
    return this.cards;
  }

  /**
   * Obtener cartas volteadas
   */
  getFlippedCards() {
    return this.flippedCards;
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
   * Reiniciar juego
   */
  reset() {
    super.reset();
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.isProcessing = false;
    this.generateCards();
  }
}

export default MemoryGame;
