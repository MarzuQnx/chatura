/**
 * ArticleRenderer - Component for rendering articles on pages
 */
(function () {
    'use strict';

    var CR = window.TranslationRepository;
    var currentLang = function () { return CR ? CR.getCurrentLanguage() : 'en'; };
    var loc = function (obj) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[currentLang()] || obj.en || '';
    };

    var ArticleRenderer = {
        selectedType: 'all',
        searchString: '',
        defaultItemsToShow: 9,
        itemsToShow: 9,

        renderLatestArticles: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container || !window.ArticleRepository) return;
            
            var allArticles = window.ArticleRepository.find(function() { return true; }) || [];
            var articles = allArticles.slice(0, 7);
            var html = '';
            
            for (var i = 0; i < articles.length; i++) {
                var a = articles[i];
                var catObj = (window.CategoryRepository) ? window.CategoryRepository.getById(a.category) : null;
                var badgeLoc = a.badge || catObj || { en: 'ARTICLE', id: 'ARTIKEL' };
                var badgeClass = catObj && catObj.badgeClass ? catObj.badgeClass : 'bg-[#004D34]/10 text-[#004D34]';
                
                html += '<article class="latest-card group overflow-hidden bg-white border border-gray-100 rounded-2xl flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">' +
                        '<div class="relative overflow-hidden aspect-16/10 bg-gray-100">' +
                            '<img src="' + a.image + '" alt="' + loc(a.title) + '" class="latest-card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" width="600" height="375">' +
                            '<div class="absolute top-4 left-4 z-10"><span class="text-[10px] font-bold uppercase tracking-wider ' + badgeClass + ' px-3 py-1 rounded-full">' + loc(badgeLoc) + '</span></div>' +
                        '</div>' +
                        '<div class="p-6 flex flex-col flex-1">' +
                            '<h3 class="font-serif font-bold text-base text-gray-950 mb-2 leading-snug"><a href="insight-detail.html?slug=' + a.slug + '" class="hover:text-emerald-800 transition-colors duration-200">' + loc(a.title) + '</a></h3>' +
                            '<p class="text-gray-500 text-xs leading-[1.7] line-clamp-2 mb-4 flex-1">' + (loc(a.description) || loc(a.subtitle) || '') + '</p>' +
                            '<div class="flex items-center justify-between pt-4 border-t border-gray-50">' +
                                '<span class="text-xs text-gray-400">' + (a.dates && a.dates.display ? loc(a.dates.display) : '') + '</span>' +
                                '<a href="insight-detail.html?slug=' + a.slug + '" class="latest-cta text-xs font-bold text-[#004D34] flex items-center gap-1 hover:gap-2 transition-all duration-200" aria-label="Read: ' + loc(a.title).replace(/"/g, '&quot;') + '">Read Insight <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>' +
                            '</div>' +
                        '</div>' +
                    '</article>';
            }
            
            container.innerHTML = html;
            
            // Reinitialize carousel if LatestCarousel exists
            if (window.LatestCarousel) {
                container.removeAttribute('data-carousel-initialized');
                window.LatestCarousel.init('latestCarousel', 'latestPrev', 'latestNext');
            }
        },

        renderFeaturedArticle: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container || !window.ArticleRepository) return;
            
            var featured = window.ArticleRepository.getFeatured();
            if (!featured) return;
            
            var catObj = (window.CategoryRepository) ? window.CategoryRepository.getById(featured.category) : null;
            var catLabel = catObj ? loc(catObj) : '';
            var articleUrl = 'insight-detail.html?slug=' + featured.slug;

            var html = '<a href="' + articleUrl + '" class="featured-card reveal-up group grid md:grid-cols-[6fr_5fr] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-800 transition-all duration-500">' +
                '<div class="relative overflow-hidden min-h-75 md:min-h-100">' +
                '<img src="' + featured.image + '" alt="' + loc(featured.title) + '" class="featured-image w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500" loading="lazy" width="1200" height="800">' +
                '<div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>' +
                '</div>' +
                '<div class="featured-content-bg p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-white group-hover:bg-[#004D34] transition-colors duration-500">' +
                '<div><div class="flex items-center gap-3 mb-5">' +
                '<span class="featured-badge text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 group-hover:bg-white/20 group-hover:text-white px-3 py-1 rounded-full transition-all duration-500">' + catLabel + '</span>' +
                '<span class="featured-meta-text text-[10px] text-gray-400 group-hover:text-white/70 transition-colors duration-500">' + loc(featured.readingTime) + '</span>' +
                '</div>' +
                '<h3 class="featured-title text-xl md:text-2xl font-serif font-bold text-gray-950 mb-4 leading-snug group-hover:text-white transition-colors duration-500">' + loc(featured.title) + '</h3>' +
                '<p class="featured-subtitle text-gray-500 text-sm leading-[1.7] line-clamp-3 mb-6 group-hover:text-white/80 transition-colors duration-500">' + loc(featured.subtitle) + '</p>' +
                '</div>' +
                '<div><div class="featured-divider flex items-center justify-between pt-5 border-t border-gray-100 group-hover:border-white/15 transition-colors duration-500">' +
                '<div class="flex items-center gap-3">';
                
            if (featured.author && featured.author.image) {
                html += '<div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"><img src="' + featured.author.image + '" alt="' + loc(featured.author.name) + '" class="w-full h-full object-cover" width="80" height="80" loading="lazy"></div>';
            }
            
            html += '<div><p class="featured-author-name text-xs font-semibold text-gray-950 group-hover:text-white transition-colors duration-500">' + (featured.author ? loc(featured.author.name) : '') + '</p>' +
                '<p class="featured-meta-text text-gray-400 group-hover:text-white/70 text-xs transition-colors duration-500">' + (featured.dates && featured.dates.display ? loc(featured.dates.display) : '') + '</p></div>' +
                '</div>' +
                '<span class="featured-cta text-xs font-bold text-[#004D34] group-hover:text-white flex items-center gap-1 group-hover:gap-2 transition-all duration-500">Read <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5"></i></span>' +
                '</div></div></div></a>';
                
            container.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        renderInsightsGrid: function(containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.ArticleRepository) return;
            
            var allArticles = window.ArticleRepository.getAll();
            var self = this;

            var filtered = allArticles.filter(function(article) {
                var matchesType = (self.selectedType === "all" || article.type === self.selectedType);
                if (!matchesType) return false;
                if (!self.searchString) return true;
                
                var q = self.searchString.toLowerCase();
                var titleEn = (article.title.en || '').toLowerCase();
                var titleId = (article.title.id || '').toLowerCase();
                var descEn = (article.description ? (article.description.en || '') : (article.subtitle ? (article.subtitle.en || '') : '')).toLowerCase();
                var descId = (article.description ? (article.description.id || '') : (article.subtitle ? (article.subtitle.id || '') : '')).toLowerCase();
                var catObj = window.CategoryRepository ? window.CategoryRepository.getById(article.category) : null;
                var catEn = catObj ? (catObj.en || '').toLowerCase() : '';
                var catId = catObj ? (catObj.id || '').toLowerCase() : '';
                var authorEn = (article.author && article.author.name) ? (article.author.name.en || '').toLowerCase() : '';
                var authorId = (article.author && article.author.name) ? (article.author.name.id || '').toLowerCase() : '';
                var tags = (article.tags || []).join(' ').toLowerCase();
                
                return titleEn.indexOf(q) > -1 || titleId.indexOf(q) > -1 || descEn.indexOf(q) > -1 || descId.indexOf(q) > -1 || catEn.indexOf(q) > -1 || catId.indexOf(q) > -1 || authorEn.indexOf(q) > -1 || authorId.indexOf(q) > -1 || tags.indexOf(q) > -1;
            });

            var loadMoreWrap = document.getElementById('loadMoreWrap');

            if (filtered.length === 0) {
                grid.innerHTML = '<div class="col-span-full py-20 text-center empty-state">' +
                    '<div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5"><i data-lucide="search-x" class="w-7 h-7 text-gray-300"></i></div>' +
                    '<p class="text-sm font-semibold text-gray-700 mb-1">No results found</p>' +
                    '<p class="text-xs text-gray-400 mb-6">Try adjusting search or filter criteria.</p>' +
                    '<button id="clearFiltersBtn" class="text-xs font-semibold text-[#004D34] hover:underline">Clear all filters</button>' +
                    '</div>';
                
                if (loadMoreWrap) { loadMoreWrap.style.display = 'none'; loadMoreWrap.innerHTML = ''; }

                var clearBtn = document.getElementById('clearFiltersBtn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', function() {
                        var searchInput = document.getElementById('search-input');
                        if (searchInput) {
                            searchInput.value = '';
                            searchInput.dispatchEvent(new Event('input'));
                        }
                        var allTab = document.querySelector('[data-type=all]');
                        if (allTab) {
                            allTab.click();
                        }
                    });
                }
                    
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }

            var visibleArticles = filtered.slice(0, self.itemsToShow);

            grid.innerHTML = visibleArticles.map(function(article) {
                var catObj = window.CategoryRepository ? window.CategoryRepository.getById(article.category) : null;
                var badgeClass = catObj && catObj.badgeClass ? catObj.badgeClass : 'text-gray-600 bg-gray-50';
                var badgeLabel = catObj ? loc(catObj) : article.type;
                var articleUrl = 'insight-detail.html?slug=' + article.slug;
                var desc = loc(article.description) || loc(article.subtitle) || '';
                
                return '<article class="insight-card bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">' +
                    '<a href="' + articleUrl + '" class="block">' +
                    '<div class="relative overflow-hidden aspect-16/10 bg-gray-100">' +
                    '<img src="' + article.image + '" alt="' + loc(article.title) + '" class="card-image w-full h-full object-cover" loading="lazy" width="600" height="375">' +
                    '<div class="absolute top-4 left-4"><span class="text-[10px] font-bold uppercase tracking-wider ' + badgeClass + ' px-3 py-1 rounded-full">' + badgeLabel + '</span></div>' +
                    '</div></a>' +
                    '<div class="p-6 flex-col flex-1">' +
                    '<h3 class="card-title font-serif font-bold text-base text-gray-950 mb-2 leading-snug"><a href="' + articleUrl + '" class="hover:text-emerald-800 transition-colors duration-200">' + loc(article.title) + '</a></h3>' +
                    '<p class="text-gray-500 text-xs leading-[1.7] line-clamp-2 mb-4 flex-1">' + desc + '</p>' +
                    '<div class="flex items-center justify-between pt-4 border-t border-gray-50">' +
                    '<div class="flex items-center gap-2">' +
                    '<div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"><i data-lucide="user" class="w-3 h-3 text-gray-400"></i></div>' +
                    '<span class="text-xs text-gray-500">' + (article.author ? loc(article.author.name) : '') + '</span>' +
                    '</div>' +
                    '<span class="text-xs text-gray-400">' + loc(article.readingTime) + '</span>' +
                    '</div>' +
                    '<div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">' +
                    '<span class="text-xs text-gray-400">' + (article.dates && article.dates.display ? loc(article.dates.display) : '') + '</span>' +
                    '<a href="' + articleUrl + '" class="text-xs font-bold text-[#004D34] flex items-center gap-1 hover:gap-2 transition-all duration-200">Read <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>' +
                    '</div>' +
                    '</div>' +
                    '</article>';
            }).join('');

            // Render / Update Load More Button Container
            if (loadMoreWrap) {
                if (filtered.length > self.itemsToShow) {
                    var loadMoreText = currentLang() === 'id' ? 'Tampilkan Lebih Banyak Artikel' : 'Load More Articles';
                    loadMoreWrap.style.display = 'block';
                    loadMoreWrap.innerHTML = '<button type="button" id="loadMoreBtn" class="inline-flex items-center gap-2.5 bg-white border border-gray-200 hover:border-[#004D34] text-gray-800 hover:text-[#004D34] text-xs font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xs hover:shadow-md group cursor-pointer">' +
                        '<span data-i18n="insights.load_more">' + loadMoreText + '</span>' +
                        '<i data-lucide="chevron-down" class="w-4 h-4 text-[#004D34] transition-transform duration-300 group-hover:translate-y-1"></i>' +
                        '</button>';

                    var btn = document.getElementById('loadMoreBtn');
                    if (btn) {
                        btn.addEventListener('click', function() {
                            var prevCount = self.itemsToShow;
                            self.itemsToShow = filtered.length; // Show remaining articles
                            self.renderInsightsGrid(containerId);

                            if (typeof gsap !== 'undefined') {
                                var newCards = Array.from(grid.querySelectorAll('article')).slice(prevCount);
                                if (newCards.length > 0) {
                                    gsap.fromTo(newCards,
                                        { opacity: 0, y: 24 },
                                        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
                                    );
                                }
                                if (typeof window.ScrollTrigger !== 'undefined') {
                                    window.ScrollTrigger.refresh();
                                }
                            }
                        });
                    }
                } else {
                    loadMoreWrap.style.display = 'none';
                    loadMoreWrap.innerHTML = '';
                }
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        bindEvents: function() {
            var self = this;
            
            // Search Event
            var searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    self.searchString = e.target.value;
                    self.itemsToShow = self.defaultItemsToShow;
                    self.renderInsightsGrid('insightsGrid');
                });
            }

            // Filter Tabs Event
            document.querySelectorAll('.filter-tab-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-tab-btn').forEach(function(b) { b.setAttribute('aria-selected', 'false'); });
                    btn.setAttribute('aria-selected', 'true');
                    self.selectedType = btn.getAttribute('data-type');
                    self.itemsToShow = self.defaultItemsToShow;
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to('#insightsGrid', { opacity: 0, y: 10, duration: 0.15, onComplete: function() {
                            self.renderInsightsGrid('insightsGrid');
                            gsap.to('#insightsGrid', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
                        }});
                    } else { 
                        self.renderInsightsGrid('insightsGrid'); 
                    }
                });
            });
        },

        init: function() {
            // Render on initial load
            this.renderLatestArticles('latestCarousel');
            this.renderFeaturedArticle('featured-article-slot');
            this.renderInsightsGrid('insightsGrid');
            this.bindEvents();
            
            // Re-render when language changes
            if (window.ChaturaBus) {
                var self = this;
                window.ChaturaBus.on('languageChange', function() {
                    self.renderLatestArticles('latestCarousel');
                    self.renderFeaturedArticle('featured-article-slot');
                    self.renderInsightsGrid('insightsGrid');
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { ArticleRenderer.init(); });
    } else {
        ArticleRenderer.init();
    }

    window.ArticleRenderer = ArticleRenderer;
})();
