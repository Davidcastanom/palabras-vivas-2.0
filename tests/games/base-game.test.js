import { describe, it, expect, vi } from 'vitest';
import BaseGame from '../../src/games/base/BaseGame.js';

describe('BaseGame', () => {
  const mockWords = [
    { id: 1, word: 'gato', syllables: 'ga-to', img: 'test.jpg' },
    { id: 2, word: 'perro', syllables: 'pe-rro', img: 'test2.jpg' },
    { id: 3, word: 'casa', syllables: 'ca-sa', img: 'test3.jpg' }
  ];

  it('should initialize with correct state', () => {
    const game = new BaseGame({
      words: mockWords,
      totalRounds: 3
    });
    game.init();
    
    expect(game.state.currentRound).toBe(1);
    expect(game.state.score).toBe(0);
    expect(game.state.streak).toBe(0);
    expect(game.state.isComplete).toBe(false);
    expect(game.state.wordsCompleted).toHaveLength(0);
    expect(game.state.wordsRemaining).toHaveLength(2);
  });

  it('should calculate stars correctly', () => {
    const game = new BaseGame({ words: mockWords });
    
    expect(game.calculateStars(95)).toBe(3);
    expect(game.calculateStars(75)).toBe(2);
    expect(game.calculateStars(55)).toBe(1);
    expect(game.calculateStars(30)).toBe(0);
  });

  it('should handle correct answer', () => {
    const game = new BaseGame({ words: mockWords, totalRounds: 3 });
    const onCorrect = vi.fn();
    game.config.onCorrectAnswer = onCorrect;
    game.init();
    
    game.handleCorrectAnswer();
    
    expect(game.state.score).toBeGreaterThan(0);
    expect(game.state.streak).toBe(1);
    expect(game.state.bestStreak).toBe(1);
    expect(onCorrect).toHaveBeenCalled();
  });

  it('should handle wrong answer', () => {
    const game = new BaseGame({ words: mockWords, totalRounds: 3 });
    const onWrong = vi.fn();
    game.config.onWrongAnswer = onWrong;
    game.init();
    
    game.handleWrongAnswer();
    
    expect(game.state.streak).toBe(0);
    expect(game.state.mistakes).toBe(1);
    expect(onWrong).toHaveBeenCalled();
  });

  it('should calculate streak bonus', () => {
    const game = new BaseGame({ words: mockWords, totalRounds: 3 });
    game.init();
    
    game.handleCorrectAnswer(); // streak 0→1: 10 + (0*2) = 10
    expect(game.state.score).toBe(10);
    
    game.handleCorrectAnswer(); // streak 1→2: 10 + (1*2) = 12
    expect(game.state.score).toBe(22);
  });

  it('should shuffle array', () => {
    const game = new BaseGame({ words: mockWords });
    const arr = [1, 2, 3, 4, 5];
    const shuffled = game.shuffleArray([...arr]);
    expect(shuffled).toHaveLength(arr.length);
    expect(shuffled.sort()).toEqual(arr.sort());
  });

  it('should normalize strings', () => {
    const game = new BaseGame({ words: mockWords });
    expect(game.normalizeString('GATO')).toBe('gato');
    expect(game.normalizeString('gató')).toBe('gato');
    expect(game.normalizeString('  Gato  ')).toBe('gato');
  });

  it('should reset game', () => {
    const game = new BaseGame({ words: mockWords, totalRounds: 3 });
    game.init();
    game.handleCorrectAnswer();
    game.handleCorrectAnswer();
    
    game.reset();
    
    expect(game.state.score).toBe(0);
    expect(game.state.streak).toBe(0);
    expect(game.state.isComplete).toBe(false);
  });

  it('should complete game when no words remaining', () => {
    const onComplete = vi.fn();
    const game = new BaseGame({
      words: [mockWords[0]],
      totalRounds: 1,
      onGameComplete: onComplete
    });
    game.init();
    
    game.completeGame();
    
    expect(game.state.isComplete).toBe(true);
    expect(onComplete).toHaveBeenCalled();
  });
});
