/**
 * IndustryRepository — Industry business data
 * Wraps window.CHATURA.INDUSTRIES
 */
(function () {
  'use strict';

  var repo = {
    _data: null,
    init: function () {
      if (window.CHATURA && window.CHATURA.INDUSTRIES) {
        this._data = window.CHATURA.INDUSTRIES;
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
      var ind = this.getByKey(key);
      return ind ? ind.slug : null;
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

  window.IndustryRepository = repo;
})();
