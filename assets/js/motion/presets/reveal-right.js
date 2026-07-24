/**
 * Motion Engine Preset — reveal-right
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const revealRightPreset = {
  name: 'reveal-right',
  category: 'reveal',
  properties: ['opacity', 'translateX-right'],
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
        transform: `translateX(${dist}px)`
      },
      duration: options.duration || this.defaults.duration,
      ease: options.ease || this.defaults.ease
    };
  }
};
