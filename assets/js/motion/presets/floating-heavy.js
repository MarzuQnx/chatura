/**
 * Motion Engine Preset — floating-heavy
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const floatingHeavyPreset = {
  name: 'floating-heavy',
  category: 'floating',
  properties: ['floatHeavyY', 'floatHeavyRotate'],
  defaults: {
    duration: 5500,
    ease: MotionTokens.ease.easeInOut
  },

  compile() {
    return {
      keyframes: [
        { transform: 'translateY(0px) rotate(0deg)' },
        { transform: 'translateY(-20px) rotate(3deg)' },
        { transform: 'translateY(0px) rotate(0deg)' }
      ],
      duration: this.defaults.duration,
      ease: this.defaults.ease,
      iterations: Infinity
    };
  }
};
