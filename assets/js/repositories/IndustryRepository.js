/**
 * IndustryRepository
 * Single source of truth for INDUSTRIES
 */
(function () {
  'use strict';
  
  var INDUSTRIES = [
            { slug: 'industries/energy/', icon: 'zap', nameKey: 'people.ind_energy', name: 'Energy & Natural Resources', desc: 'Oil, gas, mining, and renewable energy sectors.', relatedPeople: ['p3', 'p4'] },
            { slug: 'industries/manufacturing/', icon: 'factory', nameKey: 'people.ind_manufacturing', name: 'Manufacturing', desc: 'Industrial operations and supply chain.', relatedPeople: ['p3'] },
            { slug: 'industries/healthcare/', icon: 'heart-pulse', nameKey: 'people.ind_healthcare', name: 'Healthcare', desc: 'Health systems, pharmaceuticals, and medical devices.', relatedPeople: [] },
            { slug: 'industries/technology/', icon: 'cpu', nameKey: 'people.ind_tech', name: 'Technology', desc: 'Digital platforms, SaaS, and tech startups.', relatedPeople: [] },
            { slug: 'industries/infrastructure/', icon: 'building-2', nameKey: 'people.ind_infra', name: 'Infrastructure', desc: 'Transportation, utilities, and public works.', relatedPeople: [] },
            { slug: 'industries/consumer/', icon: 'shopping-bag', nameKey: 'people.ind_consumer', name: 'Consumer Goods', desc: 'FMCG, retail, and consumer services.', relatedPeople: ['p4'] },
            { slug: 'industries/financial/', icon: 'landmark', nameKey: 'people.ind_financial', name: 'Financial Services', desc: 'Banking, insurance, and capital markets.', relatedPeople: ['p1', 'p6'] },
            { slug: 'industries/education/', icon: 'graduation-cap', nameKey: 'people.ind_education', name: 'Education', desc: 'Universities, EdTech, and training institutions.', relatedPeople: [] },
            { slug: 'industries/automotive/', icon: 'car', nameKey: 'people.ind_automotive', name: 'Automotive', desc: 'OEMs, parts suppliers, and EV transition.', relatedPeople: ['p3'] }
        ];
  var STANDARDS = [
            { name: 'IFRS', desc: 'International Financial Reporting Standards', url: 'https://www.ifrs.org' },
            { name: 'PSAK', desc: 'Pernyataan Standar Akuntansi Keuangan', url: '' },
            { name: 'OECD', desc: 'Organisation for Economic Co-operation', url: 'https://www.oecd.org' },
            { name: 'COSO', desc: 'Committee of Sponsoring Organizations', url: 'https://www.coso.org' },
            { name: 'ISO', desc: 'International Organization for Standardization', url: 'https://www.iso.org' },
            { name: 'ISA', desc: 'International Standards on Auditing', url: '' },
            { name: 'BEPS', desc: 'Base Erosion & Profit Shifting', url: 'https://www.oecd.org/beps' },
            { name: 'GRI', desc: 'Global Reporting Initiative', url: 'https://www.globalreporting.org' }
        ];
  var _data = INDUSTRIES;
  var repo = {
    _data: _data,
    getAll: function() { return INDUSTRIES; },
    getStandards: function() { return STANDARDS; },

    getById: function (id) {
      return this._data[id] || null;
    }
  };

  
  window.IndustryRepository = repo;
})();
