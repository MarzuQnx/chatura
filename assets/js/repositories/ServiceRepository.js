/**
 * ServiceRepository — Service business data
 * Wraps window.CHATURA.SERVICES
 */
(function () {
  'use strict';

  var repo = {
    _data: null,
    init: function () {
      if (window.CHATURA && window.CHATURA.SERVICES) {
        this._data = window.CHATURA.SERVICES;
      }
    },
    getAll: function () {
      if (!this._data) return [];
      return Object.keys(this._data).map(function (k) { return Object.assign({ key: k }, this._data[k]); }.bind(this));
    },
    getByKey: function (key) {
      return this._data ? this._data[key] : null;
    },
    getSlug: function (key) {
      var svc = this.getByKey(key);
      return svc ? svc.slug : null;
    },
    count: function () {
      return this._data ? Object.keys(this._data).length : 0;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { repo.init(); });
  } else {
    repo.init();
  }

  window.ServiceRepository = repo;
})();
