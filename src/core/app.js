/**
 * Palabras Vivas 2.0 - Core Application
 * Inicialización de la aplicación
 */

// Estilos
import '../styles/index.css';

// Datos
import { categories as wordCategories, getWordsForCategory as getWords } from '../data/words.js';

// Componentes
import Header from '../components/layout/Header/Header.js';
import Toast from '../components/core/Toast/Toast.js';

// Screens
import HomeScreen from '../screens/Home/Home.js';
import GameMenuScreen from '../screens/GameMenu/GameMenu.js';
import GameIntroScreen from '../screens/GameIntro/GameIntro.js';
import GamePlayScreen from '../screens/GamePlay/GamePlay.js';

class App {
  constructor() {
    this.state = {
      currentScreen: 'home',
      category: null,
      game: null,
      stars: 0,
      theme: 'dark'
    };
    
    this.header = null;
    this.currentScreenInstance = null;
    this.mainContent = null;
    this.isTransitioning = false;
    this.init();
  }

  async init() {
    console.log('Palabras Vivas 2.0 initializing...');
    
    // Eliminar pantalla de carga
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.remove();
    }
    
    // Cargar datos guardados
    this.loadSavedData();
    
    // Cargar tema guardado
    this.loadTheme();
    
    // Inicializar Header
    this.initHeader();
    
    // Crear main content container
    this.createMainContent();
    
    // Renderizar pantalla inicial
    this.renderScreen('home');
    
    // Toast de bienvenida
    setTimeout(() => {
      Toast.info('¡Bienvenido a Palabras Vivas!');
    }, 1000);
    
    console.log('Palabras Vivas 2.0 initialized');
  }

  loadSavedData() {
    // Cargar estrellas guardadas
    const savedStars = localStorage.getItem('pv-stars');
    if (savedStars) {
      this.state.stars = parseInt(savedStars, 10) || 0;
    }
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
      logo: './logo.png',
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

  createMainContent() {
    const app = document.getElementById('app');
    this.mainContent = document.createElement('main');
    this.mainContent.id = 'main-content';
    this.mainContent.className = 'main-content';
    app.appendChild(this.mainContent);
  }

  renderScreen(screenName, options = {}) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const transitionDuration = 200;

    // Unmount current screen
    if (this.currentScreenInstance) {
      if (typeof this.currentScreenInstance.unmount === 'function') {
        this.currentScreenInstance.unmount();
      } else if (typeof this.currentScreenInstance.destroy === 'function') {
        this.currentScreenInstance.destroy();
      }
    }

    // Wait for exit animation, then render new screen
    const renderNewScreen = () => {
      // Clear main content
      this.mainContent.innerHTML = '';

      // Create new screen
      switch (screenName) {
        case 'home':
          this.currentScreenInstance = new HomeScreen({
            onCategorySelect: (categoryId) => this.selectCategory(categoryId)
          });
          break;

        case 'gameMenu':
          this.currentScreenInstance = new GameMenuScreen({
            category: options.category,
            onGameSelect: (gameId) => this.selectGame(gameId),
            onBack: () => this.goBack()
          });
          break;

        case 'gameIntro':
          this.currentScreenInstance = new GameIntroScreen({
            gameId: options.gameId,
            category: options.category,
            onStart: (gameId, category) => this.startGame(gameId, category),
            onBack: () => this.goBack()
          });
          break;

        case 'gamePlay':
          this.currentScreenInstance = new GamePlayScreen(this);
          break;

        default:
          this.currentScreenInstance = new HomeScreen({
            onCategorySelect: (categoryId) => this.selectCategory(categoryId)
          });
      }

      // Render and mount
      const element = this.currentScreenInstance.render();
      if (element) {
        if (typeof this.currentScreenInstance.mount === 'function') {
          this.currentScreenInstance.mount(this.mainContent);
        } else {
          this.mainContent.appendChild(element);
        }
      }

      // Update state
      this.state.currentScreen = screenName;

      // Update header
      this.header.setStars(this.state.stars);
      this.updateHeaderForScreen(screenName);

      this.isTransitioning = false;
    };

    // If there's a current screen, animate out then render new
    if (this.currentScreenInstance && this.mainContent.children.length > 0) {
      this.mainContent.classList.add('screen--exiting');
      setTimeout(() => {
        this.mainContent.classList.remove('screen--exiting');
        renderNewScreen();
      }, transitionDuration);
    } else {
      renderNewScreen();
    }
  }

  updateHeaderForScreen(screenName) {
    switch (screenName) {
      case 'home':
        this.header.setBackButton(false);
        this.header.show();
        break;
      case 'gameMenu':
        this.header.setBackButton(true);
        this.header.show();
        break;
      case 'gameIntro':
        this.header.setBackButton(true);
        this.header.show();
        break;
      case 'gamePlay':
        this.header.hide();
        break;
      default:
        this.header.setBackButton(false);
        this.header.show();
    }
  }

  selectCategory(categoryId) {
    this.state.category = categoryId;
    this.renderScreen('gameMenu', { category: categoryId });
  }

  selectGame(gameId) {
    this.state.game = gameId;
    this.renderScreen('gameIntro', { 
      gameId: gameId, 
      category: this.state.category 
    });
  }

  startGame(gameId, category) {
    this.renderScreen('gamePlay');
    
    // Initialize game after screen is rendered and transition completes (200ms exit + buffer)
    setTimeout(() => {
      if (this.currentScreenInstance && typeof this.currentScreenInstance.init === 'function') {
        this.currentScreenInstance.init(gameId, category);
      }
    }, 350);
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
      case 'gamePlay':
        if (this.currentScreenInstance && typeof this.currentScreenInstance.destroy === 'function') {
          this.currentScreenInstance.destroy();
        }
        this.renderScreen('gameIntro', { 
          gameId: this.state.game, 
          category: this.state.category 
        });
        break;
      default:
        this.renderScreen('home');
    }
  }

  navigateTo(screen, options = {}) {
    this.renderScreen(screen, options);
  }

  showToast(message, type = 'info') {
    if (type === 'success') {
      Toast.success(message);
    } else if (type === 'error') {
      Toast.error(message);
    } else if (type === 'warning') {
      Toast.warning(message);
    } else {
      Toast.info(message);
    }
  }

  saveGameResult(result) {
    const savedResults = JSON.parse(localStorage.getItem('pv-game-results') || '[]');
    savedResults.push({
      ...result,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pv-game-results', JSON.stringify(savedResults));

    this.state.stars += result.stars;
    this.header.setStars(this.state.stars);
    localStorage.setItem('pv-stars', this.state.stars.toString());
  }

  getWordsForCategory(category) {
    return getWords(category);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
