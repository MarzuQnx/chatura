/**
 * sub-industry-init.js — Page Controller for all Sub-Industry Index pages
 */
(function () {
    'use strict';
    var _initialized = false;

    function initPage() {
        if (_initialized) return;
        _initialized = true;

        if (window.PeopleRenderer) { try { window.PeopleRenderer.init(); } catch (e) {} }
        if (window.ArticleRenderer) { try { window.ArticleRenderer.init(); } catch (e) {} }

        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch (e) {} }

        initNavbar();
        initLanguageSwitcher();
        initAccordion();
        initGSAPAnimations();
    }

    // ===== NAVBAR SCROLL STATE =====
    function initNavbar() {
        var nav = document.getElementById('navbar-sticky');
        if (!nav) return;

        if (!document.getElementById('navbar-spacer')) {
            var spacer = document.createElement('div');
            spacer.id = 'navbar-spacer';
            spacer.style.height = '0px';
            nav.parentNode.insertBefore(spacer, nav.nextSibling);
        }

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

    // ===== LANGUAGE SWITCHER =====
    function initLanguageSwitcher() {
        var lang = (window.TranslationRepository && window.TranslationRepository.getCurrentLanguage)
            ? window.TranslationRepository.getCurrentLanguage()
            : 'en';

        ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
            var container = document.getElementById(id);
            if (!container) return;
            container.querySelectorAll('a[data-lang]').forEach(function (a) {
                a.className = (a.getAttribute('data-lang').trim().toLowerCase() === lang) ? 'lang-active' : 'lang-inactive';
            });
        });
    }

    function initAccordion() {
        document.querySelectorAll('.faq-item').forEach(function (item) {
            var btn = item.querySelector('.faq-toggle') || item.querySelector('button');
            if (!btn) return;
            btn.onclick = function () {
                var isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(function (other) { other.classList.remove('open'); });
                if (!isOpen) item.classList.add('open');
            };
        });
    }

    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') {
            document.querySelectorAll('.reveal-up').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        var heroSelector = '[id*="hero"] .reveal-up';
        var heroEls = document.querySelectorAll(heroSelector);
        if (heroEls.length > 0) {
            gsap.set(heroEls, { opacity: 0, y: 30 });
            gsap.to(heroEls, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15
            });
        }

        var revealEls = document.querySelectorAll('.reveal-up:not(' + heroSelector + ')');
        if (revealEls.length > 0) {
            gsap.set(revealEls, { opacity: 0, y: 30 });
        }

        ScrollTrigger.batch('.reveal-up:not(' + heroSelector + ')', {
            start: 'top 85%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' });
            }
        });
    }

    var _booted = false;
    function safeBoot() {
        if (_booted) return;
        _booted = true;
        initPage();
    }

    document.addEventListener('components:all-loaded', safeBoot);

    setTimeout(function () {
        if (_booted) return;
        if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
            window.ComponentLoader.init().then(safeBoot);
        } else {
            safeBoot();
        }
    }, 1500);
})();
