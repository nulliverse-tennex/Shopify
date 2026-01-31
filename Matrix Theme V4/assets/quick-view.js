/** MATRIX TERMINAL — <quick-view-modal> */
class QuickViewModal extends HTMLElement {
  connectedCallback() {
    this._p = this.querySelector('.quick-view__panel');
    this._c = this.querySelector('[data-quick-view-content]');
    this._fl = this.querySelector('[data-quick-view-full-link]');
    this._pf = null; this._fe = null; this._f1 = null; this._f2 = null; this._o = false;
    var s = this;
    this.querySelectorAll('[data-quick-view-close]').forEach(function(el) {
      el.addEventListener('click', function() { s.close(); });
    });
    document.addEventListener('keydown', function(e) { s._key(e); });
    document.addEventListener('quick-view:open', function(e) {
      if (e.detail && e.detail.productUrl) s.open(e.detail.productUrl);
    });
  }
  open(url) {
    if (this._o) return;
    this._o = true;
    this._pf = document.activeElement;
    this.hidden = false;
    if (typeof lockScroll === 'function') lockScroll();
    this._c.innerHTML = '<div class="quick-view__loader"><span class="quick-view__loader-text">LOADING_</span></div>';
    this._fl.href = url;
    var s = this;
    fetch(url + '?section_id=product-template')
      .then(function(r) { if (!r.ok) throw new Error('fail'); return r.text(); })
      .then(function(h) { s._inject(h); })
      .catch(function() {
        s._c.innerHTML = '<p style="color:var(--color-error);text-align:center;padding:2rem">Error. <a href="' + url + '">View product</a></p>';
      });
  }
  close() {
    if (!this._o) return;
    this._o = false; this.hidden = true;
    if (typeof unlockScroll === 'function') unlockScroll();
    this._c.innerHTML = '';
    if (this._pf) { this._pf.focus(); this._pf = null; }
  }
  _inject(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var sec = doc.querySelector('.product-section') || doc.querySelector('.product-template-section');
    if (!sec) return;
    this._c.innerHTML = '';
    this._c.appendChild(document.importNode(sec, true));
    this._c.querySelectorAll('script[src]').forEach(function(x) { x.remove(); });
    var j = this._c.querySelector('[data-product-json]');
    if (j) try { this._form(JSON.parse(j.textContent)); } catch(e) {}
    this._trap();
    if (this._f1) this._f1.focus();
  }
  _form(prod) {
    if (!prod || !prod.variants) return;
    var ct = this._c, fm = ct.querySelector('[data-product-form]');
    if (!fm) return;
    var vid = fm.querySelector('[data-variant-id]');
    fm.querySelectorAll('[data-option-index]').forEach(function(r) {
      r.addEventListener('change', function() {
        var sel = [];
        fm.querySelectorAll('.product-option').forEach(function(fs) {
          var c = fs.querySelector('input[type="radio"]:checked');
          if (c) sel.push(c.value);
        });
        var m = prod.variants.find(function(v) {
          return v.options.every(function(o, i) { return o === sel[i]; });
        });
        if (m && vid) {
          vid.value = m.id;
          var b = fm.querySelector('[data-add-to-cart]');
          if (b) { b.disabled = !m.available; b.textContent = m.available ? 'Add to Cart' : 'Sold Out'; }
          var p = ct.querySelector('[data-price]');
          if (p && typeof formatMoney === 'function') p.textContent = formatMoney(m.price);
        }
      });
    });
    fm.addEventListener('submit', function(e) {
      e.preventDefault();
      var id = parseInt(vid.value, 10);
      if (!id) return;
      var b = fm.querySelector('[data-add-to-cart]');
      if (b) b.disabled = true;
      var rt = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      fetch(rt + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ items: [{ id: id, quantity: 1 }] })
      }).then(function(r) {
        if (!r.ok) return r.json().then(function(d) { throw new Error(d.description || 'Error'); });
        return r.json();
      }).then(function(d) {
        if (b) b.disabled = false;
        document.dispatchEvent(new CustomEvent('cart:item-added', { detail: { items: d.items || d } }));
      }).catch(function(err) {
        if (b) b.disabled = false;
        var el = fm.querySelector('[data-form-error]');
        if (el) { el.textContent = err.message; el.hidden = false; }
      });
    });
  }
  _trap() {
    if (!this._p) return;
    this._fe = this._p.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if (this._fe.length) { this._f1 = this._fe[0]; this._f2 = this._fe[this._fe.length - 1]; }
  }
  _key(e) {
    if (!this._o) return;
    if (e.key === 'Escape') { this.close(); return; }
    if (e.key === 'Tab' && this._fe && this._fe.length) {
      if (e.shiftKey) {
        if (document.activeElement === this._f1) { e.preventDefault(); this._f2.focus(); }
      } else {
        if (document.activeElement === this._f2) { e.preventDefault(); this._f1.focus(); }
      }
    }
  }
}
customElements.define('quick-view-modal', QuickViewModal);
