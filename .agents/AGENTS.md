# Project Rules & Guidelines — Chatura Indonesia

## 1. Modular CSS Isolation Standard
- **Dedicated Page Stylesheets**: Every modular page MUST have its own dedicated stylesheet inside `assets/css/pages/<page_name>.css` (e.g., `assets/css/pages/about.css`, `assets/css/pages/services.css`, `assets/css/pages/industries.css`, `assets/css/pages/insights.css`).
- **No Cross-Page CSS Dependencies**: Modular pages must NOT load CSS stylesheets from other pages (e.g. `insights.html` must not rely on `services.css` or `industries.css`). All shared global tokens reside in `assets/design-system.css` and `assets/css/component-skeleton.css`, while page-specific and component-specific styles reside in `assets/css/pages/<page_name>.css`.
- **No Inline Style Blocks**: Page templates must link external stylesheet files (`<link rel="stylesheet" href="assets/css/pages/<page_name>.css">`) rather than having embedded `<style>` blocks in the `<head>` or body.

## 2. i18n Translation & Renderer Integrity
- **Dynamic Translation Lookup**: Renderer helper functions (`loc()` and `t()`) must dynamically evaluate `window.TranslationRepository` at runtime rather than binding static references at script load time.
- **String Key Translation**: `loc(obj)` must check and translate string keys (e.g., `people.p6_name`, `insight.read_cta`) via `TranslationRepository.t(key)` instead of returning raw key strings.
- **Modal Self-Containment**: Modal HTML components MUST include default hidden classes (`opacity-0 pointer-events-none`) on their top-level container element to prevent visual flash on page load/refresh.
- **Modal & Widget Component Slots**: Component slots for modals, popups, and floating widgets (`[data-component*="modal"]`, `[data-component*="widget"]`, `[data-component*="popup"]`) MUST suppress skeleton pulse animations and layout height (`background: transparent !important; animation: none !important; height: 0 !important;`) while un-loaded to eliminate visual flashing on page refresh.

## 3. Enterprise CTA Micro-Interaction Standard
- **BCG/McKinsey Looping Arrow Transition**: All CTA links and buttons with arrow icons MUST utilize the 3-step arrow re-arrangement transition on hover:
  1. **Keadaan Normal**: `| Teks -> |` (Text on left, Right Arrow on right).
  2. **Transisi Hover**: `| > Teks - |` (Right Arrow exits right `translateX(24px)`, Left Arrow `::before` enters from left edge, Text pushes right `translateX(20px)`).
  3. **Resting Hover**: `| -> Teks |` (Left Arrow sits on left, Text sits on right).
  4. **Vertical Alignment**: Incoming Left Arrow (`::before`) MUST be bound to `.cta-text` using `top: 50%; transform: translateY(-50%)` to ensure 100% optical vertical centering with text characters regardless of parent top/bottom padding (`pt-2`, `py-3`, etc.).

