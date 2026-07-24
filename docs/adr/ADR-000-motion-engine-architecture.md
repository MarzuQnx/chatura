# ADR-000: Motion Engine Architecture Specification

- **Status**: Accepted
- **Date**: 2026-07-23
- **Author**: Principal Frontend Software Architect
- **Scope**: Core UI Infrastructure & Animation System Architecture

---

## 1. Context & Problem Statement

The application requires consistent, scalable, accessible, dynamic UI motion across all pages without degrading performance, breaking responsive layouts, or introducing unmaintainable, inline GSAP page-level scripts. 

Prior to this specification, animations risked becoming scattered across page scripts, causing code duplication, property collisions, race conditions, observer duplication, accessibility issues for users preferring reduced motion, and fragile tight-coupling to third-party animation libraries like GSAP.

To prevent architectural entropy, the **Motion Engine** is established as permanent **Core Infrastructure** (on par with the Translation Engine, Repository Layer, Page Loader, and Event Bus).

---

## 2. Decision & Architecture Specification

We adopt the **Motion Engine Architecture Framework** designed as a framework-agnostic, decoupled, preset-driven, and token-governed engine stored permanently in `assets/js/motion/`.

### 2.1 Decoupled Architectural Flow

The architecture explicitly separates responsibilities into discrete, single-purpose layers. The Motion Engine **never** interacts directly with third-party libraries (e.g., GSAP, Three.js); all animation execution is delegated to Renderer Adapters.

```text
  +-------------------------------------------------------------+
  |                        Motion Engine                        |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                       Motion Observer                       |
  |     (Unified IntersectionObserver / ScrollTrigger Hub)      |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                      Motion Scheduler                       |
  |           (rAF Queue & Stagger Timeline Coordinator)        |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                       Motion Registry                       |
  |    (Preset, Theme, Adapter Storage & Property Collision)     |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                       Motion Composer                       |
  |      (Execution Order Resolution & Conflict Guard)          |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                       Renderer Adapter                      |
  |           (GSAPAdapter / CSSAdapter / ThreeAdapter)         |
  +-------------------------------------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |                   Third-Party Rendering API                 |
  |             (GSAP / Web Animations API / Three.js)          |
  +-------------------------------------------------------------+
```

---

## 3. Directory & Folder Structure

All Motion Engine code resides in `assets/js/motion/`:

```text
assets/js/motion/
├── core/
│   ├── MotionEngine.js          # Main facade exposing Minimum Public API
│   ├── MotionObserver.js        # Single observer instance manager
│   ├── MotionRegistry.js        # Registration & collision enforcement engine
│   ├── MotionScheduler.js       # RAF queue & timeline coordinator
│   ├── MotionComposer.js        # Layer execution & property composition solver
│   └── MotionState.js           # Lifecycle state machine
├── tokens/
│   ├── MotionTokens.js          # Design system motion tokens & responsive resolver
│   ├── MotionConfig.js          # Default engine settings
│   └── BrandOverride.js        # Chatura & project-specific token overrides
├── accessibility/
│   ├── ReducedMotion.js        # prefers-reduced-motion handler
│   └── FocusMotion.js          # Focus state transition guard
├── adapters/
│   ├── GSAPAdapter.js           # GSAP rendering driver
│   └── CSSAdapter.js            # Web Animations API / CSS fallback driver
├── presets/
│   ├── hero-reveal.js
│   ├── reveal-up.js
│   ├── reveal-left.js
│   ├── reveal-right.js
│   ├── slide-up.js
│   ├── slide-left.js
│   ├── floating-soft.js
│   ├── floating-medium.js
│   ├── floating-heavy.js
│   ├── parallax.js
│   ├── counter.js
│   ├── marquee.js
│   ├── image-composition.js
│   ├── navbar.js
│   └── modal.js
├── themes/
│   ├── glass-card.js
│   ├── glass-navbar.js
│   ├── glass-modal.js
│   ├── shadow-soft.js
│   ├── shadow-heavy.js
│   ├── elevation-low.js
│   └── elevation-high.js
├── debug/
│   ├── MotionInspector.js      # Console diagnostics
│   └── MotionOverlay.js        # ?motion-debug=1 visual UI overlay
└── index.js                    # Unified ES module entrypoint
```

---

## 4. Core Module Responsibilities

1. **`MotionEngine`**: Public facade controlling engine lifecycle, registration, element binding, and playback API.
2. **`MotionObserver`**: Centralized IntersectionObserver/ScrollTrigger manager. Eliminates duplicate scroll listeners.
3. **`MotionRegistry`**: Store for Presets, Themes, and Adapters. Performs mandatory property ownership validation during registration.
4. **`MotionScheduler`**: Manages execution batching using `requestAnimationFrame`, timeline staggering, and task queuing.
5. **`MotionComposer`**: Enforces execution order: `Reveal` -> `Theme` -> `Hover` -> `Floating`. Prevents CSS property collisions.
6. **`MotionState`**: Lifecycle state machine maintaining per-element state (`idle`, `prepared`, `playing`, `completed`, `destroyed`, `paused`).

---

## 5. Public API Specification

The public API is strictly frozen. The engine exposes the exact following signatures:

```javascript
/**
 * Motion Engine Minimum Public API Contract
 */
MotionEngine.init(config = {})
MotionEngine.registerPreset(name, definition)
MotionEngine.registerTheme(name, definition)
MotionEngine.registerAdapter(name, adapter)
MotionEngine.play(element, presetName, options = {})
MotionEngine.pause(element)
MotionEngine.resume(element)
MotionEngine.restart(element)
MotionEngine.destroy(elementOrScope = document)
MotionEngine.getState(element)
```

---

## 6. Lifecycle & State Machine

Every element registered with the Motion Engine follows a deterministic state lifecycle:

```text
 [ idle ] ──> [ prepared ] ──> [ playing ] ──> [ completed ]
   ^                 |             |                |
   |                 v             v                v
   +--------------------+── [ paused ] ──────> [ destroyed ]
```

- **`idle`**: Registered in DOM, unobserved or awaiting scroll trigger.
- **`prepared`**: Target visible or triggered; initial styles/tokens applied, adapter initialized.
- **`playing`**: Active tween/timeline playing.
- **`completed`**: Motion finished; final state persisted or reset depending on preset cleanup policy.
- **`paused`**: Playback temporarily paused via API.
- **`destroyed`**: Observers unlinked, timelines killed, inline style overrides cleaned up.

---

## 7. Registration Flows (Presets, Themes, Adapters)

### 7.1 Preset Registration Flow
1. Developer invokes `MotionEngine.registerPreset(name, definition)`.
2. Registry validates structure: `name`, `targetLayer`, `properties` array, `defaults`, `compile(element, tokens, adapter)`.
3. Registry validates property ownership: verifies no registered preset claims any property in `properties` for the target layer.
4. Registration stored; becomes immediately available for HTML attributes (`data-motion="preset-name"`).

### 7.2 Theme Registration Flow
1. Developers register visual style presets via `MotionEngine.registerTheme(name, definition)`.
2. Themes must control visual style properties (e.g. `backdrop-filter`, `box-shadow`, `border-color`) and **never** movement properties (`translate`, `opacity`, `rotate`).

### 7.3 Adapter Flow
1. Adapters implement a standard contract: `{ name, isSupported(), animate(target, keyframes, options), pause(target), resume(target), destroy(target) }`.
2. `GSAPAdapter` registers as primary if `window.gsap` is present; `CSSAdapter` registers as universal fallback.

---

## 8. Property Ownership & Registration Enforcement

To prevent competing styles or layout trashing, **each CSS property on an element layer must have exactly ONE owner preset**:

| Property | Owning Category | Allowed Presets |
| :--- | :--- | :--- |
| `opacity` | Reveal | `reveal-up`, `hero-reveal`, `slide-up` |
| `transform: translate` | Position / Reveal | `reveal-up`, `slide-left`, `parallax` |
| `transform: rotate` | Oscillation | `floating-soft`, `floating-heavy` |
| `transform: scale` | Hover / Focus | `hover-card`, `button-press` |
| `box-shadow` | Theme | `glass-card`, `shadow-heavy` |
| `backdrop-filter` | Glass Theme | `glass-navbar`, `glass-modal` |

**Registration-Time Property Ownership Enforcement**:
When `registerPreset` or `registerTheme` is invoked, `MotionRegistry` iterates through the declared `properties` array. If another preset targeting the same element layer has already registered any overlapping property, registration throws a hard runtime error in development:
`[MotionEngine] Property Ownership Collision: Property 'opacity' already claimed by preset 'reveal-up'.`

---

## 9. Failure Mode Matrix

| Failure Mode | Detection | Fallback Behavior | Dev Log Policy | Prod Log Policy | Content Visibility Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Preset Not Found** | Unregistered `data-motion` value | Render element immediately at opacity 1 / translate 0 | Console Error with suggestions | Silent fallback to visible state | **100% Visible** (No hiding) |
| **Adapter Load Failure** (GSAP CDN down) | `GSAPAdapter.isSupported()` returns false | Automatically switch to `CSSAdapter` | Console Warning | Silent fallback | **100% Visible** |
| **Missing Brand Token** | `MotionTokens.resolve()` receives unknown token | Fall back to Base Default Token (`duration: 400ms`, `ease: ease-out`) | Console Warning | Silent default | **100% Visible** |
| **Property Collision** | Dual presets target same CSS property | `MotionComposer` prioritizes primary preset; drops colliding property | Console Error | Silent drop of secondary property | **100% Visible** |
| **DOM Element Removed Mid-Anim** | MutationObserver / null target check | Immediate trigger `destroy(element)` to release memory | Console Info | Silent cleanup | N/A (Element removed) |
| **Reduced-Motion Toggled Mid-Playback** | `matchMedia` listener change event | Instantly finish or jump to final state; disable active loops | Console Info | Silent adaptation | **100% Visible** |

---

## 10. Legacy Coexistence & Migration Strategy

Existing projects containing direct GSAP or custom JS scroll animations can migrate section-by-section without full rewrites:

1. **Marking Strategy**:
   - Legacy elements retain existing classes/scripts and are tagged with `data-motion-legacy="true"`.
   - Migrated elements use `data-motion="reveal-up"` and are tagged with `data-motion-migrated="true"`.
2. **Side-by-Side Coexistence**:
   - `MotionObserver` ignores elements carrying `data-motion-legacy="true"`, preventing double-triggering or ScrollTrigger collisions.
3. **Incremental Migration Workflow**:
   - Step 1: Initialize `MotionEngine.init()` globally.
   - Step 2: Convert page sections one by one by replacing inline GSAP timelines with `data-motion="[preset]"` attributes.
   - Step 3: Remove legacy page script when all section elements carry `data-motion-migrated="true"`.

---

## 11. Governance & Developer Rules

### Strict Bans
- ❌ **NEVER** write GSAP timelines directly inside HTML/page JS files.
- ❌ **NEVER** create page-specific inline reveal scripts.
- ❌ **NEVER** hardcode animation duration, easing, or pixel offsets in page code.
- ❌ **NEVER** modify or bypass `assets/js/motion/core/` without an approved ADR.

### Mandatory Rules
- ✔ **ALWAYS** use `data-motion="preset-name"` attributes or `MotionEngine.play()`.
- ✔ **ALWAYS** reference motion tokens from `MotionTokens.js`.
- ✔ **ALWAYS** register reusable presets inside `assets/js/motion/presets/`.

---

## 12. Non-Goals

The Motion Engine is explicitly **NOT**:
- A global application state management system.
- A client-side router or page transition framework.
- A general-purpose DOM manipulation utility.
- Responsible for copywriting, typography, or non-motion UI logic.

---

## 13. Maintenance & Testing Strategy

- **Semantic Versioning**: Motion Engine follows independent semantic versioning (`v1.0.0`).
- **Unit Testing**: Token resolution and property collision detection are implemented as pure JavaScript functions, testable in headless Node environments without DOM dependencies.
- **Manual QA Checklist**: Verified using `?motion-debug=1` parameter across Chrome, Safari, Firefox, iOS, Android, and with `prefers-reduced-motion` enabled.

---

## 14. ADR Process

Any change to the core Motion Engine architecture (modules in `assets/js/motion/core/`) requires:
1. Creating a numbered ADR document in `/docs/adr/ADR-XXX-[title].md`.
2. Documenting Context, Decision, Alternatives, Consequences, and Status.
3. Obtaining approval before implementing changes.

---

## 15. Alternatives Considered

1. **Direct Page-Level GSAP Timelines**: Rejected due to high code churn, duplicate ScrollTriggers, missing reduced-motion fallbacks, and maintenance debt.
2. **CSS-Only Class Toggles**: Rejected due to limited timeline orchestration, weak staggering capabilities, and lack of dynamic responsive token resolution.

---

## 16. Decision Outcome

**Accepted**. The Motion Engine architecture is established as founding infrastructure under ADR-000. All UI motion must follow this specification.
