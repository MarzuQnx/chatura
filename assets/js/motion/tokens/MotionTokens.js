/**
 * Motion Engine — Design Tokens & Responsive Resolution
 * Single Source of Truth for Motion Durations, Easings, Distances, and Breakpoints.
 */

export const MotionTokens = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 400,
    slow: 700,
    deliberate: 1200
  },
  
  distance: {
    xs: { desktop: 8, tablet: 6, mobile: 4 },
    sm: { desktop: 16, tablet: 12, mobile: 8 },
    md: { desktop: 32, tablet: 24, mobile: 16 },
    lg: { desktop: 64, tablet: 48, mobile: 32 },
    xl: { desktop: 120, tablet: 80, mobile: 48 }
  },

  opacity: {
    hidden: 0,
    subtle: 0.4,
    visible: 1
  },

  scale: {
    compressed: 0.92,
    normal: 1,
    expanded: 1.05
  },

  rotation: {
    none: 0,
    subtle: 2,
    moderate: 6,
    dramatic: 15
  },

  ease: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    hero: 'cubic-bezier(0.16, 1, 0.3, 1)'
  },

  stagger: {
    none: 0,
    fast: 50,
    normal: 100,
    relaxed: 180
  },

  /**
   * Resolves responsive values based on current viewport width
   */
  resolveResponsive(tokenValue) {
    if (typeof tokenValue !== 'object' || tokenValue === null) {
      return tokenValue;
    }
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (width < 768) {
      return tokenValue.mobile ?? tokenValue.tablet ?? tokenValue.desktop;
    }
    if (width < 1024) {
      return tokenValue.tablet ?? tokenValue.desktop;
    }
    return tokenValue.desktop;
  }
};
