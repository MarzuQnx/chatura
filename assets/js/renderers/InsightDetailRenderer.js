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

    var InsightDetailRenderer = {
        render: function() {
            var params = new URLSearchParams(window.location.search);
            var slug = params.get('slug') || 'tax-reform-2026'; // fallback to featured
            
            if (!window.ArticleRepository) return;
            var article = window.ArticleRepository.getBySlug(slug);
            if (!article) {
                document.getElementById('main-content').innerHTML = '<div class="container mx-auto px-6 py-32 text-center"><h2>Article Not Found</h2><a href="insights.html" class="text-[#004D34] hover:underline mt-4 inline-block">Back to Insights</a></div>';
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
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chatura-indonesia.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Insights", "item": "https://www.chatura-indonesia.com/insights.html" },
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
                        prevSlot.innerHTML = '<a href="insight-detail.html?slug=' + adj.prev.slug + '" class="prev-next-link block p-4 border border-gray-200 rounded-xl"><span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">← Previous</span><span class="text-xs font-bold text-gray-900 leading-snug block line-clamp-2">' + loc(adj.prev.title) + '</span></a>';
                    } else {
                        prevSlot.innerHTML = '';
                    }
                }
                if (nextSlot) {
                    if (adj.next) {
                        nextSlot.innerHTML = '<a href="insight-detail.html?slug=' + adj.next.slug + '" class="prev-next-link block p-4 border border-gray-200 rounded-xl text-right"><span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Next →</span><span class="text-xs font-bold text-gray-900 leading-snug block line-clamp-2">' + loc(adj.next.title) + '</span></a>';
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { InsightDetailRenderer.init(); });
    } else {
        InsightDetailRenderer.init();
    }

    window.InsightDetailRenderer = InsightDetailRenderer;
})();
