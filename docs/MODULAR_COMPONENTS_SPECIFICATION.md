# Arsitektur Komponen Modular HTML & Rencana Migrasi Non-Destruktif (v3)

> **Perubahan dari v2**: Dokumentasi lengkap dari implementasi aktual `index-modular.html` — mencakup z-index hierarchy, script loading order, i18n architecture, fixed navbar + spacer pattern, pelajaran dari bug yang ditemukan, dan **checklist konversi** untuk halaman lain. Lihat **Bagian 14 — Changelog v2 → v3**.

---

## 1. Ringkasan Proyek

Dokumen ini memuat spesifikasi teknis dan panduan migrasi modularisasi HTML untuk proyek **CHATURA**. Arsitektur modular memisahkan elemen-elemen berulang (navbar, footer, hero, dll.) menjadi komponen HTML terpisah yang di-load secara dinamis via JavaScript `fetch()`, sehingga memudahkan pemeliharaan single-point-of-update di ~20+ halaman HTML.

**Halaman referensi yang sudah berhasil dikonversi**: `index-modular.html` (About/Landing page).

---

## 2. Batasan Teknis & Lingkungan (Environment)

| Item | Nilai |
|------|-------|
| Lingkungan Lokal | Laragon Apache (`chatura.local`) |
| Lingkungan Produksi | GitHub Pages (`chatura.marzuqnx.com`) |
| Teknologi Utama | Client-Side Vanilla JS (`fetch` API + Custom DOM Events) |
| CSS Framework | Tailwind CSS Browser v4 + Custom Design System (`design-system.css`) |
| Animation Engine | GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin + Observer |
| Icon Library | Lucide Icons 0.344.0 (UMD) |
| i18n System | Custom TranslationRepository + PageLoader + locale bundles |

> **⚠️ PENTING**: `fetch()` membutuhkan HTTP server (bukan `file://`). Selalu gunakan Laragon Apache saat pengujian lokal.

---

## 3. Strategi Migrasi Non-Destruktif (Zero Downtime)

1. **Tidak Mengubah File Asli**: File produksi (`index.html`, `services.html`, dll.) tidak disentuh pada tahap awal.
2. **File Sandbox**: Dibuat file pengujian terpisah (`index-modular.html`).
3. **Penyimpanan Komponen**: Semua pecahan HTML disimpan di `components/`.
4. **Rollout Gradual**: Setelah teruji 100% stabil, komponen diterapkan ke file HTML utama satu per satu.
5. **Uji Regresi No-JS**: Setiap komponen wajib diuji dengan JavaScript dimatikan sebelum rollout.

---

## 4. Struktur Direktori (Aktual)

```text
html/
├── components/
│   ├── shared/                    ← Komponen global (semua halaman)
│   │   ├── navbar.html            ← Fixed navbar + glassmorphism
│   │   ├── footer.html            ← Footer dengan multi-column links
│   │   ├── whatsapp-widget.html   ← Floating WA chat widget
│   │   └── head.html              ← Reusable <head> meta (opsional)
│   ├── about/                     ← Komponen spesifik halaman About
│   │   ├── hero.html              ← Cinematic hero slideshow
│   │   ├── trust-indicators.html  ← Client logos / trust badges
│   │   ├── about-summary.html     ← About section + video
│   │   ├── latest-updates.html    ← Article carousel
│   │   ├── services-grid.html     ← Services grid container
│   │   ├── industry-exposure.html ← Industry exposure section
│   │   ├── testimonials.html      ← Vertical carousel testimonials
│   │   └── strategic-expertise.html ← Expertise/CTA section
│   ├── footer.html                ← Legacy (gunakan shared/footer.html)
│   ├── navbar.html                ← Legacy (gunakan shared/navbar.html)
│   └── hero-section.html          ← Legacy template placeholder
├── assets/
│   ├── css/
│   │   ├── component-skeleton.css ← Skeleton loading + CLS mitigation
│   │   └── pages/about.css        ← Page-specific styles (navbar, hero, testimonials, dll.)
│   ├── design-system.css          ← Global design tokens + premium CTA animations
│   ├── i18n/
│   │   ├── config.js              ← ChaturaConfig (storageKey, supportedLangs, pageNamespaces)
│   │   ├── loader.js              ← i18n entry point (calls PageLoader.initialize)
│   │   └── locales/
│   │       ├── en.bundle.js       ← English translations (window.__CHATURA_LOCALES)
│   │       └── id.bundle.js       ← Indonesian translations
│   └── js/
│       ├── core/
│       │   ├── EventBus.js        ← Pub/sub (window.ChaturaBus)
│       │   ├── Repository.js      ← Base repository class
│       │   ├── TranslationRepository.js ← i18n engine
│       │   ├── PageLoader.js      ← Translation applier + lang selector binder
│       │   └── component-loader.js ← Component HTML fetcher & injector
│       ├── repositories/          ← Data repositories (Service, Article, People, etc.)
│       ├── renderers/             ← DOM renderers (ServiceRenderer, ArticleRenderer, etc.)
│       ├── components/            ← UI components (LatestCarousel, etc.)
│       └── pages/
│           └── about.js           ← Page controller for index-modular.html
├── docs/
│   └── MODULAR_COMPONENTS_SPECIFICATION.md  ← Dokumen ini
├── index-modular.html             ← Halaman modular sandbox (teruji)
└── index.html                     ← Production file (utuh & aman)
```

---

## 5. Arsitektur Komponen Loader & Event Flow

### 5.1 Tag Penampung HTML (Component Slots)

Setiap komponen dideklarasikan sebagai `<div>` kosong dengan `data-component`:

```html
<!-- Shared components (tanpa min-height karena fixed/floating) -->
<div data-component="shared/navbar"></div>

<!-- Page-specific components (dengan min-height untuk CLS mitigation) -->
<div data-component="about/hero" class="component-slot component-dark" style="min-height: 600px;"></div>
<div data-component="about/services-grid" class="component-slot" style="min-height: 450px;"></div>

<!-- Floating widget (tanpa min-height) -->
<div data-component="shared/whatsapp-widget" class="component-slot"></div>

<!-- Footer -->
<div data-component="shared/footer" class="component-slot component-dark" style="min-height: 320px;"></div>
```

> **Konvensi Penamaan**: `{scope}/{name}` — `shared/` untuk komponen global, `about/` untuk komponen halaman About, `services/` untuk halaman Services, dsb.

### 5.2 Skeleton State (CLS Mitigation)

```css
/* Light skeleton */
.component-slot:not(.component-loaded) {
    background: linear-gradient(90deg, #f0f4f2 25%, #e2eae6 50%, #f0f4f2 75%);
    background-size: 200% 100%;
    animation: skeleton-pulse 1.2s ease-in-out infinite;
}

/* Dark skeleton (navbar, footer, hero) */
.component-slot.component-dark:not(.component-loaded) {
    background: linear-gradient(90deg, #003826 25%, #004D34 50%, #003826 75%);
}
```

### 5.3 Component Loader Flow (`component-loader.js` v2.1)

```
DOMContentLoaded
  ↓
loadAll() — scan semua [data-component]
  ↓
Promise.all(loadComponent(el)) — parallel fetch
  ↓  Untuk setiap component:
  │  1. fetch('components/{name}.html?v=BUILD_VERSION')
  │  2. Cache ke Map (in-memory)
  │  3. interpolate(html, el.dataset) — replace {{key}} placeholders
  │  4. el.innerHTML = processedHtml
  │  5. el.classList.add('component-loaded') → skeleton hilang
  │  6. initComponentPlugins(el) → Lucide, i18n, GSAP ScrollTrigger
  │  7. dispatch 'component:loaded' event (bubbles)
  ↓
Setelah SEMUA selesai:
  1. Call renderers (ServiceRenderer, ClientRenderer, ArticleRenderer, PeopleRenderer, FAQRenderer)
  2. dispatch 'components:all-loaded' event
```

### 5.4 Fallback Tanpa JavaScript (`<noscript>`)

```html
<div data-component="shared/navbar"></div>
<noscript>
    <header class="sticky top-0 z-50 bg-[#004D34] text-white py-4 px-6">
        <a href="index.html"><img src="assets/chatura.webp" alt="Chatura" class="h-10"></a>
        <nav><a href="index.html">About</a> | <a href="services.html">Services</a> | ...</nav>
    </header>
</noscript>
```

---

## 6. Fixed Navbar Architecture

### 6.1 Mengapa `position: fixed` Bukan `position: sticky`

> **🚨 PELAJARAN PENTING**: `position: sticky` **TIDAK BERFUNGSI** dalam arsitektur component-loader karena:
> - Navbar dimuat ke dalam `<div data-component="shared/navbar">` yang tingginya hanya sebesar navbar itu sendiri (~72px).
> - `sticky` menempel di parent terdekatnya, bukan viewport. Parent div yang kecil = navbar tidak pernah "sticky".
> - Solusi yang benar: **`position: fixed`** + **spacer div** yang diinject oleh JavaScript.

### 6.2 Implementasi

**HTML** (`components/shared/navbar.html`):
```html
<header id="navbar-sticky" class="fixed top-0 left-0 right-0 w-full" style="z-index:9999">
```

**CSS** (`assets/css/pages/about.css`):
```css
#navbar-sticky {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 9999;
    width: 100%;
    background-color: transparent;       /* State awal: transparan */
    backdrop-filter: none;
    transition: background-color 350ms cubic-bezier(.16,1,.3,1), ...;
}

#navbar-sticky.scrolled {
    background-color: rgba(255, 255, 255, 0.88) !important;
    backdrop-filter: blur(20px) saturate(190%) !important;
    border-bottom: 1px solid rgba(0, 77, 52, 0.08) !important;
    box-shadow: 0 10px 30px -10px rgba(0, 77, 52, 0.08), ...;
}
```

**JavaScript** (`assets/js/pages/{page}.js`):
```javascript
function initScrollHandlers() {
    var nav = document.getElementById('navbar-sticky');
    if (!nav) return;

    // WAJIB: Inject spacer untuk kompensasi fixed positioning
    if (!document.getElementById('navbar-spacer')) {
        var spacer = document.createElement('div');
        spacer.id = 'navbar-spacer';
        spacer.style.height = nav.offsetHeight + 'px';
        nav.parentNode.insertBefore(spacer, nav.nextSibling);
        window.addEventListener('resize', function () {
            spacer.style.height = nav.offsetHeight + 'px';
        }, { passive: true });
    }

    var isScrolled = false;
    function updateNavbarState() {
        var y = window.scrollY || window.pageYOffset || 0;
        var shouldBeScrolled = y > 50;
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            nav.classList.toggle('scrolled', shouldBeScrolled);
        }
    }

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    window.__updateNavbarState = updateNavbarState;
}
```

### 6.3 Checklist Navbar untuk Halaman Baru

- [ ] Slot: `<div data-component="shared/navbar"></div>` — **TANPA** `min-height`, `class="component-slot"`, atau `style`.
- [ ] CSS: Pastikan `#navbar-sticky` ada di page CSS dengan `position: fixed` + `z-index: 9999`.
- [ ] JS: `initScrollHandlers()` WAJIB inject `#navbar-spacer` div.
- [ ] JS: `updateNavbarState()` WAJIB disimpan di `window.__updateNavbarState` untuk akses lintas module.
- [ ] Snap engine (jika ada): `updateNav(idx)` harus delegate ke `window.__updateNavbarState()`, BUKAN manipulasi class sendiri.

---

## 7. Z-Index Hierarchy

> **🚨 PELAJARAN PENTING**: z-index yang tidak terkoordinasi menyebabkan bug klik (WA widget tidak bisa diklik karena tertutup navbar).

| Layer | z-index | Elemen |
|-------|---------|--------|
| WhatsApp Widget | `10000` | `.wa-widget` (design-system.css) |
| Fixed Navbar | `9999` | `#navbar-sticky` (about.css + navbar.html inline) |
| Mobile Menu Overlay | `999999` | `#mobileMenu` (inline style di navbar.html) |
| Nav Dropdown Menus | `60` | `.nav-dropdown-menu` (about.css) |
| Section Content | `10` | `.container` dalam sections |
| Hero Overlays | `1-5` | `.hero-overlay-dark`, `.hero-overlay-gradient` |

> **ATURAN**: Saat menambahkan elemen `position: fixed` baru, selalu cek tabel ini dan pastikan tidak menutupi elemen lain yang perlu bisa diklik.

---

## 8. Script Loading Order (KRITIS)

Urutan `<script>` di halaman **SANGAT PENTING** karena setiap module bergantung pada module sebelumnya:

```html
<!-- 1. GSAP & Plugins (external CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Observer.min.js"></script>

<!-- 2. i18n Config (mendefinisikan window.ChaturaConfig) -->
<script src="assets/i18n/config.js"></script>

<!-- 3. Core Modules (EventBus → Repository → TranslationRepository) -->
<script src="assets/js/core/EventBus.js"></script>        <!-- window.ChaturaBus -->
<script src="assets/js/core/Repository.js"></script>       <!-- Base class -->
<script src="assets/js/core/TranslationRepository.js"></script> <!-- window.TranslationRepository -->

<!-- 4. Data Repositories (bergantung pada Repository base class) -->
<script src="assets/js/repositories/ServiceRepository.js"></script>
<script src="assets/js/repositories/ArticleRepository.js"></script>
<!-- ... dst sesuai kebutuhan halaman ... -->

<!-- 5. UI Components & Renderers -->
<script src="assets/js/components/LatestCarousel.js"></script>
<script src="assets/js/renderers/ArticleRenderer.js"></script>
<script src="assets/js/renderers/ServiceRenderer.js"></script>
<!-- ... dst sesuai kebutuhan halaman ... -->

<!-- 6. Component Loader (fetch HTML, inject, dispatch events) -->
<script src="assets/js/core/component-loader.js"></script>

<!-- 7. PageLoader (translation applier + lang selector binder) -->
<script src="assets/js/core/PageLoader.js"></script>

<!-- 8. Locale Bundles (mendefinisikan window.__CHATURA_LOCALES) -->
<script src="assets/i18n/locales/en.bundle.js"></script>
<script src="assets/i18n/locales/id.bundle.js"></script>

<!-- 9. i18n Loader Entry Point (calls PageLoader.initialize()) -->
<script src="assets/i18n/loader.js"></script>

<!-- 10. Page Controller (TERAKHIR — harus setelah semua di atas) -->
<script src="assets/js/pages/about.js"></script>
```

> **⚠️ JANGAN** memindahkan urutan ini. `TranslationRepository` membutuhkan `ChaturaConfig`. `PageLoader` membutuhkan `TranslationRepository`. `loader.js` memanggil `PageLoader.initialize()`. Page controller mendengarkan `components:all-loaded`.

---

## 9. i18n (Internasionalisasi) Architecture

### 9.1 Storage Key

> **🚨 PELAJARAN PENTING**: `TranslationRepository` menggunakan `CONFIG.storageKey` = `'lang'` (dari `config.js`). **JANGAN** menulis ke key lain (mis. `'chatura_lang'`).

```javascript
// BENAR:
window.TranslationRepository.setLanguage('id');
// JUGA BENAR (jika TranslationRepository belum load):
localStorage.setItem('lang', 'id');

// ❌ SALAH — akan menyebabkan desinkronisasi:
localStorage.setItem('chatura_lang', 'id');
```

### 9.2 Language Switcher Flow

```
User klik EN/ID
  ↓
PageLoader.bindSelectorEvents() → Repo.setLanguage(newLang)
  ↓
TranslationRepository.setLanguage()
  ├─ Update currentLang
  ├─ localStorage.setItem('lang', newLang)
  └─ ChaturaBus.emit('languageChange', {lang, previousLang})
       ↓
PageLoader (listener) →
  ├─ updateLangSelector(lang) → update class lang-active/lang-inactive
  ├─ applyTranslations() → scan [data-i18n], [data-i18n-placeholder], etc.
  └─ dispatch window 'langChange' CustomEvent
```

### 9.3 Sinkronisasi UI Switcher pada Page Load

Navbar HTML hardcode `EN` sebagai `lang-active`. Saat component dimuat, page controller HARUS sinkronkan UI:

```javascript
function initLanguageSwitcher() {
    var lang = window.TranslationRepository
        ? window.TranslationRepository.getCurrentLanguage()
        : localStorage.getItem('lang') || 'en';

    ['lang-selector', 'lang-selector-mobile'].forEach(function (id) {
        var container = document.getElementById(id);
        if (!container) return;
        container.querySelectorAll('a[data-lang]').forEach(function (a) {
            a.className = (a.getAttribute('data-lang').trim().toLowerCase() === lang)
                ? 'lang-active' : 'lang-inactive';
        });
    });

    // Re-initialize PageLoader bindings for newly injected navbar
    if (window.PageLoader) window.PageLoader.initialize();
}
```

> **Renderers** (ServiceRenderer, ArticleRenderer, dll.) secara otomatis menggunakan `TranslationRepository.getAllTranslations()` untuk mendapat teks dalam bahasa aktif. Tidak perlu menangani bahasa secara manual di renderer.

---

## 10. Page Controller Pattern (`assets/js/pages/{page}.js`)

### 10.1 Struktur Standar

```javascript
(function () {
    'use strict';
    var _initialized = false;

    function initPage() {
        if (_initialized) return;  // Guard: cegah double init
        _initialized = true;

        // 1. Panggil Renderers yang dibutuhkan halaman ini
        if (window.ServiceRenderer) { try { window.ServiceRenderer.init(); } catch(e) {} }
        // ... dst

        // 2. Lucide Icons & i18n re-apply
        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch(e) {} }

        // 3. Navbar & Scroll Handlers (WAJIB)
        initScrollHandlers();

        // 4. Page-specific features
        initPageSpecificFeature();
        // ...

        // 5. Mobile Menu Accordion (WAJIB jika pakai navbar)
        initMobileMenu();
    }

    function initScrollHandlers() { /* ... spacer + scrolled class ... */ }
    function initMobileMenu() { /* ... accordion toggle ... */ }
    function initLanguageSwitcher() { /* ... sync UI ... */ }

    // ===== BOOTSTRAP =====
    document.addEventListener('components:all-loaded', function () {
        initPage();
        initLanguageSwitcher();
    });

    // Fallback
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(function () { initPage(); initLanguageSwitcher(); }, 200);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () { initPage(); initLanguageSwitcher(); }, 300);
        });
    }
})();
```

### 10.2 Poin Penting

| Aspek | Detail |
|-------|--------|
| **Init Guard** | `var _initialized = false;` + check di awal — mencegah double init dari event + fallback |
| **Bootstrap** | Dengarkan `components:all-loaded` + fallback `setTimeout` |
| **Navbar Spacer** | WAJIB inject `#navbar-spacer` div di `initScrollHandlers()` |
| **Lang Switcher** | JANGAN duplikasi event handler — delegate ke `PageLoader.initialize()` |
| **Mobile Menu** | WAJIB init accordion jika halaman pakai navbar |

---

## 11. Shared Components Reference

### 11.1 `shared/navbar.html`

- Berisi desktop nav, mobile menu overlay, language switcher (EN/ID)
- `#mobileMenu`: overlay fullscreen dengan `z-index: 999999`
- Lang selector: `#lang-selector` (desktop) + `#lang-selector-mobile` (mobile)
- **Jangan tambahkan logic click language switcher di page JS** — sudah ditangani `PageLoader.bindSelectorEvents()`

### 11.2 `shared/footer.html`

- Multi-column footer dengan links, social media, legal links
- Mendukung `data-i18n` untuk semua label teks

### 11.3 `shared/whatsapp-widget.html`

- Floating button (fixed, bottom-right)
- Popup modal via `.is-open` class toggle
- **z-index: 10000** — harus di atas navbar (9999)
- JS handler: `initWhatsAppWidget()` di page controller

---

## 12. Bug Log & Pelajaran Penting

### 12.1 Sticky → Fixed Navbar

| Problem | `position: sticky` tidak bekerja |
|---------|----------------------------------|
| Penyebab | Parent `<div data-component>` terlalu pendek (~72px). Sticky hanya menempel di parent. |
| Solusi | Gunakan `position: fixed` + inject spacer div via JS |
| Referensi | `about.js` → `initScrollHandlers()` |

### 12.2 Navbar Flicker (Berkedip)

| Problem | Background navbar muncul lalu hilang saat scroll |
|---------|--------------------------------------------------|
| Penyebab | Dua listener konflik: scroll handler menambah `.scrolled`, snap engine menghapusnya |
| Solusi | `updateNav(idx)` di snap engine delegate ke `window.__updateNavbarState()` |

### 12.3 WA Widget Tidak Bisa Diklik

| Problem | Tombol WA terlihat tapi klik tidak responsif |
|---------|----------------------------------------------|
| Penyebab | `.wa-widget` z-index: 50 tertutup navbar z-index: 9999 |
| Solusi | Naikkan `.wa-widget` z-index ke 10000 di `design-system.css` |

### 12.4 Language Caching Bug

| Problem | Hard refresh: tombol EN aktif tapi konten bahasa Indonesia |
|---------|--------------------------------------------------------------|
| Penyebab | (1) about.js menulis ke `localStorage('chatura_lang')` bukan `localStorage('lang')`. (2) UI tidak sinkron saat load. |
| Solusi | Hapus duplikasi handler. Delegate ke `PageLoader`. Sync UI via `TranslationRepository.getCurrentLanguage()`. |

### 12.5 Missing IIFE Closing

| Problem | Syntax error `'}' expected` |
|---------|------------------------------|
| Penyebab | Edit sebelumnya menghapus `})();` penutup IIFE + blok bootstrap |
| Solusi | Selalu pastikan IIFE pattern lengkap: `(function(){ ... })();` |

---

## 13. Checklist Konversi Halaman Baru ke Modular

Gunakan checklist ini saat mengkonversi halaman (mis. `services.html` → `services-modular.html`):

### Fase 1: Setup File

- [ ] Buat file sandbox: `{page}-modular.html`
- [ ] Salin `<head>` dari `index-modular.html` (ganti title, meta, canonical)
- [ ] Pastikan CSS: `design-system.css` + `component-skeleton.css` + `pages/{page}.css`
- [ ] Pastikan script CDN: Tailwind Browser v4, Lucide, GSAP (+ ScrollTrigger, ScrollToPlugin, Observer jika perlu)

### Fase 2: Component Slots

- [ ] `<div data-component="shared/navbar"></div>` — tanpa class/style
- [ ] Page sections: `<div data-component="{page}/{section}" class="component-slot" style="min-height: Npx;"></div>`
- [ ] `<div data-component="shared/whatsapp-widget" class="component-slot"></div>`
- [ ] `<div data-component="shared/footer" class="component-slot component-dark" style="min-height: 320px;"></div>`
- [ ] `<noscript>` fallback untuk navbar dan footer

### Fase 3: Buat Komponen HTML

- [ ] Buat folder `components/{page}/`
- [ ] Ekstrak setiap `<section>` menjadi file `.html` terpisah
- [ ] Pastikan setiap komponen mandiri (tidak bergantung pada komponen lain)
- [ ] Gunakan `data-i18n` untuk semua teks yang perlu diterjemahkan
- [ ] Gunakan `class="reveal-up"` untuk animasi scroll-triggered

### Fase 4: Page Controller JS

- [ ] Buat `assets/js/pages/{page}.js` mengikuti **pattern di Bagian 10.1**
- [ ] WAJIB: `initScrollHandlers()` dengan spacer injection
- [ ] WAJIB: `initMobileMenu()` accordion toggle
- [ ] WAJIB: `initLanguageSwitcher()` sync UI + `PageLoader.initialize()`
- [ ] WAJIB: Init guard (`_initialized`) untuk cegah double init
- [ ] WAJIB: Bootstrap listeners (`components:all-loaded` + fallback)
- [ ] Tambahkan renderers yang dibutuhkan halaman (cek `index-modular.html` untuk referensi)
- [ ] WAJIB: `initWhatsAppWidget()` jika halaman pakai WA widget

### Fase 5: Page CSS

- [ ] Buat `assets/css/pages/{page}.css`
- [ ] Salin blok `#navbar-sticky` dari `about.css` (fixed + glassmorphism)
- [ ] Salin blok `.nav-dropdown`, `.nav-dropdown-menu` dari `about.css`
- [ ] Salin blok `.lang-active`, `.lang-inactive` dari `about.css`
- [ ] Tambahkan styles spesifik halaman

### Fase 6: Script Loading Order

- [ ] Ikuti urutan di **Bagian 8** — JANGAN diubah
- [ ] Hanya load repositories & renderers yang dibutuhkan halaman
- [ ] Page controller JS harus di posisi **TERAKHIR**

### Fase 7: i18n

- [ ] Tambahkan page namespace di `config.js` → `pageNamespaces`
- [ ] Pastikan semua teks dinamis menggunakan `data-i18n` attribute
- [ ] Test: klik EN → ID → hard refresh → bahasa harus konsisten

### Fase 8: Testing

- [ ] Desktop: navbar fixed, glassmorphism saat scroll, tidak flicker
- [ ] Desktop: language switcher EN ↔ ID berfungsi
- [ ] Desktop: WA widget bisa diklik & popup muncul
- [ ] Desktop: semua section terload tanpa error di console
- [ ] Mobile: mobile menu bisa dibuka/ditutup
- [ ] Mobile: accordion submenu berfungsi
- [ ] Mobile: WA widget bisa diklik
- [ ] Mobile: konten responsive, tidak ada overflow horizontal
- [ ] No-JS: disable JS → navbar/footer fallback tampil

### Fase 9: Rollout

- [ ] Review bersama sebelum replace file produksi
- [ ] Rename `{page}-modular.html` → `{page}.html`
- [ ] Test ulang di production environment

---

## 14. Changelog v2 → v3

| Area | v2 | v3 |
|------|----|----|
| Navbar positioning | `sticky` (documented) | `fixed` + spacer injection (bug fix) |
| Z-index hierarchy | Tidak didokumentasikan | Tabel z-index lengkap (Bagian 7) |
| Script loading order | Tidak didokumentasikan | Urutan detail 10 langkah (Bagian 8) |
| i18n architecture | Tidak didokumentasikan | StorageKey, flow, UI sync (Bagian 9) |
| Page controller pattern | Tidak ada template | Template lengkap + bootstrap pattern (Bagian 10) |
| Bug log | Tidak ada | 5 bug terdokumentasi dengan solusi (Bagian 12) |
| Konversi checklist | Langkah high-level | 9-fase checklist detail (Bagian 13) |
| Direktori struktur | Generik | Aktual sesuai implementasi (Bagian 4) |
| Shared components | Tidak didokumentasikan | Reference guide (Bagian 11) |
| Component naming | `navbar.html` | `shared/navbar.html` (scoped) |

---

## 15. Catatan Keputusan (Decision Log)

| Keputusan | Opsi Terpilih | Alternatif | Rationale |
|-----------|---------------|------------|-----------|
| Arsitektur Modular | Client-Side `fetch` + Data Attribute | Web Components / SSG | Zero-dependency, ramah Apache & GitHub Pages |
| Event Timing | Event Bus (`components:all-loaded`) | Timeout / MutationObserver | Menjamin DOM ready sebelum init |
| Navbar Positioning | `position: fixed` + JS spacer | `position: sticky` | Sticky gagal dalam component-loader parent div |
| Z-index Strategy | Tabel hierarki eksplisit | Ad-hoc per komponen | Mencegah bug layer overlapping |
| Language Storage | `localStorage('lang')` via TranslationRepository | Direct localStorage | Single source of truth |
| Page Controller | IIFE dengan init guard | Global functions | Encapsulation + prevent double init |
| Cache-Busting | Query param `?v=BUILD_VERSION` | No versioning | Mencegah stale component cache |

---

## 16. Opsi Jangka Panjang: Build-Time (Opsional)

Pola client-side fetch cocok untuk kebutuhan jangka pendek/menengah. Jika proyek berkembang (>30 halaman, SEO maksimal), pertimbangkan:

- **Build-time injection** (Node.js/Eleventy) yang menggabungkan `components/*.html` ke HTML statis saat build.
- Hasil tetap file HTML statis → kompatibel GitHub Pages.
- Menghilangkan `fetch` overhead → LCP lebih cepat, CLS nol.
- Struktur folder `components/` tetap sama — hanya cara penggabungan yang berubah.

---

## 17. Script Loading Order (Diperbarui — Termasuk Motion Engine)

> **Berlaku efektif**: Setelah ADR-001 disetujui. Menggantikan urutan di Bagian 8.

Urutan `<script>` di halaman **SANGAT PENTING** karena setiap module bergantung pada module sebelumnya:

```html
<!-- 1. GSAP & Plugins (external CDN) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Observer.min.js"></script>

<!-- 2. Motion Engine (ES Module — register presets, expose window.MotionEngine) -->
<script type="module" src="assets/js/motion/index.js"></script>

<!-- 3. i18n Config (mendefinisikan window.ChaturaConfig) -->
<script src="assets/i18n/config.js"></script>

<!-- 4. Core Modules (EventBus → Repository → TranslationRepository) -->
<script src="assets/js/core/EventBus.js"></script>
<script src="assets/js/core/Repository.js"></script>
<script src="assets/js/core/TranslationRepository.js"></script>

<!-- 5. Data Repositories -->
<script src="assets/js/repositories/ServiceRepository.js"></script>
<script src="assets/js/repositories/ArticleRepository.js"></script>
<!-- ... dst sesuai kebutuhan halaman ... -->

<!-- 6. UI Components & Renderers -->
<script src="assets/js/components/LatestCarousel.js"></script>
<script src="assets/js/renderers/ArticleRenderer.js"></script>
<script src="assets/js/renderers/ServiceRenderer.js"></script>
<!-- ... dst sesuai kebutuhan halaman ... -->

<!-- 7. Component Loader (fetch HTML, inject, dispatch events) -->
<script src="assets/js/core/component-loader.js"></script>

<!-- 8. PageLoader (translation applier + lang selector binder) -->
<script src="assets/js/core/PageLoader.js"></script>

<!-- 9. Locale Bundles -->
<script src="assets/i18n/locales/en.bundle.js"></script>
<script src="assets/i18n/locales/id.bundle.js"></script>

<!-- 10. i18n Loader Entry Point -->
<script src="assets/i18n/loader.js"></script>

<!-- 11. Page Controller (TERAKHIR — harus setelah semua di atas) -->
<script src="assets/js/pages/about.js"></script>
```

> **⚠️ Catatan Motion Engine**: `index.js` menggunakan ES module (`type="module"`). Module script di-defer secara default (executes setelah semua synchronous scripts). `window.MotionEngine` akan tersedia sebelum page controller berjalan.

> **⚠️ JANGAN** memindahkan urutan ini. `TranslationRepository` membutuhkan `ChaturaConfig`. `PageLoader` membutuhkan `TranslationRepository`. `loader.js` memanggil `PageLoader.initialize()`. Motion Engine harus load setelah GSAP (bergantung pada adapter) tapi sebelum page controller. Page controller mendengarkan `components:all-loaded` dan memanggil `MotionEngine.init()`.

---

## 18. Page Controller Pattern (Diperbarui — Termasuk Motion Engine Lifecycle)

> **Berlaku efektif**: Setelah ADR-001 disetujui. Mengupdate pola di Bagian 10.

### 18.1 Struktur Standar (Updated)

```javascript
(function () {
    'use strict';
    var _initialized = false;

    function initPage() {
        if (_initialized) return;  // Guard: cegah double init
        _initialized = true;

        // 1. Panggil Renderers yang dibutuhkan halaman ini
        if (window.ServiceRenderer) { try { window.ServiceRenderer.init(); } catch(e) {} }
        // ... dst

        // 2. Lucide Icons & i18n re-apply
        if (window.lucide) window.lucide.createIcons();
        if (window.i18nLoader) { try { window.i18nLoader.translatePage(); } catch(e) {} }

        // 3. Navbar & Scroll Handlers (WAJIB)
        initScrollHandlers();

        // 4. Page-specific features
        initPageSpecificFeature();
        // ...

        // 5. Mobile Menu Accordion (WAJIB jika pakai navbar)
        initMobileMenu();
    }

    function initScrollHandlers() { /* ... spacer + scrolled class ... */ }
    function initMobileMenu() { /* ... accordion toggle ... */ }
    function initLanguageSwitcher() { /* ... sync UI ... */ }

    // ===== BOOTSTRAP =====
    document.addEventListener('components:all-loaded', function () {
        initPage();
        initLanguageSwitcher();

        // Motion Engine init — WAJIB, setelah komponen ter-inject ke DOM
        if (window.MotionEngine) {
            try {
                MotionEngine.init();
            } catch (e) {
                console.error('[MotionEngine] init gagal, konten tetap tampil.', e);
            }
        }
    }, { once: true });

    // Fallback
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(function () { initPage(); initLanguageSwitcher(); }, 200);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () { initPage(); initLanguageSwitcher(); }, 300);
        });
    }
})();
```

### 18.2 Poin Penting (Updated)

| Aspek | Detail |
|-------|--------|
| **Init Guard** | `var _initialized = false;` + check di awal — mencegah double init dari event + fallback |
| **Bootstrap** | Dengarkan `components:all-loaded` + fallback `setTimeout` |
| **Navbar Spacer** | WAJIB inject `#navbar-spacer` div di `initScrollHandlers()` |
| **Lang Switcher** | JANGAN duplikasi event handler — delegate ke `PageLoader.initialize()` |
| **Mobile Menu** | WAJIB init accordion jika halaman pakai navbar |
| **Motion Engine** | WAJIB panggil `MotionEngine.init()` setelah `components:all-loaded`, sebelum `setTimeout` fallback |

### 18.3 Lazy-Loaded Content (Modal, Tab)

Untuk konten yang di-load setelah page-load awal (mis. modal expert bio), jangan `destroy + init()` ulang. Gunakan:

```javascript
MotionEngine.play(newScopeElement, 'reveal-up');
```

---

## 19. Z-Index Hierarchy (Diperbarui — Sumber Kebenaran Tunggal)

> **Berlaku efektif**: Menggantikan z-index yang tersebar di beberapa file. Semua komponen dan preset Motion Engine HARUS respect tabel ini.

| Layer | z-index | Elemen | Referensi |
|-------|---------|--------|-----------|
| WhatsApp Widget | `10000` | `.wa-widget` | `design-system.css` |
| Fixed Navbar | `9999` | `#navbar-sticky` | `about.css` + `navbar.html` inline |
| Mobile Menu Overlay | `999999` | `#mobileMenu` | `navbar.html` inline |
| Fallback Modal | `200` | `#articleNotAvailableModal` | Renderer JS |
| Expert Bio Modal | `200` | `#bioModal` | Renderer JS |
| Nav Dropdown Menus | `60` | `.nav-dropdown-menu` | `about.css` |
| Section Content | `10` | `.container` dalam sections | Default |
| Hero Overlays | `1-5` | `.hero-overlay-dark`, `.hero-overlay-gradient` | CSS |

### 19.1 Aturan

- **Preset `navbar`**: z-index = `9999` (sesuai tabel)
- **Preset `modal`**: z-index = `200` (sesuai tabel)
- **SAAT** menambahkan elemen `position: fixed` baru, selalu cek tabel ini
- **JANGAN** menggunakan z-index ad-hoc tanpa mendokumentasikan di tabel ini

---

## 20. Changelog v3

| Area | v2 | v3 |
|------|----|----|
| Script loading order | Tidak termasuk Motion Engine | Tambah langkah 2: Motion Engine (`type="module"`) |
| Page controller pattern | Tidak termasuk MotionEngine.init() | Tambah init call + lazy-loaded content pattern (Bagian 18) |
| Z-index hierarchy | Tidak ada di MODULAR spec | Tabel hierarki lengkap + aturan (Bagian 19) |
| Component migration | Tidak ada | `reveal-up` class → `data-motion` attribute (ADR-001) |
| component-loader.js | Selalu jalankan GSAP batch | Skip batch jika MotionEngine aktif (ADR-001) |
