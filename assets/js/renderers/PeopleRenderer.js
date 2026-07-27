/**
 * PeopleRenderer - Component for rendering people and expertise
 * Listens to component lifecycle events (component:loaded, components:all-loaded)
 * Compatible with modular architecture via component-loader.js
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

    // Track marquee animation frame for cleanup on re-render
    var marqueeRaf = null;
    var marqueeInitialized = false;

    var PeopleRenderer = {
        renderPeopleGrid: function (containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.PeopleRepository) return;
            var people = window.PeopleRepository.getAll();
            var html = '';
            for (var i = 0; i < people.length; i++) {
                var p = people[i];
                html += '<div class="profile-card bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-xl cursor-pointer flex flex-col justify-between" onclick="openBioModal(\'' + p.id + '\')">' +
                    '<div>' +
                    '<div class="aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 bg-gray-50">' +
                    '<img src="' + p.photo + '" alt="' + t(p.nameKey) + '" loading="lazy" class="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105">' +
                    '</div>' +
                    '<h3 class="font-serif text-[16px] font-bold text-gray-950 leading-snug mb-0.5">' + t(p.nameKey) + '</h3>' +
                    '<p class="!text-[13px] text-emerald-800 font-semibold mb-2">' + t(p.titleKey) + ' — <span class="text-gray-500 font-normal">' + t(p.practiceKey) + '</span></p>' +
                    '</div>' +
                    '<div class="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400 text-xs">' +
                    '<span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>' + t(p.locationKey) + '</span>' +
                    '<span class="text-[#004D34] font-semibold group-hover:underline flex items-center gap-0.5">' + (t('people.view_all') || 'Profile') + ' <i data-lucide="chevron-right" class="w-3 h-3"></i></span>' +
                    '</div>' +
                    '</div>';
            }
            grid.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        renderExpertise: function (containerId) {
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

        renderIndustries: function (containerId) {
            var grid = document.getElementById(containerId);
            if (!grid || !window.IndustryRepository) return;
            var allIndustries = window.IndustryRepository.getAll();
            // Filter to only industries with dedicated pages (matching industries.html overview-grid)
            var allowedSlugs = ['industries/energy/', 'industries/manufacturing/', 'industries/technology/', 'industries/healthcare/', 'industries/consumer/'];
            var industries = allIndustries.filter(function (ind) {
                return allowedSlugs.indexOf(ind.slug) !== -1;
            });
            var html = '';
            for (var i = 0; i < industries.length; i++) {
                var ind = industries[i];
                var displayName = t(ind.nameKey) !== ind.nameKey ? t(ind.nameKey) : loc(ind.name);
                html += '<a href="' + ind.slug + '" class="flex items-start gap-4 p-6 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition group">' +
                    '<div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition"><i data-lucide="' + ind.icon + '" class="w-5 h-5"></i></div>' +
                    '<div><h4 class="font-bold text-sm text-gray-950 mb-1 group-hover:text-emerald-800 transition">' + displayName + '</h4>' +
                    '<p class="text-xs text-gray-500">' + loc(ind.desc) + '</p></div>' +
                    '</a>';
            }
            grid.innerHTML = html;
        },

        _resolveAuthor: function (article) {
            if (!article) return null;
            var peopleMap = { 'dyna': 'p6', 'bezaliel': 'p4', 'adine': 'p5', 'andi': 'p3', 'schweizer': 'p1', 'bolden': 'p2' };
            var pId = null;
            if (article.authorId) {
                pId = peopleMap[article.authorId] || article.authorId;
            } else if (article.author) {
                if (article.author.peopleId) pId = peopleMap[article.author.peopleId] || article.author.peopleId;
                else if (article.author.id) pId = peopleMap[article.author.id] || article.author.id;
            }
            var person = null;
            if (pId && window.PeopleRepository) {
                person = window.PeopleRepository.getAll().find(function (x) { return x.id === pId; });
            }
            if (person) {
                return {
                    name: person.nameKey ? t(person.nameKey) : '',
                    role: person.titleKey ? t(person.titleKey) : '',
                    photo: person.photo || ''
                };
            }
            if (article.author) {
                var lang = document.documentElement.lang === 'id' ? 'id' : 'en';
                return {
                    name: article.author.name ? (typeof article.author.name === 'string' ? article.author.name : article.author.name[lang] || '') : '',
                    role: article.author.role ? (typeof article.author.role === 'string' ? article.author.role : article.author.role[lang] || '') : '',
                    photo: article.author.photo || article.author.image || ''
                };
            }
            return null;
        },

        renderInsights: function () {
            var featuredEl = document.getElementById('siFeatured');
            var nextEl = document.getElementById('siList');
            if (!featuredEl || !nextEl) return;

            var allArticles = window.ArticleRepository ? window.ArticleRepository.getAll() : [];
            var sorted = allArticles.slice().sort(function (a, b) {
                return new Date(b.dates.published) - new Date(a.dates.published);
            });
            var latest = sorted.slice(0, 5);
            if (latest.length === 0) return;

            var lang = document.documentElement.lang === 'id' ? 'id' : 'en';

            // Featured article (first)
            var featured = latest[0];
            var catInfo = PeopleRenderer.getArticleCategoryLabel(featured.category);
            var articleUrl = (window.CHATURA && window.CHATURA.getArticleUrl) ? window.CHATURA.getArticleUrl(featured) : 'insight-detail.html?slug=' + featured.slug;
            var featAuthor = PeopleRenderer._resolveAuthor(featured);
            var authorName = featAuthor ? featAuthor.name : '';
            var authorRole = featAuthor ? featAuthor.role : '';
            var authorPhoto = featAuthor ? featAuthor.photo : '';
            var title = typeof featured.title === 'string' ? featured.title : featured.title[lang];
            var subtitle = featured.subtitle ? (typeof featured.subtitle === 'string' ? featured.subtitle : featured.subtitle[lang]) : '';
            var displayDate = featured.dates && featured.dates.display ? (typeof featured.dates.display === 'string' ? featured.dates.display : featured.dates.display[lang]) : '';
            var readTime = featured.readingTime ? (typeof featured.readingTime === 'string' ? featured.readingTime : featured.readingTime[lang]) : '';

            featuredEl.innerHTML = '<a href="' + articleUrl + '" class="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl flex flex-col justify-between min-h-145">' +
                '<span class="absolute right-6 top-4 text-7xl font-serif font-bold text-gray-900 opacity-5 pointer-events-none select-none z-10">01</span>' +
                '<div>' +
                '<div class="relative overflow-hidden aspect-16/10 bg-neutral-900 w-full">' +
                '<img src="' + (featured.image || '') + '" alt="' + title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">' +
                '<div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>' +
                '</div>' +
                '<div class="p-8">' +
                '<div class="flex items-center gap-2 mb-4 transition-transform duration-300 group-hover:-translate-y-0.5">' +
                '<span class="text-[9px] font-bold uppercase tracking-widest bg-emerald-800 text-white px-2.5 py-0.5 rounded-sm">NEW</span>' +
                '<span class="text-[10px] font-bold uppercase tracking-wider ' + catInfo.badgeClass + ' px-2 py-0.5 rounded">' + catInfo.label + '</span>' +
                '</div>' +
                '<div class="border-l-2 border-emerald-700 pl-4">' +
                '<h3 class="font-serif font-bold text-xl md:text-2xl text-gray-950 leading-tight mb-4 group-hover:text-emerald-800 transition-colors duration-300">' + title + '</h3>' +
                '</div>' +
                '<p class="text-xs text-gray-500 leading-relaxed mb-6 pl-4 line-clamp-3">' + subtitle + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="px-8 pb-8 pt-4 border-t border-gray-100 flex items-center justify-between">' +
                '<div class="flex items-center gap-3">' +
                '<img class="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200" src="' + authorPhoto + '" alt="' + authorName + '" loading="lazy">' +
                '<div class="text-left">' +
                '<p class="text-xs font-bold text-gray-900 leading-none">' + authorName + '</p>' +
                '<p class="text-[10px] text-gray-400 mt-1">' + authorRole + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="text-right text-[10px] font-medium text-gray-400 uppercase tracking-wider space-y-0.5">' +
                '<p>' + displayDate + '</p>' +
                '<p class="text-[#004D34] font-bold text-right flex items-center justify-end gap-0.5">' + readTime + ' <i data-lucide="clock" class="w-3 h-3"></i></p>' +
                '</div>' +
                '</div>' +
                '</a>';

            // Next 4 articles
            var bgAlternates = ['bg-neutral-50', 'bg-white', 'bg-neutral-50', 'bg-white'];
            nextEl.innerHTML = latest.slice(1, 5).map(function (article, i) {
                var aCatInfo = PeopleRenderer.getArticleCategoryLabel(article.category);
                var aUrl = (window.CHATURA && window.CHATURA.getArticleUrl) ? window.CHATURA.getArticleUrl(article) : 'insight-detail.html?slug=' + article.slug;
                var aAuthorInfo = PeopleRenderer._resolveAuthor(article);
                var aAuthor = aAuthorInfo ? aAuthorInfo.name : '';
                var aRole = aAuthorInfo ? aAuthorInfo.role : '';
                var aTitle = typeof article.title === 'string' ? article.title : article.title[lang];
                var aDate = article.dates && article.dates.display ? (typeof article.dates.display === 'string' ? article.dates.display : article.dates.display[lang]) : '';
                var aReadTime = article.readingTime ? (typeof article.readingTime === 'string' ? article.readingTime : article.readingTime[lang]) : '';
                var num = String(i + 2).padStart(2, '0');
                return '<a href="' + aUrl + '" class="group relative ' + bgAlternates[i] + ' border border-gray-200 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg p-6 flex flex-col justify-between min-h-42">' +
                    '<span class="absolute right-6 top-4 text-5xl font-serif font-bold text-gray-900 opacity-5 pointer-events-none select-none">' + num + '</span>' +
                    '<div>' +
                    '<div class="flex items-center gap-3 mb-2.5">' +
                    '<span class="text-[10px] font-bold uppercase tracking-wider ' + aCatInfo.badgeClass + ' px-2 py-0.5 rounded">' + aCatInfo.label + '</span>' +
                    '<span class="text-[11px] text-gray-400">• &nbsp; ' + aReadTime + '</span>' +
                    '</div>' +
                    '<div class="border-l-2 border-gray-300 group-hover:border-emerald-700 pl-3 transition-colors duration-300">' +
                    '<h4 class="font-serif font-bold text-sm md:text-base text-gray-950 leading-snug group-hover:text-emerald-800 transition-colors duration-300 line-clamp-2">' + aTitle + '</h4>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pt-4 border-t border-gray-200/40 flex justify-between items-center text-[11px] text-gray-400">' +
                    '<span class="font-semibold text-gray-600">' + aAuthor + ' &nbsp;<span class="text-gray-300 font-normal">|</span>&nbsp; <span class="text-gray-400 font-normal text-[10px]">' + aRole + '</span></span>' +
                    '<span>' + aDate + '</span>' +
                    '</div>' +
                    '</a>';
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        },

        getArticleCategoryLabel: function (category) {
            if (window.CHATURA && window.CHATURA.CATEGORIES && window.CHATURA.CATEGORIES[category]) {
                var lang = document.documentElement.lang === 'id' ? 'id' : 'en';
                return { label: window.CHATURA.CATEGORIES[category][lang], badgeClass: window.CHATURA.CATEGORIES[category].badgeClass };
            }
            return { label: category.toUpperCase(), badgeClass: 'text-gray-700 bg-gray-50' };
        },

        initStandardsMarquee: function () {
            // Clean up existing marquee if re-initializing
            if (marqueeRaf) {
                cancelAnimationFrame(marqueeRaf);
                marqueeRaf = null;
            }
            marqueeInitialized = false;

            var wrapper = document.getElementById('standards-marquee');
            var track = document.getElementById('marquee-track');
            if (!wrapper || !track) return;

            var data = STANDARDS;
            var ITEM_GAP = 32;
            var speed = 0.5;
            var pos = 0;
            var paused = false;
            var srcIdx = 0;
            var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

            function createMarqueeItem(std) {
                var el = document.createElement('div');
                el.className = 'flex-shrink-0 flex flex-col items-center text-center gap-3 py-6 px-6 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition cursor-default';
                el.style.marginRight = ITEM_GAP + 'px';
                var content = '<span class="text-lg font-bold text-gray-950 tracking-tight">' + std.name + '</span>';
                content += '<span class="text-[10px] text-gray-400 leading-tight max-w-[130px]">' + std.desc + '</span>';
                el.innerHTML = content;
                return el;
            }

            function fillRight() {
                var needed = wrapper.offsetWidth * 2;
                while (track.scrollWidth + pos < needed) {
                    var item = createMarqueeItem(data[srcIdx % data.length]);
                    track.appendChild(item);
                    srcIdx++;
                }
            }

            function trimLeft() {
                while (track.firstElementChild) {
                    var first = track.firstElementChild;
                    var itemWidth = first.offsetWidth + ITEM_GAP;
                    if (pos + itemWidth < 0) {
                        track.removeChild(first);
                        pos += itemWidth;
                    } else {
                        break;
                    }
                }
            }

            function tick() {
                if (!paused && !reducedMotion.matches) {
                    pos -= speed;
                    trimLeft();
                    fillRight();
                    track.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
                }
                marqueeRaf = requestAnimationFrame(tick);
            }

            fillRight();
            marqueeRaf = requestAnimationFrame(tick);
            marqueeInitialized = true;

            wrapper.addEventListener('mouseenter', function () { paused = true; }, { passive: true });
            wrapper.addEventListener('mouseleave', function () { paused = false; }, { passive: true });

            if (reducedMotion.matches) {
                cancelAnimationFrame(marqueeRaf);
                marqueeRaf = null;
                track.style.transform = 'translate3d(0, 0, 0)';
            }
            reducedMotion.addEventListener('change', function (e) {
                if (e.matches) {
                    if (marqueeRaf) {
                        cancelAnimationFrame(marqueeRaf);
                        marqueeRaf = null;
                    }
                    track.style.transform = 'translate3d(0, 0, 0)';
                } else {
                    paused = false;
                    if (!marqueeRaf) {
                        marqueeRaf = requestAnimationFrame(tick);
                    }
                }
            });

            var resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(fillRight, 150);
            }, { passive: true });
        },

        init: function () {
            this.renderPeopleGrid('peopleGrid');
            this.renderExpertise('expertiseGrid');
            this.renderIndustries('industriesGrid');
            this.renderInsights();
            this.initStandardsMarquee();

            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Language change listener via ChaturaBus
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function () {
                    PeopleRenderer.renderPeopleGrid('peopleGrid');
                    PeopleRenderer.renderExpertise('expertiseGrid');
                    PeopleRenderer.renderIndustries('industriesGrid');
                    PeopleRenderer.renderInsights();
                    PeopleRenderer.initStandardsMarquee();
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                });
            }
        }
    };

    // Listen for component lifecycle events
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
            PeopleRenderer.init();
        }
    });

    document.addEventListener('components:all-loaded', function () {
        PeopleRenderer.init();
    });

    // Export for global access
    window.PeopleRenderer = PeopleRenderer;

    // ─── STANDARDS DATA ───────────────────────────────────────────────
    var STANDARDS = [
        { name: 'IFRS', desc: 'International Financial Reporting Standards', url: 'https://www.ifrs.org' },
        { name: 'PSAK', desc: 'Pernyataan Standar Akuntansi Keuangan', url: '' },
        { name: 'OECD', desc: 'Organisation for Economic Co-operation', url: 'https://www.oecd.org' },
        { name: 'COSO', desc: 'Committee of Sponsoring Organizations', url: 'https://www.coso.org' },
        { name: 'ISO', desc: 'International Organization for Standardization', url: 'https://www.iso.org' },
        { name: 'ISA', desc: 'International Standards on Auditing', url: '' },
        { name: 'BEPS', desc: 'Base Erosion & Profit Shifting', url: 'https://www.oecd.org/beps' },
        { name: 'GRI', desc: 'Global Reporting Initiative', url: 'https://www.globalreporting.org' }
    ];

    // ─── TOPIC RESOLVER & MODAL POPUP SYSTEMS ───────────────────────────
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

    function getCurrentLang() {
        return document.documentElement.lang === 'id' ? 'id' : 'en';
    }

    window.showArticleNotAvailableModal = function (topicTitle) {
        var lang = getCurrentLang();
        var modalEl = document.getElementById('articleNotAvailableModal');
        var titleEl = document.getElementById('notAvailableTitle');
        var topicBadge = document.getElementById('notAvailableTopicBadge');
        var topicEl = document.getElementById('notAvailableTopic');
        var descEl = document.getElementById('notAvailableDesc');
        var exploreBtn = document.getElementById('notAvailableExploreBtn');
        var closeBtn = document.getElementById('notAvailableCloseBtn');
        if (!modalEl) return;

        if (lang === 'id') {
            titleEl.textContent = 'Artikel atau Post Belum Tersedia';
            descEl.textContent = 'Artikel, publikasi, atau post detail untuk topik ini sedang disiapkan oleh tim editorial kami dan akan segera diterbitkan. Sementara itu, Anda dapat menjelajahi wawasan yang telah dipublikasikan.';
            if (exploreBtn) exploreBtn.querySelector('span').textContent = 'Jelajahi Wawasan';
            if (closeBtn) closeBtn.textContent = 'Tutup';
        } else {
            titleEl.textContent = 'Article / Post Not Available Yet';
            descEl.textContent = 'The detailed article, publication, or post for this topic is currently being prepared by our editorial team and will be released soon. In the meantime, feel free to explore our published insights.';
            if (exploreBtn) exploreBtn.querySelector('span').textContent = 'Explore Insights';
            if (closeBtn) closeBtn.textContent = 'Close';
        }

        if (topicTitle) {
            topicEl.textContent = topicTitle;
            topicBadge.classList.remove('hidden');
        } else {
            topicBadge.classList.add('hidden');
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

    window.closeArticleNotAvailableModal = function () {
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

    // Modal Action Systems
    // Note: modal fetched dynamically in openBioModal since component loads async

    window.openBioModal = function (id) {
        if (!window.PeopleRepository) return;
        var p = window.PeopleRepository.getAll().find(function (x) { return x.id === id; });
        if (!p) return;

        // Ensure modal exists (bio-modal component loads async)
        var modal = document.getElementById('bioModal');
        if (!modal) {
            // Try to create from shared component if not loaded
            if (typeof ensureBioModalElements === 'function') {
                modal = ensureBioModalElements();
            }
        }
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

        // 1. EXPERTISE TAGS WITH LINKS OR FALLBACK MODAL
        document.getElementById('modal-expertise').innerHTML = p.expertiseKeys.map(function (k) {
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
        document.getElementById('modal-experience').innerHTML = p.experienceKeys.map(function (k) {
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
            document.getElementById('modal-publications').innerHTML = p.publicationKeys.map(function (k, i) {
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
                        '<span class="text-emerald-800 font-semibold text-[9px] uppercase tracking-wider">' + (getCurrentLang() === 'id' ? 'Belum Rilis' : 'Upcoming') + '</span>' +
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

    window.closeBioModal = function () {
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

    window.openAuthorModal = function (id) {
        window.openBioModal(id);
    };

    window.closeAuthorModal = function () {
        window.closeBioModal();
    };

})();