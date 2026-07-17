import { describe, it, expect } from 'vitest';
import { categories, categoryMeta, getWordsForCategory, audioBaseUrl } from '../../src/data/words.js';

describe('Words Data', () => {
  it('should have 5 categories', () => {
    expect(Object.keys(categories)).toHaveLength(5);
  });

  it('should have categoryMeta for each category', () => {
    Object.keys(categories).forEach(id => {
      expect(categoryMeta[id]).toBeDefined();
      expect(categoryMeta[id].name).toBeTruthy();
      expect(categoryMeta[id].icon).toBeTruthy();
    });
  });

  it('should have words in each category', () => {
    Object.values(categories).forEach(category => {
      expect(category.words).toBeDefined();
      expect(category.words.length).toBeGreaterThan(0);
    });
  });

  it('should return words for a valid category', () => {
    const firstCategoryId = Object.keys(categories)[0];
    const words = getWordsForCategory(firstCategoryId);
    expect(Array.isArray(words)).toBe(true);
    expect(words.length).toBeGreaterThan(0);
  });

  it('should return empty array for invalid category', () => {
    const words = getWordsForCategory('nonexistent');
    expect(words).toEqual([]);
  });

  it('should have valid word structure', () => {
    const firstCategoryId = Object.keys(categories)[0];
    const words = getWordsForCategory(firstCategoryId);
    const word = words[0];
    
    expect(word).toHaveProperty('id');
    expect(word).toHaveProperty('word');
    expect(word).toHaveProperty('syllables');
    expect(word).toHaveProperty('img');
    expect(typeof word.word).toBe('string');
    expect(typeof word.syllables).toBe('string');
  });

  it('should have valid audioBaseUrl', () => {
    expect(audioBaseUrl).toBeTruthy();
    expect(typeof audioBaseUrl).toBe('string');
  });
});
