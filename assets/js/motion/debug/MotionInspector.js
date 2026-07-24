/**
 * Motion Engine — Motion Inspector & Diagnostics Logger
 */

export class MotionInspector {
  static isDebugMode() {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('motion-debug') === '1';
  }

  static log(topic, message, data = {}) {
    if (!this.isDebugMode()) return;
    console.group(`[MotionEngine Debug] :: ${topic}`);
    console.log(message);
    if (Object.keys(data).length > 0) {
      console.dir(data);
    }
    console.groupEnd();
  }
}
