# Specification & Implementation Documentation: Interactive Expert Bio & Topic Resolution System

- **Document Version**: 1.1.0
- **Target Subsystem**: Expert Profile Modals & Topic Link Resolution Engine
- **Supported Languages**: English (`en`) and Bahasa Indonesia (`id`)
- **Author**: Principal Frontend Software Architect

---

## 0. Implementation Status

> **Sudah Terimplementasi** di renderer berikut:
> - `PeopleRenderer.js` — `resolveTopicLink`, `PUBLICATION_SLUGS`, `#articleNotAvailableModal` (inline build)
> - `IndustryRenderer.js` — `resolveTopicLink` (expertise tags → service/industry links)
> - `InsightDetailRenderer.js` — `resolveTopicLink`, `PUBLICATION_SLUGS`, `#articleNotAvailableModal` (inline build)
>
> **🔴 Known Issue — Code Duplication**: `resolveTopicLink` dan `PUBLICATION_SLUGS` diduplikasi di 3 renderer. Direkomendasikan untuk diekstrak ke **shared utility** (`assets/js/core/TopicResolver.js`) lalu di-import oleh semua renderer. Lihat **Section 2.4** untuk detail.

---

## 1. Overview & Architectural Goals

The **Interactive Expert Bio & Topic Resolution System** transforms static expert biography modals across the platform into dynamic, interactive exploration hubs.

### Primary Capabilities:
1. **Dynamic Topic Resolution**: Automatically parses expertise tags, representative experience items, and publication entries to resolve relevant sub-service links (`/services/[slug]/`), sub-industry links (`/industries/[slug]/`), or published article detail links (`insight-detail.html?slug=[slug]`).
2. **Fallback Modal Popup (`#articleNotAvailableModal`)**: If a topic, publication, or experience item does not yet have an active live article link, clicking it displays a clean, modern, accessible bilingual modal notifying the user that the content is being prepared ("Artikel atau Post Belum Tersedia" / "Article / Post Not Available Yet").
3. **100% Bilingual Support**: All labels, fallback titles, descriptions, and CTA buttons render seamlessly in English or Bahasa Indonesia based on active document localization (`document.documentElement.lang`).

---

## 2. Core Technical Specifications

### 2.1 Topic Link Resolution Engine (`resolveTopicLink`)

The `resolveTopicLink` function inspects string labels (in either English or Indonesian) and maps them to standard canonical URL routes.

```javascript
function resolveTopicLink(text) {
    if (!text) return null;
    var lower = text.toLowerCase();

    // Services Mapping
    if (lower.indexOf('tax') !== -1 || lower.indexOf('pajak') !== -1 || lower.indexOf('fiscal') !== -1 || lower.indexOf('fiskal') !== -1) {
        return { url: 'services/tax-services/', label: 'Tax Services' };
    }
    if (lower.indexOf('transfer') !== -1 || lower.indexOf('m&a') !== -1 || lower.indexOf('merger') !== -1 || lower.indexOf('acquisition') !== -1 || lower.indexOf('akuisi') !== -1 || lower.indexOf('succession') !== -1 || lower.indexOf('suksesi') !== -1) {
        return { url: 'services/business-transfer/', label: 'Business Transfer' };
    }
    if (lower.indexOf('risk') !== -1 || lower.indexOf('risiko') !== -1 || lower.indexOf('erm') !== -1 || lower.indexOf('cyber') !== -1 || lower.indexOf('siber') !== -1 || lower.indexOf('grc') !== -1) {
        return { url: 'services/risk-management/', label: 'Risk Management' };
    }
    if (lower.indexOf('account') !== -1 || lower.indexOf('akuntan') !== -1 || lower.indexOf('finance') !== -1 || lower.indexOf('keuangan') !== -1 || lower.indexOf('credit') !== -1 || lower.indexOf('kredit') !== -1) {
        return { url: 'services/accounting-finance/', label: 'Accounting & Finance' };
    }
    if (lower.indexOf('advisory') !== -1 || lower.indexOf('consulting') !== -1 || lower.indexOf('konsultasi') !== -1 || lower.indexOf('strategy') !== -1 || lower.indexOf('strategi') !== -1) {
        return { url: 'services/corporate-advisory/', label: 'Corporate Advisory' };
    }
    
    // Industries Mapping
    if (lower.indexOf('energy') !== -1 || lower.indexOf('energi') !== -1 || lower.indexOf('mining') !== -1 || lower.indexOf('tambang') !== -1) {
        return { url: 'industries/energy/', label: 'Energy & Natural Resources' };
    }
    if (lower.indexOf('manufacturing') !== -1 || lower.indexOf('manufaktur') !== -1 || lower.indexOf('automotive') !== -1 || lower.indexOf('otomotif') !== -1) {
        return { url: 'industries/manufacturing/', label: 'Manufacturing' };
    }
    if (lower.indexOf('financial') !== -1 || lower.indexOf('bank') !== -1 || lower.indexOf('perbankan') !== -1) {
        return { url: 'industries/financial/', label: 'Financial Services' };
    }
    if (lower.indexOf('tech') !== -1 || lower.indexOf('teknologi') !== -1 || lower.indexOf('digital') !== -1) {
        return { url: 'industries/technology/', label: 'Technology' };
    }
    if (lower.indexOf('health') !== -1 || lower.indexOf('kesehatan') !== -1 || lower.indexOf('farmasi') !== -1) {
        return { url: 'industries/healthcare/', label: 'Healthcare' };
    }
    if (lower.indexOf('consumer') !== -1 || lower.indexOf('fmcg') !== -1 || lower.indexOf('ritel') !== -1) {
        return { url: 'industries/consumer/', label: 'Consumer Goods' };
    }
    
    return null;
}
```

### 2.4 🔴 Rekomendasi: Ekstrak ke Shared Utility

`resolveTopicLink` dan `PUBLICATION_SLUGS` saat ini diduplikasi di 3 renderer. Untuk konsistensi dan kemudahan maintenance:

```text
assets/js/core/TopicResolver.js
├── resolveTopicLink(text) → {url, label} | null
├── PUBLICATION_SLUGS → object
└── window.TopicResolver = { resolveTopicLink, getPublicationSlug }
```

Setelah diekstrak, renderer hanya perlu memanggil `window.TopicResolver.resolveTopicLink(label)`.

---

### 2.2 Publication Article Slug Table (`PUBLICATION_SLUGS`)

Maps author publication keys directly to published articles in `ArticleRepository`.

```javascript
var PUBLICATION_SLUGS = {
    'people.p1_pub_1': 'digital-economy-regulations',
    'people.p1_pub_2': 'manufacturing-transformation',
    'people.p2_pub_1': 'manufacturing-transformation',
    'people.p3_pub_1': 'tax-reform-2026',
    'people.p3_pub_2': 'cross-border-tax-planning',
    'people.p4_pub_1': 'business-acquisition-guide',
    'people.p4_pub_2': 'family-business-succession',
    'people.p5_pub_1': 'risk-management-framework',
    'people.p6_pub_1': 'indonesia-tax-incentives-2026',
    'people.p6_pub_2': 'tax-implications-business-transfer'
};
```

---

### 2.3 Fallback Modal Component Specification (`#articleNotAvailableModal`)

```html
<!-- Article / Post Not Available Modal Popup -->
<div id="articleNotAvailableModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300">
    <div id="articleNotAvailableContent" class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 transform scale-95 transition-all duration-300">
        <button onclick="closeArticleNotAvailableModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition" aria-label="Close">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-[#004D34] flex items-center justify-center mb-4">
            <i data-lucide="file-text" class="w-6 h-6"></i>
        </div>
        <h3 id="notAvailableTitle" class="font-serif text-xl font-bold text-gray-950 mb-2">
            Article / Post Not Available Yet
        </h3>
        <div id="notAvailableTopicBadge" class="hidden mb-3">
            <span id="notAvailableTopic" class="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-100/80 rounded-md px-2.5 py-1 inline-block"></span>
        </div>
        <p id="notAvailableDesc" class="text-sm text-gray-600 leading-relaxed mb-6">
            The detailed article or publication for this topic is currently being prepared by our editorial team and will be released soon. In the meantime, feel free to explore our published insights.
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-3">
            <a href="insights.html" id="notAvailableExploreBtn" class="w-full sm:w-auto flex-1 bg-[#004D34] text-white px-5 py-2.5 rounded-xl text-xs font-semibold text-center hover:bg-emerald-900 transition flex items-center justify-center gap-1.5">
                <span>Explore Insights</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
            <button onclick="closeArticleNotAvailableModal()" id="notAvailableCloseBtn" class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition text-center">
                Close
            </button>
        </div>
    </div>
</div>
```

---

## 3. Global Application Matrix

| Page / Component | Element ID | Applicable Pattern | Renderer |
| :--- | :--- | :--- | :--- |
| `our-people.html` | `#bioModal` & `#articleNotAvailableModal` | Full Interactive Topic Links + Fallback Modal | `PeopleRenderer.js` |
| `insight-detail.html` | `#authorModal` & `#articleNotAvailableModal` | Full Interactive Author Expertise & Publication Links | `InsightDetailRenderer.js` |
| `services.html` | `#expertBioModal` & `#articleNotAvailableModal` | Full Interactive Expert Bio Modal | `PeopleRenderer.js` (reuse) |
| `industries.html` | `#expertBioModal` & `#articleNotAvailableModal` | Full Interactive Expert Bio Modal | `IndustryRenderer.js` (partial — `resolveTopicLink` only) |
| Dedicated Service & Industry Pages | `MEET OUR EXPERTS` (`.expert-card`) | Expert Profile trigger linking to bio modal or `our-people.html` | Modular pattern (component slots) |
