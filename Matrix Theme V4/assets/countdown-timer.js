class CountdownTimer extends HTMLElement {
  constructor() {
    super();
    
    const endDate = this.dataset.endDate;
    if (!endDate) return;
    
    this.endTime = new Date(endDate).getTime();
    
    if (isNaN(this.endTime)) {
      console.error('Invalid countdown end date:', endDate);
      return;
    }

    this.elements = {
      days: this.querySelector('[data-countdown-days]'),
      hours: this.querySelector('[data-countdown-hours]'),
      minutes: this.querySelector('[data-countdown-minutes]'),
      seconds: this.querySelector('[data-countdown-seconds]'),
      display: this.querySelector('[data-countdown-display]'),
      expired: this.querySelector('[data-countdown-expired]')
    };

    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = Date.now();
    const distance = this.endTime - now;

    if (distance < 0) {
      this.expire();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.elements.days) this.elements.days.textContent = String(days).padStart(2, '0');
    if (this.elements.hours) this.elements.hours.textContent = String(hours).padStart(2, '0');
    if (this.elements.minutes) this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    if (this.elements.seconds) this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }

  expire() {
    clearInterval(this.intervalId);
    
    if (this.elements.display) this.elements.display.hidden = true;
    if (this.elements.expired) this.elements.expired.hidden = false;

    this.dispatchEvent(new CustomEvent('countdown:expired', {
      bubbles: true,
      detail: { sectionId: this.dataset.sectionId }
    }));
  }

  disconnectedCallback() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

customElements.define('countdown-timer', CountdownTimer);
