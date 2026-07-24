/**
 * Motion Engine — Single Scroll & Viewport Observer
 * Unified IntersectionObserver Hub. Prevents duplicate scroll listeners.
 * Ignores elements tagged with data-motion-legacy="true".
 */

export class MotionObserver {
  constructor(options = {}) {
    this.callbacks = new Map();
    this.observer = null;
    this.options = {
      root: null,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
      threshold: options.threshold || 0.15
    };
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Skip legacy marked elements
          if (target.getAttribute('data-motion-legacy') === 'true') {
            return;
          }

          const callback = this.callbacks.get(target);
          if (callback) {
            callback(entry);
          }
        }
      });
    }, this.options);
  }

  observe(element, callback) {
    if (!element || !this.observer) return;
    if (element.getAttribute('data-motion-legacy') === 'true') {
      return; // Do not observe legacy elements side-by-side
    }
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element) {
    if (!element || !this.observer) return;
    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
    }
  }
}
