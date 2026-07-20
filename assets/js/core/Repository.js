/**
 * Repository — Base repository pattern
 * Abstract data access behind a clean interface
 */
(function () {
  'use strict';

  function Repository(name) {
    this.name = name;
    this._data = null;
  }

  Repository.prototype.getAll = function () {
    return this._data ? this._data.slice() : [];
  };

  Repository.prototype.find = function (predicate) {
    if (!this._data) return [];
    return this._data.filter(predicate);
  };

  Repository.prototype.findOne = function (predicate) {
    if (!this._data) return null;
    for (var i = 0; i < this._data.length; i++) {
      if (predicate(this._data[i])) return this._data[i];
    }
    return null;
  };

  Repository.prototype.count = function () {
    return this._data ? this._data.length : 0;
  };

  window.Repository = Repository;
})();
