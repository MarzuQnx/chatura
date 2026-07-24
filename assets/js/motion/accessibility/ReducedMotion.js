/**
 * Motion Engine — Reduced Motion Manager
 * Evaluates prefers-reduced-motion media queries and enforces accessibility standards.
 */

export class ReducedMotion {
  constructor() {
    this.mediaQuery = typeof window !== 'undefined' && window.matchMedia 
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    this.listeners = new Set();

    if (this.mediaQuery) {
      this.mediaQuery.addEventListener('change', (e) => {
        this.notify(e.matches);
      });
    }
  }

  isReduced() {
    return this.mediaQuery ? this.mediaQuery.matches : false;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(matches) {
    this.listeners.forEach(cb => cb(matches));
  }

  /**
   * Sanitizes keyframes/styles for reduced motion preference while keeping element 100% visible
   */
  sanitizeKeyframes(keyframes) {
    if (!this.isReduced()) return keyframes;
    
    // Copy keyframes without large translations, rotation, or infinite float
    const sanitized = { ...keyframes };
    delete sanitized.transform;
    delete sanitized.translate;
    delete sanitized.rotate;
    delete sanitized.filter;
    sanitized.opacity = 1;
    sanitized.duration = 0; // instant reveal
    return sanitized;
  }
}

export const reducedMotion = new ReducedMotion();
