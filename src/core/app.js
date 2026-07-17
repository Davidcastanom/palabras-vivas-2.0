/**
 * Palabras Vivas 2.0 - Core Application
 * Inicialización de la aplicación
 */

// Estilos
import '../styles/index.css';

// Componentes
import Header from '../components/layout/Header/Header.js';
import Toast from '../components/core/Toast/Toast.js';

// Screens
import HomeScreen from '../screens/Home/Home.js';
import GameMenuScreen from '../screens/GameMenu/GameMenu.js';
import GameIntroScreen from '../screens/GameIntro/GameIntro.js';

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
    this.currentScreenInstance = null;
    this.init();
  }

  async init() {
    console.log('Palabras Vivas 2.0 initializing...');
    
    // Cargar tema guardado
    this.loadTheme();
    
    // Inicializar Header
    this.initHeader();
    
    // Renderizar pantalla inicial
    this.renderScreen('home');
    
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
      showBack: false,
      onBack: () => this.goBack(),
      onThemeToggle: () => this.toggleTheme()
    });

    const app = document.getElementById('app');
    app.prepend(this.header.getElement());
  }

  renderScreen(screenName, options = {}) {
    const app = document.getElementById('app');
    
    // Unmount current screen
    if (this.currentScreenInstance) {
      this.currentScreenInstance.unmount();
    }

    // Get or create main content
    let mainContent = app.querySelector('#main-content');
    if (!mainContent) {
      mainContent = document.createElement('main');
      mainContent.id = 'main-content';
      mainContent.className = 'main-content';
      app.appendChild(mainContent);
    }

    // Clear main content
    mainContent.innerHTML = '';

    // Create new screen
    switch (screenName) {
      case 'home':
        this.currentScreenInstance = new HomeScreen({
          onCategorySelect: (categoryId) => this.selectCategory(categoryId)
        });
        this.header.options.showBack = false;
        break;

      case 'gameMenu':
        this.currentScreenInstance = new GameMenuScreen({
          category: options.category,
          onGameSelect: (gameId) => this.selectGame(gameId),
          onBack: () => this.goBack()
        });
        this.header.options.showBack = true;
        break;

      case 'gameIntro':
        this.currentScreenInstance = new GameIntroScreen({
          gameId: options.gameId,
          category: options.category,
          onStart: (gameId, category) => this.startGame(gameId, category),
          onBack: () => this.goBack()
        });
        this.header.options.showBack = true;
        break;

      default:
        this.currentScreenInstance = new HomeScreen({
          onCategorySelect: (categoryId) => this.selectCategory(categoryId)
        });
    }

    // Mount new screen
    this.currentScreenInstance.mount(mainContent);
    
    // Update state
    this.state.currentScreen = screenName;
    
    // Update header
    this.header.setStars(this.state.stars);
    this.header.show();
  }

  selectCategory(categoryId) {
    this.state.category = categoryId;
    this.renderScreen('gameMenu', { category: categoryId });
    console.log('Category selected:', categoryId);
  }

  selectGame(gameId) {
    this.state.game = gameId;
    this.renderScreen('gameIntro', { 
      gameId: gameId, 
      category: this.state.category 
    });
    console.log('Game selected:', gameId);
  }

  startGame(gameId, category) {
    Toast.info(`Iniciando: ${gameId}`);
    console.log('Starting game:', gameId, 'in category:', category);
    // TODO: Implement GamePlay screen in Phase 5
  }

  goBack() {
    switch (this.state.currentScreen) {
      case 'gameMenu':
        this.state.category = null;
        this.renderScreen('home');
        break;
      case 'gameIntro':
        this.renderScreen('gameMenu', { category: this.state.category });
        break;
      default:
        this.renderScreen('home');
    }
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
