/**
 * Motion Engine Preset — marquee
 * Continuous ticker animation for logo tickers and partner lists.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const marqueePreset = {
  name: 'marquee',
  category: 'floating',
  properties: ['marqueeX'],
  defaults: {
    speed: 50, // px per second
    direction: 'left'
  },

  compile(options = {}) {
    return {
      type: 'marquee',
      speed: options.speed || this.defaults.speed,
      direction: options.direction || this.defaults.direction
    };
  }
};
