CHATURA INDONESIA
Corporate Strategic Partner Website
Static HTML/CSS/JS — Bilingual (EN/ID)
Domain: chatura.co.id (CNAME: chatura.marzuqnx.com)

========================================================
1. PROJECT OVERVIEW
========================================================

Chatura Indonesia is a corporate consulting firm website providing
accounting, tax, business advisory, and risk management services.
The site is a static HTML website with no backend, no build system,
and no framework. Pure HTML + Tailwind CSS (CDN) + vanilla JavaScript.

Production URL: https://www.chatura.co.id
Local dev: http://chatura.local (Laragon Apache)

Tech Stack:
  - HTML5 (static pages, no server-side rendering)
  - Tailwind CSS v4 via CDN browser script
  - Vanilla JavaScript (ES5/ES6 mix, no modules/bundler)
  - GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin + Observer
  - Lucide Icons 0.344.0
  - Google Fonts: Inter (sans) + Playfair Display (serif)
  - Sharp 0.35.3 (dev dependency only, for image optimization)

Dev Dependencies:
  - sharp: image format conversion (PNG to WebP)

========================================================
2. DIRECTORY STRUCTURE
========================================================

html/
  index.html                    Home / About Us
  services.html                 Executive Overview (5 services editorial)
  industries.html               Industry expertise hub
  insights.html                 Publications and articles hub
  insight-detail.html           Single article reader
  our-people.html               Team profiles and expertise
  career.html                   Job listings and culture
  contact-us.html               Contact form and FAQ
  business-transfer.html        M&A platform landing
  case-studies.html             Transaction case studies
  access-portal.html            Buyer login portal
  privacy.html                  Privacy policy
  terms.html                    Terms of use
  cookies.html                  Cookie policy
  disclaimer.html               Legal disclaimer
  code-of-conduct.html          Code of conduct
  sitemap.html                  Visual sitemap

  services/
    accounting-finance/index.html
    tax-services/index.html
    business-transfer/index.html
    risk-management/index.html
    corporate-advisory/index.html

  industries/
    energy/index.html
    healthcare/index.html
    manufacturing/index.html
    technology/index.html
    consumer/index.html

  assets/
    design-system.css           Unified CSS design system (762 lines)
    i18n/                       Internationalization system
    js/                         JavaScript modules and data
    *.webp / *.png / *.jpg      Images (hero, logos, backgrounds)
    about-vid.mp4               About section video

  component/                    Standalone component demos (gitignored)
  .htaccess                     Root Apache config
  assets/.htaccess              Assets directory Apache config
  site.webmanifest              PWA manifest
  CNAME                         GitHub Pages custom domain
  GUIDELINES.md                 Implementation guidelines (325 lines)
  package.json                  Only devDep: sharp

========================================================
3. INTERNATIONALIZATION (i18n) ARCHITECTURE
========================================================

3.1 Current System

Modular, namespace-based translation system with synchronous loading.
Supports EN and ID. Future-ready for JP, CN, AR without code changes.

3.2 Script Load Order (every page)

  <script src="assets/i18n/config.js"></script>
  <script src="assets/js/core/EventBus.js"></script>
  <script src="assets/js/core/Repository.js"></script>
  <script src="assets/js/core/TranslationRepository.js"></script>
  <script src="assets/js/core/PageLoader.js"></script>
  <script src="assets/i18n/locales/en.bundle.js"></script>
  <script src="assets/i18n/locales/id.bundle.js"></script>
  <script src="assets/i18n/loader.js"></script>

Sub-pages use ../../ prefix for same structure.

3.3 Core Modules

  config.js
    Supported languages array
    Default language (en)
    localStorage key
    Locale base path (auto-detected from script src)
    Shared namespaces: [common, navigation, footer]
    Page namespace mapping: which page loads which namespace

  EventBus.js
    Lightweight pub/sub decoupling modules
    API: on(event, cb), emit(event, data), once(event, cb)
    Events: languageChange

  TranslationRepository.js
    Reads from window.__CHATURA_LOCALES global
    API: t(key), tp(prefix, key), setLanguage(lang),
         getCurrentLanguage(), exists(key), getAllTranslations()
    Missing key returns key string as fallback
    Fallback chain: current language -> default language -> key

  PageLoader.js
    Applies translations to DOM via data-i18n attributes
    Handles data-i18n-placeholder and data-i18n-title
    Binds language selector click events
    Dispatches CustomEvent('langChange') for JS-driven components
    Updates document.documentElement.lang and document.title

  loader.js
    Entry point: exposes window.setLang(), window.getTranslations(),
    window.t(key) for backward compatibility with inline scripts
    Initializes PageLoader on DOMContentLoaded

3.4 Locale File Structure

  assets/i18n/locales/
    en.bundle.js              All EN namespaces combined (73KB)
    id.bundle.js              All ID namespaces combined (75KB)
    en/                       Individual EN namespace files
      common.js               site.title, filter.*, wa.* (15 keys)
      navigation.js           nav.* (11 keys)
      footer.js               footer.* (41 keys)
      home.js                 index.*, hero.*, trust.*, about.*,
                              latest_updates.*, clients.*,
                              opportunities.* (77 keys)
      services.js             services.* (124 keys)
      industries.js           industries.*, ind_lp.* (175 keys)
      insights.js             insights.* (50 keys)
      people.js               people.* (115 keys)
      career.js               career.*, join.* (111 keys)
      contact.js              contact.* (65 keys)
      business-transfer.js    transfer.* (105 keys)
      portal.js               portal.* (26 keys)
      case-studies.js         casestudies.* (47 keys)
      insight-detail.js       insight.* (17 keys)
    id/                       Individual ID namespace files (same structure)

  Total: 979 keys per language, 14 namespaces

3.5 Translation Key Convention

  Flat dot-notation: "namespace.section.key"
  Example: "nav.about_us", "footer.service_1", "home.hero.title"

3.6 DOM Translation

  HTML attributes:
    data-i18n="key"              Text content replacement
    data-i18n-placeholder="key"  Placeholder attribute
    data-i18n-title="key"        Title attribute

  setText() preserves child elements, replaces only text nodes.

3.7 Language Switching

  User clicks EN/ID link in nav
  -> setLang(lang) called
  -> localStorage updated
  -> EventBus emits 'languageChange'
  -> PageLoader re-applies all DOM translations
  -> CustomEvent 'langChange' dispatched for inline scripts

3.8 Backward Compatibility

  window.getTranslations() returns merged translations object
  window.setLang(lang) switches language
  window.t(key) returns translation for key
  Inline scripts using these APIs continue working

3.9 Legacy System (archived)

  assets/i18n/archive/
    i18n.js          Old monolithic IIFE (132KB, inline bilingual data)
    en.json          Unused EN export (63KB)
    id.json          Unused ID export (63KB)

========================================================
4. JAVASCRIPT ARCHITECTURE
========================================================

4.1 Repository Pattern

  window.CHATURA                     Global namespace
    .ARTICLES[]                      Article data (bilingual)
    .AUTHORS{}                       Author profiles (bilingual)
    .CATEGORIES{}                    Article categories (bilingual)
    .SERVICES{}                      Service definitions (bilingual)
    .INDUSTRIES{}                    Industry definitions (bilingual)
    .SITE_URL                        Base URL constant
    .getArticleBySlug(slug)
    .getFeaturedArticle()
    .getAllArticles()
    .getArticlesByCategory(category)
    .getRelatedArticles(article, limit)
    .getAdjacentArticles(slug)
    .searchArticles(query)
    .getArticleUrl(article)

  window.ArticleRepository           Repository pattern wrapper
    .getAll(), .getBySlug(), .getFeatured()
    .getByCategory(), .getRelated(), .search()

  window.PeopleRepository            Authors data access
    .getAll(), .getById(), .getByPeopleId()

  window.ServiceRepository           Services data access
    .getAll(), .getByKey(), .getSlug()

  window.IndustryRepository          Industries data access
    .getAll(), .getByKey(), .getSlug()

  window.CategoryRepository          Categories data access
    .getAll(), .getByKey()

4.2 articles.js Architecture

  Single source of truth for all insight content (79.6KB).
  Featured articles, article grid, insight detail, related insights
  all reference this file.

  Data structures (all bilingual with {en, id} objects):
    AUTHORS{}           Person profiles with bio, expertise,
                        experience, publications
    CATEGORIES{}        Tax, Transfer, Risk, Industry, Advisory,
                        Publication, Update
    SERVICES{}          Accounting, Tax, Transfer, Risk, Advisory
                        with slugs
    INDUSTRIES{}        Manufacturing, Energy, Healthcare,
                        Technology, Consumer with slugs
    ARTICLES[]          12 articles total:
      - 5 flagship (full body HTML, exec summaries)
      - 7 supplementary (grid cards)

  Each article contains:
    slug, type, category, featured, image, author
    dates (published, display, updated)
    readingTime, title, subtitle, description
    execSummary {en: {summary, findings, impact, recommendations},
                 id: {...}}
    tags[], relatedServices[], relatedIndustries[]
    body {en: 'full HTML', id: 'full HTML'}

4.3 Page-Specific Inline Scripts

  services.html, industries.html, our-people.html:
    Define expert/person arrays with translation key references
    Call window.getTranslations() to resolve display text
    Re-render on langChange event

  index.html:
    Snap scroll engine (GSAP ScrollTrigger + Observer)
    Hero parallax, counter animation, carousel
    WhatsApp popup, about video toggle

  All pages:
    Lucide icon initialization
    GSAP reveal-up animations

========================================================
5. DESIGN SYSTEM
========================================================

5.1 CSS Architecture

  assets/design-system.css (762 lines)
    CSS custom properties (design tokens)
    Color system: brand green #004D34, emerald palette
    Typography: Playfair Display (headings), Inter (body)
    Spacing: 4px base unit scale
    Component styles: buttons, cards, modals, forms
    Animation classes: reveal-up, float, shimmer
    Responsive breakpoints: mobile-first

  Tailwind CSS v4 via CDN browser script
    Used for utility classes throughout HTML
    Combined with design-system.css for component styles

5.2 Color Tokens

  --color-brand-green: #004D34
  --color-emerald-300: #6ee7b7
  --color-text-body: #374151
  --color-text-muted: #6B7280
  --color-bg-white: #FFFFFF
  --color-bg-gray: #F9FAFB
  --color-border: #E5E7EB

5.3 Typography

  Headings: Playfair Display, serif
  Body: Inter, sans-serif
  Display XL: 3rem / Display LG: 2.5rem
  H1: 2rem / H2: 1.75rem / H3: 1.5rem
  Body: 1.0625rem / Caption: 0.875rem

========================================================
6. PAGE ARCHITECTURE
========================================================

6.1 Shared Components (every page)

  Navigation bar
    Desktop: logo, nav links, language selector (EN/ID), CTA button
    Mobile: hamburger menu with slide-down panel
    Sticky on scroll with blur backdrop
    Language selector: .lang-active / .lang-inactive classes

  Footer
    4-column layout: manifesto, services, industries, company
    Newsletter subscription
    Social links, legal links
    Copyright, privacy/terms/cookies/disclaimer/conduct links
    Legal disclaimer text

  WhatsApp widget
    Floating launcher button
    Popup with department selection
    Hours display

6.2 Page-Specific Structure

  Home (index.html)
    Snap scroll sections: hero, trust indicators, about,
    video, latest updates carousel, clients, opportunities,
    contact, CTA
    Hero: animated headline, two CTAs, scroll-down indicator
    Trust: counter animations (years, clients, industries, presence)
    About: editorial section with video
    Latest: horizontal carousel with infinite loop
    Clients: logo grid
    Opportunities: featured business listings with login CTA

  Services Overview (services.html)
    Hero, service philosophy
    5 editorial sections (alternating layout)
    Industry exposure, experts, insights, CTA

  Dedicated Service Pages (services/[slug]/)
    Breadcrumbs, hero, executive summary
    Business challenges (2x3 grid)
    Solution, core services (2x3 grid with icons)
    Workflow (5 steps), deliverables
    Industry applications, related insights
    Meet experts, FAQ (accordion), CTA

  Industries (industries.html)
    Hero, industry selector (tabbed)
    Overview, challenges, solutions
    Track record, insights, experts, CTA

  Industry Landing Pages (industries/[slug]/)
    Same template as dedicated service pages

  Insights (insights.html)
    Hero, featured insight
    Filter tabs (All/Articles/Publications/Client Updates)
    Search input, article cards grid
    Newsletter subscription

  Insight Detail (insight-detail.html)
    Hero with breadcrumb
    Author info, executive summary
    Full article body, tags, share
    Advisory desk CTA, related reading

  Our People (our-people.html)
    Hero, leadership grid
    Filter tabs (All/Leadership/Partners/Directors)
    Bio modals with expertise, experience, publications
    Industry expertise, standards, insights, CTA

  Career (career.html)
    Hero, statistics, culture section
    Values, testimonials, hiring process
    Benefits, pathways (internship + leaders program)
    Open positions, FAQ, application form

  Contact (contact-us.html)
    Hero, contact information with map
    Contact form (name, email, phone, service, details)
    FAQ accordion

  Business Transfer (business-transfer.html)
    Hero, ecosystem explanation (3 steps)
    Featured listings, buyer database CTA
    Advisory expertise, buyer network, track record
    Verification badges, confidentiality, pipeline
    Heatmap, exposure, services, login modal, CTA

  Case Studies (case-studies.html)
    Hero, metrics (3 stats)
    5 case study dockets with full narratives
    Empty state for direct access

  Access Portal (access-portal.html)
    Standalone login page
    Trust indicators (4 badges)
    Login form (email, password, remember, forgot)
    Register CTA, security note

  Legal Pages (privacy, terms, cookies, disclaimer, code-of-conduct)
    Simple content pages with shared nav/footer

========================================================
7. APACHE CONFIGURATION
========================================================

7.1 Root .htaccess

  Options -Indexes
  Block hidden files: .*
  Block sensitive files: .log .md .json .xml .yml .yaml .bak
                        .old .swp .tmp .sh .bat .cmd .ps1 .py .rb
  Block node_modules/ and component/
  Security headers: X-Content-Type-Options nosniff,
                    X-Frame-Options SAMEORIGIN,
                    Referrer-Policy strict-origin-when-cross-origin

7.2 Assets .htaccess

  Block sensitive files (extended list with .txt .php)
  Block .git and hidden files
  Hotlink protection: block image requests from non-allowed referers
  Allowed referers: chatura.co.id, chatura.local, localhost, 127.0.0.1

7.3 VirtualHost (Laragon)

  Root: C:\Users\Administrator\OneDrive\Desktop\Project\CHATURA\html
  ServerName: chatura.local
  ServerAlias: *.chatura.local
  AllowOverride All (enables .htaccess)
  SSL on port 443 with self-signed cert

========================================================
8. IMAGE ASSETS
========================================================

  Hero images (WebP primary, PNG gitignored):
    hero-landing.webp        Home page
    hero-services.webp       Services overview
    hero-industries.webp     Industries
    hero-insights.webp       Insights
    hero-people.webp         Our People
    hero-join.webp           Career
    hero-join-01.webp        Career alt
    hero-contact.webp        Contact
    hero-business.webp       Business Transfer
    hero-casestudies.webp    Case Studies

  Branding:
    chatura.webp             OG image / general use
    logo.webp                Navigation logo
    chatura-footer.webp      Footer background
    bg-section-anim.webp     Section animation background
    about-vid.mp4            About section video

  Favicons:
    favicon.ico, favicon-16x16.png, favicon-32x32.png
    favicon-48x48.png, favicon-180x180.png
    favicon-192x192.png, favicon-512x512.png
    android-chrome-192x192.png, android-chrome-512x512.png
    apple-touch-icon.png

========================================================
9. EXTERNAL DEPENDENCIES (CDN)
========================================================

  Tailwind CSS v4:     cdn.jsdelivr.net/npm/@tailwindcss/browser@4
  Lucide Icons 0.344:  unpkg.com/lucide@0.344.0/dist/umd/lucide.min.js
  GSAP 3.12.5:         cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
  ScrollTrigger:       cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
  ScrollToPlugin:      cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js
  Observer:            cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Observer.min.js
  Google Fonts:        fonts.googleapis.com (Inter + Playfair Display)

No npm runtime dependencies. Only devDep: sharp (image conversion).

========================================================
10. BUILD AND DEPLOYMENT
========================================================

No build process. Static files served directly.

Local Development:
  Laragon Apache with virtualhost chatura.local
  Hosts file: 127.0.0.1 chatura.local

Image Optimization (manual):
  sharp used for PNG to WebP conversion
  PNG originals gitignored, WebP served in production

Deployment:
  Static hosting (GitHub Pages via CNAME: chatura.marzuqnx.com)
  or any static file server

========================================================
11. KEY ARCHITECTURAL DECISIONS
========================================================

  1. No framework, no bundler, no build step
     -> Zero configuration, instant deployment
     -> Trade-off: larger bundle sizes, no code splitting

  2. Tailwind via CDN browser script
     -> No build pipeline needed
     -> Trade-off: larger CSS payload, no purging

  3. Vanilla JS with IIFE pattern
     -> No module system, global namespace (window.CHATURA)
     -> Trade-off: namespace pollution, no tree shaking

  4. Bilingual data in single file (articles.js)
     -> All business data has {en, id} objects inline
     -> Trade-off: larger file size, duplication

  5. i18n via synchronous .js locale files
     -> Loaded via <script> tags, data available immediately
     -> No fetch(), no async, no race conditions
     -> Trade-off: all locale data loaded on every page

  6. data-i18n DOM attributes for translations
     -> Declarative, server-renderable fallback text
     -> Trade-off: ~2000+ attributes across all pages

========================================================
12. TOTAL FILE COUNTS
========================================================

  HTML pages:           27 (root + services + industries)
  JavaScript files:     15 (core + repositories + articles + i18n)
  CSS files:            1 (design-system.css)
  Locale files:         28 (14 per language: 2 bundles + 14 individual)
  Image files:          ~25 (WebP + PNG + favicons)
  Config files:         5 (.htaccess x2, site.webmanifest, CNAME, package.json)
  Documentation:        2 (README.md, GUIDELINES.md)
  Total non-binary:     ~60 files
