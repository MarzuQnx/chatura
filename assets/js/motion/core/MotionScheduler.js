/**
 * Motion Engine — Execution Scheduler & Batching Queue
 * Manages requestAnimationFrame execution and stagger timeline synchronization.
 */

export class MotionScheduler {
  constructor() {
    this.queue = [];
    this.isTicking = false;
  }

  schedule(task, delayMs = 0) {
    if (delayMs <= 0) {
      this.queue.push(task);
      this.requestTick();
    } else {
      setTimeout(() => {
        this.queue.push(task);
        this.requestTick();
      }, delayMs);
    }
  }

  requestTick() {
    if (!this.isTicking) {
      this.isTicking = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  flush() {
    const tasksToRun = [...this.queue];
    this.queue = [];
    this.isTicking = false;

    tasksToRun.forEach(task => {
      try {
        task();
      } catch (err) {
        console.error('[MotionScheduler] Error executing scheduled task:', err);
      }
    });
  }
}

export const scheduler = new MotionScheduler();
