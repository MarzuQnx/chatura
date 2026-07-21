/**
 * CategoryRepository
 * Single source of truth for CATEGORIES
 */
(function () {
  'use strict';
  
  var _data = {
  "tax": {
    "en": "Tax Intelligence",
    "id": "Inteligensi Pajak",
    "badgeClass": "text-emerald-800 bg-emerald-50"
  },
  "transfer": {
    "en": "Business Transfer",
    "id": "Transfer Bisnis",
    "badgeClass": "text-blue-700 bg-blue-50"
  },
  "risk": {
    "en": "Risk Insights",
    "id": "Wawasan Risiko",
    "badgeClass": "text-purple-700 bg-purple-50"
  },
  "industry": {
    "en": "Industry Analysis",
    "id": "Analisis Industri",
    "badgeClass": "text-amber-700 bg-amber-50"
  },
  "advisory": {
    "en": "Corporate Advisory",
    "id": "Konsultasi Korporasi",
    "badgeClass": "text-teal-700 bg-teal-50"
  },
  "publication": {
    "en": "Publication",
    "id": "Publikasi",
    "badgeClass": "text-blue-700 bg-blue-50"
  },
  "update": {
    "en": "Client Update",
    "id": "Pembaruan Klien",
    "badgeClass": "text-amber-700 bg-amber-50"
  }
};
  

  var repo = {
    _data: _data,
    getAll: function () {
      return Object.keys(this._data).map(function (k) { return this._data[k]; }.bind(this));
    },
    getById: function (id) {
      return this._data[id] || null;
    }
  };

  
  window.CategoryRepository = repo;
})();
