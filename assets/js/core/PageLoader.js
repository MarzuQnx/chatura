/**
 * PageLoader — Determines which namespaces each page needs and applies translations
 * Locale .js files are loaded via <script> tags BEFORE this runs
 */
(function () {
  'use strict';

  var CONFIG = window.ChaturaConfig;
  var Repo = window.TranslationRepository;
  var Bus = window.ChaturaBus;

  // Intercept GSAP ScrollTrigger batch setup to apply premium unified motion
  if (typeof window.ScrollTrigger !== 'undefined' && typeof window.gsap !== 'undefined') {
    var originalBatch = window.ScrollTrigger.batch;
    window.ScrollTrigger.batch = function (targets, vars) {
      var targetElements = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
      var filtered = [];
      targetElements.forEach(function (el) {
        if (!el.classList.contains('hero-revealed')) {
          filtered.push(el);
        }
      });

      if (targets === '.reveal-up' || targets === '.reveal-up:not(#hero-service .reveal-up)' || targets === '#valuesContainer .reveal-up' || targets === '.reveal-up:not(#hero-transfer .reveal-up)') {
        var userOnEnter = vars.onEnter;
        vars.onEnter = function (batch) {
          window.gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto'
          });
          if (typeof userOnEnter === 'function') {
            userOnEnter(batch);
          }
        };
      }
      return originalBatch.call(window.ScrollTrigger, filtered, vars);
    };
  }

  function animateHeroElements() {
    if (typeof window.gsap !== 'undefined') {
      var heroSelector = '[id*="hero"] .reveal-up, [class*="hero"] .reveal-up, main > section:first-of-type .reveal-up';
      var heroElements = document.querySelectorAll(heroSelector);
      if (heroElements.length > 0) {
        heroElements.forEach(function (el) {
          el.classList.add('hero-revealed');
        });
        window.gsap.to(heroElements, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
          overwrite: 'auto'
        });
      }
    }
  }

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
    animateHeroElements();

    // Event delegation to mark CTA buttons as interacted on hover, preventing page-load animation flash
    document.addEventListener('mouseenter', function (e) {
      var target = e.target;
      if (target && typeof target.matches === 'function' && 
          !target.matches('.svc-card') && 
          !target.matches('.insight-card') && 
          !target.matches('.career-card') && (
        target.matches('.premium-cta') || 
        target.matches('a[class*="bg-[#004D34]"]') || 
        target.matches('a[class*="bg-emerald-"]') || 
        target.matches('a[class*="btn-primary"]') || 
        target.matches('button[class*="btn-primary"]') || 
        target.matches('a[class*="border-gray-300"]') || 
        target.matches('a[class*="border-white"]') || 
        target.matches('button[class*="border-gray-300"]') || 
        target.matches('button[class*="border-white"]') || 
        target.matches('a[class*="text-[#004D34]"]') ||
        target.matches('a[class*="text-emerald-"]')
      )) {
        target.classList.add('has-interacted');
      }
    }, true);

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
