/**
 * MATRIX TERMINAL — Theme JavaScript
 * Web Components + Cart API integration
 */

/* ============================================================
   1. MOBILE MENU — <mobile-menu> Web Component
   ============================================================ */

class MobileMenu extends HTMLElement {
  constructor() {
    super();
    this.toggle = this.querySelector('[data-menu-toggle]');
    this.menu = this.querySelector('[data-menu]');
    this.overlay = this.querySelector('[data-menu-overlay]');
    this.closeBtn = this.querySelector('[data-menu-close]');
    this.isOpen = false;
    this.focusableElements = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  connectedCallback() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMenu());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeMenu());
    }
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.menu.classList.add('active');
    if (this.overlay) this.overlay.classList.add('active');
    document.body.classList.add('menu-open');
    this.toggle.setAttribute('aria-expanded', 'true');

    this.focusableElements = this.menu.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (this.focusableElements.length > 0) {
      this.firstFocusable = this.focusableElements[0];
      this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
      this.firstFocusable.focus();
    }
  }

  closeMenu() {
    this.isOpen = false;
    this.menu.classList.remove('active');
    if (this.overlay) this.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.focus();
  }

  handleKeydown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape') {
      this.closeMenu();
      return;
    }

    if (e.key === 'Tab' && this.focusableElements && this.focusableElements.length > 0) {
      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }
  }
}

customElements.define('mobile-menu', MobileMenu);


/* ============================================================
   2. MONEY FORMATTING
   ============================================================ */

/**
 * Format cents into a money string using the shop's money_format.
 * Reads window.Shopify.moneyFormat injected by theme.liquid.
 * Supports {{amount}}, {{amount_no_decimals}}, {{amount_with_comma_separator}},
 * {{amount_no_decimals_with_comma_separator}}, {{amount_with_apostrophe_separator}}.
 */
function formatMoney(cents) {
  if (typeof cents === 'string') cents = cents.replace('.', '');
  cents = parseInt(cents, 10) || 0;

  var format = (window.Shopify && window.Shopify.moneyFormat) ? window.Shopify.moneyFormat : '${{amount}}';
  var amount = (cents / 100).toFixed(2);
  var amountNoDecimals = Math.round(cents / 100).toString();
  var amountWithComma = amount.replace('.', ',');
  var amountNoDecimalsWithComma = amountNoDecimals.replace(/(\d)(?=(\d{3})+$)/g, '$1.');
  var amountWithApostrophe = amount.replace(/(\d)(?=(\d{3})+\.)/g, "$1'");

  return format
    .replace('{{amount_with_apostrophe_separator}}', amountWithApostrophe)
    .replace('{{amount_no_decimals_with_comma_separator}}', amountNoDecimalsWithComma)
    .replace('{{amount_with_comma_separator}}', amountWithComma)
    .replace('{{amount_no_decimals}}', amountNoDecimals)
    .replace('{{amount}}', amount);
}


/* ============================================================
   3. SCROLL LOCK UTILITY
   ============================================================ */

var scrollLockCount = 0;

function lockScroll() {
  scrollLockCount++;
  if (scrollLockCount === 1) {
    document.body.style.overflow = 'hidden';
  }
}

function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = '';
  }
}


/* ============================================================
   4. CART FUNCTIONALITY
   ============================================================ */

class CartManager {
  constructor() {
    this.rootUrl = window.Shopify && window.Shopify.routes && window.Shopify.routes.root
      ? window.Shopify.routes.root
      : '/';
    this.cartSectionId = 'cart-template';
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('[data-quantity-minus]');
      if (minusBtn) {
        e.preventDefault();
        const key = minusBtn.dataset.lineKey;
        const input = minusBtn.closest('.quantity-selector').querySelector('[data-quantity-input]');
        const newQty = Math.max(0, parseInt(input.value, 10) - 1);
        this.updateQuantity(key, newQty);
        return;
      }

      const plusBtn = e.target.closest('[data-quantity-plus]');
      if (plusBtn) {
        e.preventDefault();
        const key = plusBtn.dataset.lineKey;
        const input = plusBtn.closest('.quantity-selector').querySelector('[data-quantity-input]');
        const newQty = parseInt(input.value, 10) + 1;
        this.updateQuantity(key, newQty);
        return;
      }

      const removeBtn = e.target.closest('[data-remove-item]');
      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.lineKey;
        this.updateQuantity(key, 0);
        return;
      }
    });

    document.addEventListener('change', (e) => {
      const input = e.target.closest('[data-quantity-input]');
      if (input) {
        const key = input.dataset.lineKey;
        const newQty = Math.max(0, parseInt(input.value, 10) || 0);
        this.updateQuantity(key, newQty);
      }
    });
  }

  async updateQuantity(lineKey, quantity) {
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
      cartSection.style.opacity = '0.5';
      cartSection.style.pointerEvents = 'none';
    }

    try {
      const response = await fetch(`${this.rootUrl}cart/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: lineKey,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error(`Cart update failed: ${response.status}`);
      }

      const cart = await response.json();

      this.updateCartCount(cart.item_count);

      document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cart } }));

      await this.refreshCartSection();

    } catch (error) {
      console.error('[CART] Update error:', error);
      if (cartSection) {
        cartSection.style.opacity = '1';
        cartSection.style.pointerEvents = '';
      }
    }
  }

  async refreshCartSection() {
    try {
      const response = await fetch(`${this.rootUrl}?sections=${this.cartSectionId}`);
      if (!response.ok) throw new Error('Section render failed');

      const data = await response.json();
      const html = data[this.cartSectionId];

      if (html) {
        const cartContainer = document.getElementById('cart-section');
        if (cartContainer) {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          const newContent = temp.querySelector('#cart-section');
          if (newContent) {
            cartContainer.replaceWith(newContent);
          } else {
            cartContainer.outerHTML = html;
          }
        }
      }
    } catch (error) {
      console.error('[CART] Section refresh error:', error);
      window.location.reload();
    }
  }

  addItemAdded(items) {
    document.dispatchEvent(new CustomEvent('cart:item-added', { detail: { items: items } }));
  }

  updateCartCount(count) {
    const badges = document.querySelectorAll('[data-cart-count]');
    badges.forEach((badge) => {
      badge.textContent = count;
      badge.setAttribute('aria-label', `${count} items in cart`);
      if (count > 0) {
        badge.removeAttribute('hidden');
      } else {
        badge.setAttribute('hidden', '');
      }
    });
  }
}


/* ============================================================
   5. TYPEWRITER EFFECT
   ============================================================ */

function initTypewriter() {
  var el = document.querySelector('.typewriter');
  if (!el) return;

  var text = el.getAttribute('data-text');
  if (!text) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text;
    el.classList.add('typewriter--done');
    return;
  }

  el.textContent = '';
  el.classList.add('typewriter--typing');
  var i = 0;
  var delay = 80;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, delay);
    } else {
      el.classList.remove('typewriter--typing');
      el.classList.add('typewriter--done');
    }
  }

  type();
}


/* ============================================================
   6. INITIALIZATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
  initTypewriter();
});
