/**
 * Motion Engine Preset — image-composition
 * Staggered zoom-fade animation for multi-image composition grids.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const imageCompositionPreset = {
  name: 'image-composition',
  category: 'reveal',
  properties: ['imgOpacity', 'imgScale'],
  defaults: {
    duration: MotionTokens.duration.slow,
    ease: MotionTokens.ease.easeOut
  },

  compile(options = {}) {
    return {
      opacity: 1,
      transform: 'scale(1)',
      from: {
        opacity: 0,
        transform: 'scale(1.05)'
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
