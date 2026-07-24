/**
 * Motion Engine — State Machine & Lifecycle Controller
 * Manages states: idle, prepared, playing, completed, destroyed, paused.
 */

export const STATES = {
  IDLE: 'idle',
  PREPARED: 'prepared',
  PLAYING: 'playing',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  DESTROYED: 'destroyed'
};

export class MotionState {
  constructor(element) {
    this.element = element;
    this.currentState = STATES.IDLE;
    this.history = [STATES.IDLE];
    this.meta = {};
  }

  setState(newState, meta = {}) {
    if (this.currentState === STATES.DESTROYED && newState !== STATES.IDLE) {
      console.warn('[MotionState] Cannot transition state on destroyed element');
      return false;
    }
    this.currentState = newState;
    this.history.push(newState);
    this.meta = { ...this.meta, ...meta, timestamp: Date.now() };
    this.element.setAttribute('data-motion-state', newState);
    return true;
  }

  getState() {
    return this.currentState;
  }

  is(state) {
    return this.currentState === state;
  }
}
