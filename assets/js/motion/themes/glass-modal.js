/**
 * Motion Engine Theme — glass-modal
 */

export const glassModalTheme = {
  name: 'glass-modal',
  category: 'theme',
  properties: ['modal-backdrop', 'modal-shadow'],
  styles: {
    backdropFilter: 'blur(24px)',
    webkitBackdropFilter: 'blur(24px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }
};
