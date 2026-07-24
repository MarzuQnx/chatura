# CHATURA INDONESIA — GUIDELINES

> Highest implementation authority. Every architectural, UI, UX, frontend, animation, accessibility, localization, coding decision MUST comply.
> Violation = incorrect implementation.

> **📌 Referensi Implementasi**: Untuk spesifikasi teknis modular (component loader, page controller, i18n architecture, migration checklist), lihat **`MODULAR_COMPONENTS_SPECIFICATION.md`**.

---

## 1. ARCHITECTURE

### 1.1 Information Architecture (FINALIZED)

```
Root
├── index.html              (About Us / Home)
├── services.html           (Executive Overview — NOT a catalog)
├── industries.html
├── insights.html
├── our-people.html
├── career.html
├── contact-us.html
├── services/
│   ├── accounting-finance/
│   │   └── index.html
│   ├── tax-services/
│   │   └── index.html
│   ├── business-transfer/
│   │   └── index.html
│   ├── risk-management/
│   │   └── index.html
│   └── corporate-advisory/
│       └── index.html
```

**DO NOT reinterpret. DO NOT redesign. DO NOT replace existing UX patterns with own ideas.**

### 1.2 Services Page Role

Services page (`services.html`) is an **EXECUTIVE EDITORIAL OVERVIEW**.

- NOT a product catalog
- NOT an ecommerce page
- NOT a SaaS feature page
- NOT a pricing page
- Introduces five consulting capabilities
- Guides users to dedicated landing pages

---

## 2. SERVICES PAGE — FIVE SERVICES AS SECTIONS (NOT CARDS)

Each primary service is a **FULL EDITORIAL SECTION**. This is mandatory.

> **🔄 Implementasi**: Services section harus diimplementasikan sebagai komponen modular (`services/service-section-01.html` dst) menggunakan component loader pattern dari MODULAR_COMPONENTS_SPECIFICATION.md.

### 2.1 Section Structure

```
Hero
↓
Service Philosophy
↓
Section 01: Accounting & Finance
↓
Section 02: Tax Services
↓
Section 03: Business Transfer
↓
Section 04: Risk Management
↓
Section 05: Corporate Advisory
↓
Industry Exposure
↓
Our Experts
↓
Strategic Intelligence
↓
Final CTA
```

### 2.2 Each Service Section Contains

- Service Number (01–05)
- Service Name
- Executive Summary (short narrative)
- Three Key Capabilities (checkmark list)
- Supporting Image (with float animation)
- Learn More CTA → dedicated service page (`/services/[slug]/`)

**Nothing more. Detailed explanation belongs inside dedicated pages.**

### 2.3 Visual Rhythm (Alternating Editorial Layout)

| Section | Layout |
|---------|--------|
| 01 Accounting & Finance | Text LEFT, Image RIGHT |
| 02 Tax Services | Image LEFT, Text RIGHT |
| 03 Business Transfer | Text LEFT, Image RIGHT |
| 04 Risk Management | Image LEFT, Text RIGHT |
| 05 Corporate Advisory | Text LEFT, Image RIGHT |

This creates natural editorial reading rhythm.

### 2.4 DO NOT

- Convert services into cards, tiles, feature boxes, product grids, masonry layouts, dashboard widgets, or catalog layouts
- Create a second visual language
- Duplicate UI patterns
- Introduce new components that don't exist in the design system

---

## 3. DEDICATED SERVICE PAGES

> **🔄 Status Migrasi**: Dedicated service pages sedang/migrasi ke arsitektur modular (`{page}-modular.html`). Gunakan **MODULAR_COMPONENTS_SPECIFICATION.md** Section 13 sebagai panduan konversi. Layout template di bawah tetap berlaku sebagai referensi konten, tapi implementasi teknis mengikuti pola modular (component slots, page controller, shared components).

### 3.1 Template Structure (ALL service pages follow this EXACT template)

```
Breadcrumbs: Home / Services / [Service Name]
↓
Hero (service name, executive statement, description, primary CTA, secondary CTA, hero image)
↓
Executive Summary
↓
Business Challenges (2×3 grid)
↓
Solution (text + image)
↓
Core Services (2×3 grid with icons)
↓
Service Workflow (5 steps: Discovery → Assessment → Strategy → Implementation → Monitoring)
↓
Deliverables (list + image)
↓
Industry Applications (pills)
↓
Related Insights (2 cards)
↓
Meet Our Experts (2 expert cards)
↓
FAQ (accordion, 4 questions)
↓
Final CTA
↓
Secondary CTA (View All Services)
```

**Only content changes. Layout NEVER changes.**

### 3.2 Dedicated Pages

| # | Page | Slug | Hero Image |
|---|------|------|------------|
| 01 | Accounting & Finance | `/services/accounting-finance/` | photo-1554224155-6726b3ff858f |
| 02 | Tax Services | `/services/tax-services/` | photo-1450101499163-c8848c66ca85 |
| 03 | Business Transfer | `/services/business-transfer/` | photo-1744957279993-3395a9c4fe05 |
| 04 | Risk Management | `/services/risk-management/` | photo-1454165804606-c3d57bc86b40 |
| 05 | Corporate Advisory | `/services/corporate-advisory/` | photo-1521737604893-d14cc237f11d |

---

## 4. NAVIGATION

### 4.1 Primary Navigation (Desktop)

```
About Us | Services ▼ | Industries ▼ | Insights ▼ | Our People | Join Us | Contact | [EN ID] | [Let's Talk →]
```

### 4.2 Services Dropdown

```
Overview
Accounting & Finance
Tax Services
Business Transfer
Risk Management
Corporate Advisory
```

### 4.3 Industries Dropdown

```
Overview
Manufacturing
Energy & Resources
Healthcare
Technology
Financial Services
```

### 4.4 Insights Dropdown

```
Latest Insights
Executive Intelligence
Strategic Intelligence
Publications
Downloads
```

### 4.5 Mobile Navigation

Accordion-style expandable sections. Services, Industries, Insights expand/collapse.

### 4.6 Consistency Rules

- Every HTML page uses **exactly** the same header, navigation, dropdown, CTA, footer, language switcher
- No page should have a unique navigation implementation
- Active state: `text-[#004D34] font-semibold` on current page
- Mobile accordion groups open by default when a child is active (`class="open"`)

---

## 5. URL STRUCTURE

```
/
/about/
/services/
/services/accounting-finance/
/services/tax-services/
/services/business-transfer/
/services/risk-management/
/services/corporate-advisory/
/industries/
/insights/
/our-people/
/career/
/contact/
```

**Never use**: `?id=`, `?page=`, `?service=`. Avoid query parameters.

---

## 6. DESIGN SYSTEM

### 6.1 Tokens

- Brand Green: `#004D34`
- Serif: Playfair Display (`font-serif`)
- Sans: Inter (`font-sans`)
- Tailwind CSS (browser CDN)
- Lucide Icons
- GSAP + ScrollTrigger for scroll animations

### 6.2 Section Pattern

Every section uses:
- `container mx-auto px-6` for width
- `data-motion="reveal-up"` attribute for scroll-triggered animation (Motion Engine — **bukan** class `reveal-up` manual)
- `data-i18n` attributes for all visible text
- Consistent padding: `py-20` or `py-24`

### 6.3 Hero Pattern

- `-mt-32 pt-32` offset
- Background image with gradient overlay
- `reveal-up` staggered animations

### 6.4 Image Float Animation

Service sections use `si-float` and `si-shadow` CSS animations with CSS custom properties for per-section variation.

---

## 7. SEO

Every page must have:
- Unique `<title>` and `<meta description>`
- Canonical URL
- Open Graph tags
- Twitter Card tags
- Schema.org JSON-LD (ProfessionalService or Service type)
- No duplicate metadata across pages

---

## 8. ACCESSIBILITY

- Skip link (`<a href="#main-content" class="skip-link">`)
- `focus-visible` states
- `prefers-reduced-motion` support
- ARIA labels on interactive elements
- Semantic HTML5
- Keyboard navigable

---

## 9. LOCALIZATION

- All visible text uses `data-i18n="key"` attributes
- Language selector: EN / ID toggle
- i18n system via `assets/i18n/i18n.js`

---

## 10. WHATSAPP WIDGET

Every page includes the WhatsApp support launcher with popup dialog.

---

## 11. FOOTER

Every page includes:
- Brand manifesto
- Services links (to dedicated pages)
- Industries links
- Company links
- Social links
- Copyright
- Legal disclosure

---

## 12. DO NOT

- DO NOT redesign visual identity
- DO NOT invent new design language
- DO NOT change branding
- DO NOT introduce new color systems
- DO NOT create inconsistent layouts
- DO NOT duplicate large amounts of content
- DO NOT make Services another blog
- DO NOT create multiple templates
- DO NOT convert service sections to cards/grids/catalogs
