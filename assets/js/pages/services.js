/**
 * services.js — Page Controller for services-modular.html
 */
(function () {
    'use strict';
    var _initialized = false;

    // ===== EXPERTS DATA =====
    var EXPERTS = [
        { name: 'Andi Rio Ilhad Monry', role: 'Managing Partner', tags: ['accounting', 'advisory'], tagsDisplay: 'M&A · Corporate Advisory', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=500&q=80', email: 'monry.a@chatura-indonesia.com', linkedin: 'https://linkedin.com', bioKey: 'people.p3_bio', expertiseKeys: ['people.p3_exp_1', 'people.p3_exp_2', 'people.p3_exp_3'], experienceKeys: ['people.p3_exp_4', 'people.p3_exp_5'] },
        { name: 'Dyna Agustina', role: 'Partner, Tax Services', tags: ['tax'], tagsDisplay: 'International Tax · Transfer Pricing', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80', email: 'agustina.d@chatura-indonesia.com', linkedin: 'https://linkedin.com', bioKey: 'people.p6_bio', expertiseKeys: ['people.p6_exp_1', 'people.p6_exp_2', 'people.p6_exp_3'], experienceKeys: ['people.p6_exp_4', 'people.p6_exp_5'] },
        { name: 'Bezaliel B. Erlan', role: 'Partner, Business Transfer', tags: ['transfer'], tagsDisplay: 'Deal Structuring · Due Diligence', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80', email: 'erlan.b@chatura-indonesia.com', linkedin: 'https://linkedin.com', bioKey: 'people.p4_bio', expertiseKeys: ['people.p4_exp_1', 'people.p4_exp_2', 'people.p4_exp_3'], experienceKeys: ['people.p4_exp_4', 'people.p4_exp_5'] },
        { name: 'Adine K. Nadya', role: 'Partner, Risk Management', tags: ['risk'], tagsDisplay: 'Enterprise Risk · Governance', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=500&q=80', email: 'nadya.a@chatura-indonesia.com', linkedin: 'https://linkedin.com', bioKey: 'people.p5_bio', expertiseKeys: ['people.p5_exp_1', 'people.p5_exp_2', 'people.p5_exp_3'], experienceKeys: ['people.p5_exp_4', 'people.p5_exp_5'] }
    ];

    // ===== SI ARTICLES DATA =====
    var SI_ARTICLES = [
        { featured: true, category: 'Accounting & Finance', title: 'Strengthening Financial Reporting Standards Ahead of Audit Season', desc: 'Indonesian companies face tightening audit requirements in 2026. A proactive approach to financial reporting hygiene not only reduces compliance risk but strengthens stakeholder confidence.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80', read: '7 min read', date: 'Apr 08, 2026', catId: 'Akuntansi & Keuangan', titleId: 'Memperkuat Standar Pelaporan Keuangan Menjelang Musim Audit', descId: 'Perusahaan Indonesia menghadapi persyaratan audit yang lebih ketat pada 2026. Pendekatan proaktif terhadap kebersihan pelaporan keuangan tidak hanya mengurangi risiko kepatuhan tetapi juga memperkuat kepercayaan pemangku kepentingan.', readId: '7 mnt baca', dateId: '08 Apr 2026' },
        { category: 'Tax Services', title: 'Global Minimum Tax: What It Means for Indonesian Companies', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=300&q=80', read: '5 min read', catId: 'Layanan Pajak', titleId: 'Pajak Minimum Global: Apa Artinya bagi Perusahaan Indonesia', readId: '5 mnt baca' },
        { category: 'Business Transfer', title: 'Family Business Succession Planning: Key Considerations', image: 'https://images.unsplash.com/photo-1776057441344-38e0587ad1e6?auto=format&fit=crop&w=300&q=80', read: '6 min read', catId: 'Transfer Bisnis', titleId: 'Perencanaan Suksesi Bisnis Keluarga: Pertimbangan Utama', readId: '6 mnt baca' },
        { category: 'Risk Management', title: 'Enterprise Risk Management in the Digital Age', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80', read: '4 min read', catId: 'Manajemen Risiko', titleId: 'Manajemen Risiko Perusahaan di Era Digital', readId: '4 mnt baca' },
        { category: 'Corporate Advisory', title: 'Navigating Corporate Restructuring for Sustainable Growth', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=300&q=80', read: '5 min read', catId: 'Advisory Korporasi', titleId: 'Menavigasi Restrukturisasi Perusahaan untuk Pertumbuhan Berkelanjutan', readId: '5 mnt baca' }
    ];

    function initPage() {
        if (_initialized) return;
        _initialized = true;

        if (window.ServiceRenderer) { try { window.ServiceRenderer.init(); } catch (e) {} }
        if (window.ClientRenderer) { try { window.ClientRenderer.init(); } catch (e) {} }
        if (window.PeopleRenderer) { try { window.PeopleRenderer.init(); } catch (e) {} }
        if (window.ArticleRenderer) { try { window.ArticleRenderer.init(); } catch (e) {} }

        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch (e) {} }

        initScrollHandlers();
        initMobileMenu();
        renderExperts();
        renderSI();
        initGSAPAnimations();

        // Final ScrollTrigger refresh after all DOM mutations and animations are set up
        if (window.ScrollTrigger) {
            setTimeout(function () { ScrollTrigger.refresh(); }, 300);
        }

        if (window.ChaturaBus) {
            window.ChaturaBus.on('languageChange', function () { renderExperts(); renderSI(); });
        }
    }

    function initScrollHandlers() {
        var nav = document.getElementById('navbar-sticky');
        if (!nav) return;

        if (!document.getElementById('navbar-spacer')) {
            var spacer = document.createElement('div');
            spacer.id = 'navbar-spacer';
            spacer.style.height = nav.offsetHeight + 'px';
            spacer.style.width = '100%';
            spacer.style.flexShrink = '0';
            nav.parentNode.insertBefore(spacer, nav.nextSibling);
            window.addEventListener('resize', function () { spacer.style.height = nav.offsetHeight + 'px'; }, { passive: true });
        }

        var isScrolled = false;
        function updateNavbarState() {
            var y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            var shouldBeScrolled = y > 50;
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                nav.classList.toggle('scrolled', shouldBeScrolled);
            }
        }
        updateNavbarState();
        window.addEventListener('scroll', updateNavbarState, { passive: true });
        window.__updateNavbarState = updateNavbarState;
    }

    function initMobileMenu() {
        document.querySelectorAll('.mobile-nav-group-btn').forEach(function (btn) {
            btn.onclick = function () {
                var group = this.closest('.mobile-nav-group');
                if (group) group.classList.toggle('open');
            };
        });
    }

    function initLanguageSwitcher() {
        var lang = (window.TranslationRepository && window.TranslationRepository.getCurrentLanguage)
            ? window.TranslationRepository.getCurrentLanguage()
            : localStorage.getItem('lang') || 'en';

        ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
            var container = document.getElementById(id);
            if (!container) return;
            container.querySelectorAll('a[data-lang]').forEach(function (a) {
                a.className = (a.getAttribute('data-lang').trim().toLowerCase() === lang) ? 'lang-active' : 'lang-inactive';
            });
        });

        if (window.PageLoader && typeof window.PageLoader.initialize === 'function') {
            window.PageLoader.initialize();
        }
    }

    // ===== TOPIC LINK RESOLVER =====
    function resolveTopicLink(text) {
        if (!text) return null;
        var lower = text.toLowerCase();
        if (lower.indexOf('tax') !== -1 || lower.indexOf('pajak') !== -1 || lower.indexOf('fiscal') !== -1 || lower.indexOf('fiskal') !== -1) return { url: 'services/tax-services/', label: 'Tax Services' };
        if (lower.indexOf('transfer') !== -1 || lower.indexOf('m&a') !== -1 || lower.indexOf('merger') !== -1 || lower.indexOf('acquisition') !== -1 || lower.indexOf('akuisi') !== -1 || lower.indexOf('succession') !== -1 || lower.indexOf('suksesi') !== -1) return { url: 'services/business-transfer/', label: 'Business Transfer' };
        if (lower.indexOf('risk') !== -1 || lower.indexOf('risiko') !== -1 || lower.indexOf('erm') !== -1 || lower.indexOf('cyber') !== -1 || lower.indexOf('siber') !== -1 || lower.indexOf('grc') !== -1) return { url: 'services/risk-management/', label: 'Risk Management' };
        if (lower.indexOf('account') !== -1 || lower.indexOf('akuntan') !== -1 || lower.indexOf('finance') !== -1 || lower.indexOf('keuangan') !== -1 || lower.indexOf('credit') !== -1 || lower.indexOf('kredit') !== -1) return { url: 'services/accounting-finance/', label: 'Accounting & Finance' };
        if (lower.indexOf('advisory') !== -1 || lower.indexOf('consulting') !== -1 || lower.indexOf('konsultasi') !== -1 || lower.indexOf('strategy') !== -1 || lower.indexOf('strategi') !== -1) return { url: 'services/corporate-advisory/', label: 'Corporate Advisory' };
        if (lower.indexOf('energy') !== -1 || lower.indexOf('energi') !== -1 || lower.indexOf('mining') !== -1 || lower.indexOf('tambang') !== -1) return { url: 'industries/energy/', label: 'Energy & Natural Resources' };
        if (lower.indexOf('manufacturing') !== -1 || lower.indexOf('manufaktur') !== -1 || lower.indexOf('automotive') !== -1 || lower.indexOf('otomotif') !== -1) return { url: 'industries/manufacturing/', label: 'Manufacturing' };
        if (lower.indexOf('financial') !== -1 || lower.indexOf('bank') !== -1 || lower.indexOf('perbankan') !== -1) return { url: 'industries/financial/', label: 'Financial Services' };
        if (lower.indexOf('tech') !== -1 || lower.indexOf('teknologi') !== -1 || lower.indexOf('digital') !== -1) return { url: 'industries/technology/', label: 'Technology' };
        if (lower.indexOf('health') !== -1 || lower.indexOf('kesehatan') !== -1 || lower.indexOf('farmasi') !== -1) return { url: 'industries/healthcare/', label: 'Healthcare' };
        if (lower.indexOf('consumer') !== -1 || lower.indexOf('fmcg') !== -1 || lower.indexOf('ritel') !== -1) return { url: 'industries/consumer/', label: 'Consumer Goods' };
        return null;
    }

    // ===== EXPERTS RENDERER =====
    function renderExperts() {
        var grid = document.getElementById('expertsGrid');
        if (!grid) return;
        var isId = window.TranslationRepository && window.TranslationRepository.getCurrentLanguage() === 'id';
        grid.innerHTML = EXPERTS.map(function (e, i) {
            var role = e.role, tags = e.tagsDisplay;
            if (isId) {
                if (i === 1) { role = 'Partner, Layanan Pajak'; tags = 'Pajak Internasional · Transfer Pricing'; }
                else if (i === 2) { role = 'Partner, Transfer Bisnis'; tags = 'Penataan Transaksi · Uji Tuntas'; }
                else if (i === 3) { role = 'Partner, Manajemen Risiko'; tags = 'Risiko Perusahaan · Tata Kelola'; }
            }
            return '<div class="expert-card" onclick="openExpertModal(' + i + ')">' +
                '<img src="' + e.photo + '" alt="' + e.name + '" loading="lazy" class="expert-card__img">' +
                '<div class="expert-card__body">' +
                '<h3 class="expert-card__name">' + e.name + '</h3>' +
                '<p class="expert-card__role">' + role + '</p>' +
                '<p class="expert-card__expertise">' + (tags || '') + '</p>' +
                '<span class="expert-card__cta">View Profile <i data-lucide="arrow-right" class="w-3.5 h-3.5 expert-card__arrow"></i></span>' +
                '</div></div>';
        }).join('');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // ===== EXPERT BIO MODAL =====
    window.openExpertModal = function (idx) {
        var e = EXPERTS[idx];
        if (!e) return;
        var _expertModal = document.getElementById('expertBioModal');
        if (!_expertModal) return;
        var t = window.getTranslations ? window.getTranslations() : (window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {});
        document.getElementById('expertModalImg').src = e.photo;
        document.getElementById('expertModalImg').alt = e.name;
        document.getElementById('expertModalName').textContent = e.name;
        document.getElementById('expertModalTitle').textContent = e.role;
        document.getElementById('expertModalLinkedin').href = e.linkedin;
        document.getElementById('expertModalEmail').href = 'mailto:' + e.email;
        document.getElementById('expertModalBio').textContent = t[e.bioKey] || e.bioKey;

        document.getElementById('expertModalExpertise').innerHTML = (e.expertiseKeys || []).map(function (k) {
            var translated = t[k] || k;
            var res = resolveTopicLink(translated);
            if (res) return '<a href="' + res.url + '" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-[#004D34] hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">' + translated + ' <i data-lucide="external-link" class="w-2.5 h-2.5 opacity-60 group-hover:opacity-100"></i></a>';
            var escapedVal = translated.replace(/'/g, "\\'");
            return '<button onclick="showArticleNotAvailableModal(\'' + escapedVal + '\')" class="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100/60 px-2.5 py-0.5 rounded-full hover:bg-emerald-100 transition-colors duration-200 text-left">' + translated + '</button>';
        }).join('');

        document.getElementById('expertModalExperience').innerHTML = (e.experienceKeys || []).map(function (k) {
            var translated = t[k] || k;
            var res = resolveTopicLink(translated);
            var escapedVal = translated.replace(/'/g, "\\'");
            if (res) return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <a href="' + res.url + '" class="hover:text-[#004D34] hover:underline transition-colors flex items-center gap-1">' + translated + ' <i data-lucide="arrow-up-right" class="w-3 h-3 text-emerald-600"></i></a></li>';
            return '<li class="flex items-start gap-2 mb-2"><i data-lucide="check-circle" class="w-3.5 h-3.5 mt-0.5 text-emerald-700 shrink-0"></i> <button onclick="showArticleNotAvailableModal(\'' + escapedVal + '\')" class="text-left hover:text-[#004D34] hover:underline transition-colors">' + translated + '</button></li>';
        }).join('');

        _expertModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeExpertModal = function () {
        var _expertModal = document.getElementById('expertBioModal');
        if (!_expertModal) return;
        _expertModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // ===== ARTICLE NOT AVAILABLE MODAL =====
    window.showArticleNotAvailableModal = function (topicTitle) {
        var modal = document.getElementById('articleNotAvailableModal');
        var content = document.getElementById('articleNotAvailableContent');
        var titleEl = document.getElementById('notAvailableTitle');
        var descEl = document.getElementById('notAvailableDesc');
        var topicBadge = document.getElementById('notAvailableTopicBadge');
        var topicEl = document.getElementById('notAvailableTopic');
        if (!modal) return;

        var isIndonesian = document.documentElement.lang === 'id' || (window.TranslationRepository && window.TranslationRepository.getCurrentLanguage() === 'id');
        if (isIndonesian) {
            titleEl.textContent = 'Artikel / Post Belum Tersedia';
            descEl.textContent = 'Artikel, publikasi, atau post detail untuk topik ini sedang disiapkan oleh tim editorial kami dan akan segera diterbitkan. Silakan jelajahi wawasan lain yang telah tersedia.';
        } else {
            titleEl.textContent = 'Article / Post Not Available Yet';
            descEl.textContent = 'The detailed article or publication for this topic is currently being prepared by our editorial team and will be released soon. In the meantime, feel free to explore our published insights.';
        }

        if (topicTitle) { topicEl.textContent = topicTitle; topicBadge.classList.remove('hidden'); }
        else { topicBadge.classList.add('hidden'); }

        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        if (content) { content.classList.remove('scale-95'); content.classList.add('scale-100'); }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeArticleNotAvailableModal = function () {
        var modal = document.getElementById('articleNotAvailableModal');
        var content = document.getElementById('articleNotAvailableContent');
        if (!modal) return;
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        if (content) { content.classList.remove('scale-100'); content.classList.add('scale-95'); }
    };

    // ===== STRATEGIC INTELLIGENCE RENDERER =====
    function renderSI() {
        var grid = document.getElementById('siGrid');
        if (!grid) return;
        var isId = window.TranslationRepository && window.TranslationRepository.getCurrentLanguage() === 'id';
        var featured = SI_ARTICLES[0];
        var list = SI_ARTICLES.slice(1);

        var fCat = isId ? featured.catId : featured.category;
        var fTitle = isId ? featured.titleId : featured.title;
        var fDesc = isId ? featured.descId : featured.desc;
        var fRead = isId ? featured.readId : featured.read;
        var fDate = isId ? featured.dateId : featured.date;
        var readText = isId ? 'Baca Wawasan' : 'Read Insight';

        document.getElementById('siFeatured').innerHTML =
            '<a href="insights.html" class="si-featured block">' +
                '<div class="si-featured-img"><img src="' + featured.image + '" alt="' + fTitle + '" loading="lazy"></div>' +
                '<span class="si-featured-badge">' + fCat + '</span>' +
                '<div class="si-featured-glass">' +
                    '<p class="si-featured-eyebrow">' + fCat + '</p>' +
                    '<h3 class="si-featured-title">' + fTitle + '</h3>' +
                    '<p class="si-featured-desc">' + fDesc + '</p>' +
                    '<div class="si-featured-footer">' +
                        '<span class="si-featured-meta">' + fDate + ' · ' + fRead + '</span>' +
                        '<span class="si-featured-cta">' + readText + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>' +
                    '</div></div></a>';

        document.getElementById('siList').innerHTML =
            '<div class="si-list">' + list.map(function (a) {
                var c = isId ? a.catId : a.category;
                var ti = isId ? a.titleId : a.title;
                var r = isId ? a.readId : a.read;
                return '<a href="insights.html" class="si-list-item">' +
                    '<img src="' + a.image + '" alt="' + ti + '" loading="lazy" class="si-list-thumb">' +
                    '<div class="si-list-body"><p class="si-list-cat">' + c + '</p><h4 class="si-list-title">' + ti + '</h4><p class="si-list-meta">' + r + '</p></div>' +
                    '<svg class="si-list-arrow w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>';
            }).join('') + '</div>';
    }

    // ===== GSAP ANIMATIONS =====
    var _activeTriggers = [];
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') {
            document.querySelectorAll('.reveal-up, .reveal-fade').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
            document.querySelectorAll('.svc-img-composition').forEach(function (el) { el.style.opacity = 1; });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Hero animation — hanya jika elemen sudah ada di DOM
        var heroEls = document.querySelectorAll('#hero-services .reveal-up');
        if (heroEls.length > 0) {
            gsap.to(heroEls, {
                opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15
            });
        }

        ScrollTrigger.batch('.reveal-up:not(#hero-services .reveal-up):not(#detailedServicesContainer .reveal-up)', {
            start: 'top 85%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.3 });
            }
        });

        initDetailedAnimations();
    }

    var _detailedRetries = 0;
    function initDetailedAnimations() {
        var container = document.getElementById('detailedServicesContainer');
        if (!container) return;
        if (container.children.length === 0) {
            _detailedRetries++;
            if (_detailedRetries < 40) setTimeout(initDetailedAnimations, 100);
            else console.warn('[services] detailedServicesContainer still empty after retries');
            return;
        }

        _activeTriggers.forEach(function (trigger) { trigger.kill(); });
        _activeTriggers = [];

        var serviceSections = document.querySelectorAll('#detailedServicesContainer section');
        serviceSections.forEach(function (section) {
            var textColumn = section.querySelector('.reveal-up');
            var composition = section.querySelector('.svc-img-composition');
            if (!composition) return;

            var shape = composition.querySelector('.absolute');
            var imageContainer = composition.querySelector('.si-shadow');
            if (!shape || !imageContainer) return;

            gsap.set(composition, { clearProps: 'transform', opacity: 1 });
            shape.classList.remove('si-float');
            composition.classList.remove('animated');

            var isLeft = imageContainer.classList.contains('si-slide-from-left');
            var slideX = isLeft ? -180 : 180;

            gsap.set(textColumn, { opacity: 0, y: 48 });
            gsap.set(shape, { opacity: 0, scale: 0.92 });
            gsap.set(imageContainer, { opacity: 0, x: slideX });

            var tl = gsap.timeline({
                scrollTrigger: { trigger: section, start: 'top 75%', once: true }
            });

            if (tl.scrollTrigger) _activeTriggers.push(tl.scrollTrigger);

            if (textColumn) tl.to(textColumn, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
            tl.to(shape, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
              .to(imageContainer, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, '-=0.3')
              .add(function () {
                  composition.classList.add('animated');
                  shape.classList.add('si-float');
                  gsap.set([shape, imageContainer], { clearProps: 'transform,opacity' });
                  if (textColumn) { textColumn.style.opacity = '1'; gsap.set(textColumn, { clearProps: 'transform' }); }
              });
        });

        ScrollTrigger.refresh();
    }

    // ===== BOOTSTRAP =====
    // Fix race condition: only init after all components are loaded.
    // The timeout fallback ensures page still works if event never fires
    // (e.g. component-loader already ran before this script).
    var _booted = false;
    function safeBoot() {
        if (_booted) return;
        _booted = true;
        initPage();
        initLanguageSwitcher();
    }

    document.addEventListener('components:all-loaded', safeBoot);

    // Fallback: if component-loader already finished before this script ran
    setTimeout(function () {
        if (_booted) return;
        if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
            window.ComponentLoader.init().then(safeBoot);
        } else {
            safeBoot();
        }
    }, 1500);

})();
