/**
 * PeopleRepository
 * Single source of truth for AUTHORS
 */
(function () {
  'use strict';
  
  var EXPERTISE = [
            { name: 'Accounting', nameKey: 'people.exp_accounting' },
            { name: 'Tax', nameKey: 'people.exp_tax' },
            { name: 'Corporate Finance', nameKey: 'people.exp_corp_finance' },
            { name: 'Business Advisory', nameKey: 'people.exp_biz_advisory' },
            { name: 'Risk Management', nameKey: 'people.exp_risk_mgmt' },
            { name: 'Business Transfer', nameKey: 'people.exp_biz_transfer' },
            { name: 'Due Diligence', nameKey: 'people.exp_due_diligence' },
            { name: 'Transfer Pricing', nameKey: 'people.exp_transfer_pricing' },
            { name: 'ESG', nameKey: 'people.exp_esg' },
            { name: 'Digital Transformation', nameKey: 'people.exp_digital' },
            { name: 'Internal Control', nameKey: 'people.exp_internal_ctrl' },
            { name: 'Regulatory Compliance', nameKey: 'people.exp_regulatory' }
        ];
  var PEOPLE = [
            {
                id: "p1",
                nameKey: "people.p1_name",
                titleKey: "people.p1_title",
                category: "leadership",
                practiceKey: "people.p1_practice",
                locationKey: "people.p1_location",
                photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80",
                email: "schweizer.c@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p1_bio",
                expertiseKeys: ["people.p1_exp_1", "people.p1_exp_2", "people.p1_exp_3"],
                experienceKeys: ["people.p1_exp_4", "people.p1_exp_5"],
                publicationKeys: ["people.p1_pub_1", "people.p1_pub_2"],
                publicationDates: ["Jan 2026", "Nov 2025"]
            },
            {
                id: "p2",
                nameKey: "people.p2_name",
                titleKey: "people.p2_title",
                category: "director",
                practiceKey: "people.p2_practice",
                locationKey: "people.p2_location",
                photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=80",
                email: "bolden.d@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p2_bio",
                expertiseKeys: ["people.p2_exp_1", "people.p2_exp_2", "people.p2_exp_3"],
                experienceKeys: ["people.p2_exp_4", "people.p2_exp_5"],
                publicationKeys: ["people.p2_pub_1"],
                publicationDates: ["Mar 2026"]
            },
            {
                id: "p3",
                nameKey: "people.p3_name",
                titleKey: "people.p3_title",
                category: "partner",
                practiceKey: "people.p3_practice",
                locationKey: "people.p3_location",
                photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=500&q=80",
                email: "monry.a@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p3_bio",
                expertiseKeys: ["people.p3_exp_1", "people.p3_exp_2", "people.p3_exp_3"],
                experienceKeys: ["people.p3_exp_4", "people.p3_exp_5"],
                publicationKeys: ["people.p3_pub_1", "people.p3_pub_2"],
                publicationDates: ["Feb 2024", "Aug 2025"]
            },
            {
                id: "p4",
                nameKey: "people.p4_name",
                titleKey: "people.p4_title",
                category: "partner",
                practiceKey: "people.p4_practice",
                locationKey: "people.p4_location",
                photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80",
                email: "erlan.b@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p4_bio",
                expertiseKeys: ["people.p4_exp_1", "people.p4_exp_2", "people.p4_exp_3"],
                experienceKeys: ["people.p4_exp_4", "people.p4_exp_5"],
                publicationKeys: ["people.p4_pub_1"],
                publicationDates: ["Apr 2026"]
            },
            {
                id: "p5",
                nameKey: "people.p5_name",
                titleKey: "people.p5_title",
                category: "partner",
                practiceKey: "people.p5_practice",
                locationKey: "people.p5_location",
                photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=500&q=80",
                email: "nadya.a@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p5_bio",
                expertiseKeys: ["people.p5_exp_1", "people.p5_exp_2", "people.p5_exp_3"],
                experienceKeys: ["people.p5_exp_4", "people.p5_exp_5"],
                publicationKeys: ["people.p5_pub_1"],
                publicationDates: ["May 2026"]
            },
            {
                id: "p6",
                nameKey: "people.p6_name",
                titleKey: "people.p6_title",
                category: "partner",
                practiceKey: "people.p6_practice",
                locationKey: "people.p6_location",
                photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80",
                email: "agustina.d@chatura-indonesia.com",
                linkedin: "https://linkedin.com",
                bioKey: "people.p6_bio",
                expertiseKeys: ["people.p6_exp_1", "people.p6_exp_2", "people.p6_exp_3"],
                experienceKeys: ["people.p6_exp_4", "people.p6_exp_5"],
                publicationKeys: ["people.p6_pub_1", "people.p6_pub_2"],
                publicationDates: ["May 2026", "Mar 2026"]
            }
        ];
  var _data = PEOPLE;
  var repo = {
    _data: _data,
    getAll: function() { return PEOPLE; },
    getExpertise: function() { return EXPERTISE; },

    getById: function (id) {
      return this._data[id] || null;
    },
    getByPeopleId: function (peopleId) {
      var keys = Object.keys(this._data);
      for (var i = 0; i < keys.length; i++) {
        if (this._data[keys[i]].peopleId === peopleId) return this._data[keys[i]];
      }
      return null;
    }
  };

  
  window.PeopleRepository = repo;
})();
