/**
 * MATRIX TERMINAL — Quick Buy Web Component
 * <quick-buy-button> — Add to cart from collection pages
 */

class QuickBuyButton extends HTMLElement {
  connectedCallback() {
    this._btn = this.querySelector('.quick-buy__btn');
    this._text = this.querySelector('.quick-buy__text');
    this._loader = this.querySelector('.quick-buy__loading');
    this._error = this.querySelector('.quick-buy__error');

    if (this._btn && !this._btn.disabled) {
      this._btn.addEventListener('click', this._handleClick.bind(this));
    }
  }

  _handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var btn = this._btn;
    if (!btn || btn.disabled) return;

    var variantId = btn.dataset.variantId;

    if (variantId) {
      this._addToCart(parseInt(variantId, 10));
    }
  }

  _addToCart(variantId) {
    var self = this;
    this._setLoading(true);
    this._hideError();

    var rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root)
      ? window.Shopify.routes.root : '/';

    fetch(rootUrl + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: 1 }]
      })
    })
      .then(function (resp) {
        if (!resp.ok) {
          return resp.json().then(function (data) {
            throw new Error(data.description || data.message || 'Could not add to cart.');
          });
        }
        return resp.json();
      })
      .then(function (data) {
        self._setLoading(false);
        document.dispatchEvent(new CustomEvent('cart:item-added', {
          detail: { items: data.items || data, variant_id: variantId }
        }));
      })
      .catch(function (err) {
        self._setLoading(false);
        self._showError(err.message || 'Error adding to cart.');
      });
  }

  _setLoading(on) {
    if (!this._btn) return;
    this._btn.disabled = on;
    if (this._text) this._text.hidden = on;
    if (this._loader) this._loader.hidden = !on;
  }

  _showError(msg) {
    if (!this._error) return;
    this._error.textContent = msg;
    this._error.hidden = false;
  }

  _hideError() {
    if (!this._error) return;
    this._error.textContent = '';
    this._error.hidden = true;
  }
}

customElements.define('quick-buy-button', QuickBuyButton);
