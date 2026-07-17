import { describe, it, expect } from 'vitest';
import SyllablesGame from '../../src/games/syllables/SyllablesGame.js';

describe('SyllablesGame', () => {
  const mockWords = [
    { id: 1, word: 'gato', syllables: 'ga-to', img: 'gato.jpg' },
    { id: 2, word: 'perro', syllables: 'pe-rro', img: 'perro.jpg' },
    { id: 3, word: 'casa', syllables: 'ca-sa', img: 'casa.jpg' }
  ];

  it('should split word into syllables', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    expect(Array.isArray(syllables)).toBe(true);
    expect(syllables.length).toBeGreaterThan(0);
  });

  it('should track selected syllables', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    game.selectSyllable(syllables[0], 0);

    const selected = game.getSelectedSyllables();
    expect(selected).toHaveLength(1);
    expect(selected[0].syllable).toBe(syllables[0]);
  });

  it('should clear selection', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    game.selectSyllable(syllables[0], 0);
    game.clearSelection();

    const selected = game.getSelectedSyllables();
    expect(selected).toHaveLength(0);
  });

  it('should have all expected syllables', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    expect(syllables.length).toBeGreaterThan(1);

    const word = game.state.currentWord;
    const expectedSyllables = word.syllables.split('-');
    expect(syllables.sort()).toEqual(expectedSyllables.sort());
  });

  it('should verify correct syllable order', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    syllables.forEach((s, i) => {
      game.selectSyllable(s, i);
    });

    const isCorrect = game.checkSyllables();
    expect(isCorrect).toBe(true);
  });

  it('should reject wrong syllable order', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    const reversed = [...syllables].reverse();
    reversed.forEach((s, i) => {
      game.selectSyllable(s, i);
    });

    const isCorrect = game.checkSyllables();
    expect(isCorrect).toBe(false);
  });

  it('should select multiple syllables in order', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const syllables = game.getSyllables();
    game.selectSyllable(syllables[0], 0);
    game.selectSyllable(syllables[1], 1);

    const selected = game.getSelectedSyllables();
    expect(selected).toHaveLength(2);
    expect(selected[0].syllable).toBe(syllables[0]);
    expect(selected[1].syllable).toBe(syllables[1]);
  });

  it('should advance to next round and generate new syllables', () => {
    const game = new SyllablesGame({ words: mockWords, totalRounds: 3 });
    game.init();

    const firstWord = game.state.currentWord;
    game.nextRound();

    expect(game.state.isComplete).toBe(false);
    expect(game.state.currentWord.id).not.toBe(firstWord.id);

    const newSyllables = game.getSyllables();
    expect(newSyllables.length).toBeGreaterThan(0);
  });
});
