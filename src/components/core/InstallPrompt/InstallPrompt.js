import './InstallPrompt.css';

class InstallPrompt {
  constructor() {
    this.deferredPrompt = null;
    this.element = null;
    this.isDismissed = false;
    this.dismissKey = 'install-prompt-dismissed';
  }

  init() {
    if (localStorage.getItem(this.dismissKey)) {
      this.isDismissed = true;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (!this.isDismissed) {
        this.show();
      }
    });

    window.addEventListener('appinstalled', () => {
      this.hide();
      this.deferredPrompt = null;
    });
  }

  show() {
    if (this.element) return;

    this.element = document.createElement('div');
    this.element.className = 'install-prompt';
    this.element.innerHTML = `
      <div class="install-prompt__content">
        <div class="install-prompt__icon">
          <i class="fa-solid fa-download"></i>
        </div>
        <div class="install-prompt__text">
          <span class="install-prompt__title">Instalar Palabras Vivas</span>
          <span class="install-prompt__subtitle">Juega sin internet</span>
        </div>
        <button class="install-prompt__btn" aria-label="Instalar aplicación">
          Instalar
        </button>
        <button class="install-prompt__close" aria-label="Cerrar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;

    document.body.appendChild(this.element);

    this.element.querySelector('.install-prompt__btn').addEventListener('click', () => {
      this.install();
    });

    this.element.querySelector('.install-prompt__close').addEventListener('click', () => {
      this.dismiss();
    });

    requestAnimationFrame(() => {
      this.element.classList.add('install-prompt--visible');
    });
  }

  hide() {
    if (!this.element) return;
    this.element.classList.remove('install-prompt--visible');
    setTimeout(() => {
      this.element?.remove();
      this.element = null;
    }, 300);
  }

  async install() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.hide();
    }
    this.deferredPrompt = null;
  }

  dismiss() {
    this.isDismissed = true;
    localStorage.setItem(this.dismissKey, 'true');
    this.hide();
  }
}

export default new InstallPrompt();
