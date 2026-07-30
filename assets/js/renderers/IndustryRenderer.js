/**
 * IndustryRenderer - Component for rendering industry page dynamic elements
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

    var IndustryRenderer = {
        renderExperts: function() {
            var grid = document.getElementById('expertsGrid');
            if (!grid) return;
            
            // These are the specific experts featured on the Industry overview page
            var featuredExpertIds = ['p3', 'p6', 'p4', 'p5'];
            var experts = [];
            
            if (window.PeopleRepository) {
                var allPeople = window.PeopleRepository.getAll();
                for (var i = 0; i < featuredExpertIds.length; i++) {
                    var p = allPeople.find(function(x) { return x.peopleId === featuredExpertIds[i] || x.id === featuredExpertIds[i]; });
                    if (p) experts.push(p);
                }
            } else {
                return;
            }

            var html = '';
            for (var i = 0; i < experts.length; i++) {
                var e = experts[i];
                var role = t(e.titleKey);
                var photo = e.photo || e.image;
                
                // Fallback for tags/display if they are not in PeopleRepository, we just show some expertise
                var expertiseStr = '';
                var expKeys = e.expertiseKeys || [];
                if (expKeys.length > 0) expertiseStr = t(expKeys[0]);
                if (expKeys.length > 1) expertiseStr += ' · ' + t(expKeys[1]);
                
                html += '<div class="expert-card" onclick="openExpertModal(\'' + (e.peopleId || e.id) + '\')">' +
                    '<img src="' + photo + '" alt="' + t(e.nameKey) + '" loading="lazy" class="expert-card__img">' +
                    '<div class="expert-card__body">' +
                    '<h3 class="expert-card__name">' + t(e.nameKey) + '</h3>' +
                    '<p class="expert-card__role">' + role + '</p>' +
                    '<p class="expert-card__expertise">' + expertiseStr + '</p>' +
                    '<span class="expert-card__cta">' + t('people.view_profile') + ' <i data-lucide="arrow-right" class="w-3.5 h-3.5 expert-card__arrow"></i></span>' +
                    '</div></div>';
            }
            grid.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        renderInsights: function() {
            var featuredContainer = document.getElementById('siFeatured');
            var listContainer = document.getElementById('siList');
            if (!featuredContainer || !listContainer) return;
            
            var allArticles = window.ArticleRepository ? window.ArticleRepository.getAll() : [];
            var sorted = allArticles.slice().sort(function(a, b) {
                return new Date(b.dates.published) - new Date(a.dates.published);
            });
            var articles = sorted.slice(0, 5);
            if (articles.length === 0) return;
            
            var getCatLabel = function(catId) {
                if (window.CategoryRepository && typeof window.CategoryRepository.getById === 'function') {
                    var catObj = window.CategoryRepository.getById(catId);
                    if (catObj) return loc(catObj);
                }
                if (window.CHATURA && window.CHATURA.CATEGORIES && window.CHATURA.CATEGORIES[catId]) {
                    return loc(window.CHATURA.CATEGORIES[catId]);
                }
                return catId ? catId.toUpperCase() : '';
            };

            var getArticleUrl = function (article) {
                if (window.CHATURA && typeof window.CHATURA.getArticleUrl === 'function') {
                    return window.CHATURA.getArticleUrl(article);
                }
                return 'insight-detail.html?slug=' + (article.slug || article.id);
            };
            
            var featured = articles[0];
            var fCatLabel = getCatLabel(featured.category);
            var articleUrl = getArticleUrl(featured);
            var title = loc(featured.title);
            var subtitle = loc(featured.subtitle) || (featured.execSummary ? loc(featured.execSummary.summary) : loc(featured.excerpt));
            var displayDate = featured.dates && featured.dates.display ? loc(featured.dates.display) : (featured.dates ? featured.dates.published : '');
            var readTime = loc(featured.readingTime) || (featured.readTime ? featured.readTime + ' ' + (t('common.min_read') || 'min read') : '');
            var readCtaText = t('insight.read_cta') || 'Read Insight';

            featuredContainer.innerHTML =
                '<a href="' + articleUrl + '" class="si-featured block">' +
                    '<div class="si-featured-img"><img src="' + (featured.heroImage || featured.image || '') + '" alt="' + title + '" loading="lazy"></div>' +
                    '<span class="si-featured-badge">' + fCatLabel + '</span>' +
                    '<div class="si-featured-glass">' +
                        '<p class="si-featured-eyebrow">' + fCatLabel + '</p>' +
                        '<h3 class="si-featured-title">' + title + '</h3>' +
                        '<p class="si-featured-desc">' + subtitle + '</p>' +
                        '<div class="si-featured-footer">' +
                            '<span class="si-featured-meta">' + displayDate + (readTime ? ' · ' + readTime : '') + '</span>' +
                            '<span class="si-featured-cta">' + readCtaText + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' +
                        '</div></div></a>';
                        
            var listHtml = '<div class="si-list">';
            for (var i = 1; i < articles.length; i++) {
                var a = articles[i];
                var catLabel = getCatLabel(a.category);
                var aUrl = getArticleUrl(a);
                var aTitle = loc(a.title);
                var aReadTime = loc(a.readingTime) || (a.readTime ? a.readTime + ' ' + (t('common.min_read') || 'min read') : '');

                listHtml += '<a href="' + aUrl + '" class="si-list-item">' +
                    '<img src="' + (a.thumbnail || a.image || '') + '" alt="' + aTitle + '" loading="lazy" class="si-list-thumb">' +
                    '<div class="si-list-body"><p class="si-list-cat">' + catLabel + '</p><h4 class="si-list-title">' + aTitle + '</h4><p class="si-list-meta">' + aReadTime + '</p></div>' +
                    '<svg class="si-list-arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>';
            }
            listHtml += '</div>';
            listContainer.innerHTML = listHtml;
        },

        init: function() {
            this.renderExperts();
            this.renderInsights();
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    IndustryRenderer.renderExperts();
                    IndustryRenderer.renderInsights();
                });
            }
        }
    };

    document.addEventListener('component:loaded', function (e) {
        var name = e.detail && e.detail.name;
        if (name && (name === 'industries/insights' || name === 'industries/experts')) {
            IndustryRenderer.init();
        }
    });

    document.addEventListener('components:all-loaded', function () {
        IndustryRenderer.init();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { IndustryRenderer.init(); });
    } else {
        IndustryRenderer.init();
    }
    
    // Topic Link Resolver Engine
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

    // Bind Expert Modal
    window.openExpertModal = function (arg) {
        var _expertModal = document.getElementById('expertBioModal') || document.getElementById('bioModal') || document.getElementById('authorModal');
        if (!_expertModal && window.PeopleRenderer && typeof window.PeopleRenderer.openBioModal === 'function') {
            window.PeopleRenderer.openBioModal(arg);
            return;
        }
        if (!_expertModal) return;

        var e = null;
        if (window.PeopleRepository) {
            var allPeople = window.PeopleRepository.getAll();
            if (typeof arg === 'number' || (typeof arg === 'string' && !isNaN(arg) && arg.trim() !== '')) {
                var idx = parseInt(arg, 10);
                e = allPeople[idx];
            }
            if (!e) {
                e = allPeople.find(function(x) { return x.peopleId === arg || x.id === arg || x.nameKey === arg; });
            }
        }
        if (!e && window.EXPERTS) {
            if (typeof arg === 'number' || (typeof arg === 'string' && !isNaN(arg) && arg.trim() !== '')) {
                e = window.EXPERTS[parseInt(arg, 10)];
            } else {
                e = window.EXPERTS.find(function(x) { return x.id === arg || x.peopleId === arg || x.name === arg; });
            }
        }
        if (!e) return;

        var tr = function(k) {
            if (!k) return '';
            var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
            return d[k] || k;
        };

        var nameStr = e.nameKey ? tr(e.nameKey) : (e.name || '');
        var titleStr = e.titleKey ? (tr(e.titleKey) + (e.practiceKey ? ' — ' + tr(e.practiceKey) : '')) : (e.role || '');
        var photo = e.photo || e.image || '';
        var bioStr = e.bioKey ? tr(e.bioKey) : (e.bio || '');

        var imgEl = document.getElementById('expertModalImg') || document.getElementById('modal-img');
        if (imgEl) { imgEl.src = photo; imgEl.alt = nameStr; }

        var nameEl = document.getElementById('expertModalName') || document.getElementById('modal-name');
        if (nameEl) nameEl.textContent = nameStr;

        var titleEl = document.getElementById('expertModalTitle') || document.getElementById('modal-title');
        if (titleEl) titleEl.textContent = titleStr;

        var liEl = document.getElementById('expertModalLinkedin') || document.getElementById('modal-linkedin');
        if (liEl) liEl.href = e.linkedin || '#';

        var emEl = document.getElementById('expertModalEmail') || document.getElementById('modal-email');
        if (emEl) emEl.href = e.email ? ('mailto:' + e.email) : '#';

        var bioEl = document.getElementById('expertModalBio') || document.getElementById('modal-bio');
        if (bioEl) bioEl.textContent = bioStr;

        var expKeys = e.expertiseKeys || e.expertise || [];
        var expContainer = document.getElementById('expertModalExpertise') || document.getElementById('modal-expertise');
        if (expContainer) {
            expContainer.innerHTML = expKeys.map(function (k) {
                var translated = typeof k === 'string' && k.indexOf('.') > -1 ? tr(k) : k;
                var res = resolveTopicLink(translated);
                if (res) {
                    return '<a href="' + res.url + '" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-[#004D34] hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">' + translated + ' <i data-lucide="external-link" class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100"></i></a>';
                }
                var escapedVal = translated.replace(/'/g, "\\'");
                return '<button onclick="showArticleNotAvailableModal(\'' + escapedVal + '\')" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors duration-200 text-left">' + translated + '</button>';
            }).join('');
        }

        var exprKeys = e.experienceKeys || e.experience || [];
        var expContainer2 = document.getElementById('expertModalExperience') || document.getElementById('modal-experience');
        if (expContainer2) {
            expContainer2.innerHTML = exprKeys.map(function (k) {
                var translated = typeof k === 'string' && k.indexOf('.') > -1 ? tr(k) : k;
                var res = resolveTopicLink(translated);
                var escapedVal = translated.replace(/'/g, "\\'");
                if (res) {
                    return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <a href="' + res.url + '" class="hover:text-[#004D34] hover:underline transition-colors flex items-center gap-1">' + translated + ' <i data-lucide="arrow-up-right" class="w-3 h-3 text-emerald-600"></i></a></li>';
                }
                return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <button onclick="showArticleNotAvailableModal(\'' + escapedVal + '\')" class="text-left hover:text-[#004D34] hover:underline transition-colors">' + translated + '</button></li>';
            }).join('');
        }

        _expertModal.classList.remove('opacity-0', 'pointer-events-none');
        _expertModal.classList.add('opacity-100', 'pointer-events-auto', 'active');
        var content = _expertModal.querySelector('.expert-modal-content') || _expertModal.querySelector('.modal-content');
        if (content) {
            content.classList.remove('scale-95', 'translate-y-[15px]');
            content.classList.add('scale-100', 'translate-y-0');
        }
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeExpertModal = function () {
        var _expertModal = document.getElementById('expertBioModal') || document.getElementById('bioModal') || document.getElementById('authorModal');
        if (_expertModal) {
            _expertModal.classList.remove('opacity-100', 'pointer-events-auto', 'active');
            _expertModal.classList.add('opacity-0', 'pointer-events-none');
            var content = _expertModal.querySelector('.expert-modal-content') || _expertModal.querySelector('.modal-content');
            if (content) {
                content.classList.remove('scale-100', 'translate-y-0');
                content.classList.add('scale-95', 'translate-y-[15px]');
            }
        }
        document.body.style.overflow = '';
    };

    window.openBioModal = window.openExpertModal;
    window.openAuthorModal = window.openExpertModal;
    window.closeBioModal = window.closeExpertModal;
    window.closeAuthorModal = window.closeExpertModal;

    window.IndustryRenderer = IndustryRenderer;
})();
