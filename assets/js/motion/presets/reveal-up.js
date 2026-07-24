/**
 * Motion Engine Preset — reveal-up
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const revealUpPreset = {
  name: 'reveal-up',
  category: 'reveal',
  properties: ['reveal-y-up', 'reveal-opacity-up'],
  defaults: {
    duration: MotionTokens.duration.normal,
    distance: MotionTokens.distance.md,
    ease: MotionTokens.ease.easeOut
  },

  compile(options = {}) {
    const dist = MotionTokens.resolveResponsive(options.distance || this.defaults.distance);
    return {
      opacity: 1,
      transform: 'translateY(0px)',
      from: {
        opacity: 0,
        transform: `translateY(${dist}px)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
