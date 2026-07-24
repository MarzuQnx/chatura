/**
 * Motion Engine Preset — parallax
 * Smooth viewport parallax movement bound to scroll position.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const parallaxPreset = {
  name: 'parallax',
  category: 'reveal',
  properties: ['parallaxOffsetY'],
  defaults: {
    speed: 0.2
  },

  compile(options = {}) {
    const speed = options.speed || this.defaults.speed;
    return {
      type: 'scroll-driven',
      speed: speed,
      transform: 'translateY(var(--parallax-y, 0px))'
    };
  }
};
