/**
 * MATRIX TERMINAL — Cart Drawer Web Component
 * <cart-drawer> — Slide-out cart panel with bubble variant
 */

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.panel = this.querySelector('[data-drawer-panel]');
    this.overlay = this.querySelector('[data-drawer-overlay]');
    this.closeBtn = this.querySelector('[data-drawer-close]');
    this.checkoutBtn = this.querySelector('[data-drawer-checkout]');
    this.bubble = this.querySelector('[data-drawer-bubble]');
    this.body = this.querySelector('[data-drawer-body]');
    this.isOpen = false;
    this.focusableEls = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.previousFocus = null;
    this.sectionId = 'cart-drawer';
    this.rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root)
      ? window.Shopify.routes.root : '/';
  }

  connectedCallback() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    if (this.bubble) {
      this.bubble.addEventListener('click', () => this.open());
    }

    document.addEventListener('keydown', (e) => this._onKeydown(e));
    document.addEventListener('cart:item-added', () => {
      this.refresh().then(() => this.open());
    });
    document.addEventListener('cart:updated', () => {
      this.refresh();
    });

    document.addEventListener('click', (e) => {
      var trigger = e.target.closest('[data-cart-drawer-open]');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });

    this.addEventListener('click', (e) => {
      var minus = e.target.closest('[data-quantity-minus]');
      if (minus) {
        e.preventDefault();
        e.stopPropagation();
        var key = minus.dataset.lineKey;
        var input = minus.closest('.drawer-item__qty').querySelector('[data-quantity-input]');
        var qty = Math.max(0, parseInt(input.value, 10) - 1);
        this._changeQuantity(key, qty);
        return;
      }

      var plus = e.target.closest('[data-quantity-plus]');
      if (plus) {
        e.preventDefault();
        e.stopPropagation();
        var key2 = plus.dataset.lineKey;
        var input2 = plus.closest('.drawer-item__qty').querySelector('[data-quantity-input]');
        var qty2 = parseInt(input2.value, 10) + 1;
        this._changeQuantity(key2, qty2);
        return;
      }

      var remove = e.target.closest('[data-remove-item]');
      if (remove) {
        e.preventDefault();
        e.stopPropagation();
        this._changeQuantity(remove.dataset.lineKey, 0);
        return;
      }
    });

    this.addEventListener('change', (e) => {
      var input = e.target.closest('[data-quantity-input]');
      if (input) {
        e.stopPropagation();
        var qty = Math.max(0, parseInt(input.value, 10) || 0);
        this._changeQuantity(input.dataset.lineKey, qty);
      }
    });
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.previousFocus = document.activeElement;
    this.classList.add('active');
    this.setAttribute('aria-hidden', 'false');
    if (typeof lockScroll === 'function') lockScroll();
    this._trapFocus();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.classList.remove('active');
    this.setAttribute('aria-hidden', 'true');
    if (typeof unlockScroll === 'function') unlockScroll();
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
  }

  async refresh() {
    try {
      var resp = await fetch(this.rootUrl + '?sections=' + this.sectionId);
      if (!resp.ok) throw new Error('Section fetch failed');
      var data = await resp.json();
      var html = data[this.sectionId];
      if (!html) return;

      var temp = document.createElement('div');
      temp.innerHTML = html;

      var newBody = temp.querySelector('[data-drawer-body]');
      if (newBody && this.body) {
        this.body.innerHTML = newBody.innerHTML;
      }

      var currentFooter = this.panel.querySelector('.cart-drawer__footer');
      var newFooter = temp.querySelector('.cart-drawer__footer');
      if (currentFooter && newFooter) {
        currentFooter.replaceWith(newFooter);
      } else if (!currentFooter && newFooter) {
        this.panel.appendChild(newFooter);
      } else if (currentFooter && !newFooter) {
        currentFooter.remove();
      }

      var newBubble = temp.querySelector('[data-drawer-bubble] [data-cart-count]');
      var curBubble = this.querySelector('[data-drawer-bubble] [data-cart-count]');
      if (newBubble && curBubble) {
        curBubble.textContent = newBubble.textContent;
      }

      var count = temp.querySelector('[data-cart-count]');
      if (count) {
        var c = parseInt(count.textContent, 10) || 0;
        document.querySelectorAll('[data-cart-count]').forEach(function(badge) {
          if (!badge.closest('cart-drawer')) {
            badge.textContent = c;
            badge.setAttribute('aria-label', c + ' items in cart');
            if (c > 0) { badge.removeAttribute('hidden'); }
            else { badge.setAttribute('hidden', ''); }
          }
        });
      }

      if (this.isOpen) this._trapFocus();
    } catch (err) {
      console.error('[CART-DRAWER] Refresh error:', err);
    }
  }

  async _changeQuantity(lineKey, quantity) {
    var item = this.querySelector('[data-line-key="' + lineKey + '"]');
    if (item) {
      item.style.opacity = '0.5';
      item.style.pointerEvents = 'none';
    }

    try {
      var resp = await fetch(this.rootUrl + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: lineKey, quantity: quantity })
      });
      if (!resp.ok) throw new Error('Cart change failed');
      var cart = await resp.json();

      if (typeof window.cartManager !== 'undefined' && window.cartManager.updateCartCount) {
        window.cartManager.updateCartCount(cart.item_count);
      }

      document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cart } }));
    } catch (err) {
      console.error('[CART-DRAWER] Quantity error:', err);
      if (item) {
        item.style.opacity = '1';
        item.style.pointerEvents = '';
      }
    }
  }

  _trapFocus() {
    if (!this.panel) return;
    this.focusableEls = this.panel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (this.focusableEls.length > 0) {
      this.firstFocusable = this.focusableEls[0];
      this.lastFocusable = this.focusableEls[this.focusableEls.length - 1];
      this.firstFocusable.focus();
    }
  }

  _onKeydown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape') {
      this.close();
      return;
    }

    if (e.key === 'Tab' && this.focusableEls && this.focusableEls.length > 0) {
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

customElements.define('cart-drawer', CartDrawer);
