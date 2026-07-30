# Cross-Browser Compatibility

Target: Chrome, Firefox, Edge — modern versions (last 2 years).

---

## Known Issues & Fixes

### 1. 3D Flip Card (`.svc-flip-inner`)

**Problem:** Firefox rendered front-face text reversed + green back not showing.
**Root cause:** `will-change: transform` on `preserve-3d` element breaks 3D context in Firefox.
**Fix:** Removed `will-change`. Added `translateZ(0)` to front/back faces to force GPU layers.

| File | Lines |
|------|-------|
| `assets/css/pages/about.css` | 448, 450, 473, 540 |

### 2. `filter: blur()` inside `overflow: hidden`

**Problem:** Firefox clips blur gradient at parent border-radius, creating hard edges.
**Fix:** Extend blurred element beyond parent with negative inset `inset: -15px`.

| File | Lines | Fix |
|------|-------|-----|
| `assets/css/pages/about.css` | 489 | `.svc-front-img { inset: -15px }` |
| `access-portal.html` | 134 | Removed `overflow: hidden` from `.portal-bg-layer` |

### 3. `outline` + `border-radius` (Firefox)

**Problem:** Firefox doesn't clip `outline` to `border-radius` — focus ring appears square.
**Fix:** Replaced `outline: 2px solid` + `outline-offset` with `box-shadow: 0 0 0 3px`.

| File | Lines |
|------|-------|
| `assets/css/pages/about.css` | 656-659 |

### 4. Missing `-webkit-backdrop-filter`

**Problem:** Safari / older Chrome don't get glass blur effect.
**Fix:** Added `-webkit-backdrop-filter` alongside `backdrop-filter`.

| File | Lines |
|------|-------|
| `assets/css/pages/about.css` | 358-359 |

### 5. Missing `-moz-text-size-adjust`

**Problem:** Firefox mobile landscape may auto-inflate text.
**Fix:** Added `-moz-text-size-adjust: 100%`.

| File | Lines |
|------|-------|
| `assets/design-system.css` | 81-82 |

### 6. Missing vendor prefixes for `user-select`

**Problem:** Older Safari/Firefox ignores unprefixed `user-select`.
**Fix:** Added `-webkit-user-select` and `-moz-user-select`.

| File | Lines |
|------|-------|
| `case-studies.html` | 80-82 |

---

## `will-change` Budget

Firefox warns when `will-change` exceeds document surface × 3 (~1.3M px). Original code had 38 occurrences — reduced to 13 (66% reduction). Remaining `will-change` only on actively animating elements (infinite float/shadow/spin animations, slideshow, 3D flip, marquee, particle layers). Hover effects and broad selectors rely on browser auto-promotion.

---

## Known Unresolved

- **`mix-blend-mode: overlay`** in `access-portal.html:194` — Firefox renders overlay blend differently. Only affects noise texture layer. Acceptable visual difference.
- **Tailwind CDN `@tailwindcss/browser@4`** — Requires modern browser with ES module support. No fallback for IE11. See compatibility report for resolution options.
- **`100dvh`** in `design-system.css` — Fallback `100vh` covers older browsers. Address bar overlap on mobile is minor.
