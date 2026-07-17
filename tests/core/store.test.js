import { describe, it, expect, vi } from 'vitest';
import store from '../../src/core/store.js';

describe('Store', () => {
  it('should have initial state', () => {
    const state = store.getState();
    expect(state).toHaveProperty('stars');
    expect(state).toHaveProperty('theme');
    expect(state).toHaveProperty('currentScreen');
  });

  it('should get specific state key', () => {
    expect(store.getState('stars')).toBeTypeOf('number');
    expect(store.getState('theme')).toBeTypeOf('string');
  });

  it('should update state with object', () => {
    const initialStars = store.getState('stars');
    store.setState({ stars: initialStars + 10 });
    expect(store.getState('stars')).toBe(initialStars + 10);
    store.setState({ stars: initialStars });
  });

  it('should update state with key-value', () => {
    const initial = store.getState('theme');
    store.setState('theme', initial === 'dark' ? 'light' : 'dark');
    expect(store.getState('theme')).not.toBe(initial);
    store.setState('theme', initial);
  });

  it('should notify listeners on state change', () => {
    const callback = vi.fn();
    const unsub = store.on('stars', callback);
    
    const initial = store.getState('stars');
    store.setState({ stars: initial + 1 });
    
    expect(callback).toHaveBeenCalled();
    store.setState({ stars: initial });
    unsub();
  });

  it('should support wildcard listener', () => {
    const callback = vi.fn();
    const unsub = store.on('*', callback);
    
    store.setState({ stars: store.getState('stars') + 1 });
    expect(callback).toHaveBeenCalled();
    
    store.setState({ stars: store.getState('stars') - 1 });
    unsub();
  });

  it('should unsubscribe listener', () => {
    const callback = vi.fn();
    const unsub = store.on('stars', callback);
    unsub();
    
    store.setState({ stars: store.getState('stars') + 1 });
    expect(callback).not.toHaveBeenCalled();
    store.setState({ stars: store.getState('stars') - 1 });
  });

  it('should persist to localStorage', () => {
    store.setState({ stars: 42 });
    expect(localStorage.getItem('pv-stars')).toBe('42');
    store.setState({ stars: 0 });
  });

  it('should hydrate from localStorage', () => {
    localStorage.setItem('pv-stars', '99');
    store.hydrate();
    expect(store.getState('stars')).toBe(99);
    store.setState({ stars: 0 });
  });
});
