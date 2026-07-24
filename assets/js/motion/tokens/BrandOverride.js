/**
 * Motion Engine — Brand & Project Overrides
 * Allows project-specific customization without mutating Motion Engine core architecture.
 */

export const BrandOverride = {
  brandName: 'Chatura Indonesia',
  tokenOverrides: {
    duration: {
      slow: 800 // Brand-specific editorial pacing override
    },
    ease: {
      hero: 'cubic-bezier(0.22, 1, 0.36, 1)'
    }
  },
  
  applyOverrides(baseTokens) {
    return {
      ...baseTokens,
      duration: { ...baseTokens.duration, ...this.tokenOverrides.duration },
      ease: { ...baseTokens.ease, ...this.tokenOverrides.ease }
    };
  }
};
