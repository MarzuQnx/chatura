/**
 * ServiceRenderer - Component for rendering services on pages
 */
(function () {
    'use strict';

    var CR = window.TranslationRepository;
    var currentLang = function () { 
        var CR = window.TranslationRepository;
        return CR ? CR.getCurrentLanguage() : 'en'; 
    };
    var loc = function (obj, keyFallback) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj[currentLang()]) return obj[currentLang()];
        if (keyFallback && obj[keyFallback]) return obj[keyFallback];
        return obj.en || '';
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

        renderDetailedServices: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container || !window.ServiceRepository) return;
            
            var services = window.ServiceRepository.getAll();
            var html = '';
            
            for (var i = 0; i < services.length; i++) {
                var s = services[i];
                var title = loc(s.name);
                var desc = loc(s.description);
                
                var featuresHtml = '';
                if (s.features) {
                    var feats = loc(s.features) || [];
                    for (var j = 0; j < feats.length; j++) {
                        featuresHtml += '<li class="flex items-center gap-3 text-sm text-gray-700"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 shrink-0"></i> ' + feats[j] + '</li>';
                    }
                }

                var isEven = (i % 2 !== 0); // Alternate layout
                var bgClass = isEven ? 'bg-gray-50' : 'bg-white';
                var orderClass = isEven ? 'order-2 md:order-1' : '';
                var orderClass2 = isEven ? 'order-1 md:order-2' : '';
                var rotateClass1 = isEven ? 'rotate-2' : '-rotate-2';
                var bgShape = isEven ? 'bg-amber-50' : 'bg-emerald-50';
                var xVal = isEven ? '5px' : '0px';
                var rotVal = isEven ? '2deg' : '-2deg';

                var slideClass = isEven ? 'si-slide-from-left' : 'si-slide-from-right';

                html += '<section id="' + s.id + '" class="py-24 ' + bgClass + ' overflow-hidden">' +
                            '<div class="container mx-auto px-6">' +
                                '<div class="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">' +
                                    '<div class="reveal-up ' + orderClass2 + '">' +
                                        '<span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-4">' +
                                            '<span class="w-8 h-px bg-emerald-700"></span> 0' + (i + 1) +
                                        '</span>' +
                                        '<h2 class="text-3xl md:text-4xl font-serif text-gray-950 mb-5 leading-snug">' + title + '</h2>' +
                                        '<p class="text-gray-500 leading-relaxed mb-6 max-w-lg">' + desc + '</p>' +
                                        '<ul class="space-y-3 mb-8">' + featuresHtml + '</ul>' +
                                        '<a href="' + s.slug + '" class="inline-flex items-center gap-2 bg-[#004D34] text-white px-6 py-3 rounded font-medium text-sm hover:bg-[#003322] transition">' +
                                            '<span data-i18n="services.learn_more">Learn More</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>' +
                                        '</a>' +
                                    '</div>' +
                                    '<div class="svc-img-composition relative ' + orderClass + '" style="--si-x:' + xVal + ';--si-rot:' + rotVal + ';--si-dur:14s;--si-sh-dur:11s">' +
                                        '<div class="absolute -inset-4 ' + bgShape + ' rounded-3xl ' + rotateClass1 + '"></div>' +
                                        '<div class="si-shadow ' + slideClass + ' relative rounded-2xl overflow-hidden">' +
                                            '<img src="' + s.image + '" alt="' + title + '" class="relative rounded-2xl w-full h-80 md:h-96 object-cover" loading="lazy">' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</section>';
            }
            
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
