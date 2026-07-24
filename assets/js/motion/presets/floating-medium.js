/**
 * Motion Engine Preset — floating-medium
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const floatingMediumPreset = {
  name: 'floating-medium',
  category: 'floating',
  properties: ['floatMediumY', 'floatMediumRotate'],
  defaults: {
    duration: 4500,
    ease: MotionTokens.ease.easeInOut
  },

  compile() {
    return {
      keyframes: [
        { transform: 'translateY(0px) rotate(0deg)' },
        { transform: 'translateY(-12px) rotate(1.5deg)' },
        { transform: 'translateY(0px) rotate(0deg)' }
      ],
      duration: this.defaults.duration,
      ease: this.defaults.ease,
      iterations: Infinity
    };
  }
};
