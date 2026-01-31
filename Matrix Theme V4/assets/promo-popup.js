class PromoPopup extends HTMLElement {
  constructor() {
    super();
    this.popup = document.querySelector('[data-promo-popup]');
    this.overlay = document.querySelector('[data-promo-popup-overlay]');
    if (!this.popup || !this.overlay) return;

    this.storageKey = 'matrix-promo-popup-dismissed';
    this.delay = parseInt(document.body.dataset.popupDelay || '5') * 1000;
    
    if (this.isDismissed() || this.isPasswordPage()) {
      return;
    }

    setTimeout(() => this.open(), this.delay);
    this.bindEvents();
  }

  bindEvents() {
    const closeBtns = document.querySelectorAll('[data-promo-popup-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.overlay.addEventListener('click', () => this.close());
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.popup.hidden) {
        this.close();
      }
    });

    this.setupFocusTrap();
  }

  open() {
    this.popup.hidden = false;
    this.overlay.hidden = false;
    
    if (typeof lockScroll === 'function') {
      lockScroll();
    }

    const firstFocusable = this.popup.querySelector('input, button');
    if (firstFocusable) firstFocusable.focus();
  }

  close() {
    this.popup.hidden = true;
    this.overlay.hidden = true;
    
    if (typeof unlockScroll === 'function') {
      unlockScroll();
    }

    const expiryDays = 7;
    const expiryTime = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
    localStorage.setItem(this.storageKey, expiryTime.toString());
  }

  isDismissed() {
    const dismissed = localStorage.getItem(this.storageKey);
    if (!dismissed) return false;
    const expiryTime = parseInt(dismissed, 10);
    if (Date.now() > expiryTime) {
      localStorage.removeItem(this.storageKey);
      return false;
    }
    return true;
  }

  isPasswordPage() {
    return document.body.classList.contains('template-password');
  }

  setupFocusTrap() {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    this.popup.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || this.popup.hidden) return;
      
      const focusable = Array.from(this.popup.querySelectorAll(focusableSelectors));
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];
      
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    });
  }
}

customElements.define('promo-popup', PromoPopup);
