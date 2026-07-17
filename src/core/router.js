/**
 * Hash-based Router for Palabras Vivas 2.0
 * Manages navigation via URL hash fragments
 */
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.beforeEach = null;
    this.afterEach = null;
    
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., 'home', 'game/:category/:game')
   * @param {Function} handler - Function to call when route matches
   */
  on(path, handler) {
    this.routes.set(path, { handler, regex: this.pathToRegex(path) });
  }

  /**
   * Navigate to a path
   * @param {string} path - Target path
   */
  navigate(path) {
    window.location.hash = `#/${path}`;
  }

  /**
   * Get current route params
   */
  getParams() {
    if (!this.currentRoute) return {};
    return this.currentRoute.params || {};
  }

  /**
   * Get current path
   */
  getCurrentPath() {
    const hash = window.location.hash.slice(2) || 'home';
    return hash;
  }

  /**
   * Handle hash change event
   */
  async handleHashChange() {
    const path = this.getCurrentPath();
    
    // Run beforeEach guard
    if (this.beforeEach) {
      const shouldContinue = await this.beforeEach(path, this.currentRoute?.path);
      if (!shouldContinue) return;
    }

    // Find matching route
    let matched = null;
    let params = {};

    for (const [pattern, route] of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        matched = route;
        params = this.extractParams(pattern, match);
        break;
      }
    }

    if (matched) {
      this.currentRoute = { path, params };
      matched.handler(params);
    } else {
      // Default to home
      this.navigate('home');
    }

    // Run afterEach hook
    if (this.afterEach) {
      this.afterEach(path);
    }
  }

  /**
   * Convert path pattern to regex
   * e.g., 'game/:category/:game' → /^game\/([^/]+)\/([^/]+)$/
   */
  pathToRegex(path) {
    const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const withParams = escaped.replace(/:([^/]+)/g, '([^/]+)');
    return new RegExp(`^${withParams}$`);
  }

  /**
   * Extract named params from a match
   */
  extractParams(pattern, match) {
    const paramNames = (pattern.match(/:([^/]+)/g) || []).map(p => p.slice(1));
    const params = {};
    paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });
    return params;
  }

  /**
   * Initialize router — trigger current hash
   */
  init() {
    if (!window.location.hash) {
      window.location.hash = '#/home';
    } else {
      this.handleHashChange();
    }
  }

  /**
   * Destroy router
   */
  destroy() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }
}

export default new Router();
