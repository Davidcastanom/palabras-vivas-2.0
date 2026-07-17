/**
 * Header Component
 * Navbar responsive con logo, navegación y controles
 */

import './Header.css';

class Header {
  /**
   * @param {Object} options
   * @param {string} options.logo - URL del logo
   * @param {string} options.title - Título de la app
   * @param {number} options.stars - Cantidad de estrellas
   * @param {string} options.theme - Tema actual ('dark' | 'light')
   * @param {Array} options.navItems - Items de navegación [{label, href, active}]
   * @param {boolean} options.showBack - Mostrar botón de regreso
   * @param {Function} options.onBack - Callback del botón de regreso
   * @param {Function} options.onThemeToggle - Callback de cambio de tema
   * @param {Function} options.onMenuToggle - Callback de menú móvil
   * @param {Function} options.onNavClick - Callback de navegación
   */
  constructor(options = {}) {
    this.options = {
      logo: '/logo.png',
      title: 'Palabras Vivas',
      stars: 0,
      level: { name: 'Principiante', icon: 'fa-seedling' },
      theme: 'dark',
      navItems: [],
      showBack: false,
      onBack: null,
      onThemeToggle: null,
      onMenuToggle: null,
      onNavClick: null,
      ...options
    };

    this.element = null;
    this.mobileMenu = null;
    this.isScrolled = false;
    this.isMobileMenuOpen = false;

    this.handleScroll = this.handleScroll.bind(this);
    
    this.render();
    this.initScrollListener();
  }

  render() {
    // Header element
    this.element = document.createElement('header');
    this.element.className = 'header';
    this.element.innerHTML = this.buildHTML();

    // Mobile menu
    this.mobileMenu = this.element.querySelector('.header__mobile-menu');

    // Event listeners
    this.setupEventListeners();
  }

  buildHTML() {
    return `
      <div class="header__container">
        <!-- Left Section -->
        <div class="header__left">
          ${this.options.showBack ? `
            <button class="header__back" aria-label="Volver">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          ` : ''}
          <a href="/" class="header__logo">
            <img src="${this.options.logo}" alt="${this.options.title}" class="header__logo-img" loading="lazy">
            <span class="header__logo-text">${this.options.title}</span>
          </a>
        </div>

        <!-- Center Section (Desktop) -->
        <div class="header__center">
          <nav class="header__nav">
            ${this.buildNavLinks()}
          </nav>
        </div>

        <!-- Right Section -->
        <div class="header__right">
          <!-- Level Badge -->
          <div class="header__level">
            <i class="fa-solid ${this.options.level.icon}"></i>
            <span class="header__level-text">${this.options.level.name}</span>
          </div>

          <!-- Star Counter -->
          <div class="star-counter">
            <i class="star-counter__icon fa-solid fa-star"></i>
            <span class="star-counter__value">${this.options.stars}</span>
          </div>

          <!-- Theme Toggle -->
          <button class="theme-toggle" aria-label="Cambiar tema">
            <i class="fa-solid ${this.options.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
          </button>

          <!-- Menu Toggle (Mobile) -->
          <button class="header__menu-toggle" aria-label="Menú">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="header__mobile-menu">
        <nav class="header__mobile-nav">
          ${this.buildMobileNavLinks()}
        </nav>
      </div>
    `;
  }

  buildNavLinks() {
    return this.options.navItems.map(item => `
      <a href="${item.href}" class="header__nav-link ${item.active ? 'active' : ''}" data-nav="${item.href}">
        ${item.label}
      </a>
    `).join('');
  }

  buildMobileNavLinks() {
    const items = this.options.navItems.length > 0 
      ? this.options.navItems 
      : [
          { label: 'Inicio', href: 'home', icon: 'fa-home' },
          { label: 'Cambiar tema', href: 'theme', icon: 'fa-palette' }
        ];

    return items.map(item => `
      <button class="header__mobile-link ${item.active ? 'active' : ''}" data-nav="${item.href}">
        <i class="fa-solid ${item.icon || 'fa-chevron-right'}"></i>
        ${item.label}
      </button>
    `).join('');
  }

  setupEventListeners() {
    // Back button
    const backBtn = this.element.querySelector('.header__back');
    if (backBtn && this.options.onBack) {
      backBtn.addEventListener('click', this.options.onBack);
    }

    // Theme toggle
    const themeBtn = this.element.querySelector('.theme-toggle');
    if (themeBtn && this.options.onThemeToggle) {
      themeBtn.addEventListener('click', this.options.onThemeToggle);
    }

    // Menu toggle
    const menuBtn = this.element.querySelector('.header__menu-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
        if (this.options.onMenuToggle) {
          this.options.onMenuToggle(this.isMobileMenuOpen);
        }
      });
    }

    // Nav links
    const navLinks = this.element.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.dataset.nav;
        if (this.options.onNavClick) {
          this.options.onNavClick(href);
        }
        this.closeMobileMenu();
      });
    });
  }

  initScrollListener() {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const scrolled = window.scrollY > 50;
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      this.element.classList.toggle('scrolled', scrolled);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.mobileMenu.classList.toggle('open', this.isMobileMenuOpen);
    
    // Update icon
    const icon = this.element.querySelector('.header__menu-toggle i');
    if (icon) {
      icon.className = this.isMobileMenuOpen 
        ? 'fa-solid fa-times' 
        : 'fa-solid fa-bars';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.mobileMenu.classList.remove('open');
    
    const icon = this.element.querySelector('.header__menu-toggle i');
    if (icon) {
      icon.className = 'fa-solid fa-bars';
    }
  }

  // Public methods
  setStars(stars) {
    this.options.stars = stars;
    const valueEl = this.element.querySelector('.star-counter__value');
    if (valueEl) valueEl.textContent = stars;
  }

  setLevel(level) {
    this.options.level = level;
    const icon = this.element.querySelector('.header__level i');
    const text = this.element.querySelector('.header__level-text');
    if (icon) icon.className = `fa-solid ${level.icon}`;
    if (text) text.textContent = level.name;
  }

  setTheme(theme) {
    this.options.theme = theme;
    const icon = this.element.querySelector('.theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  setBackButton(show) {
    this.options.showBack = show;
    const leftSection = this.element.querySelector('.header__left');
    const existingBack = this.element.querySelector('.header__back');
    
    if (show && !existingBack) {
      const backBtn = document.createElement('button');
      backBtn.className = 'header__back';
      backBtn.setAttribute('aria-label', 'Volver');
      backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      if (this.options.onBack) {
        backBtn.addEventListener('click', this.options.onBack);
      }
      leftSection.prepend(backBtn);
    } else if (!show && existingBack) {
      existingBack.remove();
    }
  }

  setActiveNav(href) {
    // Desktop nav
    const desktopLinks = this.element.querySelectorAll('.header__nav-link');
    desktopLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === href);
    });

    // Mobile nav
    const mobileLinks = this.element.querySelectorAll('.header__mobile-link');
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === href);
    });
  }

  show() {
    this.element.style.display = '';
  }

  hide() {
    this.element.style.display = 'none';
  }

  getElement() {
    return this.element;
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default Header;
