/**
 * Palabras Vivas 2.0 - Core Application
 * Inicialización de la aplicación
 */

// Estilos
import '../styles/index.css';

// Datos
import { getWordsForCategory as getWords } from '../data/words.js';

// Componentes
import Header from '../components/layout/Header/Header.js';
import Toast from '../components/core/Toast/Toast.js';
import Modal from '../components/core/Modal/Modal.js';

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
      level: this.getLevel(),
      theme: this.state.theme,
      showBack: false,
      onBack: () => this.handleHeaderBack(),
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
    const onMounted = options.onMounted || null;

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
            onBack: () => this.goBack(),
            app: this
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
      this.header.setLevel(this.getLevel());
      this.updateHeaderForScreen(screenName);

      this.isTransitioning = false;

      // Fire onMounted callback after screen is ready
      if (onMounted) {
        onMounted();
      }
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
        this.header.setBackButton(true);
        this.header.show();
        break;
      default:
        this.header.setBackButton(false);
        this.header.show();
    }
  }

  async handleHeaderBack() {
    if (this.state.currentScreen === 'gamePlay') {
      const confirmed = await Modal.confirm({
        title: '¿Salir del juego?',
        message: 'Perderás el progreso de esta partida.',
        confirmText: 'Salir',
        cancelText: 'Seguir jugando'
      });
      if (!confirmed) return;
    }
    this.goBack();
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
    this.renderScreen('gamePlay', {
      onMounted: () => {
        if (this.currentScreenInstance && typeof this.currentScreenInstance.init === 'function') {
          this.currentScreenInstance.init(gameId, category);
        }
      }
    });
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
        this.renderScreen('home');
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
    this.header.setLevel(this.getLevel());
    localStorage.setItem('pv-stars', this.state.stars.toString());

    // Save best score per game+category
    this.saveBestScore(result);
  }

  saveBestScore(result) {
    const key = `pv-best-${result.gameId}-${result.category}`;
    const existing = JSON.parse(localStorage.getItem(key) || 'null');

    if (!existing || result.stars > existing.stars || 
        (result.stars === existing.stars && result.score > existing.score)) {
      localStorage.setItem(key, JSON.stringify({
        stars: result.stars,
        score: result.score,
        accuracy: result.accuracy,
        timestamp: new Date().toISOString()
      }));
    }
  }

  getBestScore(gameId, category) {
    const key = `pv-best-${gameId}-${category}`;
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  getLevel() {
    const stars = this.state.stars;
    if (stars >= 100) return { name: 'Maestro', icon: 'fa-crown' };
    if (stars >= 50) return { name: 'Explorador', icon: 'fa-compass' };
    if (stars >= 20) return { name: 'Aprendiz', icon: 'fa-book' };
    return { name: 'Principiante', icon: 'fa-seedling' };
  }

  getWordsForCategory(category) {
    return getWords(category);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
