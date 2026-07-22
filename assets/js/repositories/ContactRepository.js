/**
 * ContactRepository
 * Single source of truth.
 */
(function () {
  'use strict';
  
  var _data = {
  "email": "contact@chatura-indonesia.com",
  "phone": "+62 21 1234 5678",
  "whatsapp": "+62 811 1234 5678",
  "address": {
    "en": "Jakarta, Indonesia",
    "id": "Jakarta, Indonesia"
  },
  "socials": {
    "linkedin": "#",
    "twitter": "#"
  }
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
  
  window.ContactRepository = repo;
})();
