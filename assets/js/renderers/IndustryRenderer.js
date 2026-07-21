/**
 * IndustryRenderer - Component for rendering industry page dynamic elements
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
                    '<span class="expert-card__cta">View Profile <i data-lucide="arrow-right" class="w-3.5 h-3.5 expert-card__arrow"></i></span>' +
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
                if (window.CategoryRepository) { var catObj = window.CategoryRepository.getById(catId); if (catObj) {
                    var lang = currentLang();
                    return catObj[lang] || catId;
                }
                }
                return catId;
            };
            
            var featured = articles[0];
            var fCatLabel = getCatLabel(featured.category);
            
            featuredContainer.innerHTML =
                '<a href="insight-detail.html?id=' + featured.id + '" class="si-featured block">' +
                    '<div class="si-featured-img"><img src="' + (featured.heroImage || featured.image) + '" alt="' + loc(featured.title) + '" loading="lazy"></div>' +
                    '<span class="si-featured-badge">' + fCatLabel + '</span>' +
                    '<div class="si-featured-glass">' +
                        '<p class="si-featured-eyebrow">' + fCatLabel + '</p>' +
                        '<h3 class="si-featured-title">' + loc(featured.title) + '</h3>' +
                        '<p class="si-featured-desc">' + loc(featured.excerpt) + '</p>' +
                        '<div class="si-featured-footer">' +
                            '<span class="si-featured-meta">' + featured.dates.published + ' · ' + featured.readTime + ' min read</span>' +
                            '<span class="si-featured-cta">Read Insight <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' +
                        '</div></div></a>';
                        
            var listHtml = '<div class="si-list">';
            for (var i = 1; i < articles.length; i++) {
                var a = articles[i];
                var catLabel = getCatLabel(a.category);
                listHtml += '<a href="insight-detail.html?id=' + a.id + '" class="si-list-item">' +
                    '<img src="' + (a.thumbnail || a.image) + '" alt="' + loc(a.title) + '" loading="lazy" class="si-list-thumb">' +
                    '<div class="si-list-body"><p class="si-list-cat">' + catLabel + '</p><h4 class="si-list-title">' + loc(a.title) + '</h4><p class="si-list-meta">' + a.readTime + ' min read</p></div>' +
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { IndustryRenderer.init(); });
    } else {
        IndustryRenderer.init();
    }
    
    // Bind Expert Modal
    window.openExpertModal = function (id) {
        var _expertModal = document.getElementById('expertBioModal');
        if (!_expertModal || !window.PeopleRepository) return;
        var e = window.PeopleRepository.getAll().find(function(x) { return x.peopleId === id || x.id === id; });
        if (!e) return;
        
        var photo = e.photo || e.image;
        var expKeys = e.expertiseKeys || [];
        var exprKeys = e.experienceKeys || [];
        
        document.getElementById('expertModalImg').src = photo;
        document.getElementById('expertModalImg').alt = t(e.nameKey);
        document.getElementById('expertModalName').textContent = t(e.nameKey);
        document.getElementById('expertModalTitle').textContent = t(e.titleKey);
        document.getElementById('expertModalLinkedin').href = e.linkedin;
        document.getElementById('expertModalEmail').href = 'mailto:' + e.email;
        document.getElementById('expertModalBio').textContent = t(e.bioKey);
        
        document.getElementById('expertModalExpertise').innerHTML = expKeys.map(function (k) {
            return '<span class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full">' + t(k) + '</span>';
        }).join('');
        
        document.getElementById('expertModalExperience').innerHTML = exprKeys.map(function (k) {
            return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <span>' + t(k) + '</span></li>';
        }).join('');
        
        _expertModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };
    window.closeExpertModal = function () {
        var _expertModal = document.getElementById('expertBioModal');
        if (_expertModal) _expertModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.IndustryRenderer = IndustryRenderer;
})();
