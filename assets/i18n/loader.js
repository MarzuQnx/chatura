/**
 * Chatura i18n Loader — Entry point
 * Loads AFTER config.js, core modules, and locale .js files via <script> tags
 * HTML load order:
 *   config.js → EventBus.js → Repository.js → TranslationRepository.js
 *   → PageLoader.js → locale .js files → loader.js
 */
(function () {
  'use strict';

  window.setLang = function (lang) {
    window.TranslationRepository.setLanguage(lang);
  };

  window.getTranslations = function () {
    return window.TranslationRepository.getAllTranslations();
  };

  window.t = function (key) {
    return window.TranslationRepository.t(key);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.PageLoader.initialize();
    });
  } else {
    window.PageLoader.initialize();
  }
})();
