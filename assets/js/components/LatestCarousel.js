/**
 * LatestCarousel v4 — Fixed-DOM infinite carousel
 *
 * DOM created ONCE at init. Never modified after.
 * Track: [pre-pad clones] [original cards] [post-pad clones]
 * Seamless loop via instant transform reset at clone boundaries.
 * State machine: IDLE | ANIMATING | DRAGGING
 * Single RAF loop. Cached measurements. No layout thrashing.
 */
(function () {
    'use strict';

    function initCarousel(trackId, prevBtnId, nextBtnId) {
        var track = document.getElementById(trackId);
        var prevBtn = document.getElementById(prevBtnId);
        var nextBtn = document.getElementById(nextBtnId);
        var playPauseBtn = document.getElementById('latestPlayPause');
        if (!track) return;

        var originals = Array.prototype.slice.call(track.children);
        var N = originals.length;
        if (N < 2) return;
        if (track.dataset.carouselInitialized) return;
        track.dataset.carouselInitialized = 'true';

        // ─── CONFIG ──────────────────────────────────────────
        var STEP_MS = 420;
        var WHEEL_DEBOUNCE = 600;
        var AUTO_DELAY = 3500;
        var SNAP_THRESHOLD = 0.15;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        // ─── STATE ───────────────────────────────────────────
        var mode = 'IDLE'; // IDLE | ANIMATING | DRAGGING
        var pos = 0;
        var paused = false;
        var hoverPaused = false;

        // Cached measurements (set once, recalced on resize)
        var stepPx = 0;
        var padCount = 0;
        var loopPx = 0;

        // Step animation
        var stepFrom = 0;
        var stepTo = 0;
        var stepStart = 0;

        // Drag
        var dragActive = false;
        var dragStartX = 0;
        var dragStartPos = 0;

        // Touch
        var touchStartX = 0;
        var touchStartPos = 0;
        var touchStartTime = 0;

        // Wheel
        var lastWheel = 0;

        // Autoplay
        var autoTimer = null;

        // ─── DOM BUILD (ONCE) ────────────────────────────────
        // Store original HTML before modifying DOM
        var origHTML = [];
        for (var i = 0; i < N; i++) {
            origHTML.push(originals[i].outerHTML);
        }

        function buildCard(html, hidden) {
            var wrap = document.createElement('div');
            wrap.innerHTML = html;
            var el = wrap.firstElementChild;
            if (hidden) {
                el.setAttribute('aria-hidden', 'true');
                el.querySelectorAll('a, button').forEach(function (a) {
                    a.setAttribute('tabindex', '-1');
                });
            }
            el.style.flexShrink = '0';
            return el;
        }

        // Clear track
        track.innerHTML = '';
        track.style.display = 'flex';
        track.style.overflow = 'visible';
        track.style.scrollSnapType = 'none';
        track.style.scrollbarWidth = 'none';
        track.style.msOverflowStyle = 'none';
        track.style.willChange = 'transform';
        track.style.cursor = 'grab';

        var parent = track.parentElement;
        if (parent) parent.style.overflow = 'hidden';

        // Measure gap from track's CSS flex gap
        var tempCard = buildCard(origHTML[0], false);
        track.appendChild(tempCard);
        var computedGap = parseFloat(getComputedStyle(track).columnGap) || parseFloat(getComputedStyle(track).gap) || 0;
        var cardW = tempCard.offsetWidth;
        stepPx = cardW + computedGap;

        // Now figure out how many cards fit in viewport
        var viewportW = parent ? parent.offsetWidth : 1400;
        padCount = Math.ceil(viewportW / stepPx);
        if (padCount > N) padCount = N;
        loopPx = stepPx * N;

        // Remove temp card
        track.removeChild(tempCard);

        // Build: [post-pad clones] [originals] [pre-pad clones]
        // Post-pad: last padCount cards (cloned) — shown when scrolling left
        var postPad = [];
        for (var p = N - padCount; p < N; p++) {
            postPad.push(buildCard(origHTML[p], true));
        }

        // Pre-pad: first padCount cards (cloned) — shown when scrolling right
        var prePad = [];
        for (var q = 0; q < padCount; q++) {
            prePad.push(buildCard(origHTML[q], true));
        }

        // Assemble DOM
        for (var a = 0; a < postPad.length; a++) track.appendChild(postPad[a]);
        for (var b = 0; b < N; b++) track.appendChild(buildCard(origHTML[b], false));
        for (var c = 0; c < prePad.length; c++) track.appendChild(prePad[c]);

        // All cards reference
        var allCards = Array.prototype.slice.call(track.children);

        // Set initial position: show first original card (skip post-pad)
        pos = -(postPad.length * stepPx);
        track.style.transform = 'translate3d(' + pos + 'px,0,0)';

        // ─── MEASUREMENT RECACHE (resize) ────────────────────
        function recalc() {
            var firstOrig = allCards[postPad.length];
            if (!firstOrig) return;
            var newW = firstOrig.offsetWidth;
            var newGap = parseFloat(getComputedStyle(track).columnGap) || parseFloat(getComputedStyle(track).gap) || 0;
            stepPx = newW + newGap;
            loopPx = stepPx * N;
        }

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(recalc, 200);
        });

        // ─── HELPERS ─────────────────────────────────────────
        function applyPos() {
            track.style.transform = 'translate3d(' + pos + 'px,0,0)';
        }

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        // Snap to nearest card center
        function snapToCard(currentPos) {
            var idx = Math.round(-currentPos / stepPx);
            return -idx * stepPx;
        }

        // ─── SEAMLESS RESET ──────────────────────────────────
        // If pos has gone past original cards into pre-pad clones,
        // reset back into originals (add loopPx).
        // If pos has gone past post-pad into... well that shouldn't
        // happen going right, but handle both directions.
        function seamlessReset() {
            var maxPos = 0;
            var minPos = -(loopPx);
            if (pos > maxPos + 1) {
                pos -= loopPx;
                applyPos();
            } else if (pos < minPos - 1) {
                pos += loopPx;
                applyPos();
            }
        }

        // ─── SINGLE RAF LOOP ─────────────────────────────────
        function tick() {
            if (mode === 'IDLE') {
                if (!paused && !hoverPaused && !reducedMotion.matches) {
                    pos -= 0.4;
                    seamlessReset();
                    applyPos();
                }
            } else if (mode === 'ANIMATING') {
                var elapsed = performance.now() - stepStart;
                var progress = Math.min(elapsed / STEP_MS, 1);
                pos = stepFrom + (stepTo - stepFrom) * easeOutCubic(progress);
                applyPos();
                if (progress >= 1) {
                    pos = stepTo;
                    seamlessReset();
                    applyPos();
                    mode = 'IDLE';
                    scheduleAutoplay();
                }
            }
            requestAnimationFrame(tick);
        }

        // ─── STEP (ONE CARD) ─────────────────────────────────
        function stepBy(delta) {
            if (mode !== 'IDLE') return;
            mode = 'ANIMATING';
            stepFrom = pos;
            stepTo = pos + delta;
            stepStart = performance.now();
            cancelAutoplay();
        }

        function stepNext() {
            cancelAutoplay();
            stepBy(-stepPx);
        }

        function stepPrev() {
            cancelAutoplay();
            stepBy(stepPx);
        }

        // ─── SNAP ANIMATION (drag/touch release) ─────────────
        function snapToNearest(releasePos) {
            if (mode !== 'IDLE') return;
            var target = snapToCard(releasePos);
            if (Math.abs(target - releasePos) < 1) {
                pos = target;
                applyPos();
                scheduleAutoplay();
                return;
            }
            mode = 'ANIMATING';
            stepFrom = releasePos;
            stepTo = target;
            stepStart = performance.now();
            cancelAutoplay();
        }

        // ─── AUTOPLAY ────────────────────────────────────────
        function scheduleAutoplay() {
            cancelAutoplay();
            if (!paused && !hoverPaused && !reducedMotion.matches) {
                autoTimer = setTimeout(function () {
                    if (mode === 'IDLE') stepNext();
                }, AUTO_DELAY);
            }
        }

        function cancelAutoplay() {
            if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
        }

        // ─── INIT START ──────────────────────────────────────
        requestAnimationFrame(tick);
        scheduleAutoplay();

        // ─── PLAY / PAUSE ────────────────────────────────────
        function updateBtn() {
            if (!playPauseBtn) return;
            var pi = playPauseBtn.querySelector('.icon-play');
            var pa = playPauseBtn.querySelector('.icon-pause');
            if (pi && pa) {
                pi.style.display = paused ? 'block' : 'none';
                pa.style.display = paused ? 'none' : 'block';
            }
            playPauseBtn.setAttribute('aria-label', paused ? 'Play carousel' : 'Pause carousel');
        }

        if (playPauseBtn && !playPauseBtn.dataset.init) {
            playPauseBtn.addEventListener('click', function () {
                paused = !paused;
                updateBtn();
                if (!paused) scheduleAutoplay();
            });
            playPauseBtn.dataset.init = '1';
        }
        updateBtn();

        // ─── PREV / NEXT ─────────────────────────────────────
        if (prevBtn && !prevBtn.dataset.init) {
            prevBtn.addEventListener('click', stepPrev);
            prevBtn.dataset.init = '1';
        }
        if (nextBtn && !nextBtn.dataset.init) {
            nextBtn.addEventListener('click', stepNext);
            nextBtn.dataset.init = '1';
        }

        // ─── HOVER ───────────────────────────────────────────
        track.addEventListener('mouseenter', function () {
            hoverPaused = true;
            cancelAutoplay();
        }, { passive: true });

        track.addEventListener('mouseleave', function () {
            hoverPaused = false;
            if (mode === 'IDLE') scheduleAutoplay();
        }, { passive: true });

        // ─── DRAG ────────────────────────────────────────────
        track.addEventListener('mousedown', function (e) {
            if (e.target.closest('a, button')) return;
            if (mode !== 'IDLE') return;
            mode = 'DRAGGING';
            dragActive = true;
            dragStartX = e.pageX;
            dragStartPos = pos;
            track.style.cursor = 'grabbing';
            cancelAutoplay();
            e.preventDefault();
        });

        window.addEventListener('mouseup', function () {
            if (!dragActive) return;
            dragActive = false;
            mode = 'IDLE';
            track.style.cursor = 'grab';
            snapToNearest(pos);
        });

        window.addEventListener('mousemove', function (e) {
            if (!dragActive) return;
            e.preventDefault();
            pos = dragStartPos + (e.pageX - dragStartX);
            applyPos();
        });

        // ─── TOUCH ───────────────────────────────────────────
        track.addEventListener('touchstart', function (e) {
            if (mode !== 'IDLE') return;
            mode = 'DRAGGING';
            dragActive = true;
            touchStartX = e.touches[0].pageX;
            touchStartPos = pos;
            touchStartTime = Date.now();
            cancelAutoplay();
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            if (!dragActive) return;
            pos = touchStartPos + (e.touches[0].pageX - touchStartX);
            applyPos();
        }, { passive: true });

        track.addEventListener('touchend', function () {
            if (!dragActive) return;
            dragActive = false;
            var dx = pos - touchStartPos;
            var dt = Date.now() - touchStartTime;

            if (dt < 300 && Math.abs(dx) > 30) {
                // Momentum: snap to nearest card in swipe direction
                var velocity = dx / dt;
                var momentumOffset = velocity * 250;
                momentumOffset = Math.max(-stepPx * 2, Math.min(stepPx * 2, momentumOffset));
                var target = snapToCard(pos + momentumOffset);
                mode = 'ANIMATING';
                stepFrom = pos;
                stepTo = target;
                stepStart = performance.now();
                cancelAutoplay();
            } else {
                mode = 'IDLE';
                snapToNearest(pos);
            }
        }, { passive: true });

        // ─── WHEEL ───────────────────────────────────────────
        track.addEventListener('wheel', function (e) {
            var dx = e.deltaX;
            var dy = e.deltaY;
            if (Math.abs(dx) <= Math.abs(dy) * 1.5) return;

            var now = Date.now();
            if (now - lastWheel < WHEEL_DEBOUNCE) return;
            lastWheel = now;

            e.preventDefault();
            e.stopPropagation();
            if (dx > 0) stepNext(); else stepPrev();
        }, { passive: false });

        // ─── KEYBOARD ────────────────────────────────────────
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); stepNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPrev(); }
        });

        // ─── FOCUS ───────────────────────────────────────────
        track.addEventListener('focusin', function () {
            hoverPaused = true;
            cancelAutoplay();
        });
        track.addEventListener('focusout', function () {
            hoverPaused = false;
            if (mode === 'IDLE') scheduleAutoplay();
        });

        // ─── REDUCED MOTION ──────────────────────────────────
        if (reducedMotion.matches) { paused = true; updateBtn(); }
        reducedMotion.addEventListener('change', function (e) {
            paused = e.matches;
            updateBtn();
        });
    }

    window.LatestCarousel = { init: initCarousel };
})();
