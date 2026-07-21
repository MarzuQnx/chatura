/**
 * SettingsRepository
 * Single source of truth.
 */
(function () {
  'use strict';
  
  var _data = {
  "companyName": "Chatura Indonesia",
  "logo": "assets/images/logo.png",
  "primaryColor": "#059669",
  "established": 2010
};
  
  var repo = {
    _data: _data,
    getAll: function () {
      return Array.isArray(this._data) ? this._data : Object.keys(this._data).map(k => this._data[k]);
    },
    getById: function (id) {
      return Array.isArray(this._data) ? this._data.find(i => i.id === id) : this._data[id];
    }
  };
  
  window.SettingsRepository = repo;
})();
