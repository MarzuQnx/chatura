/**
 * Motion Engine Theme — glass-card
 * Visual styling theme for glassmorphism cards. Controls appearance ONLY (never movement).
 */

export const glassCardTheme = {
  name: 'glass-card',
  category: 'theme',
  properties: ['backdrop-filter', 'box-shadow', 'border-color'],
  styles: {
    backdropFilter: 'blur(12px)',
    webkitBackdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 77, 52, 0.08)'
  }
};
