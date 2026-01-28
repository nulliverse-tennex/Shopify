class ProductForm extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('[data-product-form]');
    this.variantIdInput = this.querySelector('[data-variant-id]');
    this.addToCartBtn = this.querySelector('[data-add-to-cart]');
    this.priceContainer = this.closest('.product-info')
      ? this.closest('.product-info').querySelector('[data-product-price]')
      : null;
    this.errorEl = this.querySelector('[data-form-error]');
    this.quantityInput = this.querySelector('[data-quantity-input]');

    var jsonEl = this.querySelector('[data-product-json]');
    if (!jsonEl) return;

    this.product = JSON.parse(jsonEl.textContent);
    this.variants = this.product.variants;
    this.options = [];

    this._bindEvents();
    this._initFromURL();
  }

  _bindEvents() {
    var self = this;
    var radios = this.querySelectorAll('input[type="radio"][data-option-index]');
    radios.forEach(function (radio) {
      radio.addEventListener('change', self._onOptionChange.bind(self));
    });

    if (this.form) {
      this.form.addEventListener('submit', this._onFormSubmit.bind(this));
    }
  }

  _initFromURL() {
    var params = new URLSearchParams(window.location.search);
    var variantId = params.get('variant');
    if (!variantId) return;

    var variant = this.variants.find(function (v) {
      return v.id === parseInt(variantId, 10);
    });
    if (!variant) return;

    var self = this;
    variant.options.forEach(function (optionValue, index) {
      var radio = self.querySelector(
        'input[type="radio"][data-option-index="' + index + '"][value="' + CSS.escape(optionValue) + '"]'
      );
      if (radio) radio.checked = true;
    });

    this._updateVariant(variant);
  }

  _onOptionChange() {
    var selectedOptions = this._getSelectedOptions();
    var variant = this._findVariant(selectedOptions);

    if (variant) {
      this._updateVariant(variant);
    } else {
      this._setUnavailable();
    }
  }

  _getSelectedOptions() {
    var options = [];
    var seen = {};

    this.querySelectorAll('[data-option-index]').forEach(function (input) {
      if (input.type === 'radio' && input.checked) {
        var idx = input.getAttribute('data-option-index');
        if (!seen[idx]) {
          seen[idx] = true;
          options[parseInt(idx, 10)] = input.value;
        }
      }
    });

    return options;
  }

  _findVariant(selectedOptions) {
    return this.variants.find(function (variant) {
      return variant.options.every(function (opt, index) {
        return opt === selectedOptions[index];
      });
    });
  }

  _updateVariant(variant) {
    if (this.variantIdInput) {
      this.variantIdInput.value = variant.id;
    }

    var url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());

    this._updatePrice(variant);
    this._updateButton(variant);
    this._hideError();
  }

  _updatePrice(variant) {
    if (!this.priceContainer) return;

    var formatMoney = function (cents) {
      return '$' + (cents / 100).toFixed(2);
    };

    var html = '';

    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      html =
        '<span class="product-info__compare-price" data-compare-price>' +
        formatMoney(variant.compare_at_price) +
        '</span>' +
        '<span class="product-info__sale-price" data-price>' +
        formatMoney(variant.price) +
        '</span>' +
        '<span class="badge badge--sale">Sale</span>';
    } else {
      html =
        '<span class="product-info__current-price" data-price>' +
        formatMoney(variant.price) +
        '</span>';
    }

    this.priceContainer.innerHTML = html;
  }

  _updateButton(variant) {
    if (!this.addToCartBtn) return;

    if (variant.available) {
      this.addToCartBtn.disabled = false;
      this.addToCartBtn.textContent = 'Add to Cart';
    } else {
      this.addToCartBtn.disabled = true;
      this.addToCartBtn.textContent = 'Sold Out';
    }
  }

  _setUnavailable() {
    if (this.addToCartBtn) {
      this.addToCartBtn.disabled = true;
      this.addToCartBtn.textContent = 'Unavailable';
    }
  }

  _onFormSubmit(event) {
    event.preventDefault();

    if (!this.variantIdInput) return;

    var variantId = parseInt(this.variantIdInput.value, 10);
    var quantity = this.quantityInput ? parseInt(this.quantityInput.value, 10) : 1;

    if (!variantId || isNaN(variantId)) {
      this._showError('Please select a valid variant.');
      return;
    }

    if (quantity < 1) quantity = 1;

    var self = this;
    var btn = this.addToCartBtn;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Adding...';
    }

    this._hideError();

    var cartUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root)
      ? window.Shopify.routes.root + 'cart/add.js'
      : '/cart/add.js';

    fetch(cartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: variantId,
          quantity: quantity
        }]
      })
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error(data.description || data.message || 'Could not add item to cart.');
          });
        }
        return response.json();
      })
      .then(function () {
        window.location.href = '/cart';
      })
      .catch(function (error) {
        self._showError(error.message || 'Something went wrong. Please try again.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Add to Cart';
        }
      });
  }

  _showError(message) {
    if (!this.errorEl) return;
    this.errorEl.textContent = message;
    this.errorEl.hidden = false;
  }

  _hideError() {
    if (!this.errorEl) return;
    this.errorEl.textContent = '';
    this.errorEl.hidden = true;
  }
}

customElements.define('product-form', ProductForm);
