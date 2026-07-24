/**
 * Motion Engine Preset — reveal-left
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const revealLeftPreset = {
  name: 'reveal-left',
  category: 'reveal',
  properties: ['reveal-x-left', 'reveal-opacity-left'],
  defaults: {
    duration: MotionTokens.duration.normal,
    distance: MotionTokens.distance.md,
    ease: MotionTokens.ease.easeOut
  },

  compile(options = {}) {
    const dist = MotionTokens.resolveResponsive(options.distance || this.defaults.distance);
    return {
      opacity: 1,
      transform: 'translateX(0px)',
      from: {
        opacity: 0,
        transform: `translateX(-${dist}px)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
