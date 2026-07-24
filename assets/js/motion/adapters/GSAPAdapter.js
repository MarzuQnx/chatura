/**
 * Motion Engine — GSAP Adapter
 * Wraps GSAP timeline & tween execution behind unified engine interface.
 */

export class GSAPAdapter {
  constructor() {
    this.name = 'gsap';
    this.activeTweens = new Map();
  }

  isSupported() {
    return typeof window !== 'undefined' && Boolean(window.gsap);
  }

  animate(element, keyframes, options = {}) {
    if (!this.isSupported()) {
      throw new Error('[GSAPAdapter] GSAP is not available in window context.');
    }

    const gsap = window.gsap;
    const durationSec = (options.duration || 400) / 1000;
    const delaySec = (options.delay || 0) / 1000;

    const tweenVars = {
      ...keyframes,
      duration: durationSec,
      delay: delaySec,
      ease: options.ease || 'power2.out',
      onComplete: () => {
        if (options.onComplete) options.onComplete();
      }
    };

    const tween = gsap.to(element, tweenVars);
    this.activeTweens.set(element, tween);
    return tween;
  }

  pause(element) {
    const tween = this.activeTweens.get(element);
    if (tween) tween.pause();
  }

  resume(element) {
    const tween = this.activeTweens.get(element);
    if (tween) tween.resume();
  }

  restart(element) {
    const tween = this.activeTweens.get(element);
    if (tween) tween.restart();
  }

  destroy(element) {
    const tween = this.activeTweens.get(element);
    if (tween) {
      tween.kill();
      this.activeTweens.delete(element);
    }
  }
}
