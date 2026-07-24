/**
 * CareerRenderer - Renders all dynamic sections on the Career page
 */
(function () {
    'use strict';

    var CR = window.TranslationRepository;
    var currentLang = function () { return CR ? CR.getCurrentLanguage() : 'en'; };
    var loc = function (obj, keyFallback) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        if (obj[currentLang()]) return obj[currentLang()];
        if (keyFallback && obj[keyFallback]) return obj[keyFallback];
        return obj.en || '';
    };

    var CareerRenderer = {
        renderFeaturedJobs: function() {
            var c = document.getElementById('featuredJobsContainer');
            if (!c || !window.CareerRepository) return;
            var jobs = window.CareerRepository.getPositions().filter(function (p) { return p.featured; });
            var html = '';
            for (var i = 0; i < jobs.length; i++) {
                var j = jobs[i];
                html += '<div class="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#004D34] transition duration-300 group flex flex-col h-full cursor-pointer" onclick="openJobModal(\'' + j.id + '\')">' +
                    '<div class="flex justify-between items-start mb-6">' +
                    '<span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">' + loc(j.deptLabel) + '</span>' +
                    '<div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#004D34] group-hover:text-white transition duration-300"><i data-lucide="arrow-up-right" class="w-5 h-5"></i></div>' +
                    '</div>' +
                    '<h3 class="text-xl font-bold text-gray-950 mb-3 group-hover:text-[#004D34] transition">' + loc(j.title) + '</h3>' +
                    '<p class="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">' + loc(j.about) + '</p>' +
                    '<div class="flex flex-wrap gap-4 pt-6 border-t border-gray-100 mt-auto">' +
                    '<div class="flex items-center gap-1.5 text-xs font-medium text-gray-600"><i data-lucide="map-pin" class="w-4 h-4 text-emerald-700"></i> ' + loc(j.location) + '</div>' +
                    '<div class="flex items-center gap-1.5 text-xs font-medium text-gray-600"><i data-lucide="clock" class="w-4 h-4 text-emerald-700"></i> ' + loc(j.type) + '</div>' +
                    '</div></div>';
            }
            c.innerHTML = html;
        },

        renderGallery: function() {
            var c = document.getElementById('galleryContainer');
            if (!c || !window.CareerRepository || !window.CareerGallery) return;
            
            var items = window.CareerRepository.getGallery();
            var smSizes = window.CareerGallery.generateLayout(items, 'sm');
            var mdSizes = window.CareerGallery.generateLayout(items, 'md');
            var lgSizes = window.CareerGallery.generateLayout(items, 'lg');

            var html = '';
            for (var i = 0; i < items.length; i++) {
                var g = items[i];
                var sm = smSizes[i], md = mdSizes[i], lg = lgSizes[i];
                var cls = 'col-span-' + sm.w + ' row-span-' + sm.h +
                    ' md:col-span-' + md.w + ' md:row-span-' + md.h +
                    ' lg:col-span-' + lg.w + ' lg:row-span-' + lg.h +
                    ' shadow-sm group bg-gray-900 cursor-pointer';
                var inner = '<img src="' + g.thumb + '" alt="' + loc(g.alt) + '" class="absolute inset-0 w-full !h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" loading="lazy">';
                
                if (g.hasSideAccent) inner += '<div class="absolute inset-y-0 left-0 w-1 bg-[#004D34]"></div>';
                if (g.hasBlendOverlay) inner += '<div class="absolute inset-0 bg-[#004D34]/10 mix-blend-multiply"></div>';
                if (g.hasGradient) inner += '<div class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-gray-950/60 to-transparent"></div>';
                if (g.labelBadge) {
                    var badge = loc(g.labelBadge);
                    inner += '<div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-[#004D34] px-2 py-1 rounded shadow-sm">' + badge + '</div>';
                }
                
                html += '<div class="relative overflow-hidden rounded-xl ' + cls + '" onclick="openLightbox(\'' + g.image + '\')">' + inner + '</div>';
            }
            c.innerHTML = html;
        },

        renderPrograms: function() {
            var c = document.getElementById('programsContainer');
            if (!c || !window.CareerRepository) return;
            var progs = window.CareerRepository.getPrograms();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            
            var html = '';
            for (var i = 0; i < progs.length; i++) {
                var p = progs[i];
                var bullets = '';
                for (var j = 0; j < p.bullets.length; j++) {
                    bullets += '<li class="flex items-center"><i data-lucide="check" class="text-emerald-700 mr-2 w-4 h-4"></i> <span>' + t(p.bullets[j]) + '</span></li>';
                }
                html += '<div class="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition duration-300">' +
                    '<div class="h-48 overflow-hidden"><img src="' + p.image + '" alt="' + loc(p.alt) + '" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy"></div>' +
                    '<div class="p-8">' +
                    '<div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#004D34] flex items-center justify-center text-lg mb-5"><i data-lucide="' + p.icon + '"></i></div>' +
                    '<h3 class="text-xl font-bold text-gray-950 mb-3">' + t(p.i18nTitle) + '</h3>' +
                    '<p class="text-sm text-gray-500 leading-relaxed mb-6">' + t(p.i18nDesc) + '</p>' +
                    '<ul class="text-sm text-gray-600 space-y-2.5 mb-8">' + bullets + '</ul>' +
                    '<a href="#apply-form" onclick="prefillPosition(\'General Interest\')" class="text-sm text-[#004D34] font-semibold hover:underline flex items-center gap-1">' + t('career.explore_program') + '</a>' +
                    '</div></div>';
            }
            c.innerHTML = html;
        },

        renderPositions: function(activeFilter) {
            var c = document.getElementById('positionsContainer');
            if (!c || !window.CareerRepository) return;
            activeFilter = activeFilter || 'all';
            var allPositions = window.CareerRepository.getPositions();
            var filtered = activeFilter === 'all' ? allPositions : allPositions.filter(function (p) { return p.dept === activeFilter; });
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            
            if (filtered.length === 0) { 
                c.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-6 bg-white border border-gray-200 rounded-xl">' + t('career.empty_positions') + '</p>'; 
                return; 
            }
            var deptIcons = { advisory: 'briefcase', tax: 'file-text', finance: 'calculator', risk: 'shield' };
            var deptColors = { advisory: 'bg-indigo-50 text-indigo-700', tax: 'bg-blue-50 text-blue-700', finance: 'bg-emerald-50 text-emerald-700', risk: 'bg-amber-50 text-amber-700' };
            
            var html = '';
            for (var i = 0; i < filtered.length; i++) {
                var j = filtered[i];
                html += '<div class="bg-white border border-gray-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md hover:border-emerald-700 transition duration-300">' +
                    '<div class="flex items-start gap-4"><div class="w-11 h-11 rounded-xl ' + (deptColors[j.dept] || 'bg-gray-100 text-gray-600') + ' flex items-center justify-center shrink-0"><i data-lucide="' + (deptIcons[j.dept] || 'briefcase') + '" class="w-5 h-5"></i></div>' +
                    '<div><h3 class="font-bold text-gray-950 text-sm leading-tight">' + loc(j.title) + '</h3><div class="flex flex-wrap gap-3 text-[11px] text-gray-400 mt-1.5"><span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3"></i>' + loc(j.location) + '</span><span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i>' + loc(j.type) + '</span><span class="flex items-center gap-1"><i data-lucide="folder" class="w-3 h-3"></i>' + loc(j.deptLabel) + '</span></div></div></div>' +
                    '<div class="flex items-center gap-2 w-full sm:w-auto flex-row-reverse sm:flex-row"><button onclick="openJobModal(\'' + j.id + '\')" class="flex-1 sm:flex-none border border-gray-300 text-gray-700 text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition whitespace-nowrap flex items-center gap-1"><span data-i18n="career.view_details">' + t('career.view_details') + '</span> <i data-lucide="arrow-right" class="w-3 h-3"></i></button><button onclick="scrollToApply(\'' + loc(j.title).replace(/'/g, "\\'") + '\')" class="flex-1 sm:flex-none bg-[#004D34] text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-[#003322] transition whitespace-nowrap">' + t('career.apply_now') + '</button></div></div>';
            }
            c.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        },
        
        renderPositionDropdown: function() {
            var dd = document.getElementById('positionDropdown');
            if (!dd || !window.CareerRepository) return;
            var positions = window.CareerRepository.getPositions();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            var opts = '<option value="">' + t('career.form_position_placeholder') + '</option>';
            positions.forEach(function (p) {
                opts += '<option value="' + loc(p.title).replace(/"/g, '&quot;') + '">' + loc(p.title) + '</option>';
            });
            opts += '<option value="General Interest">' + t('career.form_position_general') + '</option>';
            dd.innerHTML = opts;
        },

        init: function() {
            this.renderFeaturedJobs();
            this.renderGallery();
            this.renderPrograms();
            this.renderPositions('all');
            this.renderPositionDropdown();
            
            // Note: RenderValues, RenderBenefits, RenderHiringProcess, RenderFAQ are small static arrays
            // If they are in CareerRepository, we should render them. Since we didn't migrate them to CareerRepository initially, 
            // we will leave them in career.html for now unless we need to extract them.
            // Actually, we did migrate them to CareerRepository!
            // Let's implement them too.
            this.renderValues();
            this.renderBenefits();
            this.renderHiringProcess();
            this.renderFaq();
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            if (window.ChaturaBus) {
                window.ChaturaBus.on('languageChange', function() {
                    CareerRenderer.renderFeaturedJobs();
                    CareerRenderer.renderGallery();
                    CareerRenderer.renderPrograms();
                    CareerRenderer.renderPositions('all');
                    CareerRenderer.renderPositionDropdown();
                    CareerRenderer.renderValues();
                    CareerRenderer.renderBenefits();
                    CareerRenderer.renderHiringProcess();
                    CareerRenderer.renderFaq();
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                });
            }
        },
        
        renderValues: function() {
            var c = document.getElementById('valuesContainer');
            if (!c || !window.CareerRepository || !window.CareerRepository.getValues) return;
            var vals = window.CareerRepository.getValues();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            var html = '';
            for(var i=0; i<vals.length; i++){
                var v = vals[i];
                html += '<div class="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition duration-300">' +
                        '<div class="w-14 h-14 rounded-xl bg-emerald-50 text-[#004D34] flex items-center justify-center text-xl mb-6">' +
                        '<i data-lucide="' + v.icon + '"></i></div>' +
                        '<h3 class="text-xl font-bold text-gray-950 mb-3">' + t(v.i18nTitle) + '</h3>' +
                        '<p class="text-sm text-gray-500 leading-relaxed">' + t(v.i18nDesc) + '</p></div>';
            }
            c.innerHTML = html;
        },
        
        renderBenefits: function() {
            var c = document.getElementById('benefitsContainer');
            if (!c || !window.CareerRepository || !window.CareerRepository.getBenefits) return;
            var items = window.CareerRepository.getBenefits();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            var html = '';
            for(var i=0; i<items.length; i++){
                var b = items[i];
                html += '<div class="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-200 hover:shadow-md transition duration-300">' +
                        '<div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><i data-lucide="' + b.icon + '" class="w-5 h-5"></i></div>' +
                        '<div><h4 class="font-bold text-sm text-gray-950">' + t(b.i18nTitle) + '</h4><p class="text-xs text-gray-500 mt-1">' + t(b.i18nDesc) + '</p></div></div>';
            }
            c.innerHTML = html;
        },
        
        renderHiringProcess: function() {
            var c = document.getElementById('hiringProcessContainer');
            if (!c || !window.CareerRepository || !window.CareerRepository.getHiringProcess) return;
            var steps = window.CareerRepository.getHiringProcess();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            var html = '';
            for(var i=0; i<steps.length; i++){
                var s = steps[i];
                html += '<div class="text-center flex-1 max-w-50 mx-auto">' +
                        '<div class="w-12 h-12 rounded-full bg-[#004D34] text-white flex items-center justify-center mx-auto mb-3"><i data-lucide="' + s.icon + '"></i></div>' +
                        '<h4 class="font-bold text-sm text-gray-950">' + t(s.i18nTitle) + '</h4>' +
                        '<p class="text-xs text-gray-500 mt-1">' + t(s.i18nDesc) + '</p></div>';
            }
            c.innerHTML = html;
        },
        
        renderFaq: function() {
            var c = document.getElementById('faqAccordionWrap');
            if (!c || !window.CareerRepository || !window.CareerRepository.getFaq) return;
            var items = window.CareerRepository.getFaq();
            var t = window.TranslationRepository ? window.TranslationRepository.t.bind(window.TranslationRepository) : function(k) { return k; };
            var html = '';
            for(var i=0; i<items.length; i++){
                var f = items[i];
                html += '<div class="faq-accordion-item bg-white border border-gray-200 rounded-xl p-5 transition cursor-pointer">' +
                        '<div class="flex justify-between items-center gap-4 text-sm font-bold text-gray-950">' +
                        '<span>' + t(f.i18nQuestion) + '</span>' +
                        '<div class="faq-icon w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-300"><i data-lucide="plus" class="w-3 h-3 text-gray-400"></i></div></div>' +
                        '<div class="faq-accordion-content text-xs text-gray-500 leading-relaxed">' + t(f.i18nAnswer) + '</div></div>';
            }
            c.innerHTML = html;
            
            // Re-bind click events
            var domItems = document.querySelectorAll('.faq-accordion-item');
            for(var j=0; j<domItems.length; j++){
                domItems[j].addEventListener('click', function(e) {
                    var item = e.currentTarget;
                    var isActive = item.classList.contains('active');
                    document.querySelectorAll('.faq-accordion-item').forEach(function (el) { el.classList.remove('active'); });
                    if (!isActive) item.classList.add('active');
                });
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { CareerRenderer.init(); });
    } else {
        CareerRenderer.init();
    }
    
    // Bind Job Modal globally
    window.openJobModal = function (id) {
        if (!window.CareerRepository) return;
        var j = window.CareerRepository.getPositionById(id);
        if (!j) return;
        
        var modal = document.getElementById('jobModal');
        if (!modal) return;
        
        window.lastFocused = document.activeElement;
        document.getElementById('modalDept').textContent = loc(j.deptLabel);
        document.getElementById('modalTitle').textContent = loc(j.title);
        document.getElementById('modalLocation').textContent = loc(j.location);
        document.getElementById('modalType').textContent = loc(j.type);
        document.getElementById('modalAbout').textContent = loc(j.about);
        
        var currentLangCode = currentLang();
        var tasksHtml = '';
        var tasks = j.tasks[currentLangCode] || j.tasks.en;
        for (var i = 0; i < tasks.length; i++) tasksHtml += '<li>' + tasks[i] + '</li>';
        document.getElementById('modalTasks').innerHTML = tasksHtml;
        
        var reqHtml = '';
        var reqs = j.requirements[currentLangCode] || j.requirements.en;
        for (var i = 0; i < reqs.length; i++) reqHtml += '<li>' + reqs[i] + '</li>';
        document.getElementById('modalRequirements').innerHTML = reqHtml;
        
        var similar = window.CareerRepository.getPositionsByDept(j.dept).filter(function (x) { return x.id !== j.id; }).slice(0, 2);
        var similarHtml = '';
        if (similar.length > 0) {
            for (var i = 0; i < similar.length; i++) {
                var s = similar[i];
                similarHtml += '<a href="javascript:void(0)" onclick="openJobModal(\'' + s.id + '\')" class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-emerald-700 hover:shadow-sm transition text-left"><div><p class="text-xs font-bold text-gray-950">' + loc(s.title) + '</p><p class="text-[10px] text-gray-400 mt-0.5">' + loc(s.location) + ' · ' + loc(s.type) + '</p></div></a>';
            }
        } else {
            similarHtml = '<p class="text-xs text-gray-400 italic">' + t('career.no_similar') + '</p>';
        }
        document.getElementById('modalSimilar').innerHTML = similarHtml;
        
        document.getElementById('modalApplyBtn').setAttribute('onclick', "scrollToApply('" + loc(j.title).replace(/'/g, "\\'") + "'); closeJobModal();");
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        var modalBody = modal.querySelector('.modal-body');
        if (modalBody) modalBody.focus();
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    window.closeJobModal = function () {
        var modal = document.getElementById('jobModal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (window.lastFocused) { window.lastFocused.focus(); window.lastFocused = null; }
    };
    
    window.scrollToApply = function (jobTitle) { 
        if (window.prefillPosition) window.prefillPosition(jobTitle); 
        var form = document.getElementById('apply-form');
        if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    };
    
    window.prefillPosition = function (title) {
        var dd = document.getElementById('positionDropdown');
        if (!dd) return;
        var matched = false;
        for (var i = 0; i < dd.options.length; i++) { 
            if (dd.options[i].value === title) { 
                dd.selectedIndex = i; 
                matched = true; 
                break; 
            } 
        }
        if (!matched) dd.selectedIndex = dd.options.length - 1;
    };
    
    // Bind Filter Tabs globally
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            var filterBtns = document.querySelectorAll('.job-tab-btn');
            for(var i=0; i<filterBtns.length; i++) {
                filterBtns[i].addEventListener('click', function(e) {
                    var btn = e.currentTarget;
                    document.querySelectorAll('.job-tab-btn').forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
                    btn.setAttribute('aria-selected', 'true');
                    var activeFilter = btn.getAttribute('data-filter');
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to('#positionsContainer', { opacity: 0, y: 12, duration: 0.15, onComplete: function () { 
                            CareerRenderer.renderPositions(activeFilter); 
                            gsap.to('#positionsContainer', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }); 
                        } });
                    } else { 
                        CareerRenderer.renderPositions(activeFilter); 
                    }
                });
            }
        });
    }

    window.CareerRenderer = CareerRenderer;
})();
