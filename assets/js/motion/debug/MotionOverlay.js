/**
 * Motion Engine — Visual Diagnostic Overlay (?motion-debug=1)
 * Renders on-screen HUD displaying Preset name, Trigger, State, Timeline, & Adapter.
 */

import { MotionInspector } from './MotionInspector.js';

export class MotionOverlay {
  constructor() {
    this.container = null;
  }

  init() {
    if (!MotionInspector.isDebugMode() || typeof document === 'undefined') return;

    this.container = document.createElement('div');
    this.container.id = 'motion-debug-overlay';
    Object.assign(this.container.style, {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      width: '320px',
      maxHeight: '260px',
      overflowY: 'auto',
      backgroundColor: 'rgba(0, 77, 52, 0.92)',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '11px',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: '999999',
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none'
    });

    this.container.innerHTML = `
      <div style="font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px; margin-bottom:8px;">
        ⚡ MOTION ENGINE DIAGNOSTICS HUD
      </div>
      <div id="motion-debug-content">Listening for active motion elements...</div>
    `;

    document.body.appendChild(this.container);
  }

  updateElement(element, info = {}) {
    if (!this.container) return;
    const content = this.container.querySelector('#motion-debug-content');
    if (!content) return;

    const entry = document.createElement('div');
    entry.style.marginBottom = '6px';
    entry.innerHTML = `
      <div><strong>Target:</strong> ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ')[0] : ''}</div>
      <div><strong>Preset:</strong> ${info.preset || 'N/A'} | <strong>Adapter:</strong> ${info.adapter || 'N/A'}</div>
      <div><strong>State:</strong> <span style="color:#4ADE80">${info.state || 'active'}</span> | <strong>Delay:</strong> ${info.delay || 0}ms</div>
    `;
    content.prepend(entry);
  }
}

export const overlay = new MotionOverlay();
