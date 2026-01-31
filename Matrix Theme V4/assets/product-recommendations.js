class ProductRecommendations extends HTMLElement {
  connectedCallback() {
    const productId = this.dataset.productId;
    const sectionId = this.dataset.sectionId;
    const limit = this.dataset.limit || '4';

    if (!productId || !sectionId) return;

    const url = `/recommendations/products?product_id=${productId}&section_id=${sectionId}&limit=${limit}&intent=related`;

    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const products = doc.querySelectorAll('[data-product-item]');

        if (!products.length) {
          this.style.display = 'none';
          return;
        }

        const grid = this.querySelector('[data-recommendations-grid]');
        if (!grid) return;

        products.forEach(product => {
          grid.appendChild(product.cloneNode(true));
        });
      })
      .catch(() => {
        this.style.display = 'none';
      });
  }
}

customElements.define('product-recommendations', ProductRecommendations);
