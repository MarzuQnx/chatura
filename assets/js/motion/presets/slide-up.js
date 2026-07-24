/**
 * Motion Engine Preset — slide-up
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const slideUpPreset = {
  name: 'slide-up',
  category: 'reveal',
  properties: ['slideY'],
  defaults: {
    duration: MotionTokens.duration.fast,
    distance: MotionTokens.distance.sm,
    ease: MotionTokens.ease.easeInOut
  },

  compile(options = {}) {
    const dist = MotionTokens.resolveResponsive(options.distance || this.defaults.distance);
    return {
      transform: 'translateY(0px)',
      from: {
        transform: `translateY(${dist}px)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
