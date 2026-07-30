/**
 * our-people-init.js
 * Page-specific initialization for our-people.html
 * Initializes PeopleRenderer after components load and binds lifecycle events
 */

(function () {
    'use strict';

    // ===== STRATEGIC INTELLIGENCE RENDERER =====
    function renderSI() {
        var grid = document.getElementById('siGrid');
        if (!grid) return;
        var featuredEl = document.getElementById('siFeatured');
        var listEl = document.getElementById('siList');
        if (!featuredEl || !listEl) return;

        if (window.PeopleRenderer && typeof window.PeopleRenderer.renderInsights === 'function') {
            window.PeopleRenderer.renderInsights();
            return;
        }

        var articles = window.ArticleRepository ? window.ArticleRepository.getAll() : [];
        if (!articles || articles.length === 0) return;

        var sorted = articles.slice().sort(function (a, b) {
            return new Date(b.dates.published) - new Date(a.dates.published);
        });
        var latest = sorted.slice(0, 5);

        var lang = (window.TranslationRepository && typeof window.TranslationRepository.getCurrentLanguage === 'function')
            ? window.TranslationRepository.getCurrentLanguage()
            : 'en';

        var locStr = function (obj) {
            if (!obj) return '';
            if (typeof obj === 'string') {
                if (window.TranslationRepository && typeof window.TranslationRepository.t === 'function') {
                    var tr = window.TranslationRepository.t(obj);
                    if (tr && tr !== obj) return tr;
                }
                return obj;
            }
            return obj[lang] || obj.en || obj.id || '';
        };

        var getCat = function (catId) {
            if (window.CategoryRepository && typeof window.CategoryRepository.getById === 'function') {
                var catObj = window.CategoryRepository.getById(catId);
                if (catObj) return locStr(catObj);
            }
            return catId ? catId.toUpperCase() : '';
        };

        // Featured article
        var feat = latest[0];
        var fCat = getCat(feat.category);
        var fTitle = locStr(feat.title);
        var fDesc = locStr(feat.subtitle) || (feat.execSummary ? locStr(feat.execSummary.summary) : '');
        var fDate = feat.dates && feat.dates.display ? locStr(feat.dates.display) : (feat.dates ? feat.dates.published : '');
        var fRead = locStr(feat.readingTime) || (feat.readTime ? feat.readTime + ' min read' : '');
        var readText = lang === 'id' ? 'Baca Wawasan' : 'Read Insight';
        var fUrl = 'insight-detail.html?slug=' + (feat.slug || feat.id);

        featuredEl.innerHTML =
            '<a href="' + fUrl + '" class="si-featured block">' +
                '<div class="si-featured-img"><img src="' + (feat.heroImage || feat.image || '') + '" alt="' + fTitle + '" loading="lazy"></div>' +
                '<span class="si-featured-badge">' + fCat + '</span>' +
                '<div class="si-featured-glass">' +
                    '<p class="si-featured-eyebrow">' + fCat + '</p>' +
                    '<h3 class="si-featured-title">' + fTitle + '</h3>' +
                    '<p class="si-featured-desc">' + fDesc + '</p>' +
                    '<div class="si-featured-footer">' +
                        '<span class="si-featured-meta">' + fDate + ' · ' + fRead + '</span>' +
                        '<span class="si-featured-cta">' + readText + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' +
                    '</div></div></a>';

        // List articles
        var listHtml = '<div class="si-list">';
        for (var i = 1; i < latest.length; i++) {
            var a = latest[i];
            var cCat = getCat(a.category);
            var aTitle = locStr(a.title);
            var aRead = locStr(a.readingTime) || (a.readTime ? a.readTime + ' min read' : '');
            var aUrl = 'insight-detail.html?slug=' + (a.slug || a.id);

            listHtml += '<a href="' + aUrl + '" class="si-list-item">' +
                '<img src="' + (a.thumbnail || a.image || '') + '" alt="' + aTitle + '" loading="lazy" class="si-list-thumb">' +
                '<div class="si-list-body"><p class="si-list-cat">' + cCat + '</p><h4 class="si-list-title">' + aTitle + '</h4><p class="si-list-meta">' + aRead + '</p></div>' +
                '<svg class="si-list-arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>';
        }
        listHtml += '</div>';
        listEl.innerHTML = listHtml;
    }

    function initPeoplePage() {
        // Initialize PeopleRenderer after component HTML is injected
        if (window.PeopleRenderer && typeof window.PeopleRenderer.init === 'function') {
            try {
                window.PeopleRenderer.init();
            } catch (e) {
                console.warn('[OurPeopleInit] Error initializing PeopleRenderer:', e);
            }
        }
        renderSI();

        // Refresh GSAP ScrollTrigger after component rendering
        if (window.ScrollTrigger) {
            setTimeout(function () {
                try { window.ScrollTrigger.refresh(); } catch (e) {}
            }, 300);
        }
    }

    // Listen for component:loaded events to re-initialize when relevant components finish loading
    document.addEventListener('component:loaded', function (e) {
        var componentName = e.detail && e.detail.name;
        if (componentName &&
            (componentName === 'our-people/hero' ||
             componentName === 'our-people/listing' ||
             componentName === 'our-people/collective-expertise' ||
             componentName === 'our-people/industries' ||
             componentName === 'our-people/standards' ||
             componentName === 'our-people/expert-insights' ||
             componentName === 'our-people/cta')) {
            initPeoplePage();
        }
    });

    // Also listen for components:all-loaded as fallback
    document.addEventListener('components:all-loaded', function () {
        initPeoplePage();
        initWhatsAppWidget();
    });

    // Language change listener via ChaturaBus
    if (window.ChaturaBus) {
        window.ChaturaBus.on('languageChange', function () {
            initPeoplePage();
        });
    }

    // Auto-initialize if DOM already ready (fallback)
    if (document.readyState !== 'loading') {
        initPeoplePage();
    } else {
        document.addEventListener('DOMContentLoaded', initPeoplePage);
    }

    // WhatsApp Widget initialization - explicit call to ensure binding after component load
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

    // Export for manual init if needed
    window.OurPeopleInit = {
        init: initPeoplePage
    };

})();