/**
 * Motion Engine Presets — Floating Animations
 * Subtle ambient float oscillations for hero images and graphic elements.
 */

import { MotionTokens } from '../tokens/MotionTokens.js';

export const floatingSoftPreset = {
  name: 'floating-soft',
  category: 'floating',
  properties: ['floatSoftY', 'floatSoftRotate'],
  defaults: {
    duration: 3500,
    ease: MotionTokens.ease.easeInOut
  },

  compile() {
    return {
      keyframes: [
        { transform: 'translateY(0px) rotate(0deg)' },
        { transform: 'translateY(-6px) rotate(0.5deg)' },
        { transform: 'translateY(0px) rotate(0deg)' }
      ],
      duration: this.defaults.duration,
      ease: this.defaults.ease,
      iterations: Infinity
    };
  }
};

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
