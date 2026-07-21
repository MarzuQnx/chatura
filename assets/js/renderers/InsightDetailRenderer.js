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
                "publisher": { "@type": "Organization", "name": "Chatura Indonesia", "logo": { "@type": "ImageObject", "url": "https://www.chatura.co.id/assets/chatura.webp" } },
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
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chatura.co.id/" },
                    { "@type": "ListItem", "position": 2, "name": "Insights", "item": "https://www.chatura.co.id/insights.html" },
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

            // Author
            var authorNameEl = document.getElementById('author-name');
            if (authorNameEl) authorNameEl.textContent = loc(article.author ? article.author.name : '') + ' — ' + loc(article.author ? article.author.role : '');
            
            var articleDate = document.getElementById('article-date');
            if (articleDate) articleDate.textContent = article.dates && article.dates.display ? loc(article.dates.display) : '';
            
            var articleRead = document.getElementById('article-readtime');
            if (articleRead) articleRead.textContent = loc(article.readingTime);

            // Author photo
            var authorPhotoImg = document.getElementById('author-photo-img');
            if (authorPhotoImg && article.author) {
                authorPhotoImg.src = article.author.photo || article.author.image || '';
                authorPhotoImg.alt = loc(article.author.name);
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
            var shareUrl = encodeURIComponent(url);
            var shareTitle = encodeURIComponent(loc(article.title));
            var linkedin = document.getElementById('share-linkedin');
            if (linkedin) linkedin.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl;
            
            var facebook = document.getElementById('share-facebook');
            if (facebook) facebook.href = 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl;
            
            var twitter = document.getElementById('share-twitter');
            if (twitter) twitter.href = 'https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareTitle;
            
            var emailShare = document.getElementById('share-email');
            if (emailShare) emailShare.href = 'mailto:?subject=' + shareTitle + '&body=' + shareUrl;
            
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

            // Related Services
            if (article.relatedServices && article.relatedServices.length) {
                var rsSec = document.getElementById('related-services-section');
                if (rsSec) rsSec.style.display = '';
                var rsList = document.getElementById('related-services-list');
                if (rsList && window.ServiceRepository) {
                    rsList.innerHTML = article.relatedServices.map(function(sk) {
                        var svc = window.ServiceRepository.getById(sk);
                        if (!svc) return '';
                        return '<a href="services/' + svc.slug + '/" class="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 transition">' + loc(svc.title) + '</a>';
                    }).join('');
                }
            } else {
                var rsSec = document.getElementById('related-services-section');
                if (rsSec) rsSec.style.display = 'none';
            }

            // Related Industries
            if (article.relatedIndustries && article.relatedIndustries.length) {
                var riSec = document.getElementById('related-industries-section');
                if (riSec) riSec.style.display = '';
                var riList = document.getElementById('related-industries-list');
                if (riList && window.IndustryRepository) {
                    riList.innerHTML = article.relatedIndustries.map(function(ik) {
                        var ind = window.IndustryRepository.getById(ik);
                        if (!ind) return '';
                        return '<a href="industries/' + ind.slug + '/" class="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 transition">' + loc(ind.title) + '</a>';
                    }).join('');
                }
            } else {
                var riSec = document.getElementById('related-industries-section');
                if (riSec) riSec.style.display = 'none';
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
