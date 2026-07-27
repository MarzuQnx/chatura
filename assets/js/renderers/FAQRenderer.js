/**
 * FAQRenderer
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

    var FAQRenderer = {
        render: function(containerId) {
            var c = document.getElementById(containerId);
            if (!c || !window.FAQRepository) return;
            
            var faqs = window.FAQRepository.getAll();
            var html = '';
            
            for (var i = 0; i < faqs.length; i++) {
                var f = faqs[i];
                html += '<div class="faq-item bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">' +
                        '<button class="faq-trigger w-full flex items-center justify-between p-6 text-left" onclick="this.closest(\'.faq-item\').classList.toggle(\'open\')">' +
                        '<span class="font-semibold text-gray-900 pr-4">' + loc(f.question) + '</span>' +
                        '<i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 shrink-0 faq-icon"></i>' +
                        '</button>' +
                        '<div class="faq-content px-6">' +
                        '<p class="text-xs text-gray-500 leading-relaxed pb-6">' + loc(f.answer) + '</p>' +
                        '</div></div>';
            }
            
            c.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        init: function() {
            var containers = document.querySelectorAll('[data-renderer="faq"]');
            for(var i=0; i<containers.length; i++) {
                if(containers[i].id) {
                    this.render(containers[i].id);
                }
            }
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    var containers = document.querySelectorAll('[data-renderer="faq"]');
                    for(var i=0; i<containers.length; i++) {
                        if(containers[i].id) {
                            FAQRenderer.render(containers[i].id);
                        }
                    }
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { FAQRenderer.init(); });
    } else {
        FAQRenderer.init();
    }
    
    window.FAQRenderer = FAQRenderer;
})();
