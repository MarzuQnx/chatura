/**
 * Motion Engine — Registry Module
 * Stores presets, themes, and adapters.
 * Enforces registration-time Property Ownership Collision Validation.
 */

export class MotionRegistry {
  constructor() {
    this.presets = new Map();
    this.themes = new Map();
    this.adapters = new Map();
    this.propertyOwnershipMap = new Map(); // Key: propertyName -> Value: preset/theme name
  }

  /**
   * Registers a Preset with Property Ownership Validation
   */
  registerPreset(name, definition) {
    if (!name || typeof name !== 'string') {
      throw new Error('[MotionRegistry] Invalid preset name');
    }
    if (!definition || typeof definition.compile !== 'function') {
      throw new Error(`[MotionRegistry] Preset '${name}' must provide a compile function`);
    }

    const declaredProperties = definition.properties || [];
    
    // Property Ownership Collision Check
    declaredProperties.forEach(prop => {
      if (this.propertyOwnershipMap.has(prop)) {
        const owner = this.propertyOwnershipMap.get(prop);
        if (owner !== name) {
          throw new Error(
            `[MotionRegistry] Property Ownership Collision: Property '${prop}' in preset '${name}' is already owned by '${owner}'.`
          );
        }
      }
    });

    // Record ownership
    declaredProperties.forEach(prop => {
      this.propertyOwnershipMap.set(prop, name);
    });

    this.presets.set(name, definition);
  }

  getPreset(name) {
    return this.presets.get(name);
  }

  hasPreset(name) {
    return this.presets.has(name);
  }

  /**
   * Registers a Theme
   */
  registerTheme(name, definition) {
    if (!name || typeof name !== 'string') {
      throw new Error('[MotionRegistry] Invalid theme name');
    }
    
    // Enforce theme rule: themes must NOT claim movement properties
    const forbiddenMovementProps = ['translate', 'opacity', 'rotate', 'transform'];
    const declaredProps = definition.properties || [];
    declaredProps.forEach(prop => {
      if (forbiddenMovementProps.includes(prop)) {
        throw new Error(
          `[MotionRegistry] Theme Registration Error: Theme '${name}' declared movement property '${prop}'. Themes may only control visual styling (e.g., box-shadow, backdrop-filter).`
        );
      }
    });

    this.themes.set(name, definition);
  }

  getTheme(name) {
    return this.themes.get(name);
  }

  hasTheme(name) {
    return this.themes.has(name);
  }

  /**
   * Registers a Renderer Adapter
   */
  registerAdapter(name, adapter) {
    if (!name || !adapter || typeof adapter.animate !== 'function') {
      throw new Error(`[MotionRegistry] Invalid adapter '${name}'`);
    }
    this.adapters.set(name, adapter);
  }

  getAdapter(name) {
    return this.adapters.get(name);
  }

  hasAdapter(name) {
    return this.adapters.has(name);
  }
}

export const registry = new MotionRegistry();
