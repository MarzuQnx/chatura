# Project Report – Chatura Indonesia Website

## 1. Project Overview
- **Name**: Chatura Indonesia – Corporate Strategic Partner Website
- **Purpose**: Public‑facing corporate site showcasing accounting, tax, advisory, and risk‑management services.
- **Delivery**: Fully static HTML/CSS/JS site hosted on a CDN (CNAME points to `chatura.marzuqnx.com`).
- **Current Tech Stack**
  - HTML5 (static pages, no server‑side rendering)
  - Tailwind CSS v4 via CDN (no build step)
  - Vanilla JavaScript (ES5/ES6 mix, no modules/bundler)
  - GSAP 3.12.5 (animations & scroll‑trigger)
  - Lucide Icons 0.344.0
  - Google Fonts – Inter (sans) + Playfair Display (serif)
  - Development‑only `sharp` for image conversion (Node.js dev dependency)

## 2. Directory Structure (Top‑Level)
```
html/
├─ index.html                     # Home / About Us
├─ services.html                  # Executive Overview (5 services)
├─ industries.html                # Industry expertise hub
├─ insights.html                  # Publications & articles hub
├─ insight-detail.html            # Single article reader
├─ our-people.html                # Team profiles
├─ career.html                    # Job listings & culture
├─ contact-us.html                # Contact form + FAQ
├─ business-transfer.html         # M&A platform landing
├─ case-studies.html              # Transaction case studies
├─ access-portal.html             # Buyer login portal (restricted area)
├─ privacy.html, terms.html, cookies.html, disclaimer.html, code-of-conduct.html, sitemap.html
├─ assets/                        # Images, design‑system.css, i18n bundles, JS core & renderers
│   ├─ design-system.css          # Global Tailwind overrides + custom utilities
│   ├─ i18n/                      # Locale bundles (`en.bundle.js`, `id.bundle.js`)
│   └─ js/
│       ├─ core/                 # Repository, EventBus, TranslationRepository, PageLoader, Config
│       └─ renderers/            # One renderer per page (ArticleRenderer, ContactRenderer, …)
├─ update_*.js                    # One‑off migration scripts (e.g., update_contact.js)
├─ create_repos.js, migrate.js    # Project bootstrap / data migration utilities
├─ temp_articles.js               # Historic script for bulk article generation (no longer used)
├─ package.json & package‑lock.json (dev only – for `sharp` & npm scripts)
├─ .git/ & .gitignore            # Version control (not required for production deployment)
├─ .htaccess, CNAME               # Server/hosting configuration
└─ GUIDELINES.md                 # Internal contribution guidelines
```

## 3. Core Architecture & Code Organization
| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Data Repository** | `assets/js/core/Repository.js` | Simple in‑memory repository base class (CRUD helpers) used by all domain‑specific repos (ArticleRepository, CategoryRepository, etc.). |
| **Event Bus** | `assets/js/core/EventBus.js` | Decoupled pub/sub for cross‑module communication (e.g., `languageChange` events). |
| **Internationalisation** | `assets/js/core/TranslationRepository.js` | Loads locale bundles from `window.__CHATURA_LOCALES`, provides `t`, `tp`, `setLanguage`, `getCurrentLanguage`, fallback logic, and emits `languageChange`. |
| **Page Initialization** | `assets/js/core/PageLoader.js` | On DOM ready: determines current language, applies translations to all `[data-i18n]` elements, updates language selectors, and registers a listener for future language switches. |
| **Renderers** | `assets/js/renderers/*.js` | Page‑specific modules that bind UI events, generate dynamic content (e.g., FAQ accordion, contact‑form submission, article grids) and invoke the repository APIs. |
| **Configuration** | `assets/js/core/Config.js` | Global constants (supported languages, storage key, default language, etc.). |
| **Static Assets** | CSS, images, icon fonts, i18n bundles | Visual styling, responsive design, and localized strings. |

### Language Switch Flow (Current Implementation)
1. User clicks a language link (`data-lang="en"` / `data-lang="id"`).
2. `ContactRenderer` (or any renderer) calls `Repo.setLanguage(newLang)`.
3. `TranslationRepository.setLanguage` stores the choice in `localStorage` and emits `languageChange` via the global `Bus`.
4. `PageLoader` listens for `languageChange`, then:
   - Calls `updateLangSelector` to toggle `.lang‑active` / `.lang‑inactive` classes.
   - Calls `applyTranslations` which iterates over every element with `[data-i18n]` (or placeholder / title) and swaps text based on the current bundle.
5. A custom `langChange` event is also dispatched for any downstream listeners.

## 4. Issues & Bugs Identified (Language Switch & General)
| # | Symptom | Root Cause (observed) | Impact |
|---|---------|----------------------|--------|
| 1 | Text does not update after language change on pages where content is injected by a renderer. | `PageLoader.applyTranslations()` runs **once** before the renderer adds its DOM nodes. Subsequent language changes never re‑translate those nodes. | Stale language on dynamic sections (e.g., FAQ, article cards). |
| 2 | Language selector UI remains on the old language in the mobile navigation. | `updateLangSelector` only targets hard‑coded IDs `#lang-selector` and `#lang-selector-mobile`. Mobile menu uses a duplicated selector with a different ID in some pages. | Confusing UI – both languages appear active. |
| 3 | Some elements show raw keys like `nav.lets_talk` instead of the localized string. | Inconsistent key naming between HTML (`nav.lets_talk`) and locale bundles (`nav.letsTalk`). Missing key causes fallback to the key itself. | Untranslated UI text. |
| 4 | `<html lang>` attribute stays `en` even after switching to Indonesian. | The attribute is only changed via JavaScript (`document.documentElement.lang`). Search engines / screen readers read the static attribute before JS runs. | SEO & accessibility mismatch. |
| 5 | Duplicate script loading order on `contact-us.html` – `TranslationRepository.js` is loaded **after** `ContactRenderer.js`. | `ContactRenderer` may call `Repo.setLanguage` before the repository is defined, leading to `ReferenceError`. | Console errors, broken language switch on the Contact page. |
| 6 | Rapid clicks on language links cause multiple full DOM walks, leading to noticeable jank on low‑end devices. | No debounce/throttle on the click handler. |
| 7 | Dynamically injected content (e.g., career cards, service tiles) does not get translated after a language change. | No public API to re‑apply translations; renderers do not call `PageLoader.applyTranslations()` after DOM updates. |
| 8 | Some locale keys are `null` or empty strings, bypassing fallback logic. | `translate()` treats falsy values as valid, returning an empty string instead of falling back to the default language. |
| 9 | Accessibility: language links lack ARIA attributes (`role="menuitem"`, `aria-selected`). | Plain anchors only. |
|10| Unnecessary `data‑i18n‑placeholder` on elements that never use placeholders. | Redundant markup. |

## 5. Un‑needed / Redundant Files
| File / Directory | Reason for Removal | Suggested Action |
|------------------|-------------------|-----------------|
| `node_modules/` | Dev‑only dependencies (`sharp`); not required for static site deployment. | Delete before production packaging. |
| `package.json` & `package-lock.json` | Only used for the `sharp` dev tool; the site does not use npm at runtime. | Keep in repo for development but exclude from the static release bundle. |
| `sharp` dev dependency | Used solely for image conversion during build. | Remove if image assets are already final WebP/PNG. |
| `create_repos.js`, `migrate.js`, `temp_articles.js` | One‑off scripts for initial data seeding and migration. | Archive or delete after data is baked into static HTML. |
| All `update_*.js` scripts (e.g., `update_contact.js`, `update_index.js`, `update_services.js`, etc.) | They perform bulk find‑and‑replace on HTML files for a previous refactor. No longer needed at runtime. | Remove from production; keep a copy in a `tools/` folder if future migrations are expected. |
| `.git/`, `.gitignore` | Version‑control metadata not required on the hosting server. | Exclude from deployment. |
| `.kilo/` (unknown purpose) | No reference in the codebase. |
| Redundant favicon sizes (multiple PNG variants) | Modern browsers accept a single SVG or a limited set of favicons. | Keep only essential sizes (`32x32`, `16x16`, `180x180`) or switch to an SVG favicon. |
| `GUIDELINES.md` | Internal design guidelines; not needed for end‑user deployment. |
| `LICENSE` | Legal file – keep in repo but not part of the deployed static bundle. |
| `CNAME` | Required for DNS mapping; keep if using custom domain, otherwise optional. |
| `.htaccess` | Depends on hosting environment (e.g., Apache). If the site is served from a static CDN (Netlify, Vercel), this file is unnecessary. |
| `README.md` (old content) | Will be overwritten with the comprehensive report. |

## 6. Recommendations & Action Plan
1. **Refactor Language Switch**
   - Expose a public `TranslationRepository.refresh()` that renderers call after they inject new DOM nodes.
   - Consolidate selector UI logic into a single `LanguageUI` module that scans for any element with a `data-lang-selector` attribute, removing hard‑coded IDs.
   - Add a debounce (300 ms) to language click handlers.
   - Ensure `TranslationRepository.setLanguage` is called **only** after the repository script has loaded.
   - Update `<html lang>` attribute early (inline script in `<head>` before any content) so crawlers see the correct language.
   - Normalize all `data-i18n` keys; run a lint script to detect mismatches.
2. **Cleanup Repository**
   - Delete all one‑off `update_*.js`, `create_repos.js`, `migrate.js`, and `temp_articles.js` from the production bundle.
   - Remove `node_modules` and `package.json` from the deploy artifact; keep them locally for development only.
   - Consolidate favicons – either generate an SVG favicon or keep a minimal set of PNGs.
3. **Accessibility Improvements**
   - Add `role="menuitem"` and `aria-selected` to language links.
   - Ensure all interactive elements have focus styles.
4. **Documentation Update**
   - Replace the current `README.md` with this comprehensive report (the file will now serve as a project status snapshot for management). Include a short “How to build / run locally” section if needed.
5. **Build / Deploy Process**
   - Create a simple npm script (or Makefile) that runs `sharp` once to generate optimized images, then copies the `html/` folder (excluding `.git`, `node_modules`, `update_*.js`, etc.) to the deployment target.
   - Consider adding a CI step that validates that every `data-i18n` key exists in both `en` and `id` bundles.

## 7. Quick “How to Run Locally” (for developers)
```bash
# Clone repo
git clone <repo-url>
cd CHATURA/html
# Install dev dependencies (only for image conversion)
npm install
# Generate WebP assets (optional)
npx sharp-cli ./assets/images/* --out-dir ./assets/images/webp
# Open a local server (e.g., Python SimpleHTTPServer or Live Server extension)
python -m http.server 8000
# Visit http://localhost:8000 in the browser
```
*Note*: After cleanup, the only required step will be to serve the static `html/` folder.

---
*Generated by Antigravity – automated project audit.*
