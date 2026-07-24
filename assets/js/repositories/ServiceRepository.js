/**
 * ServiceRepository
 * Single source of truth for SERVICES
 */
(function () {
  'use strict';
  
  var _data = {
    "accounting": {
      "id": "accounting",
      "slug": "services/accounting-finance/",
      "name": { "en": "Accounting & Finance", "id": "Akuntansi & Keuangan" },
      "icon": "wallet",
      "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
      "description": {
          "en": "We help businesses maintain financial integrity, improve reporting accuracy, and gain actionable insights.",
          "id": "Kami membantu bisnis menjaga integritas keuangan, meningkatkan akurasi pelaporan, dan mendapatkan wawasan yang dapat ditindaklanjuti."
      },
      "features": {
          "en": ["Financial Reporting", "CFO Advisory", "Management Reporting"],
          "id": ["Pelaporan Keuangan", "Konsultasi CFO", "Pelaporan Manajemen"]
      }
    },
    "tax": {
      "id": "tax",
      "slug": "services/tax-services/",
      "name": { "en": "Tax Services", "id": "Layanan Pajak" },
      "icon": "file-text",
      "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80",
      "description": {
          "en": "Comprehensive tax planning, compliance, and dispute resolution to minimize liabilities and ensure regulatory adherence.",
          "id": "Perencanaan pajak komprehensif, kepatuhan, dan penyelesaian sengketa untuk meminimalkan kewajiban dan memastikan kepatuhan."
      },
      "features": {
          "en": ["Corporate Tax", "Transfer Pricing", "Tax Dispute"],
          "id": ["Pajak Korporasi", "Transfer Pricing", "Sengketa Pajak"]
      }
    },
    "transfer": {
      "id": "transfer",
      "slug": "services/business-transfer/",
      "name": { "en": "Business Transfer", "id": "Transfer Bisnis" },
      "icon": "arrow-right-left",
      "image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80",
      "description": {
          "en": "End-to-end support for mergers, acquisitions, and successions to maximize value and ensure smooth transitions.",
          "id": "Dukungan end-to-end untuk merger, akuisisi, dan suksesi untuk memaksimalkan nilai dan memastikan transisi yang lancar."
      },
      "features": {
          "en": ["M&A Advisory", "Valuation", "Due Diligence"],
          "id": ["Konsultasi M&A", "Valuasi", "Uji Tuntas"]
      }
    },
    "risk": {
      "id": "risk",
      "slug": "services/risk-management/",
      "name": { "en": "Risk Management", "id": "Manajemen Risiko" },
      "icon": "shield-check",
      "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
      "description": {
          "en": "Identify, assess, and mitigate operational and financial risks to safeguard your enterprise assets.",
          "id": "Identifikasi, nilai, dan mitigasi risiko operasional dan keuangan untuk melindungi aset perusahaan Anda."
      },
      "features": {
          "en": ["Internal Audit", "Compliance", "IT Risk"],
          "id": ["Audit Internal", "Kepatuhan", "Risiko TI"]
      }
    },
    "advisory": {
      "id": "advisory",
      "slug": "services/corporate-advisory/",
      "name": { "en": "Corporate Advisory", "id": "Konsultasi Korporasi" },
      "icon": "briefcase",
      "image": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
      "description": {
          "en": "Strategic guidance for restructuring, market entry, and operational efficiency to drive sustainable growth.",
          "id": "Panduan strategis untuk restrukturisasi, entri pasar, dan efisiensi operasional untuk mendorong pertumbuhan berkelanjutan."
      },
      "features": {
          "en": ["Market Entry", "Restructuring", "Strategy"],
          "id": ["Entri Pasar", "Restrukturisasi", "Strategi"]
      }
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

  window.ServiceRepository = repo;
})();
