/**
 * IndustryRepository
 * Single source of truth for INDUSTRIES
 */
(function () {
  'use strict';
  
  var INDUSTRIES = [
            { slug: 'industries/energy/', icon: 'zap', nameKey: 'people.ind_energy', name: { en: 'Energy & Natural Resources', id: 'Energi & Sumber Daya Alam' }, desc: { en: 'Oil, gas, mining, and renewable energy sectors.', id: 'Sektor minyak, gas, pertambangan, dan energi terbarukan.' }, relatedPeople: ['p3', 'p4'] },
            { slug: 'industries/manufacturing/', icon: 'factory', nameKey: 'people.ind_manufacturing', name: { en: 'Manufacturing', id: 'Manufaktur' }, desc: { en: 'Industrial operations and supply chain.', id: 'Operasi industri dan rantai pasok.' }, relatedPeople: ['p3'] },
            { slug: 'industries/healthcare/', icon: 'heart-pulse', nameKey: 'people.ind_healthcare', name: { en: 'Healthcare', id: 'Kesehatan' }, desc: { en: 'Health systems, pharmaceuticals, and medical devices.', id: 'Sistem kesehatan, farmasi, dan alat kesehatan.' }, relatedPeople: [] },
            { slug: 'industries/technology/', icon: 'cpu', nameKey: 'people.ind_tech', name: { en: 'Technology', id: 'Teknologi' }, desc: { en: 'Digital platforms, SaaS, and tech startups.', id: 'Platform digital, SaaS, dan startup teknologi.' }, relatedPeople: [] },
            { slug: 'industries/infrastructure/', icon: 'building-2', nameKey: 'people.ind_infra', name: { en: 'Infrastructure', id: 'Infrastruktur' }, desc: { en: 'Transportation, utilities, and public works.', id: 'Transportasi, utilitas, dan pekerjaan umum.' }, relatedPeople: [] },
            { slug: 'industries/consumer/', icon: 'shopping-bag', nameKey: 'people.ind_consumer', name: { en: 'Consumer Goods', id: 'Barang Konsumen' }, desc: { en: 'FMCG, retail, and consumer services.', id: 'FMCG, ritel, dan layanan konsumen.' }, relatedPeople: ['p4'] },
            { slug: 'industries/financial/', icon: 'landmark', nameKey: 'people.ind_financial', name: { en: 'Financial Services', id: 'Layanan Keuangan' }, desc: { en: 'Banking, insurance, and capital markets.', id: 'Perbankan, asuransi, dan pasar modal.' }, relatedPeople: ['p1', 'p6'] },
            { slug: 'industries/education/', icon: 'graduation-cap', nameKey: 'people.ind_education', name: { en: 'Education', id: 'Pendidikan' }, desc: { en: 'Universities, EdTech, and training institutions.', id: 'Universitas, EdTech, dan lembaga pelatihan.' }, relatedPeople: [] },
            { slug: 'industries/automotive/', icon: 'car', nameKey: 'people.ind_automotive', name: { en: 'Automotive', id: 'Otomotif' }, desc: { en: 'OEMs, parts suppliers, and EV transition.', id: 'OEM, pemasok suku cadang, dan transisi EV.' }, relatedPeople: ['p3'] }
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
