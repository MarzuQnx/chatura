/**
 * PeopleRepository — People/Expert business data
 * Wraps window.CHATURA.AUTHORS
 */
(function () {
  'use strict';

  var repo = {
    _data: null,
    init: function () {
      if (window.CHATURA && window.CHATURA.AUTHORS) {
        this._data = window.CHATURA.AUTHORS;
      }
    },
    getAll: function () {
      if (!this._data) return [];
      return Object.keys(this._data).map(function (k) { return this._data[k]; }.bind(this));
    },
    getById: function (id) {
      return this._data ? this._data[id] : null;
    },
    getByPeopleId: function (peopleId) {
      if (!this._data) return null;
      var keys = Object.keys(this._data);
      for (var i = 0; i < keys.length; i++) {
        if (this._data[keys[i]].peopleId === peopleId) return this._data[keys[i]];
      }
      return null;
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

  window.PeopleRepository = repo;
})();
