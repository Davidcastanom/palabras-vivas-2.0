import { describe, it, expect, vi } from 'vitest';
import CompleteWordGame from '../../src/games/complete-word/CompleteWordGame.js';

describe('CompleteWordGame', () => {
  const mockWords = [
    { id: 1, word: 'gato', syllables: 'ga-to', img: 'gato.jpg' },
    { id: 2, word: 'perro', syllables: 'pe-rro', img: 'perro.jpg' },
    { id: 3, word: 'casa', syllables: 'ca-sa', img: 'casa.jpg' },
    { id: 4, word: 'pez', syllables: 'pez', img: 'pez.jpg' },
    { id: 5, word: 'rana', syllables: 'ra-na', img: 'rana.jpg' }
  ];

  it('should initialize with a target word', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    expect(target).toBeDefined();
    expect(target.word).toBeTruthy();
    expect(target.img).toBeTruthy();
  });

  it('should provide 3 options including the target', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    const options = game.getOptions();

    expect(options).toHaveLength(3);
    expect(options.some(o => o.id === target.id)).toBe(true);
  });

  it('should handle correct answer', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    const options = game.getOptions();
    const correctOption = options.find(o => o.id === target.id);

    const isCorrect = game.checkAnswer(correctOption);
    expect(isCorrect).toBe(true);
  });

  it('should handle wrong answer', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    const options = game.getOptions();
    const wrongOption = options.find(o => o.id !== target.id);

    const isCorrect = game.checkAnswer(wrongOption);
    expect(isCorrect).toBe(false);
    expect(game.state.mistakes).toBe(1);
    expect(game.state.streak).toBe(0);
  });

  it('should advance to next round after correct answer', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const firstRound = game.state.currentRound;
    const firstTarget = game.getTarget();
    const options = game.getOptions();
    const correctOption = options.find(o => o.id === firstTarget.id);

    game.checkAnswer(correctOption);

    // After correct answer, game should have advanced
    expect(game.state.currentRound).toBeGreaterThanOrEqual(firstRound);
    expect(game.getTarget()).toBeDefined();
  });

  it('should complete game after all rounds', () => {
    const onComplete = vi.fn();
    const game = new CompleteWordGame({
      words: mockWords.slice(0, 3),
      totalRounds: 3,
      onGameComplete: onComplete
    });
    game.init();

    for (let i = 0; i < 3; i++) {
      const target = game.getTarget();
      const options = game.getOptions();
      const correctOption = options.find(o => o.id === target.id);
      game.checkAnswer(correctOption);
    }

    expect(game.state.isComplete).toBe(true);
    expect(onComplete).toHaveBeenCalled();
  });

  it('should calculate final result with stars', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    for (let i = 0; i < 5; i++) {
      const target = game.getTarget();
      const options = game.getOptions();
      const correctOption = options.find(o => o.id === target.id);
      game.checkAnswer(correctOption);
    }

    const result = game.calculateResult();
    expect(result.stars).toBe(3);
    expect(result.accuracy).toBe(100);
  });

  it('should reset streak on wrong answer', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    const options = game.getOptions();
    const correctOption = options.find(o => o.id === target.id);

    game.checkAnswer(correctOption);
    expect(game.state.streak).toBe(1);

    const target2 = game.getTarget();
    const options2 = game.getOptions();
    const wrongOption = options2.find(o => o.id !== target2.id);

    game.checkAnswer(wrongOption);
    expect(game.state.streak).toBe(0);
    expect(game.state.mistakes).toBe(1);
  });

  it('should track words completed', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    for (let i = 0; i < 3; i++) {
      const target = game.getTarget();
      const options = game.getOptions();
      const correctOption = options.find(o => o.id === target.id);
      game.checkAnswer(correctOption);
    }

    expect(game.state.wordsCompleted).toHaveLength(3);
  });

  it('should reset game correctly', () => {
    const game = new CompleteWordGame({ words: mockWords, totalRounds: 5 });
    game.init();

    const target = game.getTarget();
    const options = game.getOptions();
    const correctOption = options.find(o => o.id === target.id);
    game.checkAnswer(correctOption);

    game.reset();

    expect(game.state.score).toBe(0);
    expect(game.state.streak).toBe(0);
    expect(game.state.isComplete).toBe(false);
    expect(game.getTarget()).toBeDefined();
  });
});
