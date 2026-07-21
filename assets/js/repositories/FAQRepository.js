/**
 * FAQRepository
 * Single source of truth.
 */
(function () {
  'use strict';
  
  var _data = [
  {
    "id": "f1",
    "question": {
      "en": "What services do you provide?",
      "id": "Layanan apa yang Anda berikan?"
    },
    "answer": {
      "en": "We provide accounting, tax, business transfer, risk management, and corporate advisory.",
      "id": "Kami menyediakan akuntansi, pajak, transfer bisnis, manajemen risiko, dan konsultasi korporasi."
    }
  },
  {
    "id": "f2",
    "question": {
      "en": "How do you charge?",
      "id": "Bagaimana sistem pembayaran Anda?"
    },
    "answer": {
      "en": "We charge based on project scope and retainer models.",
      "id": "Kami mengenakan biaya berdasarkan ruang lingkup proyek dan model retainer."
    }
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
  
  window.FAQRepository = repo;
})();
