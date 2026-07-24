/**
 * Motion Engine — Base Configuration Settings
 */

import { MotionTokens } from './MotionTokens.js';

export const MotionConfig = {
  version: '1.0.0',
  defaultAdapter: 'gsap',
  fallbackAdapter: 'css',
  debugMode: false,
  autoInit: true,
  observeThreshold: 0.15,
  observeRootMargin: '0px 0px -50px 0px',
  reducedMotionFallback: true,
  propertyOwnershipCheck: true,
  tokens: MotionTokens
};
