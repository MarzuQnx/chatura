/**
 * our-people-init.js
 * Page-specific initialization for our-people.html
 * Initializes PeopleRenderer after components load and binds lifecycle events
 */

(function () {
    'use strict';

    function initPeoplePage() {
        // Initialize PeopleRenderer after component HTML is injected
        if (window.PeopleRenderer && typeof window.PeopleRenderer.init === 'function') {
            window.PeopleRenderer.init();
        }
    }

    // Listen for component:loaded events to re-initialize when relevant components finish loading
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
            initPeoplePage();
        }
    });

    // Also listen for components:all-loaded as fallback
    document.addEventListener('components:all-loaded', function () {
        initPeoplePage();
        initWhatsAppWidget();
    });

    // Auto-initialize if DOM already ready (fallback)
    if (document.readyState !== 'loading') {
        initPeoplePage();
    } else {
        document.addEventListener('DOMContentLoaded', initPeoplePage);
    }

    // WhatsApp Widget initialization - explicit call to ensure binding after component load
    function initWhatsAppWidget() {
        var launcher = document.getElementById('waLauncher');
        var popup = document.getElementById('waPopup');
        var close = document.getElementById('waClose');
        if (!launcher || !popup) return;

        if (launcher.getAttribute('data-wa-bound') === 'true') return;
        launcher.setAttribute('data-wa-bound', 'true');

        function togglePopup() {
            var isOpen = popup.classList.contains('is-open');
            popup.classList.toggle('is-open');
            launcher.setAttribute('aria-expanded', !isOpen);
            popup.setAttribute('aria-hidden', isOpen);
        }

        launcher.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            togglePopup();
        });

        if (close) {
            close.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                togglePopup();
            });
        }

        document.addEventListener('click', function (e) {
            if (popup.classList.contains('is-open') && !popup.contains(e.target) && !launcher.contains(e.target)) {
                togglePopup();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && popup.classList.contains('is-open')) {
                togglePopup();
            }
        });
    }

    // Export for manual init if needed
    window.OurPeopleInit = {
        init: initPeoplePage
    };

})();