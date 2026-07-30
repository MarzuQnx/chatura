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

      if (typeof targets === 'string' && targets.indexOf('.reveal-up') !== -1) {
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
      var heroSelector = '[id*="hero"] .reveal-up, [class*="hero"] .reveal-up, .hero-section .reveal-up';
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

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (data[key] !== undefined) el.innerHTML = data[key];
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (data[key] !== undefined) el.alt = data[key];
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (data[key] !== undefined) el.setAttribute('aria-label', data[key]);
    });

    document.querySelectorAll('[data-i18n-aria-description]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-description');
      if (data[key] !== undefined) el.setAttribute('aria-description', data[key]);
    });

    document.querySelectorAll('[data-i18n-tooltip]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-tooltip');
      if (data[key] !== undefined) {
        el.setAttribute('data-tooltip', data[key]);
        el.title = data[key];
      }
    });

    document.querySelectorAll('[data-i18n-value]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-value');
      if (data[key] !== undefined) el.value = data[key];
    });

    document.querySelectorAll('meta[name="description"]').forEach(function (el) {
      if (data['meta.description']) el.setAttribute('content', data['meta.description']);
    });
    document.querySelectorAll('meta[property="og:title"]').forEach(function (el) {
      if (data['meta.og_title']) el.setAttribute('content', data['meta.og_title']);
    });
    document.querySelectorAll('meta[property="og:description"]').forEach(function (el) {
      if (data['meta.og_description']) el.setAttribute('content', data['meta.og_description']);
    });
    document.querySelectorAll('meta[name="twitter:title"]').forEach(function (el) {
      if (data['meta.twitter_title']) el.setAttribute('content', data['meta.twitter_title']);
    });
    document.querySelectorAll('meta[name="twitter:description"]').forEach(function (el) {
      if (data['meta.twitter_description']) el.setAttribute('content', data['meta.twitter_description']);
    });

    document.documentElement.lang = Repo.getCurrentLanguage();
    document.title = data['site.title'] || document.title;
  }

  function updateLangSelector(lang) {
    var activeLang = lang || (Repo ? Repo.getCurrentLanguage() : 'en');
    var containers = document.querySelectorAll('#lang-selector, #lang-selector-mobile, .portal-footer-lang, [data-lang-switcher]');
    containers.forEach(function (container) {
      container.querySelectorAll('a[data-lang]').forEach(function (a) {
        var linkLang = (a.getAttribute('data-lang') || a.textContent).trim().toLowerCase();
        if (CONFIG && CONFIG.supportedLangs && CONFIG.supportedLangs.indexOf(linkLang) === -1) return;
        a.className = linkLang === activeLang ? 'lang-active' : 'lang-inactive';
      });
    });
  }

  // Global event delegation for language switching on click
  document.addEventListener('click', function (e) {
    var target = e.target;
    var langLink = (target && typeof target.closest === 'function')
      ? target.closest('#lang-selector a[data-lang], #lang-selector-mobile a[data-lang], .portal-footer-lang a[data-lang], [data-lang-switcher] a[data-lang]')
      : null;
    if (langLink) {
      e.preventDefault();
      var newLang = (langLink.getAttribute('data-lang') || langLink.textContent).trim().toLowerCase();
      if (Repo && typeof Repo.setLanguage === 'function') {
        Repo.setLanguage(newLang);
      }
    }
  });

  function initNavbarScroll() {
    var nav = document.getElementById('navbar-sticky');
    if (!nav) return;

    var isScrolled = false;
    function update() {
      var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      var shouldBeScrolled = y > 40;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        nav.classList.toggle('scrolled', shouldBeScrolled);
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initDesktopDropdowns() {
    if (window.__desktopDropdownsBound) return;
    window.__desktopDropdownsBound = true;

    document.addEventListener('click', function (e) {
      // Find if a top-level link inside .nav-dropdown was clicked
      var toggle = e.target.closest('.nav-dropdown > a, .nav-dropdown-toggle');
      if (toggle) {
        var dropdown = toggle.closest('.nav-dropdown');
        if (dropdown) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('is-open');

          // Close all open dropdowns
          document.querySelectorAll('.nav-dropdown.is-open, .nav-dropdown.active').forEach(function (d) {
            d.classList.remove('is-open', 'active');
          });

          // Toggle clicked dropdown if it wasn't open
          if (!isOpen) {
            dropdown.classList.add('is-open', 'active');
          }
          return;
        }
      }

      // Close dropdowns when clicking outside
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.is-open, .nav-dropdown.active').forEach(function (d) {
          d.classList.remove('is-open', 'active');
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-dropdown.is-open, .nav-dropdown.active').forEach(function (d) {
          d.classList.remove('is-open', 'active');
        });
      }
    });
  }

  function initMobileAccordion() {
    if (window.__mobileAccordionBound) return;
    window.__mobileAccordionBound = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.mobile-nav-group-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        var group = btn.closest('.mobile-nav-group');
        if (group) {
          group.classList.toggle('open');
        }
      }
    });
  }

  function initWhatsAppWidget() {
    var launcher = document.getElementById('waLauncher');
    var popup = document.getElementById('waPopup');
    var close = document.getElementById('waClose');
    if (!launcher || !popup) return;

    if (launcher.getAttribute('data-wa-bound') === 'true') return;
    launcher.setAttribute('data-wa-bound', 'true');

    function togglePopup() {
      var isOpen = popup.classList.contains('is-open');
      popup.classList.toggle('is-open');
      launcher.setAttribute('aria-expanded', !isOpen);
      popup.setAttribute('aria-hidden', isOpen);
    }

    launcher.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      togglePopup();
    });

    if (close) {
      close.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePopup();
      });
    }

    document.addEventListener('click', function (e) {
      if (popup.classList.contains('is-open') && !popup.contains(e.target) && !launcher.contains(e.target)) {
        togglePopup();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) {
        togglePopup();
      }
    });
  }

  function enhanceCtaMicroInteractions() {
    var ctaElements = document.querySelectorAll('a, button');
    ctaElements.forEach(function (cta) {
      var arrow = cta.querySelector('i[data-lucide*="arrow"], svg[data-lucide*="arrow"], i.lucide-arrow-right, svg.lucide-arrow-right, .cta-arrow');
      if (!arrow) return;

      if (!cta.classList.contains('group/cta') && !cta.classList.contains('group/btn') && !cta.classList.contains('group/navbtn')) {
        cta.classList.add('group/cta');
      }

      if (!arrow.classList.contains('cta-arrow')) {
        arrow.classList.add('cta-arrow');
      }
      if (!arrow.classList.contains('inline-block')) {
        arrow.classList.add('inline-block');
      }

      if (arrow.tagName.toLowerCase() === 'svg') {
        arrow.setAttribute('width', '14');
        arrow.setAttribute('height', '14');
        arrow.style.width = '14px';
        arrow.style.height = '14px';
      }

      var existingCtaText = cta.querySelector('.cta-text');
      if (!existingCtaText) {
        var spanNode = cta.querySelector('span');
        if (spanNode) {
          spanNode.classList.add('cta-text');
          if (!spanNode.classList.contains('inline-block')) {
            spanNode.classList.add('inline-block');
          }
        } else {
          var textNode = null;
          for (var i = 0; i < cta.childNodes.length; i++) {
            var node = cta.childNodes[i];
            if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
              textNode = node;
              break;
            }
          }
          if (textNode) {
            var span = document.createElement('span');
            span.className = 'cta-text inline-block';
            span.textContent = textNode.nodeValue;
            cta.insertBefore(span, textNode);
            cta.removeChild(textNode);
          }
        }
      }
    });
  }

  function initialize() {
    var lang = Repo.getCurrentLanguage();
    updateLangSelector(lang);
    applyTranslations();
    animateHeroElements();
    initNavbarScroll();
    initDesktopDropdowns();
    initMobileAccordion();
    initWhatsAppWidget();
    enhanceCtaMicroInteractions();

    document.addEventListener('component:loaded', function (e) {
      initWhatsAppWidget();
      enhanceCtaMicroInteractions();
      if (e.detail && (e.detail.name === 'shared/navbar' || e.detail.name === 'shared/navbar-sub' || e.detail.name === 'shared/footer' || e.detail.name === 'shared/footer-sub')) {
        initNavbarScroll();
        updateLangSelector(Repo ? Repo.getCurrentLanguage() : 'en');
        applyTranslations();
      }
    });

    document.addEventListener('components:all-loaded', function () {
      initNavbarScroll();
      initWhatsAppWidget();
      enhanceCtaMicroInteractions();
      updateLangSelector(Repo ? Repo.getCurrentLanguage() : 'en');
      applyTranslations();
    });

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

    Bus.on('languageChange', function (payload) {
      var activeLang = (payload && payload.lang) ? payload.lang : (Repo ? Repo.getCurrentLanguage() : 'en');
      updateLangSelector(activeLang);
      applyTranslations();
      window.dispatchEvent(new CustomEvent('langChange', {
        detail: { lang: activeLang, data: Repo.getAllTranslations() }
      }));
    });
  }

  // Safety fallback for cross-browser GSAP initialization (Firefox, Chrome Mac)
  setTimeout(function () {
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      if (window.getComputedStyle(el).opacity === '0') {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 1200);

  window.PageLoader = {
    initialize: initialize,
    applyTranslations: applyTranslations,
    initNavbarScroll: initNavbarScroll,
    initWhatsAppWidget: initWhatsAppWidget
  };

  window.i18nLoader = {
    translatePage: function () {
      applyTranslations();
    }
  };
})();
