import { describe, it, expect } from 'vitest';
import gameIntroData from '../../src/data/games.js';

describe('Games Data', () => {
  it('should have data for all game types', () => {
    const expectedGames = ['complete-word', 'association', 'memory', 'sort-letters', 'syllables', 'word-search'];
    
    expectedGames.forEach(gameId => {
      expect(gameIntroData[gameId]).toBeDefined();
      expect(gameIntroData[gameId].title).toBeTruthy();
      expect(gameIntroData[gameId].description).toBeTruthy();
      expect(gameIntroData[gameId].howToPlay).toBeInstanceOf(Array);
      expect(gameIntroData[gameId].howToPlay.length).toBeGreaterThan(0);
    });
  });

  it('should have valid game structure', () => {
    Object.values(gameIntroData).forEach(game => {
      expect(game).toHaveProperty('title');
      expect(game).toHaveProperty('description');
      expect(game).toHaveProperty('icon');
      expect(game).toHaveProperty('iconColor');
      expect(game).toHaveProperty('howToPlay');
      expect(game).toHaveProperty('tip');
      expect(game).toHaveProperty('reward');
      expect(game).toHaveProperty('estimatedTime');
      expect(game).toHaveProperty('difficulty');
    });
  });

  it('should have valid difficulty values', () => {
    Object.values(gameIntroData).forEach(game => {
      expect(game.difficulty).toBeGreaterThanOrEqual(0);
      expect(game.difficulty).toBeLessThanOrEqual(3);
    });
  });
});
