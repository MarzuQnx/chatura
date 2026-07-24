/**
 * Page Controllers & Interactions for About / Landing Page (index-modular.html)
 * Designed to execute AFTER component HTML fragments are loaded into the DOM.
 */

(function () {
    'use strict';
    var _aboutInitialized = false;

    function initAboutPage() {
        if (_aboutInitialized) return;
        _aboutInitialized = true;
        // ===== 1. Renderers Execution =====
        if (window.ServiceRenderer && typeof window.ServiceRenderer.init === 'function') {
            try { window.ServiceRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.ClientRenderer && typeof window.ClientRenderer.init === 'function') {
            try { window.ClientRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.ArticleRenderer && typeof window.ArticleRenderer.init === 'function') {
            try { window.ArticleRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.PeopleRenderer && typeof window.PeopleRenderer.init === 'function') {
            try { window.PeopleRenderer.init(); } catch (e) { console.warn(e); }
        }

        // ===== 2. Lucide Icons & i18n =====
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        if (window.i18nLoader && typeof window.i18nLoader.translatePage === 'function') {
            try { window.i18nLoader.translatePage(); } catch (e) { }
        }

        // ===== 3. Navbar & Scroll Handlers =====
        initScrollHandlers();

        // ===== 4. Section Snap Scroll Engine =====
        initSnapEngine();

        // ===== 5. WhatsApp Popup Controller =====
        initWhatsAppWidget();

        // ===== 6. About Video Toggle =====
        initAboutVideo();

        // ===== 7. Counter Animation =====
        initCounters();

        // ===== 8. Testimonials Vertical Carousel =====
        initTestimonials();

        // ===== 9. Cinematic Hero Slideshow Controller =====
        initHeroSlideshow();

        // ===== 10. Mobile Menu Accordion =====
        initMobileMenu();
    }

    // ===== 3. Fixed Navbar Controller with Glassmorphism =====
    function initScrollHandlers() {
        var nav = document.getElementById('navbar-sticky');
        if (!nav) return;

        // Inject spacer to compensate for fixed positioning
        if (!document.getElementById('navbar-spacer')) {
            var spacer = document.createElement('div');
            spacer.id = 'navbar-spacer';
            spacer.style.height = nav.offsetHeight + 'px';
            spacer.style.width = '100%';
            spacer.style.flexShrink = '0';
            nav.parentNode.insertBefore(spacer, nav.nextSibling);
            // Update spacer on resize
            window.addEventListener('resize', function () {
                spacer.style.height = nav.offsetHeight + 'px';
            }, { passive: true });
        }

        var isScrolled = false;

        function updateNavbarState() {
            var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            var shouldBeScrolled = y > 50;

            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                if (shouldBeScrolled) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        }

        var heroBg = document.getElementById('hero-bg');
        if (heroBg) {
            window.addEventListener('scroll', function () {
                var y = window.scrollY;
                if (y < 1200) {
                    heroBg.style.transform = 'translateY(' + (y * 0.3) + 'px) scale(1.1)';
                }
            }, { passive: true });
        }
        var scrollBtn = document.getElementById('scroll-down');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', function () {
                var about = document.getElementById('about');
                if (about) {
                    about.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            window.addEventListener('scroll', function () {
                if (window.scrollY > 100) { scrollBtn.style.opacity = '0'; scrollBtn.style.pointerEvents = 'none'; }
                else { scrollBtn.style.opacity = '1'; scrollBtn.style.pointerEvents = 'auto'; }
            }, { passive: true });
        }
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

        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState, { passive: true });
        window.addEventListener('resize', updateNavbarState, { passive: true });
        window.__updateNavbarState = updateNavbarState;
    }

    // ===== 4. Section Snap Scroll Engine =====
    function initSnapEngine() {
        if (typeof gsap === 'undefined' || typeof ScrollToPlugin === 'undefined') return;
        gsap.registerPlugin(ScrollToPlugin);

        var NAVBAR_HEIGHT = 80;
        var SNAP_THRESHOLD = 50;
        var DURATION = 1.1;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var state = 'IDLE';
        var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
        var current = 0;
        var len = sections.length;
        if (!len) return;

        function springEase(progress) {
            if (progress >= 1) return 1;
            var p = progress;
            return 1 + Math.exp(-6.5 * p) * Math.sin(12.5 * p) * 0.08;
        }

        function sectionTop(idx) {
            if (idx < 0) idx = 0;
            if (idx >= len) idx = len - 1;
            return sections[idx].offsetTop - NAVBAR_HEIGHT;
        }

        function scrollTo(idx, immediate) {
            if (idx < 0 || idx >= len) return;
            if (state === 'ANIMATING') return;

            var prev = current;
            current = idx;
            state = 'ANIMATING';
            var target = sectionTop(idx);

            if (prev !== idx && sections[prev]) {
                var outEl = sections[prev].querySelector('.container, .max-w-2xl, [class*="reveal"]');
                var inEl = sections[idx] ? sections[idx].querySelector('.container, .max-w-2xl, [class*="reveal"]') : null;
                if (outEl && !reducedMotion) {
                    gsap.to(outEl, { opacity: 0.92, scale: 0.985, duration: 0.3, ease: 'power2.out' });
                    if (inEl) gsap.set(inEl, { opacity: 0.94, scale: 0.985 });
                }
            }

            gsap.to(window, {
                scrollTo: { y: target, autoKill: false },
                duration: immediate ? 0.25 : DURATION,
                ease: reducedMotion ? 'power2.inOut' : springEase,
                onComplete: function () {
                    if (prev !== idx && sections[prev]) {
                        var outEl2 = sections[prev].querySelector('.container, .max-w-2xl, [class*="reveal"]');
                        if (outEl2) gsap.set(outEl2, { opacity: 1, scale: 1 });
                    }
                    var inEl2 = sections[idx] ? sections[idx].querySelector('.container, .max-w-2xl, [class*="reveal"]') : null;
                    if (inEl2) gsap.to(inEl2, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });

                    state = 'IDLE';
                    updateHash(idx);
                    updateDots(idx);
                    updateNav(idx);
                }
            });
        }

        function next() { if (current < len - 1) scrollTo(current + 1); }
        function prev() { if (current > 0) scrollTo(current - 1); }

        function updateHash(idx) {
            if (!sections[idx]) return;
            var id = sections[idx].id;
            if (id && history.replaceState) {
                history.replaceState(null, '', '#' + id);
            }
        }

        function hashIndex() {
            var h = location.hash.replace('#', '');
            for (var i = 0; i < len; i++) {
                if (sections[i].id === h) return i;
            }
            return 0;
        }

        function updateNav(idx) {
            if (typeof window.__updateNavbarState === 'function') {
                window.__updateNavbarState();
            }
        }

        var scrollBtn = document.getElementById('scroll-down');
        function updateScrollBtn() {
            if (!scrollBtn) return;
            if (current > 0) { scrollBtn.style.opacity = '0'; scrollBtn.style.pointerEvents = 'none'; }
            else { scrollBtn.style.opacity = '1'; scrollBtn.style.pointerEvents = 'auto'; }
        }

        // Section dots
        var existingDots = document.querySelector('.snap-dots');
        if (existingDots) existingDots.remove();

        var dotsWrap = document.createElement('div');
        dotsWrap.className = 'snap-dots';
        dotsWrap.setAttribute('role', 'navigation');
        dotsWrap.setAttribute('aria-label', 'Section navigation');
        sections.forEach(function (sec, i) {
            var dot = document.createElement('button');
            dot.className = 'snap-dot';
            dot.setAttribute('aria-label', 'Go to ' + (sec.id || 'section ' + (i + 1)));
            dot.setAttribute('data-index', i);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () { scrollTo(i); });
            dotsWrap.appendChild(dot);
        });
        document.body.appendChild(dotsWrap);

        function updateDots(idx) {
            var dots = dotsWrap.querySelectorAll('.snap-dot');
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === idx);
            });
            if (scrollBtn) updateScrollBtn();
        }

        if (typeof Observer !== 'undefined') {
            Observer.create({
                type: 'wheel,touch,pointer',
                wheelSpeed: -1,
                tolerance: SNAP_THRESHOLD,
                preventDefault: true,
                onUp: function () { prev(); },
                onDown: function () { next(); },
                ignore: "#latestCarousel, .wa-popup, .wa-widget, #mobileMenu, #loginModal, .nav-dropdown-menu",
                ignoreMobileScroll: true
            });
        }

        document.addEventListener('keydown', function (e) {
            if (state === 'ANIMATING') return;
            switch (e.key) {
                case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); next(); break;
                case 'ArrowUp': case 'PageUp': e.preventDefault(); prev(); break;
                case 'Home': e.preventDefault(); scrollTo(0); break;
                case 'End': e.preventDefault(); scrollTo(len - 1); break;
            }
        });

        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var hash = link.getAttribute('href');
            if (!hash || hash === '#' || hash.length < 2) return;
            e.preventDefault();
            for (var i = 0; i < len; i++) {
                if ('#' + sections[i].id === hash) { scrollTo(i); break; }
            }
            var mm = document.getElementById('mobileMenu');
            if (mm && !mm.classList.contains('hidden')) {
                mm.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });

        current = hashIndex();
        scrollTo(current, true);
        updateDots(current);
        updateNav(current);

        window.__snapEngine = { scrollTo: scrollTo, next: next, prev: prev };
    }

    // ===== 5. WhatsApp Widget =====
    function initWhatsAppWidget() {
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
        launcher.onclick = togglePopup;
        if (close) close.onclick = function (e) { e.stopPropagation(); togglePopup(); };
        document.addEventListener('click', function (e) {
            if (!popup.contains(e.target) && !launcher.contains(e.target) && popup.classList.contains('is-open')) {
                togglePopup();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('is-open')) togglePopup();
        });
    }

    // ===== 6. About Video =====
    function initAboutVideo() {
        var video = document.getElementById('aboutVideo');
        var btn = document.getElementById('aboutVideoToggle');
        var pauseIcon = document.getElementById('aboutPauseIcon');
        var playIcon = document.getElementById('aboutPlayIcon');
        if (!video || !btn) return;
        btn.onclick = function () {
            if (video.paused) {
                video.play();
                if (pauseIcon) pauseIcon.classList.remove('hidden!');
                if (playIcon) playIcon.classList.add('hidden!');
                btn.setAttribute('aria-label', 'Pause video');
            } else {
                video.pause();
                if (pauseIcon) pauseIcon.classList.add('hidden!');
                if (playIcon) playIcon.classList.remove('hidden!');
                btn.setAttribute('aria-label', 'Play video');
            }
        };
    }

    // ===== 7. Counters Animation =====
    function initCounters() {
        var counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;
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
                var value = Math.round(easeOutCubic(progress) * target);
                el.textContent = value.toLocaleString() + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        var trustSec = document.getElementById('trust-indicators');
        if (trustSec) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        counters.forEach(function (c) { animateCounter(c); });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(trustSec);
        }
    }

    // ===== 8. Testimonials Vertical Carousel (GSAP Hardware-Accelerated Engine) =====
    function initTestimonials() {
        var viewport = document.getElementById('testiViewport');
        var batchA = document.getElementById('testiBatchA');
        var batchB = document.getElementById('testiBatchB');
        if (!viewport || !batchA || !batchB) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var active = 'A';
        var delay = 5000;
        var paused = false;
        var timer = null;

        // Initial positions setup
        if (window.gsap) {
            gsap.set(batchB, { y: 60, opacity: 0, pointerEvents: 'none' });
            gsap.set(batchA, { y: 0, opacity: 1, pointerEvents: 'auto' });
        }

        function swap() {
            if (paused) { timer = setTimeout(swap, 800); return; }
            var out = active === 'A' ? batchA : batchB;
            var inp = active === 'A' ? batchB : batchA;

            if (window.gsap) {
                // Outgoing batch slides UP (-60px) and fades OUT
                gsap.set(out, { zIndex: 1, pointerEvents: 'none' });
                gsap.to(out, {
                    y: -60,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.inOut'
                });

                // Incoming batch slides UP from below (+60px -> 0) and fades IN
                gsap.set(inp, { y: 60, opacity: 0, pointerEvents: 'none', zIndex: 2 });
                gsap.to(inp, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    delay: 0.1,
                    onComplete: function () {
                        inp.style.pointerEvents = 'auto';
                    }
                });
            } else {
                // Vanilla fallback
                out.style.opacity = '0';
                inp.style.opacity = '1';
            }

            active = active === 'A' ? 'B' : 'A';
            timer = setTimeout(swap, delay);
        }

        viewport.addEventListener('mouseenter', function () { paused = true; });
        viewport.addEventListener('mouseleave', function () { paused = false; });
        timer = setTimeout(swap, delay);
    }

    // ===== 9. Hero Slideshow =====
    function initHeroSlideshow() {
        var container = document.getElementById('heroSlides');
        if (!container) return;

        var slides = Array.from(container.querySelectorAll('.hero-slide'));
        if (slides.length <= 1) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var currentIndex = 0;
        var slideInterval = 20000;

        function advanceSlide() {
            var prevIndex = currentIndex;
            currentIndex = (currentIndex + 1) % slides.length;

            slides[prevIndex].classList.remove('is-active');
            slides[currentIndex].classList.add('is-active');
        }

        var timer = setInterval(advanceSlide, slideInterval);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { clearInterval(timer); }
            else { timer = setInterval(advanceSlide, slideInterval); }
        });
    }

    // ===== 10. Mobile Menu Accordions =====
    function initMobileMenu() {
        document.querySelectorAll('.mobile-nav-group-btn').forEach(function (btn) {
            btn.onclick = function () {
                var group = this.closest('.mobile-nav-group');
                if (group) group.classList.toggle('open');
            };
        });
    }

    // ===== 12. Language Switcher — Sync UI on Load =====
    function initLanguageSwitcher() {
        // Sync language selector UI with actual language from TranslationRepository
        var lang = (window.TranslationRepository && window.TranslationRepository.getCurrentLanguage)
            ? window.TranslationRepository.getCurrentLanguage()
            : localStorage.getItem('lang') || 'en';

        // Update selector buttons to match stored language
        ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
            var container = document.getElementById(id);
            if (!container) return;
            container.querySelectorAll('a[data-lang]').forEach(function (a) {
                var aLang = a.getAttribute('data-lang').trim().toLowerCase();
                a.className = (aLang === lang) ? 'lang-active' : 'lang-inactive';
            });
        });

        // Re-bind PageLoader selectors (safe to call multiple times — it uses addEventListener)
        if (window.PageLoader && typeof window.PageLoader.initialize === 'function') {
            window.PageLoader.initialize();
        }
    }

    // ===== BOOTSTRAP: Listen for component injection completion =====
    document.addEventListener('components:all-loaded', function () {
        initAboutPage();
        initLanguageSwitcher();
    });

    // Fallback: if components already loaded or DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(function () {
            initAboutPage();
            initLanguageSwitcher();
        }, 200);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                initAboutPage();
                initLanguageSwitcher();
            }, 300);
        });
    }

})();
