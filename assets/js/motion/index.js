/**
 * Motion Engine — Unified Main Entry Point
 * Registers default presets and themes, and exports core public API.
 */

import { motionEngine, MotionEngine } from './core/MotionEngine.js';
import { registry } from './core/MotionRegistry.js';
import { MotionTokens } from './tokens/MotionTokens.js';
import { MotionConfig } from './tokens/MotionConfig.js';
import { BrandOverride } from './tokens/BrandOverride.js';

// Presets
import { heroRevealPreset } from './presets/hero-reveal.js';
import { revealUpPreset } from './presets/reveal-up.js';
import { revealLeftPreset } from './presets/reveal-left.js';
import { revealRightPreset } from './presets/reveal-right.js';
import { slideUpPreset } from './presets/slide-up.js';
import { slideLeftPreset } from './presets/slide-left.js';
import { floatingSoftPreset, floatingMediumPreset, floatingHeavyPreset } from './presets/floating-soft.js';
import { parallaxPreset } from './presets/parallax.js';
import { counterPreset } from './presets/counter.js';
import { marqueePreset } from './presets/marquee.js';
import { imageCompositionPreset } from './presets/image-composition.js';
import { navbarPreset } from './presets/navbar.js';
import { modalPreset } from './presets/modal.js';

// Themes
import { glassCardTheme } from './themes/glass-card.js';
import { glassNavbarTheme } from './themes/glass-navbar.js';
import { glassModalTheme } from './themes/glass-modal.js';
import { shadowSoftTheme } from './themes/shadow-soft.js';
import { shadowHeavyTheme } from './themes/shadow-heavy.js';
import { elevationLowTheme, elevationHighTheme } from './themes/elevation-low.js';

// Register Default Presets
motionEngine.registerPreset('hero-reveal', heroRevealPreset);
motionEngine.registerPreset('reveal-up', revealUpPreset);
motionEngine.registerPreset('reveal-left', revealLeftPreset);
motionEngine.registerPreset('reveal-right', revealRightPreset);
motionEngine.registerPreset('slide-up', slideUpPreset);
motionEngine.registerPreset('slide-left', slideLeftPreset);
motionEngine.registerPreset('floating-soft', floatingSoftPreset);
motionEngine.registerPreset('floating-medium', floatingMediumPreset);
motionEngine.registerPreset('floating-heavy', floatingHeavyPreset);
motionEngine.registerPreset('parallax', parallaxPreset);
motionEngine.registerPreset('counter', counterPreset);
motionEngine.registerPreset('marquee', marqueePreset);
motionEngine.registerPreset('image-composition', imageCompositionPreset);
motionEngine.registerPreset('navbar', navbarPreset);
motionEngine.registerPreset('modal', modalPreset);

// Register Default Themes
motionEngine.registerTheme('glass-card', glassCardTheme);
motionEngine.registerTheme('glass-navbar', glassNavbarTheme);
motionEngine.registerTheme('glass-modal', glassModalTheme);
motionEngine.registerTheme('shadow-soft', shadowSoftTheme);
motionEngine.registerTheme('shadow-heavy', shadowHeavyTheme);
motionEngine.registerTheme('elevation-low', elevationLowTheme);
motionEngine.registerTheme('elevation-high', elevationHighTheme);

// Expose on Window Object for browser script tag usage
if (typeof window !== 'undefined') {
  window.MotionEngine = motionEngine;
  window.MotionTokens = MotionTokens;
  window.MotionConfig = MotionConfig;
}

export {
  motionEngine as default,
  motionEngine,
  MotionEngine,
  registry,
  MotionTokens,
  MotionConfig,
  BrandOverride
};
