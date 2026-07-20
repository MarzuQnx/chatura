/**
 * CategoryRepository — Category business data
 * Wraps window.CHATURA.CATEGORIES
 */
(function () {
  'use strict';

  var repo = {
    _data: null,
    init: function () {
      if (window.CHATURA && window.CHATURA.CATEGORIES) {
        this._data = window.CHATURA.CATEGORIES;
      }
    },
    getAll: function () {
      if (!this._data) return [];
      return Object.keys(this._data).map(function (k) { return Object.assign({ key: k }, this._data[k]); }.bind(this));
    },
    getByKey: function (key) {
      return this._data ? this._data[key] : null;
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

  window.CategoryRepository = repo;
})();
