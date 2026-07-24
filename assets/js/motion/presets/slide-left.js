/**
 * Motion Engine Preset — slide-left
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const slideLeftPreset = {
  name: 'slide-left',
  category: 'reveal',
  properties: ['slideX'],
  defaults: {
    duration: MotionTokens.duration.fast,
    distance: MotionTokens.distance.sm,
    ease: MotionTokens.ease.easeInOut
  },

  compile(options = {}) {
    const dist = MotionTokens.resolveResponsive(options.distance || this.defaults.distance);
    return {
      transform: 'translateX(0px)',
      from: {
        transform: `translateX(${dist}px)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
