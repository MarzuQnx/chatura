/**
 * Career Page Controller
 */
(function () {
    'use strict';

    var _careerInitialized = false;

    function initCareerPage() {
        if (_careerInitialized) return;
        _careerInitialized = true;
        if (window.CareerRenderer && typeof window.CareerRenderer.init === 'function') {
            window.CareerRenderer.init();
        }

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.batch('.reveal-up:not(#hero-careers .reveal-up)', {
                start: 'top 88%',
                once: true,
                onEnter: function (batch) {
                    gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out' });
                }
            });
        }

        // Bind filter tab buttons
        var filterBtns = document.querySelectorAll('.job-tab-btn');
        filterBtns.forEach(function (btn) {
            if (!btn.dataset.listenerBound) {
                btn.dataset.listenerBound = 'true';
                btn.addEventListener('click', function () {
                    filterBtns.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
                    btn.setAttribute('aria-selected', 'true');
                    var activeFilter = btn.getAttribute('data-filter');

                    if (typeof gsap !== 'undefined') {
                        gsap.to('#positionsContainer', {
                            opacity: 0, y: 12, duration: 0.15, onComplete: function () {
                                if (window.CareerRenderer) window.CareerRenderer.renderPositions(activeFilter);
                                gsap.to('#positionsContainer', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
                            }
                        });
                    } else {
                        if (window.CareerRenderer) window.CareerRenderer.renderPositions(activeFilter);
                    }
                });
            }
        });
    }

    // Global Modal Control Helpers
    window.openLightbox = function (src) {
        var modal = document.getElementById('lightboxModal');
        var img = document.getElementById('lightboxImg');
        if (!modal || !img) return;
        img.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        var modal = document.getElementById('lightboxModal');
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.handleJobSubmit = function (e) {
        e.preventDefault();
        var t = function (key) {
            var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
            return d[key] || key;
        };
        alert(t('career.submit_success') || 'Thank you! Your application has been received. Our HR team will review it and get back to you shortly.');
        e.target.reset();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCareerPage);
    } else {
        initCareerPage();
    }

    document.addEventListener('components:all-loaded', initCareerPage);
})();
