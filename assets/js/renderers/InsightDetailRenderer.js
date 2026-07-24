/**
 * InsightDetailRenderer - Renders an individual insight/article page
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
    var t = function (key) {
        var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
        return d[key] || key;
    };

    var InsightDetailRenderer = {
        render: function() {
            var params = new URLSearchParams(window.location.search);
            var slug = params.get('slug') || 'tax-reform-2026'; // fallback to featured
            
            if (!window.ArticleRepository) return;
            var article = window.ArticleRepository.getBySlug(slug);
            if (!article) {
                document.getElementById('main-content').innerHTML = '<div class="container mx-auto px-6 py-32 text-center"><h2>' + t('insight.not_found_title') + '</h2><a href="insights.html" class="text-[#004D34] hover:underline mt-4 inline-block">' + t('insight.back_to_insights') + '</a></div>';
                return;
            }

            var lang = currentLang();
            var title = loc(article.title) + ' | Chatura Insights';
            var desc = loc(article.description) || loc(article.subtitle) || '';
            var url = window.location.href;
            var img = article.image;

            // Meta tags
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = desc;
            
            var ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = title;
            
            var ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.content = desc;
            
            var ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.content = url;
            
            var ogImg = document.querySelector('meta[property="og:image"]');
            if (ogImg) ogImg.content = img;

            var twTitle = document.querySelector('meta[name="twitter:title"]');
            if (twTitle) twTitle.content = title;
            
            var twDesc = document.querySelector('meta[name="twitter:description"]');
            if (twDesc) twDesc.content = desc;
            
            var twImg = document.querySelector('meta[name="twitter:image"]');
            if (twImg) twImg.content = img;
            
            document.title = title;

            // Article Schema
            var schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": loc(article.title),
                "description": desc,
                "image": img,
                "datePublished": article.dates.published,
                "author": { "@type": "Person", "name": loc(article.author ? article.author.name : '') },
                "publisher": { "@type": "Organization", "name": "Chatura Indonesia", "logo": { "@type": "ImageObject", "url": "https://www.chatura-indonesia.com/assets/chatura.webp" } },
                "mainEntityOfPage": { "@type": "WebPage", "@id": url }
            };
            if (article.dates.updated) {
                var updEn = article.dates.updated.en;
                if (updEn) schema.dateModified = typeof article.dates.updated === 'string' ? article.dates.updated : updEn;
            }
            var schemaEl = document.getElementById('article-schema');
            if (schemaEl) schemaEl.textContent = JSON.stringify(schema);

            // Breadcrumb Schema
            var breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": t('nav.home'), "item": "https://www.chatura-indonesia.com/" },
                    { "@type": "ListItem", "position": 2, "name": t('nav.latest_insights'), "item": "https://www.chatura-indonesia.com/insights.html" },
                    { "@type": "ListItem", "position": 3, "name": loc(article.title).substring(0, 60), "item": url }
                ]
            };
            var breadEl = document.getElementById('breadcrumb-schema');
            if (breadEl) breadEl.textContent = JSON.stringify(breadcrumbSchema);

            // Breadcrumb
            var currBread = document.getElementById('breadcrumb-current');
            if (currBread) currBread.textContent = loc(article.title).substring(0, 50);

            // Hero
            var catObj = window.CategoryRepository ? window.CategoryRepository.getById(article.category) : null;
            var heroLabel = document.getElementById('hero-label');
            if (heroLabel) heroLabel.textContent = catObj ? loc(catObj) : '';
            
            var heroTitle = document.getElementById('hero-title');
            if (heroTitle) heroTitle.textContent = loc(article.title);
            
            var heroDesc = document.getElementById('hero-desc');
            if (heroDesc) heroDesc.textContent = desc;

            // Author resolution from PeopleRepository
            var author = null;
            if (window.PeopleRepository) {
                var peopleMap = {
                    'dyna': 'p6',
                    'bezaliel': 'p4',
                    'adine': 'p5',
                    'andi': 'p3',
                    'schweizer': 'p1',
                    'bolden': 'p2'
                };
                var pId = peopleMap[article.authorId] || article.authorId || (article.author ? article.author.peopleId : null);
                if (pId) {
                    var person = window.PeopleRepository.getAll().find(function(x) { return x.id === pId; });
                    if (person) {
                        author = {
                            peopleId: person.id,
                            name: person.nameKey,
                            role: person.titleKey,
                            practice: person.practiceKey,
                            photo: person.photo,
                            email: person.email,
                            linkedin: person.linkedin,
                            location: person.locationKey,
                            bio: person.bioKey,
                            expertise: person.expertiseKeys,
                            experience: person.experienceKeys,
                            publications: person.publicationKeys,
                            publicationDates: person.publicationDates
                        };
                    }
                }
            }
            if (!author && article.author) {
                author = article.author;
            }
            article.author = author;

            var tStr = function(key) {
                var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
                return d[key] || key;
            };

            var authorNameEl = document.getElementById('author-name');
            if (authorNameEl) {
                var nameVal = author ? (author.peopleId ? tStr(author.name) : loc(author.name)) : '';
                var roleVal = author ? (author.peopleId ? (tStr(author.role) + ' — ' + tStr(author.practice)) : loc(author.role)) : '';
                authorNameEl.textContent = nameVal + (roleVal ? ' — ' + roleVal : '');
            }
            
            var articleDate = document.getElementById('article-date');
            if (articleDate) articleDate.textContent = article.dates && article.dates.display ? loc(article.dates.display) : '';
            
            var articleRead = document.getElementById('article-readtime');
            if (articleRead) articleRead.textContent = loc(article.readingTime);

            // Author photo
            var authorPhotoImg = document.getElementById('author-photo-img');
            if (authorPhotoImg && author) {
                authorPhotoImg.src = author.photo || author.image || '';
                authorPhotoImg.alt = author.peopleId ? tStr(author.name) : loc(author.name);
            }

            // Hero image
            var imgEl = document.getElementById('article-hero-image');
            if (imgEl) {
                imgEl.src = article.image;
                imgEl.alt = loc(article.title);
            }

            // Executive Summary
            var es = article.execSummary ? (article.execSummary[lang] || article.execSummary.en) : null;
            if (es) {
                var esSec = document.getElementById('exec-summary-section');
                if (esSec) esSec.style.display = '';
                
                var esText = document.getElementById('exec-summary-text');
                if (esText) esText.textContent = es.summary || '';
                
                if (es.findings && es.findings.length) {
                    var fSec = document.getElementById('exec-summary-findings');
                    if (fSec) fSec.style.display = '';
                    var fList = document.getElementById('exec-findings-list');
                    if (fList) fList.innerHTML = es.findings.map(function(f){ return '<li>'+f+'</li>'; }).join('');
                } else {
                    var fSec = document.getElementById('exec-summary-findings');
                    if (fSec) fSec.style.display = 'none';
                }
                
                if (es.impact) {
                    var iSec = document.getElementById('exec-summary-impact');
                    if (iSec) iSec.style.display = '';
                    var iText = document.getElementById('exec-impact-text');
                    if (iText) iText.textContent = es.impact;
                } else {
                    var iSec = document.getElementById('exec-summary-impact');
                    if (iSec) iSec.style.display = 'none';
                }
                
                if (es.recommendations && es.recommendations.length) {
                    var rSec = document.getElementById('exec-summary-recs');
                    if (rSec) rSec.style.display = '';
                    var rList = document.getElementById('exec-recs-list');
                    if (rList) rList.innerHTML = es.recommendations.map(function(r){ return '<li>'+r+'</li>'; }).join('');
                } else {
                    var rSec = document.getElementById('exec-summary-recs');
                    if (rSec) rSec.style.display = 'none';
                }
            } else {
                var esSec = document.getElementById('exec-summary-section');
                if (esSec) esSec.style.display = 'none';
            }

            // Article body
            var bodyEl = document.getElementById('article-body');
            if (bodyEl) bodyEl.innerHTML = loc(article.body);

            // Tags
            var tagsEl = document.getElementById('article-tags');
            if (tagsEl) {
                tagsEl.innerHTML = (article.tags || []).map(function(tag) {
                    return '<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-md">#' + tag + '</span>';
                }).join('');
            }

            // Share links
            var shareTitle = encodeURIComponent(loc(article.title));
            var shareUrl = encodeURIComponent(url);
            
            var shLi = document.getElementById('share-linkedin');
            if (shLi) shLi.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl;
            
            var shFb = document.getElementById('share-facebook');
            if (shFb) shFb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl;
            
            var shTw = document.getElementById('share-twitter');
            if (shTw) shTw.href = 'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareTitle;
            
            var shEm = document.getElementById('share-email');
            if (shEm) shEm.href = 'mailto:?subject=' + shareTitle + '&body=' + shareUrl;
            
            var copyBtn = document.getElementById('share-copy');
            if (copyBtn && !copyBtn.dataset.listener) {
                copyBtn.dataset.listener = 'true';
                copyBtn.addEventListener('click', function() {
                    navigator.clipboard.writeText(url).then(function() {
                        copyBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                        setTimeout(function() { 
                            copyBtn.innerHTML = '<i data-lucide="link" class="w-4 h-4"></i>'; 
                            if (typeof lucide !== 'undefined') lucide.createIcons();
                        }, 2000);
                    });
                });
            }

            // Related Services Articles
            var rsSec = document.getElementById('related-services-section');
            var rsList = document.getElementById('related-services-list');
            if (rsSec && rsList) {
                var svcArticles = [];
                if (article.relatedServices && article.relatedServices.length && window.ArticleRepository) {
                    svcArticles = window.ArticleRepository.getAll().filter(function(a) {
                        if (a.slug === article.slug) return false;
                        if (!a.relatedServices) return false;
                        return a.relatedServices.some(function(s) { return article.relatedServices.includes(s); });
                    });
                }
                if (svcArticles.length > 0) {
                    rsSec.style.display = '';
                    rsList.innerHTML = svcArticles.slice(0, 4).map(function(item) {
                        return '<a href="insight-detail.html?slug=' + item.slug + '" class="group flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-emerald-700/40 hover:bg-emerald-50/30 transition duration-300">' +
                            '<div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">' +
                            '<img src="' + item.image + '" alt="' + loc(item.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">' +
                            '</div>' +
                            '<div class="min-w-0 flex-1">' +
                            '<h5 class="text-xs font-bold text-gray-900 leading-snug group-hover:text-[#004D34] transition-colors line-clamp-2 mb-1">' + loc(item.title) + '</h5>' +
                            '<span class="text-[10px] text-gray-400 block">' + (item.dates && item.dates.display ? loc(item.dates.display) : '') + ' • ' + loc(item.readingTime) + '</span>' +
                            '</div></a>';
                    }).join('');
                } else {
                    rsSec.style.display = 'none';
                }
            }

            // Related Industries Articles
            var riSec = document.getElementById('related-industries-section');
            var riList = document.getElementById('related-industries-list');
            if (riSec && riList) {
                var indArticles = [];
                if (article.relatedIndustries && article.relatedIndustries.length && window.ArticleRepository) {
                    indArticles = window.ArticleRepository.getAll().filter(function(a) {
                        if (a.slug === article.slug) return false;
                        if (!a.relatedIndustries) return false;
                        return a.relatedIndustries.some(function(i) { return article.relatedIndustries.includes(i); });
                    });
                }
                if (indArticles.length > 0) {
                    riSec.style.display = '';
                    riList.innerHTML = indArticles.slice(0, 4).map(function(item) {
                        return '<a href="insight-detail.html?slug=' + item.slug + '" class="group flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-emerald-700/40 hover:bg-emerald-50/30 transition duration-300">' +
                            '<div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">' +
                            '<img src="' + item.image + '" alt="' + loc(item.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">' +
                            '</div>' +
                            '<div class="min-w-0 flex-1">' +
                            '<h5 class="text-xs font-bold text-gray-900 leading-snug group-hover:text-[#004D34] transition-colors line-clamp-2 mb-1">' + loc(item.title) + '</h5>' +
                            '<span class="text-[10px] text-gray-400 block">' + (item.dates && item.dates.display ? loc(item.dates.display) : '') + ' • ' + loc(item.readingTime) + '</span>' +
                            '</div></a>';
                    }).join('');
                } else {
                    riSec.style.display = 'none';
                }
            }

            // Prev / Next
            if (window.ArticleRepository.getAdjacentArticles) {
                var adj = window.ArticleRepository.getAdjacentArticles(slug);
                var prevSlot = document.getElementById('prev-article-slot');
                var nextSlot = document.getElementById('next-article-slot');
                if (prevSlot) {
                    if (adj.prev) {
                        prevSlot.innerHTML = '<a href="insight-detail.html?slug=' + adj.prev.slug + '" class="prev-next-link block p-4 border border-gray-200 rounded-xl"><span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">' + t('insight.prev') + '</span><span class="text-xs font-bold text-gray-900 leading-snug block line-clamp-2">' + loc(adj.prev.title) + '</span></a>';
                    } else {
                        prevSlot.innerHTML = '';
                    }
                }
                if (nextSlot) {
                    if (adj.next) {
                        nextSlot.innerHTML = '<a href="insight-detail.html?slug=' + adj.next.slug + '" class="prev-next-link block p-4 border border-gray-200 rounded-xl text-right"><span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">' + t('insight.next') + '</span><span class="text-xs font-bold text-gray-900 leading-snug block line-clamp-2">' + loc(adj.next.title) + '</span></a>';
                    } else {
                        nextSlot.innerHTML = '';
                    }
                }
            }

            // Related Insights Sidebar
            if (window.ArticleRepository.getRelatedArticles) {
                var related = window.ArticleRepository.getRelatedArticles(article, 5);
                var relList = document.getElementById('relatedInsightsList');
                if (relList && related.length) {
                    relList.innerHTML = related.map(function(item, i) {
                        var num = String(i + 1).padStart(2, '0');
                        var cat2 = window.CategoryRepository ? window.CategoryRepository.getById(item.category) : null;
                        var badgeColor = '#059669';
                        if (cat2 && cat2.badgeClass) {
                            if (cat2.badgeClass.indexOf('blue') > -1) badgeColor = '#1d4ed8';
                            else if (cat2.badgeClass.indexOf('amber') > -1) badgeColor = '#b45309';
                            else if (cat2.badgeClass.indexOf('purple') > -1) badgeColor = '#7c3aed';
                            else if (cat2.badgeClass.indexOf('teal') > -1) badgeColor = '#0d9488';
                        }
                        return '<a href="insight-detail.html?slug=' + item.slug + '" class="related-drop-row">' +
                            '<span class="related-drop-num">' + num + '</span>' +
                            '<div>' +
                            '<h4 class="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#004D34] transition-colors">' + loc(item.title) + '</h4>' +
                            '<div class="flex items-center gap-2">' +
                            '<span style="color:' + badgeColor + '" class="text-[10px] font-bold uppercase">' + (cat2 ? loc(cat2) : '') + '</span>' +
                            '<span class="w-1 h-1 rounded-full bg-gray-300"></span>' +
                            '<span class="text-xs text-gray-400">' + loc(item.readingTime) + '</span>' +
                            '</div></div></a>';
                    }).join('');
                }
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof window.ScrollTrigger !== 'undefined') {
                setTimeout(function() { window.ScrollTrigger.refresh(); }, 100);
            }
            setTimeout(function() {
                document.querySelectorAll('#article-body, #article-hero-image, .reveal-up, .related-drop-row').forEach(function(el) {
                    if (window.getComputedStyle(el).opacity === '0' || el.style.opacity === '0') {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    }
                });
            }, 200);
        },
        
        init: function() {
            this.render();
            if (window.ChaturaBus) {
                var self = this;
                window.ChaturaBus.on('languageChange', function() {
                    self.render();
                });
            }
        }
    };

    window.openAuthorModal = function(overrideId) {
        var params = new URLSearchParams(window.location.search);
        var slug = params.get('slug') || 'tax-reform-2026';
        var article = window.ArticleRepository ? window.ArticleRepository.getBySlug(slug) : null;

        var author = article ? article.author : null;
        var peopleMap = {
            'dyna': 'p6',
            'bezaliel': 'p4',
            'adine': 'p5',
            'andi': 'p3',
            'schweizer': 'p1',
            'bolden': 'p2'
        };
        var pId = overrideId || (article ? (peopleMap[article.authorId] || article.authorId || (author ? author.peopleId : null)) : null);
        var person = (pId && window.PeopleRepository) ? window.PeopleRepository.getAll().find(function(x) { return x.id === pId; }) : null;

        var tr = function(k) {
            if (!k) return '';
            var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
            return d[k] || k;
        };

        var nameStr = person ? tr(person.nameKey) : (author ? loc(author.name) : '');
        var titleStr = person ? (tr(person.titleKey) + ' — ' + tr(person.practiceKey)) : (author ? loc(author.role) : '');
        var photoSrc = person ? person.photo : (author ? (author.photo || author.image) : '');
        var locationStr = person ? tr(person.locationKey) : (author && author.location ? loc(author.location) : 'Jakarta');
        var linkedinHref = person ? person.linkedin : (author ? (author.linkedin || '#') : '#');
        var emailHref = person ? person.email : (author ? (author.email || '') : '');

        var imgEl = document.getElementById('amodal-img') || document.getElementById('modal-img');
        if (imgEl) { imgEl.src = photoSrc; imgEl.alt = nameStr; }
        
        var nameEl = document.getElementById('amodal-name') || document.getElementById('modal-name');
        if (nameEl) nameEl.textContent = nameStr;

        var titleEl = document.getElementById('amodal-title') || document.getElementById('modal-title');
        if (titleEl) titleEl.textContent = titleStr;

        var locEl = document.getElementById('amodal-location') || document.getElementById('modal-location');
        if (locEl) {
            var span = locEl.querySelector('span');
            if (span) span.textContent = locationStr;
        }

        var liEl = document.getElementById('amodal-linkedin') || document.getElementById('modal-linkedin');
        if (liEl) liEl.href = linkedinHref;

        var emEl = document.getElementById('amodal-email') || document.getElementById('modal-email');
        if (emEl) emEl.href = emailHref ? ('mailto:' + emailHref) : '#';

        var bioStr = person ? tr(person.bioKey) : (author ? loc(author.bio) : '');
        var bioEl = document.getElementById('amodal-bio') || document.getElementById('modal-bio');
        if (bioEl) bioEl.textContent = bioStr;

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

        var expList = person ? person.expertiseKeys.map(function(k) { return tr(k); }) : (author && author.expertise ? author.expertise : []);
        var expContainer = document.getElementById('amodal-expertise') || document.getElementById('modal-expertise');
        if (expContainer) {
            expContainer.innerHTML = expList.map(function(k) {
                var res = resolveTopicLink(k);
                if (res) {
                    return '<a href="' + res.url + '" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-[#004D34] hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">' + k + ' <i data-lucide="external-link" class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100"></i></a>';
                }
                var escapedKey = k.replace(/'/g, "\\'");
                return '<button onclick="showArticleNotAvailableModal(\'' + escapedKey + '\')" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors duration-200 text-left">' + k + '</button>';
            }).join('');
        }

        var expList2 = person ? person.experienceKeys.map(function(k) { return tr(k); }) : (author && author.experience ? author.experience : []);
        var expContainer2 = document.getElementById('amodal-experience') || document.getElementById('modal-experience');
        if (expContainer2) {
            expContainer2.innerHTML = expList2.map(function(k) {
                var res = resolveTopicLink(k);
                var escapedK = k.replace(/'/g, "\\'");
                if (res) {
                    return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <a href="' + res.url + '" class="hover:text-[#004D34] hover:underline transition-colors flex items-center gap-1">' + k + ' <i data-lucide="arrow-up-right" class="w-3 h-3 text-emerald-600"></i></a></li>';
                }
                return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <button onclick="showArticleNotAvailableModal(\'' + escapedK + '\')" class="text-left hover:text-[#004D34] hover:underline transition-colors">' + k + '</button></li>';
            }).join('');
        }

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

        var pubItems = [];
        if (person && person.publicationKeys) {
            pubItems = person.publicationKeys.map(function(k, idx) {
                return { key: k, title: tr(k), date: person.publicationDates[idx] || '' };
            });
        }
        var pubContainer = document.getElementById('amodal-publications') || document.getElementById('modal-publications');
        if (pubContainer) {
            if (pubItems.length) {
                pubContainer.innerHTML = pubItems.map(function(p) {
                    var slug = PUBLICATION_SLUGS[p.key];
                    var articleUrl = slug ? ('insight-detail.html?slug=' + slug) : null;
                    var escapedTitle = (p.title || '').replace(/'/g, "\\'");

                    if (articleUrl) {
                        return '<a href="' + articleUrl + '" class="block bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-emerald-700/60 hover:bg-emerald-50/40 transition group">' +
                            '<h5 class="font-semibold text-gray-900 leading-tight mb-1.5 text-xs group-hover:text-[#004D34] transition-colors flex items-center justify-between gap-1">' + p.title + ' <i data-lucide="arrow-up-right" class="w-3 h-3 text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></i></h5>' +
                            '<span class="text-[10px] text-gray-400 block">' + p.date + '</span></a>';
                    }
                    return '<div onclick="showArticleNotAvailableModal(\'' + escapedTitle + '\')" class="bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-emerald-700/40 hover:bg-gray-100/80 transition cursor-pointer group">' +
                        '<h5 class="font-semibold text-gray-900 leading-tight mb-1.5 text-xs group-hover:text-[#004D34] transition-colors">' + p.title + '</h5>' +
                        '<span class="text-[10px] text-gray-400 block">' + p.date + '</span></div>';
                }).join('');
            } else {
                pubContainer.innerHTML = '<p class="text-xs text-gray-400 italic">' + (tr('people.no_publications') || 'No publications available.') + '</p>';
            }
        }

        var authorModal = document.getElementById('authorModal') || document.getElementById('bioModal');
        if (authorModal) {
            authorModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeAuthorModal = function() {
        var authorModal = document.getElementById('authorModal') || document.getElementById('bioModal');
        if (authorModal) {
            authorModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.openBioModal = function(id) {
        if (window.openAuthorModal) {
            window.openAuthorModal(id);
        }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { InsightDetailRenderer.init(); });
    } else {
        InsightDetailRenderer.init();
    }

    window.InsightDetailRenderer = InsightDetailRenderer;
})();
