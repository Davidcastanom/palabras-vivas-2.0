import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '../../src/core/router.js';

describe('Router', () => {
  beforeEach(() => {
    window.location.hash = '#/home';
  });

  it('should register routes', () => {
    const handler = vi.fn();
    router.on('test-route', handler);
    expect(router.routes.has('test-route')).toBe(true);
  });

  it('should navigate to path', () => {
    router.navigate('game/animals');
    expect(window.location.hash).toBe('#/game/animals');
  });

  it('should extract params from path', () => {
    const handler = vi.fn();
    router.on('game/:category', handler);
    
    const regex = router.pathToRegex('game/:category');
    const match = 'game/animals'.match(regex);
    expect(match).not.toBeNull();
  });

  it('should get current path', () => {
    window.location.hash = '#/game/animals/memory';
    expect(router.getCurrentPath()).toBe('game/animals/memory');
  });

  it('should return default path when hash is empty', () => {
    window.location.hash = '';
    expect(router.getCurrentPath()).toBe('home');
  });
});
