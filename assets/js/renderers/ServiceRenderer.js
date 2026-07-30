/**
 * ServiceRenderer - Component for rendering services on pages
 */
(function () {
    'use strict';

    var currentLang = function () { 
        return (window.TranslationRepository && typeof window.TranslationRepository.getCurrentLanguage === 'function') 
            ? window.TranslationRepository.getCurrentLanguage() 
            : 'en'; 
    };
    var t = function (key) {
        if (window.TranslationRepository && typeof window.TranslationRepository.t === 'function') {
            return window.TranslationRepository.t(key);
        }
        return key;
    };
    var loc = function (obj, keyFallback) {
        if (!obj) return '';
        if (typeof obj === 'string') {
            if (window.TranslationRepository && typeof window.TranslationRepository.t === 'function') {
                var translated = window.TranslationRepository.t(obj);
                if (translated && translated !== obj) return translated;
            }
            return obj;
        }
        var lang = currentLang();
        if (obj[lang]) return obj[lang];
        if (keyFallback && obj[keyFallback]) return obj[keyFallback];
        return obj.en || obj.id || '';
    };

    var ServiceRenderer = {
        renderServicesGrid: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container || !window.ServiceRepository) return;
            
            var services = window.ServiceRepository.getAll();
            var html = '';
            
            for (var i = 0; i < services.length; i++) {
                var s = services[i];
                var title = loc(s.name);
                var desc = loc(s.description);
                
                var capabilitiesHtml = '';
                if (s.features) {
                    var feats = loc(s.features) || [];
                    for (var j = 0; j < feats.length; j++) {
                        capabilitiesHtml += '<li class="svc-back-cap">' + feats[j] + '</li>';
                    }
                }

                html += '<div class="svc-flip-card" role="group" aria-label="' + title + '">' +
                            '<div class="svc-flip-inner">' +
                                '<div class="svc-flip-front">' +
                                    '<div class="svc-front-img" style="background-image:url(\'' + s.image + '\')"></div>' +
                                    '<div class="svc-front-glass">' +
                                        '<h3 class="svc-front-title">' + title + '</h3>' +
                                        '<p class="svc-front-tagline">' + desc + '</p>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="svc-flip-back">' +
                                    '<div class="svc-back-content">' +
                                        '<div class="svc-back-icon-wrap"><i data-lucide="' + s.icon + '" class="svc-back-icon"></i></div>' +
                                        '<h3 class="svc-back-title">' + title + '</h3>' +
                                        '<p class="svc-back-desc">' + desc + '</p>' +
                                        '<ul class="svc-back-caps">' + capabilitiesHtml + '</ul>' +
                                        '<a href="' + s.slug + '" class="svc-back-cta">' +
                                            '<span data-i18n="services.explore_service">Explore This Service</span>' +
                                            '<i data-lucide="arrow-right" class="svc-back-arrow"></i>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
            }
            
            container.innerHTML = html;
            
            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }
        },

        renderDetailedServices: function (containerId) {
            var container = document.getElementById(containerId);
            if (!container || !window.ServiceRepository) return;

            var services = window.ServiceRepository.getAll();
            if (!services || services.length === 0) return;

            var count = services.length;
            // Dynamic Grid Columns logic for 2 rows:
            // <= 6 items (e.g. current 5 items): 3 columns per row (grid-cols-1 md:grid-cols-3) -> 2 rows
            // >= 7 items (e.g. future 8 items): 4 columns per row (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) -> 2 rows
            var gridColsClass = count <= 6 
                ? 'grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8' 
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8';

            var html = '<div class="' + gridColsClass + '">';

            for (var i = 0; i < services.length; i++) {
                var s = services[i];
                var title = loc(s.name);
                var desc = loc(s.description);

                var featuresHtml = '';
                if (s.features) {
                    var feats = loc(s.features) || [];
                    for (var j = 0; j < feats.length; j++) {
                        featuresHtml += '<li class="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">' +
                            '<i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5"></i>' +
                            '<span>' + feats[j] + '</span>' +
                            '</li>';
                    }
                }

                var numStr = (i + 1) < 10 ? '0' + (i + 1) : (i + 1);

                html += '<div id="' + s.id + '" class="svc-detail-card group bg-white border border-gray-100/90 rounded-2xl p-6 md:p-7 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">' +
                    /* Top Hover Accent Bar */
                    '<div class="absolute top-0 left-0 right-0 h-1 bg-[#004D34] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>' +
                    
                    '<div>' +
                    /* Header: Corporate Badge & Icon */
                    '<div class="flex items-center justify-between mb-5">' +
                    '<span class="text-xs font-bold font-mono tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/60">' + numStr + '</span>' +
                    '<div class="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-emerald-50 text-gray-600 group-hover:text-emerald-800 flex items-center justify-center transition-colors duration-300">' +
                    '<i data-lucide="' + (s.icon || 'briefcase') + '" class="w-5 h-5"></i>' +
                    '</div>' +
                    '</div>' +

                    /* Service Title */
                    '<h3 class="font-serif text-xl font-bold text-gray-950 mb-3 leading-snug group-hover:text-emerald-950 transition-colors duration-300">' + title + '</h3>' +

                    /* Service Description */
                    '<p class="text-gray-600 text-xs md:text-sm leading-relaxed mb-6">' + desc + '</p>' +

                    /* Hidden Image Comment for Future Development */
                    '<!-- <img src="' + s.image + '" alt="' + title + '" class="hidden"> -->' +

                    /* Capabilities Checklist */
                    '<ul class="space-y-2.5 mb-8 pt-4 border-t border-gray-100">' + featuresHtml + '</ul>' +
                    '</div>' +

                    /* Action Link CTA */
                    '<a href="' + s.slug + '" class="inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 text-xs font-bold text-[#004D34] group-hover:text-emerald-900 transition-colors duration-300 group/cta">' +
                    '<span class="cta-text inline-block" data-i18n="services.learn_more">Learn More</span>' +
                    '<i data-lucide="arrow-right" class="w-4 h-4 text-emerald-700 group-hover/cta:translate-x-1 transition-transform duration-200"></i>' +
                    '</a>' +

                    '</div>';
            }

            html += '</div>';

            container.innerHTML = html;

            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }
        },

        init: function() {
            this.renderServicesGrid('servicesGrid');
            this.renderDetailedServices('detailedServicesContainer');
            this.initFlipCards();
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    ServiceRenderer.renderServicesGrid('servicesGrid');
                    ServiceRenderer.renderDetailedServices('detailedServicesContainer');
                    ServiceRenderer.initFlipCards();
                    document.querySelectorAll('#detailedServicesContainer .reveal-up').forEach(function(el) {
                        el.style.opacity = 1;
                        el.style.transform = 'none';
                    });
                });
            }
        },

        initFlipCards: function() {
            var cards = document.querySelectorAll('.svc-flip-card');
            if (!cards.length) return;

            var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

            cards.forEach(function(card) {
                card.setAttribute('tabindex', '0');

                card.addEventListener('click', function(e) {
                    if (e.target.closest('.svc-back-cta')) return;

                    if (isTouch) {
                        var wasFlipped = card.classList.contains('is-flipped');
                        cards.forEach(function(c) { c.classList.remove('is-flipped'); });
                        if (!wasFlipped) {
                            card.classList.add('is-flipped');
                        }
                    }
                });

                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.classList.toggle('is-flipped');
                    }
                });
            });

            document.addEventListener('click', function(e) {
                if (!e.target.closest('.svc-flip-card')) {
                    cards.forEach(function(c) { c.classList.remove('is-flipped'); });
                }
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { ServiceRenderer.init(); });
    } else {
        ServiceRenderer.init();
    }

    window.ServiceRenderer = ServiceRenderer;
})();
