/**
 * TranslationRepository — Enterprise i18n engine
 * Reads from window.__CHATURA_LOCALES (synchronous .js locale files)
 * Provides translation API, language switching, fallback
 */
(function () {
  'use strict';

  var CONFIG = window.ChaturaConfig;
  var Bus = window.ChaturaBus;

  var currentLang = (function () {
    var stored = localStorage.getItem(CONFIG.storageKey);
    return CONFIG.supportedLangs.indexOf(stored) !== -1 ? stored : CONFIG.defaultLang;
  })();

  var I18N_DEBUG = (function () {
    var params = new URLSearchParams(window.location.search);
    if (params.get('i18n_debug') === '1') {
      localStorage.setItem('I18N_DEBUG', '1');
      return true;
    }
    return localStorage.getItem('I18N_DEBUG') === '1';
  })();

  function getLocaleData() {
    return window.__CHATURA_LOCALES || {};
  }

  function translate(key) {
    var locales = getLocaleData();
    var langData = locales[currentLang];
    if (langData && langData[key] !== undefined) return langData[key];

    if (currentLang !== CONFIG.defaultLang) {
      var fallback = locales[CONFIG.defaultLang];
      if (fallback && fallback[key] !== undefined) return fallback[key];
    }

    if (I18N_DEBUG) {
      console.warn('[i18n] missing key:', key);
      return '[' + key + ']';
    }

    return key;
  }

  function translateWithPrefix(prefix, key) {
    return translate(prefix + '.' + key);
  }

  function setLanguage(lang) {
    if (CONFIG.supportedLangs.indexOf(lang) === -1 || lang === currentLang) return;
    var oldLang = currentLang;
    currentLang = lang;
    localStorage.setItem(CONFIG.storageKey, lang);
    Bus.emit('languageChange', { lang: lang, previousLang: oldLang });
  }

  function getCurrentLanguage() {
    return currentLang;
  }

  function exists(key) {
    var locales = getLocaleData();
    var langData = locales[currentLang];
    return langData ? langData[key] !== undefined : false;
  }

  function getAllTranslations() {
    var locales = getLocaleData();
    var merged = {};
    var langData = locales[currentLang];
    if (langData) {
      Object.keys(langData).forEach(function (k) { merged[k] = langData[k]; });
    }
    return merged;
  }

  window.TranslationRepository = {
    t: translate,
    tp: translateWithPrefix,
    setLanguage: setLanguage,
    getCurrentLanguage: getCurrentLanguage,
    exists: exists,
    getAllTranslations: getAllTranslations,
    setDebug: function (enabled) {
      I18N_DEBUG = !!enabled;
      localStorage.setItem('I18N_DEBUG', I18N_DEBUG ? '1' : '0');
    },
    isDebug: function () { return I18N_DEBUG; }
  };

  window.I18N_DEBUG = I18N_DEBUG;
})();
