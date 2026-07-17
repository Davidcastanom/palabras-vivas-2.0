/**
 * Centralized State Store for Palabras Vivas 2.0
 * Simple pub/sub state management
 */
class Store {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Map();
    this.middleware = [];
  }

  /**
   * Get current state (read-only copy)
   * @param {string} key - Optional key to get specific slice
   * @returns {Object}
   */
  getState(key) {
    if (key) {
      return this.state[key];
    }
    return { ...this.state };
  }

  /**
   * Update state
   * @param {Object|string} updates - Key-value pairs or single key
   * @param {*} value - Value if key is string
   */
  setState(updates, value) {
    let newSlice;
    
    if (typeof updates === 'string') {
      newSlice = { [updates]: value };
    } else {
      newSlice = updates;
    }

    const prevState = { ...this.state };
    Object.assign(this.state, newSlice);

    // Run middleware
    this.middleware.forEach(fn => fn(this.state, prevState));

    // Notify listeners
    Object.keys(newSlice).forEach(key => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).forEach(fn => {
          fn(this.state[key], prevState[key]);
        });
      }
    });

    // Notify wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(fn => {
        fn(this.state, prevState);
      });
    }

    // Persist to localStorage
    this.persist();
  }

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch (or '*' for all)
   * @param {Function} callback - Called with (newValue, oldValue)
   * @returns {Function} Unsubscribe function
   */
  on(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    return () => {
      this.listeners.get(key).delete(callback);
    };
  }

  /**
   * Add middleware function
   * @param {Function} fn - (newState, prevState) => void
   */
  use(fn) {
    this.middleware.push(fn);
  }

  /**
   * Persist relevant state to localStorage
   */
  persist() {
    try {
      localStorage.setItem('pv-stars', String(this.state.stars));
      localStorage.setItem('pv-theme', this.state.theme);
    } catch (e) {
      console.warn('Failed to persist state:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  hydrate() {
    try {
      const stars = localStorage.getItem('pv-stars');
      const theme = localStorage.getItem('pv-theme');
      
      if (stars !== null) this.state.stars = parseInt(stars, 10) || 0;
      if (theme !== null) this.state.theme = theme;
    } catch (e) {
      console.warn('Failed to hydrate state:', e);
    }
  }

  /**
   * Reset state to initial values
   */
  reset() {
    const initialState = { ...this.state };
    this.state = {
      currentScreen: 'home',
      category: null,
      game: null,
      stars: 0,
      theme: 'dark'
    };
    this.persist();
    
    // Notify all listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(fn => {
        fn(this.state, initialState);
      });
    }
  }
}

// Create singleton store
const store = new Store({
  currentScreen: 'home',
  category: null,
  game: null,
  stars: 0,
  theme: 'dark'
});

// Hydrate from localStorage
store.hydrate();

export default store;
