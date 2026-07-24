/**
 * Motion Engine — Core Architecture Facade
 * 
 * Implements the MANDATORY Minimum Public API Contract:
 * - MotionEngine.init(config)
 * - MotionEngine.registerPreset(name, definition)
 * - MotionEngine.registerTheme(name, definition)
 * - MotionEngine.registerAdapter(name, adapter)
 * - MotionEngine.play(element, presetName, options)
 * - MotionEngine.pause(element)
 * - MotionEngine.resume(element)
 * - MotionEngine.restart(element)
 * - MotionEngine.destroy(element | scope)
 * - MotionEngine.getState(element)
 */

import { registry } from './MotionRegistry.js';
import { MotionObserver } from './MotionObserver.js';
import { scheduler } from './MotionScheduler.js';
import { MotionComposer } from './MotionComposer.js';
import { MotionState, STATES } from './MotionState.js';
import { MotionTokens } from '../tokens/MotionTokens.js';
import { MotionConfig } from '../tokens/MotionConfig.js';
import { GSAPAdapter } from '../adapters/GSAPAdapter.js';
import { CSSAdapter } from '../adapters/CSSAdapter.js';
import { reducedMotion } from '../accessibility/ReducedMotion.js';
import { overlay } from '../debug/MotionOverlay.js';
import { MotionInspector } from '../debug/MotionInspector.js';

export class MotionEngine {
  constructor() {
    this.config = { ...MotionConfig };
    this.observer = null;
    this.activeStates = new Map(); // element -> MotionState
    this.activeAdapters = new Map(); // element -> adapter instance
    this.isInitialized = false;

    // Register Default Adapters
    const gsapAdapter = new GSAPAdapter();
    const cssAdapter = new CSSAdapter();
    this.registerAdapter('gsap', gsapAdapter);
    this.registerAdapter('css', cssAdapter);
  }

  /**
   * Initializes the Motion Engine infrastructure
   */
  init(config = {}) {
    if (this.isInitialized) return this;
    this.config = { ...this.config, ...config };

    this.observer = new MotionObserver({
      rootMargin: this.config.observeRootMargin,
      threshold: this.config.observeThreshold
    });

    if (this.config.debugMode || MotionInspector.isDebugMode()) {
      overlay.init();
    }

    this.isInitialized = true;
    MotionInspector.log('Core', 'Motion Engine initialized successfully', this.config);

    // Auto-bind elements with data-motion attributes in DOM
    if (typeof document !== 'undefined') {
      this.scanAndBind(document);
    }

    return this;
  }

  /**
   * Scans scope for data-motion attributes and attaches observers
   */
  scanAndBind(scope = document) {
    const elements = scope.querySelectorAll('[data-motion], .motion');
    elements.forEach(el => {
      // Ignore legacy marked elements
      if (el.getAttribute('data-motion-legacy') === 'true') {
        return;
      }

      const presetName = el.getAttribute('data-motion') || this.extractPresetFromClass(el);
      if (!presetName) return;

      const delay = parseInt(el.getAttribute('data-motion-delay') || '0', 10);
      const trigger = el.getAttribute('data-motion-trigger') || 'scroll';

      const state = this.getOrCreateState(el);
      state.setState(STATES.IDLE);

      if (trigger === 'scroll') {
        this.observer.observe(el, () => {
          this.play(el, presetName, { delay });
          this.observer.unobserve(el);
        });
      } else {
        // Immediate or custom trigger
        this.play(el, presetName, { delay });
      }
    });
  }

  extractPresetFromClass(element) {
    const classes = Array.from(element.classList);
    const preset = classes.find(cls => registry.hasPreset(cls));
    return preset || null;
  }

  getOrCreateState(element) {
    if (!this.activeStates.has(element)) {
      this.activeStates.set(element, new MotionState(element));
    }
    return this.activeStates.get(element);
  }

  /**
   * Registers a new Preset definition
   */
  registerPreset(name, definition) {
    registry.registerPreset(name, definition);
    return this;
  }

  /**
   * Registers a new Theme definition
   */
  registerTheme(name, definition) {
    registry.registerTheme(name, definition);
    return this;
  }

  /**
   * Registers a new Renderer Adapter
   */
  registerAdapter(name, adapter) {
    registry.registerAdapter(name, adapter);
    return this;
  }

  /**
   * Resolves appropriate renderer adapter for an element (GSAP -> CSS fallback)
   */
  resolveAdapter(requestedName) {
    const primary = registry.getAdapter(requestedName || this.config.defaultAdapter);
    if (primary && primary.isSupported()) {
      return primary;
    }
    const fallback = registry.getAdapter(this.config.fallbackAdapter);
    if (fallback && fallback.isSupported()) {
      return fallback;
    }
    throw new Error('[MotionEngine] No supported renderer adapter found.');
  }

  /**
   * Main Playback Method
   */
  play(element, presetName, options = {}) {
    if (!element) return;
    const state = this.getOrCreateState(element);

    // Guard: Preset Existence Fallback
    if (!registry.hasPreset(presetName)) {
      console.error(`[MotionEngine] Preset '${presetName}' not found in registry. Executing fallback reveal.`);
      Object.assign(element.style, { opacity: '1', transform: 'none' });
      state.setState(STATES.COMPLETED);
      return;
    }

    const presetDef = registry.getPreset(presetName);
    const themeName = element.getAttribute('data-motion-theme');
    const themeDef = themeName ? registry.getTheme(themeName) : null;

    state.setState(STATES.PREPARED);

    // Resolve adapter
    const adapter = this.resolveAdapter(options.adapter);
    this.activeAdapters.set(element, adapter);

    // Compose final keyframes
    const compiledKeyframes = MotionComposer.compose(
      [presetDef],
      themeDef ? [themeDef] : [],
      options
    );

    // Reduced motion check
    const finalKeyframes = reducedMotion.sanitizeKeyframes(compiledKeyframes);

    scheduler.schedule(() => {
      state.setState(STATES.PLAYING);
      
      // Apply initial from styles if available
      if (finalKeyframes.from) {
        Object.assign(element.style, finalKeyframes.from);
        delete finalKeyframes.from;
      }

      adapter.animate(element, finalKeyframes, {
        duration: options.duration || finalKeyframes.duration || MotionTokens.duration.normal,
        delay: options.delay || 0,
        ease: options.ease || finalKeyframes.ease,
        onComplete: () => {
          state.setState(STATES.COMPLETED);
          if (options.onComplete) options.onComplete();
        }
      });

      overlay.updateElement(element, {
        preset: presetName,
        adapter: adapter.name,
        state: 'playing',
        delay: options.delay || 0
      });
    }, options.delay || 0);
  }

  /**
   * Pauses animation on an element
   */
  pause(element) {
    const adapter = this.activeAdapters.get(element);
    const state = this.activeStates.get(element);
    if (adapter && adapter.pause) {
      adapter.pause(element);
      if (state) state.setState(STATES.PAUSED);
    }
  }

  /**
   * Resumes animation on an element
   */
  resume(element) {
    const adapter = this.activeAdapters.get(element);
    const state = this.activeStates.get(element);
    if (adapter && adapter.resume) {
      adapter.resume(element);
      if (state) state.setState(STATES.PLAYING);
    }
  }

  /**
   * Restarts animation on an element
   */
  restart(element) {
    const adapter = this.activeAdapters.get(element);
    if (adapter && adapter.restart) {
      adapter.restart(element);
    }
  }

  /**
   * Destroys engine bindings for an element or entire scope
   */
  destroy(elementOrScope = document) {
    if (elementOrScope instanceof HTMLElement) {
      const adapter = this.activeAdapters.get(elementOrScope);
      if (adapter) adapter.destroy(elementOrScope);
      if (this.observer) this.observer.unobserve(elementOrScope);
      const state = this.activeStates.get(elementOrScope);
      if (state) state.setState(STATES.DESTROYED);
      this.activeAdapters.delete(elementOrScope);
      this.activeStates.delete(elementOrScope);
    } else {
      if (this.observer) this.observer.destroy();
      this.activeAdapters.forEach((adapter, el) => adapter.destroy(el));
      this.activeAdapters.clear();
      this.activeStates.clear();
      this.isInitialized = false;
    }
  }

  /**
   * Retrieves current lifecycle state of an element
   */
  getState(element) {
    const stateObj = this.activeStates.get(element);
    return stateObj ? stateObj.getState() : STATES.IDLE;
  }
}

// Global Singleton Instance
export const motionEngine = new MotionEngine();
