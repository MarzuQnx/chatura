/**
 * ============================================================================
 * CHATURA HTML COMPONENT LOADER v2.1
 * Modular HTML Component Loader with Cache-Busting, CLS Mitigation, Template
 * Interpolation, GSAP ScrollTrigger Refresh, i18n Re-translation, and
 * Event-Driven Motion System Hooks.
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    var BUILD_VERSION = 'v20260724';
    var FETCH_TIMEOUT_MS = 5000;
    var componentCache = new Map();

    // Auto-detect base path from current page location
    // Root pages (index.html, services-modular.html) -> base = ''
    // Sub-pages (services/xxx/index.html) -> base = '../../'
    var _basePath = '';
    (function detectBase() {
        if (window.__COMPONENT_BASE !== undefined) { _basePath = window.__COMPONENT_BASE; return; }
        var path = window.location.pathname;
        // Remove filename to get directory path
        var dir = path.replace(/\/[^\/]*$/, '/');
        var segments = dir.split('/').filter(Boolean);
        _basePath = '';
        for (var i = 0; i < segments.length; i++) _basePath += '../';
    })();

    /**
     * Replaces {{placeholder}} tokens with matching dataset properties.
     * @param {string} template HTML string containing {{key}} placeholders
     * @param {DOMStringMap} dataset Element dataset
     * @returns {string} Interpolated HTML string
     */
    function interpolate(template, dataset) {
        if (!template || !dataset) return template;
        return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, function (match, key) {
            return dataset[key] !== undefined ? dataset[key] : '';
        });
    }

    /**
     * Fetches a component with a timeout fallback.
     * @param {string} url Component target URL
     * @returns {Promise<string>} HTML text content
     */
    function fetchWithTimeout(url) {
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () {
                reject(new Error('Fetch request timed out'));
            }, FETCH_TIMEOUT_MS);

            fetch(url)
                .then(function (res) {
                    clearTimeout(timer);
                    if (!res.ok) {
                        throw new Error('HTTP status ' + res.status);
                    }
                    return res.text();
                })
                .then(resolve)
                .catch(function (err) {
                    clearTimeout(timer);
                    reject(err);
                });
        });
    }

    /**
     * Re-initializes animations, GSAP triggers, icons, and i18n inside newly injected component.
     * @param {HTMLElement} el Component container element
     */
    function initComponentPlugins(el) {
        // 1. Re-initialize Lucide Icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({
                nameAttr: 'data-lucide'
            });
        }

        // 2. Re-apply i18n Translations if present
        if (window.i18nLoader && typeof window.i18nLoader.translatePage === 'function') {
            try {
                window.i18nLoader.translatePage(el);
            } catch (e) {
                console.warn('[ComponentLoader] i18n translation warning:', e);
            }
        }

        // 3. Handle GSAP & ScrollTrigger reveal-up animations inside loaded component
        // Skip if page has its own GSAP init (e.g. sub-service-init.js)
        if (window.gsap && !window.__SKIP_COMPONENT_GSAP) {
            var revealUpEls = el.querySelectorAll('.reveal-up');
            if (revealUpEls.length > 0) {
                if (window.ScrollTrigger) {
                    window.ScrollTrigger.batch(revealUpEls, {
                        start: 'top 90%',
                        once: true,
                        onEnter: function (batch) {
                            window.gsap.to(batch, {
                                opacity: 1,
                                y: 0,
                                duration: 0.65,
                                stagger: 0.08,
                                ease: 'power2.out'
                            });
                        }
                    });
                    window.ScrollTrigger.refresh();
                } else {
                    // Direct GSAP fallback if ScrollTrigger isn't active
                    window.gsap.to(revealUpEls, {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: 'power2.out'
                    });
                }
            }
        }
    }

    /**
     * Loads and injects a single component into the target container.
     * @param {HTMLElement} el Target container element with [data-component]
     * @returns {Promise<void>}
     */
    async function loadComponent(el) {
        var name = el.getAttribute('data-component');
        if (!name) return;

        try {
            var html = componentCache.get(name);
            if (!html) {
                var url = _basePath + 'components/' + name + '.html?v=' + BUILD_VERSION;
                html = await fetchWithTimeout(url);
                componentCache.set(name, html);
            }

            // Interpolate any data-* placeholder variables
            var processedHtml = interpolate(html, el.dataset);

            // Replace container innerHTML
            el.innerHTML = processedHtml;
            el.classList.add('component-loaded');

            // Initialize plugins for newly injected DOM
            initComponentPlugins(el);

            // Dispatch global event for Motion system and other component scripts
            var event = new CustomEvent('component:loaded', {
                bubbles: true,
                cancelable: true,
                detail: {
                    name: name,
                    element: el
                }
            });
            el.dispatchEvent(event);
            document.dispatchEvent(event);

        } catch (err) {
            el.classList.add('component-error');
            console.error('[ComponentLoader] Failed to load component "' + name + '":', err);
        }
    }

    /**
     * Scans the document and loads all [data-component] targets.
     * @returns {Promise<void>}
     */
    async function loadAll() {
        var elements = Array.from(document.querySelectorAll('[data-component]'));
        if (!elements.length) return;

        await Promise.all(elements.map(function (el) {
            return loadComponent(el);
        }));

        // Trigger renderers if they were waiting for component HTML
        if (window.ServiceRenderer && typeof window.ServiceRenderer.init === 'function') {
            try { window.ServiceRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.ClientRenderer && typeof window.ClientRenderer.init === 'function') {
            try { window.ClientRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.ArticleRenderer && typeof window.ArticleRenderer.init === 'function') {
            try { window.ArticleRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.PeopleRenderer && typeof window.PeopleRenderer.init === 'function') {
            try { window.PeopleRenderer.init(); } catch (e) { console.warn(e); }
        }
        if (window.FAQRenderer && typeof window.FAQRenderer.init === 'function') {
            try { window.FAQRenderer.init(); } catch (e) { console.warn(e); }
        }

        // Dispatch global components:all-loaded event
        var allLoadedEvent = new CustomEvent('components:all-loaded', {
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(allLoadedEvent);
    }

    // Public API
    window.ComponentLoader = {
        init: loadAll,
        loadComponent: loadComponent,
        version: BUILD_VERSION
    };

    // Auto-start on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }

})(window, document);
