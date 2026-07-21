/**
 * ClientRepository
 * Single source of truth.
 */
(function () {
  'use strict';
  
  var _data = [
  {
    "id": "c1",
    "name": "Tech Innovators",
    "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
  },
  {
    "id": "c2",
    "name": "Global Finance",
    "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
  },
  {
    "id": "c3",
    "name": "Retail Giant",
    "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
  },
  {
    "id": "c4",
    "name": "Energy Co",
    "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
  },
  {
    "id": "c5",
    "name": "Health Plus",
    "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
  }
];
  
  var repo = {
    _data: _data,
    getAll: function () {
      return Array.isArray(this._data) ? this._data : Object.keys(this._data).map(k => this._data[k]);
    },
    getById: function (id) {
      return Array.isArray(this._data) ? this._data.find(i => i.id === id) : this._data[id];
    }
  };
  
  window.ClientRepository = repo;
})();
