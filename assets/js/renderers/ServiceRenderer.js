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
                var title = loc(s, 'id_lang'); // uses s.en or s.id_lang
                var desc = loc(s.description);
                
                var featuresHtml = '';
                if (s.features) {
                    var feats = loc(s.features) || [];
                    for (var j = 0; j < feats.length; j++) {
                        featuresHtml += '<li class="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-white/80 transition-colors duration-500">' +
                                        '<span class="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-white/60 transition-colors duration-500 shrink-0"></span>' + feats[j] + '</li>';
                    }
                }

                html += '<a href="' + s.slug + '" class="svc-card group flex flex-col rounded-xl overflow-hidden bg-white border border-gray-200 transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:bg-[#004D34] hover:border-[#004D34] hover:shadow-2xl hover:-translate-y-1">' +
                            '<div class="svc-header flex items-center gap-3 px-4 pt-5 pb-3">' +
                                '<div class="w-10 h-10 rounded-lg bg-[#004D34]/10 group-hover:bg-white/15 flex items-center justify-center shrink-0 transition-all duration-500">' +
                                    '<i data-lucide="' + s.icon + '" class="w-5 h-5 text-[#004D34] group-hover:text-white transition-colors duration-500"></i>' +
                                '</div>' +
                                '<h3 class="text-sm font-bold text-gray-950 group-hover:text-white transition-colors duration-500 leading-tight">' + title + '</h3>' +
                            '</div>' +
                            '<div class="svc-image relative h-36 overflow-hidden">' +
                                '<img src="' + s.image + '" alt="' + title + '" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]">' +
                            '</div>' +
                            '<div class="svc-content flex flex-col flex-1 px-4 py-4">' +
                                '<p class="text-sm text-gray-500 group-hover:text-white/70 transition-colors duration-500 leading-relaxed mb-3 line-clamp-2">' + desc + '</p>' +
                                '<ul class="space-y-1 mb-auto">' + featuresHtml + '</ul>' +
                            '</div>' +
                            '<div class="svc-footer px-4 pb-5 pt-2 border-t border-gray-100 group-hover:border-white/15 transition-colors duration-500">' +
                                '<span class="inline-flex items-center gap-1 text-sm font-bold text-[#004D34] group-hover:text-white transition-colors duration-500">Explore <i data-lucide="arrow-right" class="w-3 h-3 transition-transform group-hover:translate-x-0.5 duration-300"></i></span>' +
                            '</div>' +
                        '</a>';
            }
            
            container.innerHTML = html;
            
            // Reinitialize lucide icons if available
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
                var title = loc(s, 'id_lang');
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
                                            'Learn More <i data-lucide="arrow-right" class="w-4 h-4"></i>' +
                                        '</a>' +
                                    '</div>' +
                                    '<div class="reveal-up relative ' + orderClass + '" style="--si-x:' + xVal + ';--si-rot:' + rotVal + ';--si-dur:14s;--si-sh-dur:11s">' +
                                        '<div class="absolute -inset-4 ' + bgShape + ' rounded-3xl ' + rotateClass1 + ' si-float"></div>' +
                                        '<div class="si-shadow relative rounded-2xl overflow-hidden">' +
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
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    ServiceRenderer.renderServicesGrid('servicesGrid');
                    ServiceRenderer.renderDetailedServices('detailedServicesContainer');
                    document.querySelectorAll('#detailedServicesContainer .reveal-up').forEach(function(el) {
                        el.style.opacity = 1;
                        el.style.transform = 'none';
                    });
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { ServiceRenderer.init(); });
    } else {
        ServiceRenderer.init();
    }

    window.ServiceRenderer = ServiceRenderer;
})();
