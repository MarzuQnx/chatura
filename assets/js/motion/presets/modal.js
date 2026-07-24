/**
 * Motion Engine Preset — modal
 * Modal dialog reveal animation with scale-up backdrop blur transition.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const modalPreset = {
  name: 'modal',
  category: 'reveal',
  properties: ['modalOpacity', 'modalScale'],
  defaults: {
    duration: MotionTokens.duration.fast,
    ease: MotionTokens.ease.bounce
  },

  compile(options = {}) {
    return {
      opacity: 1,
      transform: 'scale(1)',
      from: {
        opacity: 0,
        transform: 'scale(0.95)'
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
