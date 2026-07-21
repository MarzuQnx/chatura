/**
 * LatestCarousel - Component for handling the "Latest Updates" carousel logic
 */
(function () {
    'use strict';

    function initCarouselEvents(trackId, prevBtnId, nextBtnId) {
        var track = document.getElementById(trackId);
        var prevBtn = document.getElementById(prevBtnId);
        var nextBtn = document.getElementById(nextBtnId);
        if (!track || !prevBtn || !nextBtn) return;
        
        var originals = Array.prototype.slice.call(track.children);
        if (originals.length < 2) return;
        
        var isMobile = window.matchMedia('(max-width: 768px)').matches ||
            (window.matchMedia('(hover:none)').matches && window.matchMedia('(pointer:coarse)').matches);
        if (isMobile) return;

        originals.forEach(function (c) {
            if (c.getAttribute('aria-hidden') === 'true') return;
            var clone = c.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button').forEach(function (el) {
                el.setAttribute('tabindex', '-1');
            });
            clone.style.scrollSnapAlign = 'start';
            track.appendChild(clone);
        });

        var allCards = track.querySelectorAll('.latest-card');
        allCards.forEach(function (c) { c.style.scrollSnapAlign = 'start'; });
        track.style.scrollSnapType = 'x mandatory';
        track.style.scrollbarWidth = 'none';
        track.style.msOverflowStyle = 'none';

        if (track.dataset.carouselInitialized) return;
        track.dataset.carouselInitialized = 'true';

        var loopLock = false;
        function getScrollStep() { 
            var first = track.firstElementChild;
            return first ? first.offsetWidth + 20 : 0; 
        }
        
        function jumpTo(pos) {
            loopLock = true;
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = pos;
            track.style.scrollBehavior = 'smooth';
            requestAnimationFrame(function () { loopLock = false; });
        }

        track.addEventListener('scroll', function () {
            if (loopLock) return;
            var maxScroll = track.scrollWidth - track.clientWidth;
            if (maxScroll <= 0) return;
            if (track.scrollLeft >= maxScroll - 2) {
                jumpTo(0);
            } else if (track.scrollLeft <= 2) {
                jumpTo(maxScroll);
            }
        });

        if (!prevBtn.dataset.carouselBtnInit) {
            prevBtn.addEventListener('click', function () { track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }); });
            prevBtn.dataset.carouselBtnInit = 'true';
        }
        if (!nextBtn.dataset.carouselBtnInit) {
            nextBtn.addEventListener('click', function () { track.scrollBy({ left: getScrollStep(), behavior: 'smooth' }); });
            nextBtn.dataset.carouselBtnInit = 'true';
        }

        var isDragging = false, startX = 0, scrollLeftStart = 0;
        track.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeftStart = track.scrollLeft;
            track.style.cursor = 'grabbing';
            e.preventDefault();
        });
        window.addEventListener('mouseup', function () {
            if (isDragging) { isDragging = false; track.style.cursor = 'grab'; }
        });
        track.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            var x = e.pageX - track.offsetLeft;
            track.scrollLeft = scrollLeftStart - (x - startX) * 1.5;
        });

        track.addEventListener('touchstart', function (e) {
            isDragging = true;
            startX = e.touches[0].pageX;
            scrollLeftStart = track.scrollLeft;
        }, { passive: true });
        track.addEventListener('touchend', function () { isDragging = false; }, { passive: true });
        track.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            var x = e.touches[0].pageX;
            track.scrollLeft = scrollLeftStart - (x - startX) * 1.2;
        }, { passive: true });

        track.addEventListener('wheel', function (e) {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            track.scrollBy({ left: e.deltaY > 0 ? getScrollStep() : -getScrollStep(), behavior: 'smooth' });
        }, { passive: false });

        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: getScrollStep(), behavior: 'smooth' }); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }); }
        });
    }

    window.LatestCarousel = {
        init: initCarouselEvents
    };
})();
