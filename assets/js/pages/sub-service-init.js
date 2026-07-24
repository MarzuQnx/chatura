/**
 * sub-service-init.js — Shared initialization for all sub-service pages
 * Handles: GSAP animations, navbar, FAQ, mobile menu, WhatsApp, counters, i18n
 */
(function () {
    'use strict';

    // ===== NAVBAR SCROLL STATE =====
    function initNavbar() {
        var nav = document.getElementById('navbar-sticky');
        if (!nav) return;

        if (!document.getElementById('navbar-spacer')) {
            var spacer = document.createElement('div');
            spacer.id = 'navbar-spacer';
            spacer.style.height = nav.offsetHeight + 'px';
            spacer.style.width = '100%';
            spacer.style.flexShrink = '0';
            nav.parentNode.insertBefore(spacer, nav.nextSibling);
            window.addEventListener('resize', function () {
                spacer.style.height = nav.offsetHeight + 'px';
            }, { passive: true });
        }

        var isScrolled = false;
        function update() {
            var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            var shouldBeScrolled = y > 50;
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                nav.classList.toggle('scrolled', shouldBeScrolled);
            }
        }
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    // ===== MOBILE MENU =====
    function initMobileMenu() {
        document.querySelectorAll('.mobile-nav-group-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var group = this.closest('.mobile-nav-group');
                if (group) group.classList.toggle('open');
            });
        });

        var mm = document.getElementById('mobileMenu');
        if (mm) {
            window.addEventListener('resize', function () {
                if (window.innerWidth >= 768 && !mm.classList.contains('hidden')) {
                    mm.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                }
            });
        }
    }

    // ===== GSAP ANIMATIONS =====
    function initGSAP() {
        if (typeof gsap === 'undefined') {
            document.querySelectorAll('.reveal-up, .reveal-fade').forEach(function (el) {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
            document.querySelectorAll('.svc-img-composition').forEach(function (el) {
                el.style.opacity = 1;
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Hero animation
        var heroSelector = '#hero-service .reveal-up, #hero-bt .reveal-up, #hero .reveal-up';
        var heroEls = document.querySelectorAll(heroSelector);
        if (heroEls.length > 0) {
            gsap.to(heroEls, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15
            });
        }

        // Batch reveal for non-hero elements
        ScrollTrigger.batch('.reveal-up:not(' + heroSelector.split(', ').join('):not(') + ')', {
            start: 'top 85%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' });
            }
        });

        // Service image compositions
        document.querySelectorAll('.svc-img-composition').forEach(function (composition) {
            var section = composition.closest('section') || composition.parentElement;
            var textColumn = section ? section.querySelector('.reveal-up') : null;
            var shape = composition.querySelector('.absolute');
            var imageContainer = composition.querySelector('.si-shadow');
            if (!shape || !imageContainer) return;

            gsap.set(composition, { clearProps: 'transform', opacity: 1 });
            shape.classList.remove('si-float');
            composition.classList.remove('animated');

            var isLeft = imageContainer.classList.contains('si-slide-from-left');
            var slideX = isLeft ? -180 : 180;

            gsap.set(shape, { opacity: 0, scale: 0.92 });
            gsap.set(imageContainer, { opacity: 0, x: slideX });

            var tl = gsap.timeline({
                scrollTrigger: { trigger: composition, start: 'top 75%', once: true }
            });

            tl.to(shape, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
              .to(imageContainer, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, '-=0.3')
              .add(function () {
                  composition.classList.add('animated');
                  shape.classList.add('si-float');
                  gsap.set([shape, imageContainer], { clearProps: 'transform,opacity' });
              });
        });

        // Final refresh after load
        window.addEventListener('load', function () {
            ScrollTrigger.refresh();
            document.querySelectorAll('.reveal-up').forEach(function (el) {
                if (getComputedStyle(el).opacity === '0') {
                    el.style.opacity = 1;
                    el.style.transform = 'none';
                }
            });
        });

        // Safety net fallback
        setTimeout(function () {
            document.querySelectorAll('.reveal-up').forEach(function (el) {
                if (getComputedStyle(el).opacity === '0') {
                    el.style.opacity = 1;
                    el.style.transform = 'none';
                }
            });
        }, 2000);
    }

    // ===== FAQ ACCORDION =====
    function initFAQ() {
        document.querySelectorAll('.faq-trigger:not(.faq-bound), .faq-toggle:not(.faq-bound)').forEach(function (btn) {
            btn.classList.add('faq-bound');
            btn.removeAttribute('onclick'); // Prevent conflicting inline click handler
            
            btn.addEventListener('click', function () {
                var item = this.closest('.faq-item');
                if (!item) return;
                var icon = this.querySelector('i, .faq-icon, .faq-chevron');
                var isOpen = item.classList.contains('open');

                // Close others
                document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                        var t = openItem.querySelector('.faq-trigger, .faq-toggle');
                        if (t) t.setAttribute('aria-expanded', 'false');
                        var ic = t ? t.querySelector('i, .faq-icon, .faq-chevron') : null;
                        if (ic) ic.style.transform = '';
                    }
                });

                if (isOpen) {
                    item.classList.remove('open');
                    this.setAttribute('aria-expanded', 'false');
                    if (icon) icon.style.transform = '';
                } else {
                    item.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            });
        });

        // prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.faq-content, .faq-answer').forEach(function (el) {
                el.style.transition = 'none';
            });
        }
    }

    // ===== WHATSAPP WIDGET =====
    function initWhatsApp() {
        var launcher = document.getElementById('waLauncher');
        var popup = document.getElementById('waPopup');
        var close = document.getElementById('waClose');
        if (!launcher || !popup) return;

        function togglePopup() {
            var isOpen = popup.classList.contains('is-open');
            popup.classList.toggle('is-open');
            launcher.setAttribute('aria-expanded', !isOpen);
            popup.setAttribute('aria-hidden', isOpen);
        }

        launcher.addEventListener('click', togglePopup);
        if (close) close.addEventListener('click', function (e) { e.stopPropagation(); togglePopup(); });
        document.addEventListener('click', function (e) {
            if (!popup.contains(e.target) && !launcher.contains(e.target) && popup.classList.contains('is-open')) {
                togglePopup();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('is-open')) togglePopup();
        });
    }

    // ===== INTERSECTION OBSERVER (fm-hidden) =====
    function initIntersectionObserver() {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.remove('fm-hidden');
                    e.target.classList.add('fm-visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.fm-hidden').forEach(function (el) { obs.observe(el); });
    }

    // ===== COUNTER ANIMATION =====
    function initCounters() {
        var counters = document.querySelectorAll('[data-counter]:not(.counter-bound)');
        if (!counters.length) return;

        counters.forEach(function (el) { el.classList.add('counter-bound'); });

        var animated = false;
        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-counter'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = performance.now();
            function tick(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                el.textContent = Math.round(easeOutCubic(progress) * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(animateCounter);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    // ===== LANGUAGE SWITCHER =====
    function initLanguageSwitcher() {
        var lang = (window.TranslationRepository && window.TranslationRepository.getCurrentLanguage)
            ? window.TranslationRepository.getCurrentLanguage()
            : localStorage.getItem('lang') || 'en';

        ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
            var container = document.getElementById(id);
            if (!container) return;
            container.querySelectorAll('a[data-lang]').forEach(function (a) {
                a.className = (a.getAttribute('data-lang').trim().toLowerCase() === lang) ? 'lang-active' : 'lang-inactive';
            });
        });

        if (window.PageLoader && typeof window.PageLoader.initialize === 'function') {
            window.PageLoader.initialize();
        }
    }

    // ===== BOOT =====
    function initBase() {
        initNavbar();
        initMobileMenu();
        initFAQ();
        initWhatsApp();
        initCounters();
        initIntersectionObserver();
        initLanguageSwitcher();
        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) {
            try { window.i18nLoader.translatePage(); } catch (e) {}
        }
    }

    function initAll() {
        initBase();
        // GSAP after base init (components may still be loading)
        setTimeout(function () { initGSAP(); }, 100);
    }

    // Listen for component-loader completion
    document.addEventListener('components:all-loaded', function () {
        initFAQ();
        initCounters();
        initGSAP();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
