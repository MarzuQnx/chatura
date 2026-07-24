/**
 * Motion Engine — CSS Web Animations API Adapter
 * Standalone fallback renderer when GSAP is unvailable. Zero external dependencies.
 */

export class CSSAdapter {
  constructor() {
    this.name = 'css';
    this.activeAnimations = new Map();
  }

  isSupported() {
    return typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  }

  animate(element, keyframes, options = {}) {
    const duration = options.duration || 400;
    const delay = options.delay || 0;
    const easing = options.ease || 'ease-out';

    // Formulate keyframes object for element.animate()
    const fromState = options.from || {};
    const toState = { ...keyframes };

    const animation = element.animate(
      [fromState, toState],
      {
        duration: duration,
        delay: delay,
        easing: easing,
        fill: 'forwards'
      }
    );

    animation.onfinish = () => {
      // Persist final inline styles
      Object.assign(element.style, toState);
      if (options.onComplete) options.onComplete();
    };

    this.activeAnimations.set(element, animation);
    return animation;
  }

  pause(element) {
    const anim = this.activeAnimations.get(element);
    if (anim) anim.pause();
  }

  resume(element) {
    const anim = this.activeAnimations.get(element);
    if (anim) anim.play();
  }

  restart(element) {
    const anim = this.activeAnimations.get(element);
    if (anim) {
      anim.currentTime = 0;
      anim.play();
    }
  }

  destroy(element) {
    const anim = this.activeAnimations.get(element);
    if (anim) {
      anim.cancel();
      this.activeAnimations.delete(element);
    }
  }
}
