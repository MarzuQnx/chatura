/**
 * EventBus — Lightweight pub/sub event system
 * Decouples modules for clean communication
 */
(function () {
  'use strict';

  var channels = {};

  function on(event, callback) {
    if (!channels[event]) channels[event] = [];
    channels[event].push(callback);
    return function off() {
      channels[event] = channels[event].filter(function (fn) { return fn !== callback; });
    };
  }

  function emit(event, data) {
    if (!channels[event]) return;
    channels[event].slice().forEach(function (fn) {
      try { fn(data); } catch (e) { console.error('[EventBus]', event, e); }
    });
  }

  function once(event, callback) {
    var unsub = on(event, function handler(data) {
      unsub();
      callback(data);
    });
    return unsub;
  }

  window.ChaturaBus = { on: on, emit: emit, once: once };
})();
