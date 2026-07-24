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
                    '<p class="text-xs text-gray-500">' + loc(ind.desc) + '</p></div>' +
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
    
    function ensureBioModalElements() {
        var modal = document.getElementById('bioModal') || document.getElementById('authorModal');
        if (!modal) {
            var modalDiv = document.createElement('div');
            modalDiv.id = 'bioModal';
            modalDiv.className = 'fixed inset-0 z-50 opacity-0 pointer-events-none transition-all duration-300 flex items-center justify-center p-4';
            modalDiv.innerHTML = '<div class="absolute inset-0 bg-gray-900/60 backdrop-blur-xs" onclick="closeBioModal()"></div>' +
                '<div class="modal-content bg-white rounded-2xl max-w-4xl w-full relative z-10 shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row transform scale-95 translate-y-[15px] transition-all duration-300 max-h-[90vh] md:max-h-[85vh]">' +
                '<button onclick="closeBioModal()" class="absolute top-4 right-4 bg-white/80 p-1.5 rounded-full text-gray-500 hover:text-gray-800 shadow-xs border border-gray-100 transition z-20"><i data-lucide="x" class="w-5 h-5"></i></button>' +
                '<div class="w-full md:w-1/3 bg-gray-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0 text-center">' +
                '<img id="modal-img" src="" alt="" class="w-36 h-48 rounded-xl object-cover shadow-md border-4 border-white mb-4 bg-gray-200">' +
                '<h3 id="modal-name" class="text-xl font-bold text-gray-900 leading-tight"></h3>' +
                '<p id="modal-title" class="text-xs font-bold text-[#004D34] uppercase tracking-wide mt-1 mb-2"></p>' +
                '<p id="modal-location" class="text-xs text-gray-400 flex items-center gap-1 mb-6"><i data-lucide="map-pin" class="w-3 h-3"></i> <span></span></p>' +
                '<div class="flex gap-2.5 w-full">' +
                '<a id="modal-linkedin" href="#" target="_blank" rel="noopener noreferrer" class="flex-1 bg-white border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-600 hover:text-emerald-900 hover:border-emerald-700 flex justify-center items-center gap-1 transition"><i data-lucide="linkedin" class="w-3.5 h-3.5"></i> LinkedIn</a>' +
                '<a id="modal-email" href="#" class="flex-1 bg-white border border-gray-200 rounded-lg py-2 text-xs font-semibold text-gray-600 hover:text-emerald-900 hover:border-emerald-700 flex justify-center items-center gap-1 transition"><i data-lucide="mail" class="w-3.5 h-3.5"></i> Email</a>' +
                '</div>' +
                '</div>' +
                '<div class="w-full md:w-2/3 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">' +
                '<div><h4 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2" data-i18n="people.modal_bio">Biography</h4><p id="modal-bio" class="text-gray-600 text-sm leading-relaxed"></p></div>' +
                '<div><h4 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2" data-i18n="people.modal_expertise">Expertise & Practice Focus</h4><div id="modal-expertise" class="flex flex-wrap gap-1.5"></div></div>' +
                '<div><h4 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3" data-i18n="people.modal_experience">Representative Experience</h4><ul id="modal-experience" class="space-y-2 text-xs text-gray-600"></ul></div>' +
                '<div><h4 class="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3" data-i18n="people.modal_publications">Publications & Insights</h4><div id="modal-publications" class="grid sm:grid-cols-2 gap-3"></div></div>' +
                '</div>' +
                '</div>';
            document.body.appendChild(modalDiv);
            modal = modalDiv;
        }

        var navModal = document.getElementById('articleNotAvailableModal');
        if (!navModal) {
            var navDiv = document.createElement('div');
            navDiv.id = 'articleNotAvailableModal';
            navDiv.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300';
            navDiv.innerHTML = '<div id="articleNotAvailableContent" class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 transform scale-95 transition-all duration-300">' +
                '<button onclick="closeArticleNotAvailableModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition" aria-label="Close"><i data-lucide="x" class="w-5 h-5"></i></button>' +
                '<div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#004D34] flex items-center justify-center mb-4"><i data-lucide="file-text" class="w-6 h-6"></i></div>' +
                '<h3 id="notAvailableTitle" class="font-serif text-xl font-bold text-gray-950 mb-2">Article / Post Not Available Yet</h3>' +
                '<div id="notAvailableTopicBadge" class="hidden mb-3"><span id="notAvailableTopic" class="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100/80 rounded-md px-2.5 py-1 inline-block"></span></div>' +
                '<p id="notAvailableDesc" class="text-sm text-gray-600 leading-relaxed mb-6">The detailed article or publication for this topic is currently being prepared by our editorial team and will be released soon. In the meantime, feel free to explore our published insights.</p>' +
                '<div class="flex flex-col sm:flex-row items-center gap-3">' +
                '<a href="insights.html" id="notAvailableExploreBtn" class="w-full sm:w-auto flex-1 bg-[#004D34] text-white px-5 py-2.5 rounded-xl text-xs font-semibold text-center hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"><span data-i18n="people.explore_insights">Explore Insights</span><i data-lucide="arrow-right" class="w-4 h-4"></i></a>' +
                '<button onclick="closeArticleNotAvailableModal()" id="notAvailableCloseBtn" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition text-center" data-i18n="people.close">Close</button>' +
                '</div>' +
                '</div>';
            document.body.appendChild(navDiv);
        }

        return modal;
    }
    
    window.openBioModal = function(id) {
        if (!window.PeopleRepository) return;
        var p = window.PeopleRepository.getAll().find(function(x) { return x.id === id; });
        if (!p) return;
        var modal = ensureBioModalElements();

        var PUBLICATION_SLUGS = {
            'people.p1_pub_1': 'digital-economy-regulations',
            'people.p1_pub_2': 'manufacturing-transformation',
            'people.p2_pub_1': 'manufacturing-transformation',
            'people.p3_pub_1': 'tax-reform-2026',
            'people.p3_pub_2': 'cross-border-tax-planning',
            'people.p4_pub_1': 'business-acquisition-guide',
            'people.p4_pub_2': 'family-business-succession',
            'people.p5_pub_1': 'risk-management-framework',
            'people.p6_pub_1': 'indonesia-tax-incentives-2026',
            'people.p6_pub_2': 'tax-implications-business-transfer'
        };

        function resolveTopicLink(text) {
            if (!text) return null;
            var lower = text.toLowerCase();
            if (lower.indexOf('tax') !== -1 || lower.indexOf('pajak') !== -1 || lower.indexOf('fiscal') !== -1 || lower.indexOf('fiskal') !== -1) {
                return { url: 'services/tax-services/', label: 'Tax Services' };
            }
            if (lower.indexOf('transfer') !== -1 || lower.indexOf('m&a') !== -1 || lower.indexOf('merger') !== -1 || lower.indexOf('acquisition') !== -1 || lower.indexOf('akuisi') !== -1 || lower.indexOf('succession') !== -1 || lower.indexOf('suksesi') !== -1) {
                return { url: 'services/business-transfer/', label: 'Business Transfer' };
            }
            if (lower.indexOf('risk') !== -1 || lower.indexOf('risiko') !== -1 || lower.indexOf('erm') !== -1 || lower.indexOf('cyber') !== -1 || lower.indexOf('siber') !== -1 || lower.indexOf('grc') !== -1) {
                return { url: 'services/risk-management/', label: 'Risk Management' };
            }
            if (lower.indexOf('account') !== -1 || lower.indexOf('akuntan') !== -1 || lower.indexOf('finance') !== -1 || lower.indexOf('keuangan') !== -1 || lower.indexOf('credit') !== -1 || lower.indexOf('kredit') !== -1) {
                return { url: 'services/accounting-finance/', label: 'Accounting & Finance' };
            }
            if (lower.indexOf('advisory') !== -1 || lower.indexOf('consulting') !== -1 || lower.indexOf('konsultasi') !== -1 || lower.indexOf('strategy') !== -1 || lower.indexOf('strategi') !== -1) {
                return { url: 'services/corporate-advisory/', label: 'Corporate Advisory' };
            }
            if (lower.indexOf('energy') !== -1 || lower.indexOf('energi') !== -1 || lower.indexOf('mining') !== -1 || lower.indexOf('tambang') !== -1) {
                return { url: 'industries/energy/', label: 'Energy & Natural Resources' };
            }
            if (lower.indexOf('manufacturing') !== -1 || lower.indexOf('manufaktur') !== -1 || lower.indexOf('automotive') !== -1 || lower.indexOf('otomotif') !== -1) {
                return { url: 'industries/manufacturing/', label: 'Manufacturing' };
            }
            if (lower.indexOf('financial') !== -1 || lower.indexOf('bank') !== -1 || lower.indexOf('perbankan') !== -1) {
                return { url: 'industries/financial/', label: 'Financial Services' };
            }
            if (lower.indexOf('tech') !== -1 || lower.indexOf('teknologi') !== -1 || lower.indexOf('digital') !== -1) {
                return { url: 'industries/technology/', label: 'Technology' };
            }
            if (lower.indexOf('health') !== -1 || lower.indexOf('kesehatan') !== -1 || lower.indexOf('farmasi') !== -1) {
                return { url: 'industries/healthcare/', label: 'Healthcare' };
            }
            if (lower.indexOf('consumer') !== -1 || lower.indexOf('fmcg') !== -1 || lower.indexOf('ritel') !== -1) {
                return { url: 'industries/consumer/', label: 'Consumer Goods' };
            }
            return null;
        }

        document.getElementById('modal-img').src = p.photo;
        document.getElementById('modal-img').alt = t(p.nameKey);
        document.getElementById('modal-name').textContent = t(p.nameKey);
        document.getElementById('modal-title').textContent = t(p.titleKey) + " — " + t(p.practiceKey);
        
        var locationSpan = document.getElementById('modal-location').querySelector('span');
        if (locationSpan) locationSpan.textContent = t(p.locationKey);
        
        document.getElementById('modal-linkedin').href = p.linkedin;
        document.getElementById('modal-email').href = "mailto:" + p.email;
        document.getElementById('modal-bio').textContent = t(p.bioKey);

        // 1. EXPERTISE TAGS WITH LINKS OR FALLBACK MODAL
        document.getElementById('modal-expertise').innerHTML = p.expertiseKeys.map(function(k) {
            var label = t(k);
            var targetLink = resolveTopicLink(label);
            if (targetLink) {
                return '<a href="' + targetLink.url + '" class="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300 px-2.5 py-1 rounded-full transition group" title="' + targetLink.label + '">' +
                    '<span>' + label + '</span>' +
                    '<i data-lucide="arrow-up-right" class="w-3 h-3 text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>' +
                    '</a>';
            } else {
                var escapedLabel = label.replace(/'/g, "\\'");
                return '<button onclick="showArticleNotAvailableModal(\'' + escapedLabel + '\')" class="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 px-2.5 py-1 rounded-full transition cursor-pointer group">' +
                    '<span>' + label + '</span>' +
                    '<i data-lucide="info" class="w-3 h-3 text-gray-400 group-hover:text-emerald-700 transition-colors"></i>' +
                    '</button>';
            }
        }).join('');

        // 2. REPRESENTATIVE EXPERIENCE WITH LINKS OR FALLBACK MODAL
        document.getElementById('modal-experience').innerHTML = p.experienceKeys.map(function(k) {
            var expText = t(k);
            var targetLink = resolveTopicLink(expText);
            if (targetLink) {
                return '<li class="flex items-start gap-2 mb-2 group">' +
                    '<i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i>' +
                    '<a href="' + targetLink.url + '" class="text-xs text-gray-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition">' +
                    '<span>' + expText + '</span>' +
                    '<i data-lucide="external-link" class="w-3 h-3 text-emerald-700 shrink-0 inline-block"></i>' +
                    '</a>' +
                    '</li>';
            } else {
                var escapedText = expText.replace(/'/g, "\\'");
                return '<li class="flex items-start gap-2 mb-2 group cursor-pointer" onclick="showArticleNotAvailableModal(\'' + escapedText + '\')">' +
                    '<i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i>' +
                    '<span class="text-xs text-gray-700 group-hover:text-emerald-800 transition-colors">' + expText + '</span>' +
                    '<i data-lucide="info" class="w-3 h-3 text-gray-300 group-hover:text-emerald-700 shrink-0 mt-0.5 transition-colors"></i>' +
                    '</li>';
            }
        }).join('');

        // 3. PUBLICATIONS & INSIGHTS CARDS WITH LINKS OR FALLBACK MODAL
        if (p.publicationKeys && p.publicationKeys.length > 0) {
            document.getElementById('modal-publications').innerHTML = p.publicationKeys.map(function(k, i) {
                var pubTitle = t(k);
                var slug = PUBLICATION_SLUGS[k];
                if (slug) {
                    var url = 'insight-detail.html?slug=' + slug;
                    return '<a href="' + url + '" class="group block bg-gray-50 border border-gray-100 rounded-xl p-3.5 hover:border-emerald-700/40 hover:bg-emerald-50/30 hover:shadow-md transition">' +
                        '<div class="flex items-start justify-between gap-2 mb-1.5">' +
                        '<h5 class="font-serif font-bold text-xs text-gray-950 leading-snug group-hover:text-emerald-900 transition-colors line-clamp-2">' + pubTitle + '</h5>' +
                        '<span class="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-[#004D34] group-hover:text-white group-hover:border-transparent transition">' +
                        '<i data-lucide="arrow-up-right" class="w-3 h-3"></i>' +
                        '</span>' +
                        '</div>' +
                        '<span class="text-[10px] text-gray-400 block">' + p.publicationDates[i] + '</span>' +
                        '</a>';
                } else {
                    var escapedTitle = pubTitle.replace(/'/g, "\\'");
                    return '<div onclick="showArticleNotAvailableModal(\'' + escapedTitle + '\')" class="group cursor-pointer bg-gray-50 border border-gray-100 rounded-xl p-3.5 hover:border-emerald-200 hover:bg-gray-100/80 transition">' +
                        '<div class="flex items-start justify-between gap-2 mb-1.5">' +
                        '<h5 class="font-serif font-bold text-xs text-gray-950 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">' + pubTitle + '</h5>' +
                        '<span class="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-gray-400 group-hover:text-emerald-700 group-hover:border-emerald-300 transition">' +
                        '<i data-lucide="info" class="w-3 h-3"></i>' +
                        '</span>' +
                        '</div>' +
                        '<div class="flex items-center justify-between text-[10px] text-gray-400">' +
                        '<span>' + p.publicationDates[i] + '</span>' +
                        '<span class="text-emerald-800 font-semibold text-[9px] uppercase tracking-wider">' + (currentLang() === 'id' ? 'Belum Rilis' : 'Upcoming') + '</span>' +
                        '</div>' +
                        '</div>';
                }
            }).join('');
        } else {
            document.getElementById('modal-publications').innerHTML = '<p class="text-xs text-gray-400 italic">' + (t('people.no_publications') || 'No publications available.') + '</p>';
        }

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto', 'active');

        var content = modal.querySelector('.modal-content') || modal.querySelector('.expert-modal-content');
        if (content) {
            content.classList.remove('scale-95', 'translate-y-[15px]');
            content.classList.add('scale-100', 'translate-y-0');
        }

        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
    
    window.closeBioModal = function() {
        var modal = document.getElementById('bioModal') || document.getElementById('authorModal') || document.getElementById('expertBioModal');
        if (!modal) return;
        modal.classList.remove('opacity-100', 'pointer-events-auto', 'active');
        modal.classList.add('opacity-0', 'pointer-events-none');

        var content = modal.querySelector('.modal-content') || modal.querySelector('.expert-modal-content');
        if (content) {
            content.classList.remove('scale-100', 'translate-y-0');
            content.classList.add('scale-95', 'translate-y-[15px]');
        }
        document.body.style.overflow = '';
    };

    window.showArticleNotAvailableModal = function(topicTitle) {
        var modalEl = document.getElementById('articleNotAvailableModal');
        if (!modalEl) return;
        var topicEl = document.getElementById('notAvailableTopic');
        var topicBadge = document.getElementById('notAvailableTopicBadge');
        if (topicEl && topicBadge) {
            if (topicTitle) {
                topicEl.textContent = topicTitle;
                topicBadge.classList.remove('hidden');
            } else {
                topicBadge.classList.add('hidden');
            }
        }
        modalEl.classList.remove('opacity-0', 'pointer-events-none');
        modalEl.classList.add('opacity-100', 'pointer-events-auto');
        var content = modalEl.querySelector('#articleNotAvailableContent');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeArticleNotAvailableModal = function() {
        var modalEl = document.getElementById('articleNotAvailableModal');
        if (!modalEl) return;
        modalEl.classList.remove('opacity-100', 'pointer-events-auto');
        modalEl.classList.add('opacity-0', 'pointer-events-none');
        var content = modalEl.querySelector('#articleNotAvailableContent');
        if (content) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
    };

    window.openAuthorModal = function(id) {
        window.openBioModal(id);
    };

    window.closeAuthorModal = function() {
        window.closeBioModal();
    };

    window.PeopleRenderer = PeopleRenderer;
})();

