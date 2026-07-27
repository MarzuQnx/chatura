/**
 * CHATURA INSIGHTS PAGE INITIALIZER
 * Handles component lifecycle, filtering, search, and dynamic rendering.
 */
(function () {
    'use strict';

    var _initialized = false;

    function renderArticles() {
        if (window.ArticleRenderer) {
            try {
                window.ArticleRenderer.renderFeaturedArticle('featured-article-slot');
                window.ArticleRenderer.renderInsightsGrid('insightsGrid');
            } catch (e) { console.warn(e); }
        }
    }

    function initInsightsPage() {
        renderArticles();

        if (!_initialized) {
            _initialized = true;

            if (window.PeopleRenderer && typeof window.PeopleRenderer.init === 'function') {
                try { window.PeopleRenderer.init(); } catch (e) { console.warn(e); }
            }

            initCategoryTabs();
            initSearchInput();
            initGSAP();
        }

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initCategoryTabs() {
        var wrap = document.getElementById('filterTabWrap');
        if (!wrap) return;

        wrap.addEventListener('click', function (e) {
            var btn = e.target.closest('.filter-tab-btn');
            if (!btn) return;

            var type = btn.getAttribute('data-type');
            wrap.querySelectorAll('.filter-tab-btn').forEach(function (b) {
                b.setAttribute('aria-selected', 'false');
                b.classList.remove('bg-[#004D34]', 'text-white', 'border-[#004D34]');
                b.classList.add('bg-white', 'text-gray-700', 'border-gray-200');
            });

            btn.setAttribute('aria-selected', 'true');
            btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-200');
            btn.classList.add('bg-[#004D34]', 'text-white', 'border-[#004D34]');

            if (window.ArticleRenderer && typeof window.ArticleRenderer.filterByType === 'function') {
                window.ArticleRenderer.filterByType(type);
            }
        });
    }

    function initSearchInput() {
        var input = document.getElementById('search-input');
        if (!input) return;

        var debounceTimer;
        input.addEventListener('input', function (e) {
            clearTimeout(debounceTimer);
            var query = e.target.value;
            debounceTimer = setTimeout(function () {
                if (window.ArticleRenderer && typeof window.ArticleRenderer.search === 'function') {
                    window.ArticleRenderer.search(query);
                }
            }, 250);
        });
    }

    function initGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.batch('.reveal-up:not(#hero-insights .reveal-up)', {
                start: 'top 85%',
                once: true,
                onEnter: function (batch) {
                    gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
                }
            });

            setTimeout(function () { ScrollTrigger.refresh(); }, 300);
        }

        // Failsafe reveal for any elements that remain opacity 0
        setTimeout(function () {
            document.querySelectorAll('.reveal-up').forEach(function (el) {
                if (window.getComputedStyle(el).opacity === '0' || el.style.opacity === '0') {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                }
            });
        }, 400);
    }

    // Lifecycle Handlers
    document.addEventListener('component:loaded', function () {
        renderArticles();
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    });
    document.addEventListener('components:all-loaded', initInsightsPage);
    document.addEventListener('DOMContentLoaded', function () {
        initInsightsPage();
        setTimeout(initInsightsPage, 150);
    });

    window.initInsightsPage = initInsightsPage;
})();
