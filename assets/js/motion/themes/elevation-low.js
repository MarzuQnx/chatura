/**
 * Motion Engine Theme — elevation-low & elevation-high
 */

export const elevationLowTheme = {
  name: 'elevation-low',
  category: 'theme',
  properties: ['elev-low-shadow'],
  styles: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  }
};

export const elevationHighTheme = {
  name: 'elevation-high',
  category: 'theme',
  properties: ['elev-high-shadow'],
  styles: {
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.18)'
  }
};
