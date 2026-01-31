class CollectionFilters extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('[data-filters-form]');
    if (!this.form) return;
    
    this.debouncedSubmit = this.debounce(this.onSubmit.bind(this), 500);
    this.bindEvents();
  }

  bindEvents() {
    this.form.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', this.onSubmit.bind(this));
    });
    
    this.form.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('input', this.debouncedSubmit);
    });
    
    this.querySelectorAll('[data-filter-remove]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyFilter(link.href);
      });
    });
  }

  onSubmit(event) {
    if (event) event.preventDefault();
    
    const formData = new FormData(this.form);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
      if (value) params.append(key, value);
    }
    
    const url = `${window.location.pathname}?${params.toString()}`;
    this.applyFilter(url);
  }

  applyFilter(url) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const newFilters = doc.querySelector('collection-filters');
        const newGrid = doc.querySelector('[data-collection-grid]');
        const newPagination = doc.querySelector('[data-pagination]');
        
        if (newFilters) this.innerHTML = newFilters.innerHTML;
        if (newGrid) {
          const currentGrid = document.querySelector('[data-collection-grid]');
          if (currentGrid) currentGrid.innerHTML = newGrid.innerHTML;
        }
        if (newPagination) {
          const currentPagination = document.querySelector('[data-pagination]');
          if (currentPagination) currentPagination.innerHTML = newPagination.innerHTML;
        }
        
        this.bindEvents();
        history.pushState({}, '', url);
      });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

customElements.define('collection-filters', CollectionFilters);
