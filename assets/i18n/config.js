/**
 * Chatura i18n Configuration
 * Language settings, supported locales, default language
 */
(function () {
  'use strict';

  var CONFIG = {
    supportedLangs: ['en', 'id'],
    defaultLang: 'en',
    storageKey: 'lang',
    i18nBasePath: (function () {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('loader.js') !== -1) {
          return src.replace(/loader\.js$/, 'locales/');
        }
      }
      var page = window.location.pathname;
      var depth = (page.replace(/[^/]/g, '').length - 1) || 0;
      var prefix = '';
      for (var j = 0; j < depth; j++) prefix += '../';
      return prefix + 'assets/i18n/locales/';
    })(),
    sharedNamespaces: ['common', 'navigation', 'footer'],
    pageNamespaces: {
      'index.html': ['home'],
      'services.html': ['services'],
      'industries.html': ['industries'],
      'insights.html': ['insights'],
      'our-people.html': ['people'],
      'career.html': ['career'],
      'contact-us.html': ['contact'],
      'business-transfer.html': ['business-transfer'],
      'case-studies.html': ['case-studies'],
      'access-portal.html': ['portal'],
      'insight-detail.html': ['insight-detail']
    }
  };

  window.ChaturaConfig = CONFIG;
})();
