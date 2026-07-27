/**
 * industries.js — Page Controller for industries.html
 */
(function () {
    'use strict';
    var _initialized = false;

    function initPage() {
        if (_initialized) return;
        _initialized = true;

        if (window.IndustryRenderer) { try { window.IndustryRenderer.init(); } catch (e) {} }
        if (window.PeopleRenderer) { try { window.PeopleRenderer.init(); } catch (e) {} }
        if (window.ArticleRenderer) { try { window.ArticleRenderer.init(); } catch (e) {} }

        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch (e) {} }
        if (window.PageLoader && typeof window.PageLoader.initNavbarScroll === 'function') { window.PageLoader.initNavbarScroll(); }

        initGSAPAnimations();
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
