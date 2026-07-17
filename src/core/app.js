/**
 * Palabras Vivas 2.0 - Core Application
 * Inicialización de la aplicación
 */

// Estilos
import '../styles/index.css';

// Componentes
import Header from '../components/layout/Header/Header.js';
import Toast from '../components/core/Toast/Toast.js';

class App {
  constructor() {
    this.state = {
      currentScreen: 'home',
      category: null,
      game: null,
      stars: 12,
      theme: 'dark'
    };
    
    this.header = null;
    this.init();
  }

  async init() {
    console.log('Palabras Vivas 2.0 initializing...');
    
    // Cargar tema guardado
    this.loadTheme();
    
    // Inicializar Header
    this.initHeader();
    
    // Renderizar contenido
    this.renderContent();
    
    // Toast de bienvenida
    setTimeout(() => {
      Toast.info('¡Bienvenido a Palabras Vivas!');
    }, 1000);
    
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
    
    if (this.header) {
      this.header.setTheme(newTheme);
    }
  }

  initHeader() {
    this.header = new Header({
      logo: '/logo.png',
      title: 'Palabras Vivas',
      stars: this.state.stars,
      theme: this.state.theme,
      showBack: this.state.currentScreen !== 'home',
      onBack: () => this.goBack(),
      onThemeToggle: () => this.toggleTheme(),
      onNavClick: (href) => this.handleNav(href)
    });

    const app = document.getElementById('app');
    app.prepend(this.header.getElement());
  }

  renderContent() {
    const app = document.getElementById('app');
    
    // Create main content
    let mainContent = app.querySelector('.main-content');
    if (!mainContent) {
      mainContent = document.createElement('main');
      mainContent.className = 'main-content';
      app.appendChild(mainContent);
    }

    mainContent.innerHTML = `
      <div class="container">
        <div class="section text-center">
          <h1 class="mb-md animate-fadeInUp">¡Elige un mundo!</h1>
          <p class="body-lg text-secondary mb-xl animate-fadeInUp animation-delay-100">Aprende jugando con palabras increíbles</p>
          
          <div class="grid grid-2 lg:grid-4 gap-lg max-w-4xl mx-auto stagger-children" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            ${this.renderCategories()}
          </div>
        </div>
      </div>
    `;

    // Update header
    if (this.header) {
      this.header.show();
      this.header.setStars(this.state.stars);
    }
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
        class="card card--interactive card--center card--lg"
        onclick="window.app.selectCategory('${cat.id}')"
        style="border-left: 4px solid ${cat.color}; min-height: 160px;"
      >
        <i class="fa-solid ${cat.icon} text-4xl mb-md" style="color: ${cat.color}; font-size: 48px;"></i>
        <h4 class="font-heading">${cat.name}</h4>
      </button>
    `).join('');
  }

  selectCategory(categoryId) {
    this.state.category = categoryId;
    this.state.currentScreen = 'gameMenu';
    
    // Update header
    if (this.header) {
      this.header.options.showBack = true;
    }
    
    this.renderContent();
    Toast.info(`Categoría: ${categoryId}`);
    console.log('Category selected:', categoryId);
  }

  goBack() {
    if (this.state.currentScreen === 'gameMenu') {
      this.state.currentScreen = 'home';
      this.state.category = null;
      
      if (this.header) {
        this.header.options.showBack = false;
      }
      
      this.renderContent();
    }
  }

  handleNav(href) {
    console.log('Navigate to:', href);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
