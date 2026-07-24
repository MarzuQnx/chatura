/**
 * Motion Engine Preset — counter
 * Numeric counter tick animation for stats and metrics.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const counterPreset = {
  name: 'counter',
  category: 'reveal',
  properties: ['numericTextValue'],
  defaults: {
    duration: MotionTokens.duration.slow,
    ease: MotionTokens.ease.easeOut
  },

  compile(options = {}) {
    return {
      type: 'counter',
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease,
      fromValue: options.from || 0,
      toValue: options.to || 100
    };
  }
};
