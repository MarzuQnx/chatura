/**
 * Contact Page Controller
 */
(function () {
    'use strict';

    function initContactPage() {
        if (window.ContactRenderer && typeof window.ContactRenderer.init === 'function') {
            window.ContactRenderer.init();
        }

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.batch('.reveal-up:not(#hero-contact .reveal-up)', {
                start: 'top 88%',
                once: true,
                onEnter: function (batch) {
                    gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out' });
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactPage);
    } else {
        initContactPage();
    }

    document.addEventListener('components:all-loaded', initContactPage);
})();
