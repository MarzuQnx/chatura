/**
 * Motion Engine — Motion Composer Module
 * Resolves execution order across multiple presets & themes:
 * Execution Order: Reveal -> Theme -> Hover -> Floating
 * Ensures styles never collide or fight in CSS.
 */

export class MotionComposer {
  static EXECUTION_ORDER = ['reveal', 'theme', 'hover', 'floating'];

  /**
   * Compiles merged keyframes respecting execution order & priority
   */
  static compose(presetDefs = [], themeDefs = [], tokenResolver) {
    const combinedKeyframes = {};
    const activeProperties = new Set();

    // 1. Process Presets by Layer / Priority
    const sortedPresets = [...presetDefs].sort((a, b) => {
      const orderA = this.EXECUTION_ORDER.indexOf(a.category || 'reveal');
      const orderB = this.EXECUTION_ORDER.indexOf(b.category || 'reveal');
      return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
    });

    sortedPresets.forEach(preset => {
      const compiled = preset.compile(tokenResolver);
      Object.keys(compiled).forEach(key => {
        if (!activeProperties.has(key)) {
          combinedKeyframes[key] = compiled[key];
          activeProperties.add(key);
        }
      });
    });

    // 2. Process Themes (Appearance only)
    themeDefs.forEach(theme => {
      const compiled = theme.compile ? theme.compile(tokenResolver) : (theme.styles || {});
      Object.keys(compiled).forEach(key => {
        combinedKeyframes[key] = compiled[key];
      });
    });

    return combinedKeyframes;
  }
}
