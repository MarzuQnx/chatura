/**
 * PageLoader — Determines which namespaces each page needs and applies translations
 * Locale .js files are loaded via <script> tags BEFORE this runs
 */
(function () {
  'use strict';

  var CONFIG = window.ChaturaConfig;
  var Repo = window.TranslationRepository;
  var Bus = window.ChaturaBus;

  function setText(el, text) {
    var textNodes = [];
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) textNodes.push(el.childNodes[i]);
    }
    if (textNodes.length === 0) {
      el.insertBefore(document.createTextNode(text), el.firstChild);
    } else if (textNodes.length === 1) {
      textNodes[0].textContent = text;
    } else {
      textNodes[0].textContent = text;
      for (var j = 1; j < textNodes.length; j++) textNodes[j].textContent = '';
    }
  }

  function applyTranslations() {
    var data = Repo.getAllTranslations();

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (data[key] !== undefined) setText(el, data[key]);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (data[key] !== undefined) el.placeholder = data[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (data[key] !== undefined) el.title = data[key];
    });

    document.documentElement.lang = Repo.getCurrentLanguage();
    document.title = data['site.title'] || document.title;
  }

  function updateLangSelector(lang) {
    ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) updateSelectorLinks(el, lang);
    });

    var portalSelector = document.querySelector('.portal-footer-lang');
    if (portalSelector) updateSelectorLinks(portalSelector, lang);
  }

  function updateSelectorLinks(selector, lang) {
    selector.querySelectorAll('a').forEach(function (a) {
      var linkLang = (a.getAttribute('data-lang') || a.textContent).trim().toLowerCase();
      if (CONFIG.supportedLangs.indexOf(linkLang) === -1) return;
      a.className = linkLang === lang ? 'lang-active' : 'lang-inactive';
    });
  }

  function bindSelectorEvents() {
    ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) bindSelector(el);
    });

    var portalSelector = document.querySelector('.portal-footer-lang');
    if (portalSelector) bindSelector(portalSelector);
  }

  function bindSelector(selector) {
    selector.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var newLang = (a.getAttribute('data-lang') || a.textContent).trim().toLowerCase();
        Repo.setLanguage(newLang);
      });
    });
  }

  function initialize() {
    var lang = Repo.getCurrentLanguage();
    updateLangSelector(lang);
    applyTranslations();

    Bus.on('languageChange', function () {
      updateLangSelector(Repo.getCurrentLanguage());
      applyTranslations();
      window.dispatchEvent(new CustomEvent('langChange', {
        detail: { lang: Repo.getCurrentLanguage(), data: Repo.getAllTranslations() }
      }));
    });

    bindSelectorEvents();
  }

  window.PageLoader = {
    initialize: initialize,
    applyTranslations: applyTranslations
  };
})();
