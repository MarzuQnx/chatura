/**
 * Motion Engine Preset — hero-reveal
 * Premium staggered hero entrance animation with custom cubic-bezier easing.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const heroRevealPreset = {
  name: 'hero-reveal',
  category: 'reveal',
  properties: ['heroOpacity', 'heroTranslateY', 'heroScale'],
  defaults: {
    duration: MotionTokens.duration.slow,
    distance: MotionTokens.distance.lg,
    ease: MotionTokens.ease.hero
  },

  compile(options = {}) {
    const dist = MotionTokens.resolveResponsive(options.distance || this.defaults.distance);
    return {
      opacity: 1,
      transform: 'translateY(0px) scale(1)',
      from: {
        opacity: 0,
        transform: `translateY(${dist}px) scale(0.98)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
