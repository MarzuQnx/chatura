/**
 * Motion Engine Theme — glass-navbar
 */

export const glassNavbarTheme = {
  name: 'glass-navbar',
  category: 'theme',
  properties: ['nav-backdrop', 'nav-shadow'],
  styles: {
    backdropFilter: 'blur(16px)',
    webkitBackdropFilter: 'blur(16px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
  }
};
