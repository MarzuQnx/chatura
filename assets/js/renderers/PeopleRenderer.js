/**
 * PeopleRenderer - Component for rendering people and expertise
 */
(function () {
    'use strict';

    var CR = window.TranslationRepository;
    var currentLang = function () { return CR ? CR.getCurrentLanguage() : 'en'; };
    var t = function (key) {
        var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
        return d[key] || key;
    };
    var loc = function (obj, keyFallback) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj[currentLang()]) return obj[currentLang()];
        if (keyFallback && obj[keyFallback]) return obj[keyFallback];
        return obj.en || '';
    };

    var PeopleRenderer = {
        renderPeopleGrid: function(containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.PeopleRepository) return;
            var people = window.PeopleRepository.getAll();
            var html = '';
            for (var i = 0; i < people.length; i++) {
                var p = people[i];
                html += '<div class="profile-card bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl cursor-pointer flex flex-col justify-between" onclick="openBioModal(\'' + p.id + '\')">' +
                    '<div>' +
                    '<div class="aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 bg-gray-50">' +
                    '<img src="' + p.photo + '" alt="' + t(p.nameKey) + '" loading="lazy" class="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105">' +
                    '</div>' +
                    '<h3 class="font-serif text-lg font-bold text-gray-950 leading-snug mb-0.5">' + t(p.nameKey) + '</h3>' +
                    '<p class="text-xs text-emerald-800 font-semibold mb-2">' + t(p.titleKey) + ' — <span class="text-gray-500 font-normal">' + t(p.practiceKey) + '</span></p>' +
                    '</div>' +
                    '<div class="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400 text-xs">' +
                    '<span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>' + t(p.locationKey) + '</span>' +
                    '<span class="text-[#004D34] font-semibold group-hover:underline flex items-center gap-0.5">' + (t('people.view_all') || 'Profile') + ' <i data-lucide="chevron-right" class="w-3 h-3"></i></span>' +
                    '</div>' +
                    '</div>';
            }
            grid.innerHTML = html;
        },

        renderExpertise: function(containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.PeopleRepository || !window.PeopleRepository.getExpertise) return;
            var expertise = window.PeopleRepository.getExpertise();
            var html = '';
            for (var i = 0; i < expertise.length; i++) {
                var e = expertise[i];
                var name = t(e.nameKey) !== e.nameKey ? t(e.nameKey) : e.name;
                html += '<span class="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-emerald-700 hover:text-emerald-800 transition cursor-default">' + name + '</span>';
            }
            grid.innerHTML = html;
        },

        renderIndustries: function(containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.IndustryRepository) return;
            var industries = window.IndustryRepository.getAll();
            var html = '';
            for (var i = 0; i < industries.length; i++) {
                var ind = industries[i];
                var displayName = t(ind.nameKey) !== ind.nameKey ? t(ind.nameKey) : ind.name;
                html += '<a href="' + ind.slug + '" class="flex items-start gap-4 p-6 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition group">' +
                    '<div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition"><i data-lucide="' + ind.icon + '" class="w-5 h-5"></i></div>' +
                    '<div><h4 class="font-bold text-sm text-gray-950 mb-1 group-hover:text-emerald-800 transition">' + displayName + '</h4>' +
                    '<p class="text-xs text-gray-500">' + ind.desc + '</p></div>' +
                    '</a>';
            }
            grid.innerHTML = html;
        },
        
        renderInsights: function(containerId) {
            var grid = document.getElementById(containerId);
            if (!grid) return;
            
            var allArticles = window.ArticleRepository ? window.ArticleRepository.getAll() : [];
            var sorted = allArticles.slice().sort(function(a, b) {
                return new Date(b.dates.published) - new Date(a.dates.published);
            });
            var latest = sorted.slice(0, 5);
            
            var html = '';
            for (var i = 0; i < latest.length; i++) {
                var art = latest[i];
                var badgeLabel = art.category;
                var badgeClass = 'text-gray-700 bg-gray-50';
                if (window.CategoryRepository) { var catObj = window.CategoryRepository.getById(art.category); if (catObj) {
                    var lang = document.documentElement.lang === 'id' ? 'id' : 'en';
                    badgeLabel = catObj[lang];
                    badgeClass = catObj.badgeClass;
                }
                }
                html += '<a href="insight-detail.html?id=' + art.id + '" class="group block bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-emerald-700/30 transition">' +
                        '<div class="flex flex-col h-full justify-between">' +
                        '<div>' +
                        '<span class="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 ' + badgeClass + '">' + badgeLabel + '</span>' +
                        '<h3 class="font-serif text-lg font-bold text-gray-950 leading-snug group-hover:text-[#004D34] transition line-clamp-3">' + loc(art.title) + '</h3>' +
                        '</div>' +
                        '<div class="mt-4 flex items-center justify-between text-xs text-gray-400">' +
                        '<span>' + art.dates.published + '</span>' +
                        '<span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#004D34] group-hover:text-white transition"><i data-lucide="arrow-up-right" class="w-4 h-4"></i></span>' +
                        '</div>' +
                        '</div></a>';
            }
            grid.innerHTML = html;
        },

        init: function() {
            this.renderPeopleGrid('peopleGrid');
            this.renderExpertise('expertiseGrid');
            this.renderIndustries('industriesGrid');
            this.renderInsights('insightsGrid');
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    PeopleRenderer.renderPeopleGrid('peopleGrid');
                    PeopleRenderer.renderExpertise('expertiseGrid');
                    PeopleRenderer.renderIndustries('industriesGrid');
                    PeopleRenderer.renderInsights('insightsGrid');
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { PeopleRenderer.init(); });
    } else {
        PeopleRenderer.init();
    }
    
    window.openBioModal = function(id) {
        if (!window.PeopleRepository) return;
        var p = window.PeopleRepository.getAll().find(function(x) { return x.id === id; });
        if (!p) return;
        var modal = document.getElementById('bioModal');
        if (!modal) return;

        document.getElementById('modal-img').src = p.photo;
        document.getElementById('modal-img').alt = t(p.nameKey);
        document.getElementById('modal-name').textContent = t(p.nameKey);
        document.getElementById('modal-title').textContent = t(p.titleKey) + " — " + t(p.practiceKey);
        
        var locationSpan = document.getElementById('modal-location').querySelector('span');
        if (locationSpan) locationSpan.textContent = t(p.locationKey);
        
        document.getElementById('modal-linkedin').href = p.linkedin;
        document.getElementById('modal-email').href = "mailto:" + p.email;
        document.getElementById('modal-bio').textContent = t(p.bioKey);

        document.getElementById('modal-expertise').innerHTML = p.expertiseKeys.map(function(k) {
            return '<span class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full">' + t(k) + '</span>';
        }).join('');

        document.getElementById('modal-experience').innerHTML = p.experienceKeys.map(function(k) {
            return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <span>' + t(k) + '</span></li>';
        }).join('');

        if (p.publicationKeys && p.publicationKeys.length > 0) {
            document.getElementById('modal-publications').innerHTML = p.publicationKeys.map(function(k, i) {
                return '<div class="bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-emerald-700/40 transition">' +
                    '<h5 class="font-semibold text-gray-900 leading-tight mb-1 mb-1.5">' + t(k) + '</h5>' +
                    '<span class="text-[10px] text-gray-400 block">' + p.publicationDates[i] + '</span>' +
                    '</div>';
            }).join('');
        } else {
            document.getElementById('modal-publications').innerHTML = '<p class="text-xs text-gray-400 italic">' + (t('people.no_publications') || 'No publications available.') + '</p>';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
    
    window.closeBioModal = function() {
        var modal = document.getElementById('bioModal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.PeopleRenderer = PeopleRenderer;
})();
