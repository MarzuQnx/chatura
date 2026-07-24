/**
 * CareerRepository
 * Auto-generated stub to fix missing methods
 */
(function () {
  'use strict';
  
    var _data = [
    {
      id: 'job1',
      title: { en: 'Legal Associate', id: 'Asosiasi Hukum' },
      department: { en: 'Legal', id: 'Hukum' },
      location: { en: 'Jakarta', id: 'Jakarta' },
      dept: 'legal',
      deptLabel: { en: 'Legal', id: 'Hukum' },
      icon: 'scale',
      type: { en: 'Full-Time', id: 'Penuh Waktu' },
      about: { en: 'Join our Legal team to assist in corporate law and compliance cases.', id: 'Bergabunglah dengan tim Hukum kami untuk membantu dalam kasus hukum korporasi dan kepatuhan.' },
      summary: { en: 'Join our Legal team to assist in corporate law and compliance cases.', id: 'Bergabunglah dengan tim Hukum kami untuk membantu dalam kasus hukum korporasi dan kepatuhan.' },
      featured: true
    },
    {
      id: 'job2',
      title: { en: 'Tax Consultant', id: 'Konsultan Pajak' },
      department: { en: 'Tax Services', id: 'Layanan Pajak' },
      location: { en: 'Jakarta', id: 'Jakarta' },
      dept: 'tax',
      deptLabel: { en: 'Tax', id: 'Pajak' },
      icon: 'file-text',
      type: { en: 'Full-Time', id: 'Penuh Waktu' },
      about: { en: 'Provide strategic tax advice and compliance solutions for multinational clients.', id: 'Memberikan saran pajak strategis dan solusi kepatuhan untuk klien multinasional.' },
      summary: { en: 'Provide strategic tax advice and compliance solutions for multinational clients.', id: 'Memberikan saran pajak strategis dan solusi kepatuhan untuk klien multinasional.' },
      featured: true
    },
    {
      id: 'job3',
      title: { en: 'Finance Analyst', id: 'Analis Keuangan' },
      department: { en: 'Accounting & Finance', id: 'Akuntansi & Keuangan' },
      location: { en: 'Jakarta', id: 'Jakarta' },
      dept: 'finance',
      deptLabel: { en: 'Finance', id: 'Keuangan' },
      icon: 'pie-chart',
      type: { en: 'Full-Time', id: 'Penuh Waktu' },
      about: { en: 'Analyze financial data and support business restructuring operations.', id: 'Menganalisis data keuangan dan mendukung operasi restrukturisasi bisnis.' },
      summary: { en: 'Analyze financial data and support business restructuring operations.', id: 'Menganalisis data keuangan dan mendukung operasi restrukturisasi bisnis.' },
      featured: true
    },
    {
      id: 'job4',
      title: { en: 'Risk Management Associate', id: 'Asosiasi Manajemen Risiko' },
      department: { en: 'Risk Management', id: 'Manajemen Risiko' },
      location: { en: 'Jakarta', id: 'Jakarta' },
      dept: 'risk',
      deptLabel: { en: 'Risk Management', id: 'Manajemen Risiko' },
      icon: 'shield-alert',
      type: { en: 'Full-Time', id: 'Penuh Waktu' },
      about: { en: 'Identify and mitigate enterprise risks for our corporate clients.', id: 'Mengidentifikasi dan memitigasi risiko perusahaan untuk klien korporat kami.' },
      summary: { en: 'Identify and mitigate enterprise risks for our corporate clients.', id: 'Mengidentifikasi dan memitigasi risiko perusahaan untuk klien korporat kami.' },
      featured: true
    }
  ];
  
  var repo = {
    _data: _data,
    getLocalized: function(obj, lang) {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[lang] || obj['en'] || '';
    },
    getAll: function () { return this._data; },
    getById: function (id) { return this._data.find(i => i.id === id); },
    getFeaturedJobs: function() { return this._data.filter(j => j.featured); },
    getPositions: function() { return this._data; },
    getPositionsByDept: function(dept) { return dept === 'all' ? this._data : this._data.filter(j => j.dept === dept); },
    getPositionById: function(id) { return this.getById(id); },
    getValues: function() { return [
        { icon: 'trending-up', i18nTitle: 'career.value_1_title', i18nDesc: 'career.value_1_desc' },
        { icon: 'users', i18nTitle: 'career.value_2_title', i18nDesc: 'career.value_2_desc' },
        { icon: 'target', i18nTitle: 'career.value_3_title', i18nDesc: 'career.value_3_desc' }
    ]; },
    getGallery: function() { return [
        { thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Team Collaboration', id: 'Kolaborasi Tim' }, labelBadge: { en: 'Team Collaboration', id: 'Kolaborasi Tim' }, hasSideAccent: true, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Corporate Meeting', id: 'Rapat Korporat' }, labelBadge: { en: 'Corporate Meeting', id: 'Rapat Korporat' }, hasSideAccent: false, hasBlendOverlay: true },
        { thumb: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Office Space', id: 'Ruang Kantor' }, labelBadge: { en: 'Office Space', id: 'Ruang Kantor' }, hasSideAccent: false, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Team Brainstorming', id: 'Tukar Pikiran' }, labelBadge: { en: 'Team Brainstorming', id: 'Tukar Pikiran' }, hasSideAccent: false, hasBlendOverlay: true },
        { thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Professional Discussion', id: 'Diskusi Profesional' }, labelBadge: { en: 'Professional Discussion', id: 'Diskusi Profesional' }, hasSideAccent: true, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Networking Event', id: 'Acara Jaringan' }, labelBadge: { en: 'Networking Event', id: 'Acara Jaringan' }, hasSideAccent: false, hasBlendOverlay: true },
        { thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Strategy Session', id: 'Sesi Strategi' }, labelBadge: { en: 'Strategy Session', id: 'Sesi Strategi' }, hasSideAccent: false, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Digital Analytics', id: 'Analisis Digital' }, labelBadge: { en: 'Digital Analytics', id: 'Analisis Digital' }, hasSideAccent: true, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Modern Workspace', id: 'Ruang Kerja Modern' }, labelBadge: { en: 'Modern Workspace', id: 'Ruang Kerja Modern' }, hasSideAccent: false, hasBlendOverlay: true },
        { thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Corporate Architecture', id: 'Arsitektur Korporat' }, labelBadge: { en: 'Corporate Architecture', id: 'Arsitektur Korporat' }, hasSideAccent: false, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Team Work', id: 'Kerja Tim' }, labelBadge: { en: 'Team Work', id: 'Kerja Tim' }, hasSideAccent: true, hasBlendOverlay: false },
        { thumb: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80', alt: { en: 'Business Meeting', id: 'Rapat Bisnis' }, labelBadge: { en: 'Business Meeting', id: 'Rapat Bisnis' }, hasSideAccent: false, hasBlendOverlay: true }
    ]; },
    getPrograms: function() { return [
        { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', alt: { en: 'Internship', id: 'Program Magang' }, labelBadge: { en: 'Internship', id: 'Program Magang' }, icon: 'graduation-cap', i18nTitle: 'career.internship_title', i18nDesc: 'career.internship_desc', bullets: ['career.internship_bullet_1', 'career.internship_bullet_2', 'career.internship_bullet_3'] },
        { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', alt: { en: 'Future Leaders', id: 'Pemimpin Masa Depan' }, labelBadge: { en: 'Future Leaders', id: 'Pemimpin Masa Depan' }, icon: 'star', i18nTitle: 'career.leaders_title', i18nDesc: 'career.leaders_desc', bullets: ['career.leaders_bullet_1', 'career.leaders_bullet_2', 'career.leaders_bullet_3'] }
    ]; },
    getBenefits: function() { return [
        { icon: 'shield-check', i18nTitle: 'career.benefit_1_title', i18nDesc: 'career.benefit_1_desc' },
        { icon: 'graduation-cap', i18nTitle: 'career.benefit_2_title', i18nDesc: 'career.benefit_2_desc' },
        { icon: 'award', i18nTitle: 'career.benefit_3_title', i18nDesc: 'career.benefit_3_desc' },
        { icon: 'laptop', i18nTitle: 'career.benefit_4_title', i18nDesc: 'career.benefit_4_desc' },
        { icon: 'book-open', i18nTitle: 'career.benefit_5_title', i18nDesc: 'career.benefit_5_desc' },
        { icon: 'coffee', i18nTitle: 'career.benefit_6_title', i18nDesc: 'career.benefit_6_desc' }
    ]; },
    getHiringProcess: function() { return [
        { icon: 'file-text', i18nTitle: 'career.process_step_1_title', i18nDesc: 'career.process_step_1_desc' },
        { icon: 'search', i18nTitle: 'career.process_step_2_title', i18nDesc: 'career.process_step_2_desc' },
        { icon: 'users', i18nTitle: 'career.process_step_3_title', i18nDesc: 'career.process_step_3_desc' },
        { icon: 'briefcase', i18nTitle: 'career.process_step_4_title', i18nDesc: 'career.process_step_4_desc' },
        { icon: 'check-circle', i18nTitle: 'career.process_step_5_title', i18nDesc: 'career.process_step_5_desc' }
    ]; },
    getFaq: function() { return [
        { i18nQuestion: 'career.faq_1', i18nAnswer: 'career.faq_1_answer' },
        { i18nQuestion: 'career.faq_2', i18nAnswer: 'career.faq_2_answer' },
        { i18nQuestion: 'career.faq_3', i18nAnswer: 'career.faq_3_answer' }
    ]; }
  };
  
  window.CareerRepository = repo;
})();
