/**
 * Motion Engine Preset — navbar
 * Header stickiness, elevation elevation-shadow shift, and glass transparency reveal.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const navbarPreset = {
  name: 'navbar',
  category: 'reveal',
  properties: ['navY', 'navOpacity'],
  defaults: {
    duration: MotionTokens.duration.fast,
    ease: MotionTokens.ease.easeInOut
  },

  compile(options = {}) {
    return {
      opacity: 1,
      transform: 'translateY(0px)',
      from: {
        opacity: 0,
        transform: 'translateY(-100%)'
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
