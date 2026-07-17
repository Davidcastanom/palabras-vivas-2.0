import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MemoryGame from '../../src/games/memory/MemoryGame.js';

describe('MemoryGame', () => {
  const mockWords = [
    { id: 1, word: 'gato', syllables: 'ga-to', img: 'gato.jpg' },
    { id: 2, word: 'perro', syllables: 'pe-rro', img: 'perro.jpg' },
    { id: 3, word: 'casa', syllables: 'ca-sa', img: 'casa.jpg' }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create pairs of cards (image + word)', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    expect(cards).toHaveLength(6);
  });

  it('should have image and word cards for each word', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const imageCards = cards.filter(c => c.type === 'image');
    const wordCards = cards.filter(c => c.type === 'word');

    expect(imageCards).toHaveLength(3);
    expect(wordCards).toHaveLength(3);
  });

  it('should flip a card', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const firstCard = cards[0];

    const flipped = game.flipCard(firstCard.id);
    expect(flipped).toBeTruthy();

    const flippedCards = game.getFlippedCards();
    expect(flippedCards).toHaveLength(1);
  });

  it('should not flip already flipped card', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const firstCard = cards[0];

    game.flipCard(firstCard.id);
    const result = game.flipCard(firstCard.id);

    expect(result).toBeNull();
    expect(game.getFlippedCards()).toHaveLength(1);
  });

  it('should detect matching pairs', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const imageCard = cards.find(c => c.type === 'image');
    const wordCard = cards.find(c => c.type === 'word' && c.pairId === imageCard.pairId);

    game.flipCard(imageCard.id);
    game.flipCard(wordCard.id);

    const flipped = game.getFlippedCards();
    expect(flipped).toHaveLength(2);

    vi.advanceTimersByTime(1000);

    expect(imageCard.isMatched).toBe(true);
    expect(wordCard.isMatched).toBe(true);
    expect(game.getFlippedCards()).toHaveLength(0);
  });

  it('should start with all cards unmatched', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const matched = cards.filter(c => c.isMatched);
    expect(matched).toHaveLength(0);
  });

  it('should return null when flipping a non-existent card', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const result = game.flipCard('non-existent-id');
    expect(result).toBeNull();
  });

  it('should unflip non-matching cards after timeout', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const cards = game.getCards();
    const card1 = cards.find(c => c.type === 'image');
    const card2 = cards.find(c => c.type === 'word' && c.pairId !== card1.pairId);

    game.flipCard(card1.id);
    game.flipCard(card2.id);

    expect(card1.isFlipped).toBe(true);
    expect(card2.isFlipped).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(card1.isFlipped).toBe(false);
    expect(card2.isFlipped).toBe(false);
    expect(card1.isMatched).toBe(false);
    expect(card2.isMatched).toBe(false);
  });

  it('should track match progress', () => {
    const game = new MemoryGame({ words: mockWords, totalRounds: 3 });
    game.init();

    let progress = game.getMatchProgress();
    expect(progress.matched).toBe(0);
    expect(progress.total).toBe(3);

    const cards = game.getCards();
    const imageCard = cards.find(c => c.type === 'image');
    const wordCard = cards.find(c => c.type === 'word' && c.pairId === imageCard.pairId);

    game.flipCard(imageCard.id);
    game.flipCard(wordCard.id);
    vi.advanceTimersByTime(1000);

    progress = game.getMatchProgress();
    expect(progress.matched).toBe(1);
    expect(progress.percentage).toBe(33);
  });

  it('should complete game when all pairs matched', () => {
    const onComplete = vi.fn();
    const game = new MemoryGame({
      words: mockWords,
      totalRounds: 3,
      onGameComplete: onComplete
    });
    game.init();

    const cards = game.getCards();

    for (let i = 0; i < 3; i++) {
      const imageCard = cards.find(c => c.type === 'image' && c.pairId === i);
      const wordCard = cards.find(c => c.type === 'word' && c.pairId === i);

      game.flipCard(imageCard.id);
      game.flipCard(wordCard.id);
      vi.advanceTimersByTime(1000);
    }

    expect(game.state.isComplete).toBe(true);
    expect(onComplete).toHaveBeenCalled();
  });
});
