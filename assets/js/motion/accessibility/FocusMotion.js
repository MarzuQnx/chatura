/**
 * Motion Engine — Focus Motion Handler
 * Ensures keyboard navigation focus indicators remain visible and undisturbed by active motion timelines.
 */

export class FocusMotion {
  static attach(element) {
    if (!element) return;
    element.addEventListener('focusin', () => {
      // Ensure focus ring is never obscured by ongoing opacity or scale animation
      element.style.outline = '';
      element.style.zIndex = '10';
    });

    element.addEventListener('focusout', () => {
      element.style.zIndex = '';
    });
  }
}
