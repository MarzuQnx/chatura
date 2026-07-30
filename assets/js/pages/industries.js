/**
 * industries.js — Page Controller for industries.html
 */
(function () {
    'use strict';
    var _initialized = false;

    // ===== STRATEGIC INTELLIGENCE RENDERER =====
    function renderSI() {
        var grid = document.getElementById('siGrid');
        if (!grid) return;
        var featuredEl = document.getElementById('siFeatured');
        var listEl = document.getElementById('siList');
        if (!featuredEl || !listEl) return;

        if (window.IndustryRenderer && typeof window.IndustryRenderer.renderInsights === 'function') {
            window.IndustryRenderer.renderInsights();
            return;
        }

        var articles = window.ArticleRepository ? window.ArticleRepository.getAll() : [];
        if (!articles || articles.length === 0) return;

        var sorted = articles.slice().sort(function (a, b) {
            return new Date(b.dates.published) - new Date(a.dates.published);
        });
        var latest = sorted.slice(0, 5);

        var lang = (window.TranslationRepository && typeof window.TranslationRepository.getCurrentLanguage === 'function')
            ? window.TranslationRepository.getCurrentLanguage()
            : 'en';

        var locStr = function (obj) {
            if (!obj) return '';
            if (typeof obj === 'string') {
                if (window.TranslationRepository && typeof window.TranslationRepository.t === 'function') {
                    var tr = window.TranslationRepository.t(obj);
                    if (tr && tr !== obj) return tr;
                }
                return obj;
            }
            return obj[lang] || obj.en || obj.id || '';
        };

        var getCat = function (catId) {
            if (window.CategoryRepository && typeof window.CategoryRepository.getById === 'function') {
                var catObj = window.CategoryRepository.getById(catId);
                if (catObj) return locStr(catObj);
            }
            return catId ? catId.toUpperCase() : '';
        };

        // Featured article
        var feat = latest[0];
        var fCat = getCat(feat.category);
        var fTitle = locStr(feat.title);
        var fDesc = locStr(feat.subtitle) || (feat.execSummary ? locStr(feat.execSummary.summary) : '');
        var fDate = feat.dates && feat.dates.display ? locStr(feat.dates.display) : (feat.dates ? feat.dates.published : '');
        var fRead = locStr(feat.readingTime) || (feat.readTime ? feat.readTime + ' min read' : '');
        var readText = lang === 'id' ? 'Baca Wawasan' : 'Read Insight';
        var fUrl = 'insight-detail.html?slug=' + (feat.slug || feat.id);

        featuredEl.innerHTML =
            '<a href="' + fUrl + '" class="si-featured block">' +
                '<div class="si-featured-img"><img src="' + (feat.heroImage || feat.image || '') + '" alt="' + fTitle + '" loading="lazy"></div>' +
                '<span class="si-featured-badge">' + fCat + '</span>' +
                '<div class="si-featured-glass">' +
                    '<p class="si-featured-eyebrow">' + fCat + '</p>' +
                    '<h3 class="si-featured-title">' + fTitle + '</h3>' +
                    '<p class="si-featured-desc">' + fDesc + '</p>' +
                    '<div class="si-featured-footer">' +
                        '<span class="si-featured-meta">' + fDate + ' · ' + fRead + '</span>' +
                        '<span class="si-featured-cta">' + readText + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' +
                    '</div></div></a>';

        // List articles
        var listHtml = '<div class="si-list">';
        for (var i = 1; i < latest.length; i++) {
            var a = latest[i];
            var cCat = getCat(a.category);
            var aTitle = locStr(a.title);
            var aRead = locStr(a.readingTime) || (a.readTime ? a.readTime + ' min read' : '');
            var aUrl = 'insight-detail.html?slug=' + (a.slug || a.id);

            listHtml += '<a href="' + aUrl + '" class="si-list-item">' +
                '<img src="' + (a.thumbnail || a.image || '') + '" alt="' + aTitle + '" loading="lazy" class="si-list-thumb">' +
                '<div class="si-list-body"><p class="si-list-cat">' + cCat + '</p><h4 class="si-list-title">' + aTitle + '</h4><p class="si-list-meta">' + aRead + '</p></div>' +
                '<svg class="si-list-arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>';
        }
        listHtml += '</div>';
        listEl.innerHTML = listHtml;
    }

    function initPage() {
        if (_initialized) return;
        _initialized = true;

        if (window.IndustryRenderer) { try { window.IndustryRenderer.init(); } catch (e) {} }
        if (window.PeopleRenderer) { try { window.PeopleRenderer.init(); } catch (e) {} }
        if (window.ArticleRenderer) { try { window.ArticleRenderer.init(); } catch (e) {} }
        renderSI();

        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch (e) {} }
        if (window.PageLoader && typeof window.PageLoader.initNavbarScroll === 'function') { window.PageLoader.initNavbarScroll(); }

        initGSAPAnimations();

        if (window.ChaturaBus) {
            window.ChaturaBus.on('languageChange', function () { renderSI(); });
        }
    }

    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') {
            document.querySelectorAll('.reveal-up').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        var heroSelector = '[id*="hero"] .reveal-up';
        var heroEls = document.querySelectorAll(heroSelector);
        if (heroEls.length > 0) {
            gsap.set(heroEls, { opacity: 0, y: 30 });
            gsap.to(heroEls, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15
            });
        }

        var revealEls = document.querySelectorAll('.reveal-up:not(' + heroSelector + ')');
        if (revealEls.length > 0) {
            gsap.set(revealEls, { opacity: 0, y: 30 });
        }

        ScrollTrigger.batch('.reveal-up:not(' + heroSelector + ')', {
            start: 'top 85%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.1 });
            }
        });

        // svc-img-composition slide-in animation
        document.querySelectorAll('.svc-img-composition').forEach(function (composition) {
            var shape = composition.querySelector('.absolute');
            var imageContainer = composition.querySelector('.si-shadow');
            if (!shape || !imageContainer) return;

            var isLeft = imageContainer.classList.contains('si-slide-from-left');
            var slideX = isLeft ? -180 : 180;

            gsap.set(composition, { clearProps: 'transform', opacity: 1 });
            shape.classList.remove('si-float');
            composition.classList.remove('animated');
            gsap.set(shape, { opacity: 0, scale: 0.92 });
            gsap.set(imageContainer, { opacity: 0, x: slideX });

            var tl = gsap.timeline({
                scrollTrigger: { trigger: composition, start: 'top 80%', once: true }
            });

            tl.to(shape, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
              .to(imageContainer, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, '-=0.3')
              .add(function () {
                  composition.classList.add('animated');
                  shape.classList.add('si-float');
                  gsap.set([shape, imageContainer], { clearProps: 'transform,opacity' });
              });
        });
    }

    var _booted = false;
    function safeBoot() {
        if (_booted) return;
        _booted = true;
        initPage();
    }

    document.addEventListener('components:all-loaded', safeBoot);

    setTimeout(function () {
        if (_booted) return;
        if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
            window.ComponentLoader.init().then(safeBoot);
        } else {
            safeBoot();
        }
    }, 1500);
})();
