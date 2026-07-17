/**
 * Palabras Vivas 2.0 - Core Application
 * Inicialización de la aplicación
 */

// Estilos
import '../styles/index.css';

class App {
  constructor() {
    this.state = {
      currentScreen: 'home',
      category: null,
      game: null,
      stars: 0,
      theme: 'dark'
    };
    
    this.init();
  }

  async init() {
    console.log('Palabras Vivas 2.0 initializing...');
    
    // Cargar tema guardado
    this.loadTheme();
    
    // Renderizar pantalla inicial
    this.render();
    
    console.log('Palabras Vivas 2.0 initialized');
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('pv-theme');
    if (savedTheme) {
      this.state.theme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.state.theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pv-theme', newTheme);
  }

  render() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
      <div class="min-h-screen bg-primary">
        <!-- Header -->
        <header class="header">
          <div class="header-content">
            <div class="header-logo">
              <img src="/logo.png" alt="Palabras Vivas" width="40" height="40">
              <span class="font-display text-lg hidden sm:block">Palabras Vivas</span>
            </div>
            
            <div class="flex items-center gap-md">
              <div class="star-counter flex items-center gap-sm p-sm rounded-full bg-elevated">
                <i class="fa-solid fa-star text-accent"></i>
                <span class="font-heading font-bold">${this.state.stars}</span>
              </div>
              
              <button class="theme-toggle" onclick="window.app.toggleTheme()">
                <i class="fa-solid ${this.state.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
          <div class="container">
            <div class="section text-center">
              <h1 class="mb-md">¡Elige un mundo!</h1>
              <p class="text-secondary mb-xl">Aprende jugando con palabras increíbles</p>
              
              <div class="grid grid-2 lg:grid-4 gap-md max-w-4xl mx-auto stagger-children">
                ${this.renderCategories()}
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  renderCategories() {
    const categories = [
      { id: 'animals', name: 'Animales', icon: 'fa-paw', color: 'var(--color-category-animals)' },
      { id: 'fruits', name: 'Frutas', icon: 'fa-apple-whole', color: 'var(--color-category-fruits)' },
      { id: 'colors', name: 'Colores', icon: 'fa-palette', color: 'var(--color-category-colors)' },
      { id: 'shapes', name: 'Formas', icon: 'fa-shapes', color: 'var(--color-category-shapes)' },
      { id: 'clothes', name: 'Ropa', icon: 'fa-shirt', color: 'var(--color-category-clothes)' }
    ];

    return categories.map(cat => `
      <button 
        class="card hover-lift hover-glow cursor-pointer text-center p-lg"
        onclick="window.app.selectCategory('${cat.id}')"
        style="border-left: 4px solid ${cat.color}"
      >
        <i class="fa-solid ${cat.icon} text-4xl mb-md" style="color: ${cat.color}"></i>
        <h4>${cat.name}</h4>
      </button>
    `).join('');
  }

  selectCategory(categoryId) {
    this.state.category = categoryId;
    this.state.currentScreen = 'gameMenu';
    this.render();
    console.log('Category selected:', categoryId);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
