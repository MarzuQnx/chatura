# ADR-001: Motion Engine ↔ Component Loader Integration

- **Status**: Proposed
- **Date**: 2026-07-24
- **Author**: Frontend Architecture Review
- **Scope**: Integrasi lifecycle Motion Engine (ADR-000) dengan Component Loader & Page Controller (MODULAR_COMPONENTS_SPECIFICATION.md)
- **Supersedes**: —
- **Requires approval per**: ADR-000 Section 14 (perubahan/penambahan yang menyentuh inisialisasi `assets/js/motion/core/`)

---

## 1. Context & Problem Statement

ADR-000 menetapkan Motion Engine sebagai Core Infrastructure yang **framework-agnostic** dan **decoupled** dari halaman spesifik — tapi ADR-000 tidak menspesifikasikan *kapan* dan *di titik apa* dalam siklus hidup halaman engine tersebut di-inisialisasi. Di sisi lain, arsitektur modular (`component-loader.js`) memuat navbar, footer, dan section-section halaman secara asinkron via `fetch()`, yang berarti DOM final baru lengkap **setelah** event `components:all-loaded` terpicu.

Tanpa titik integrasi eksplisit, dua kemungkinan gagal terjadi:
1. `MotionEngine.init()` dipanggil terlalu awal (sebelum komponen selesai di-inject) → `MotionObserver` tidak menemukan elemen `[data-motion]` karena belum ada di DOM → animasi tidak pernah trigger.
2. `MotionEngine.init()` tidak pernah dipanggil sama sekali di page controller → elemen tetap di state `idle` selamanya (ini yang saat ini terjadi — **gap kritis** yang teridentifikasi di poin 1 analisis).

Selain itu, komponen HTML yang sudah ada di `components/` masih memakai class `reveal-up` manual (peninggalan sebelum Motion Engine ada), bukan atribut `data-motion="reveal-up"` sesuai kontrak publik ADR-000 Section 5.

---

## 2. Decision

Motion Engine di-init **satu kali per page-load**, dipicu oleh event `components:all-loaded` dari Component Loader — bukan oleh `DOMContentLoaded` — dan seluruh komponen HTML shared/page-specific bermigrasi dari class `reveal-up` manual ke atribut `data-motion="[preset]"`, dengan class lama dipertahankan sementara sebagai `data-motion-legacy="true"` mengikuti strategi migrasi ADR-000 Section 10.

### 2.1 Titik Integrasi Resmi

```javascript
// Page controller — SATU-SATUNYA titik resmi MotionEngine.init()
document.addEventListener('components:all-loaded', function () {
  // ... existing renderer/init code ...

  if (window.MotionEngine) {
    try {
      MotionEngine.init();
    } catch (e) {
      // Kegagalan init TIDAK BOLEH menyembunyikan konten.
      // Sesuai ADR-000 Section 9 (Failure Mode Matrix): fallback = 100% visible.
      console.error('[MotionEngine] init gagal, konten tetap tampil apa adanya.', e);
    }
  }
}, { once: true });
```

`{ once: true }` wajib — mencegah double-init jika `components:all-loaded` ter-dispatch lebih dari sekali (mis. karena partial re-render), yang akan menyebabkan `MotionObserver` mendaftarkan observer duplikat (persis kelas bug yang ADR-000 Section 1 coba cegah).

**Bukan** `MotionEngine.destroy()` lalu `init()` ulang setiap kali `components:all-loaded` terpicu (seperti disebut di poin 7 analisis) — pola destroy-reinit tanpa guard berisiko melepas observer dari elemen yang animasinya sedang `playing`, dan bertentangan dengan model *single deterministic lifecycle* di ADR-000 Section 6. Kalau ada kebutuhan re-scan parsial (mis. modal yang di-load lazy setelah page-load awal), gunakan `MotionEngine.play(newScopeElement, ...)` per-elemen, bukan destroy-all.

### 2.2 Migrasi Komponen: Class Manual → `data-motion`

| Komponen | Sebelum | Sesudah |
|---|---|---|
| `components/about/hero.html` | class manual | `data-motion="hero-reveal"` |
| `components/about/trust-indicators.html` | `class="reveal-up"` | `data-motion="reveal-up"` |
| `components/about/about-summary.html` | `class="reveal-up"` | `data-motion="reveal-up"` |
| `components/about/services-grid.html` | `class="reveal-up"` | `data-motion="reveal-up"` |
| `components/about/industry-exposure.html` | `class="reveal-up"` | `data-motion="reveal-up"` |
| `components/about/testimonials.html` | `class="reveal-up"` | `data-motion="slide-up"` |
| `components/about/strategic-expertise.html` | `class="reveal-up"` | `data-motion="reveal-up"` |
| `components/shared/navbar.html` | tidak ada | `data-motion="navbar"` |
| `components/shared/footer.html` | tidak ada | `data-motion="reveal-up"` |

Selama masa transisi, komponen yang belum sempat dimigrasi **tetap boleh** memakai class `reveal-up` lama, ditandai `data-motion-legacy="true"` secara eksplisit (bukan dibiarkan tanpa penanda) — ini yang membedakan "belum dimigrasi" dari "lupa dimigrasi" saat audit.

---

## 3. Dampak ke Dokumen Lain (Action Items, bukan Fait Accompli)

Poin-poin berikut **memerlukan penulisan bagian baru**, bukan penyuntingan bagian yang sudah ada, karena bagian tersebut belum tercatat di `MODULAR_COMPONENTS_SPECIFICATION.md` versi yang tersedia saat ADR ini dibuat:

| Dokumen | Aksi | Status |
|---|---|---|
| `MODULAR_COMPONENTS_SPECIFICATION.md` | Tambah bagian baru: **Script Loading Order**, dengan urutan: (1) GSAP & Plugins → (2) Motion Engine Core + Presets + Adapters → (3) Core Modules (component-loader, dst.) → (4) Page Controller | **Belum ditulis** — perlu drafting terpisah |
| `MODULAR_COMPONENTS_SPECIFICATION.md` | Tambah bagian baru: **Page Controller Pattern** (`initPage()`), mendokumentasikan urutan resmi: render komponen → renderer init → `MotionEngine.init()` (lihat 2.1) | **Belum ditulis** — perlu drafting terpisah |
| `MODULAR_COMPONENTS_SPECIFICATION.md` | Tambah bagian baru: **Z-Index Hierarchy** sebagai single source of truth, dirujuk oleh preset `navbar` dan `modal` di Motion Engine | **Belum ditulis** — perlu drafting terpisah; ADR-000 sendiri tidak mendefinisikan nilai z-index, hanya nama preset |
| `GUIDELINES.md` Section 6.2 | Ganti `reveal-up` class manual → `data-motion="reveal-up"` attribute | Siap diedit langsung, tidak butuh dokumen baru |
| `GUIDELINES.md` referensi "Section 13" | Verifikasi ulang — section ini juga belum ditemukan di spec yang tersedia | **Perlu konfirmasi**: apakah sudah ditulis di tempat lain, atau perlu dibuat |

Saya sengaja tidak menulis isi tiga bagian baru itu (Script Loading Order, Page Controller Pattern, Z-Index Hierarchy) di ADR ini — ADR mendokumentasikan **keputusan**, bukan spesifikasi implementasi detail. Begitu ADR ini disetujui, tiga bagian itu jadi task terpisah untuk update `MODULAR_COMPONENTS_SPECIFICATION.md` ke v3.

---

## 4. Options Considered

### Option A: Init via `components:all-loaded` (Dipilih)
| Dimensi | Penilaian |
|---|---|
| Keselarasan dengan arsitektur existing | Tinggi — memakai event bus yang sudah ada, tidak menambah mekanisme baru |
| Risiko race condition | Rendah — dijamin DOM lengkap sebelum `MotionObserver` scan |
| Kompleksitas tambahan | Rendah |

**Pros**: Satu titik integrasi, konsisten dengan prinsip Event Bus di ADR-000 §1. Tidak butuh polling/timeout.
**Cons**: Bergantung pada Component Loader benar-benar men-dispatch `components:all-loaded` di semua halaman secara konsisten — perlu audit page controller yang ada.

### Option B: Init via `DOMContentLoaded` + Polling `MutationObserver`
| Dimensi | Penilaian |
|---|---|
| Keselarasan dengan arsitektur existing | Rendah |
| Risiko race condition | Sedang — MutationObserver bisa fire sebelum semua fetch komponen selesai |
| Kompleksitas tambahan | Tinggi |

**Pros**: Tidak bergantung pada Component Loader mem-broadcast event dengan benar.
**Cons**: ADR-000 §15 sudah secara eksplisit menolak pendekatan timeout/observer polling untuk masalah serupa (alasan yang sama berlaku di sini).

### Option C: Destroy-and-Reinit setiap `components:all-loaded`
| Dimensi | Penilaian |
|---|---|
| Keselarasan dengan arsitektur existing | Sedang |
| Risiko race condition | Tinggi jika event ter-dispatch lebih dari sekali tanpa guard |
| Kompleksitas tambahan | Sedang |

**Pros**: "Selalu bersih", cocok untuk skenario re-render besar.
**Cons**: Berisiko memutus animasi yang sedang `playing`; bertentangan dengan state machine deterministik ADR-000 §6. Cocok dipakai sebagai API `MotionEngine.play(scope)` untuk re-scan **parsial**, bukan sebagai pola default di setiap `components:all-loaded`.

---

## 5. Trade-off Analysis

Option A dipilih karena satu-satunya yang tidak menambah mekanisme sinkronisasi baru di luar apa yang sudah ditetapkan ADR-000 (Event Bus) dan spesifikasi modular (Component Loader). Trade-off utamanya adalah ketergantungan pada kedisiplinan setiap page controller untuk benar-benar mem-broadcast `components:all-loaded` — ini yang membuat audit di Bagian 6 wajib, bukan opsional.

---

## 6. Consequences

- **Lebih mudah**: Satu pola init yang konsisten di semua page controller; debugging "animasi tidak jalan" jadi lebih mudah ditelusuri (cek apakah `components:all-loaded` ter-dispatch, cek apakah elemen punya `data-motion`).
- **Lebih sulit**: Setiap page controller baru harus disiplin men-dispatch event ini di titik yang tepat — perlu checklist/lint rule, bukan sekadar dokumentasi.
- **Perlu ditinjau ulang**: Skenario lazy-loaded content (modal, tab content) yang muncul setelah `components:all-loaded` awal — perlu API re-scan parsial (`MotionEngine.play(scope)`) yang belum dibahas eksplisit di ADR-000.

---

## 7. Action Items

1. [ ] Audit semua page controller (`about.js`, dan yang lain) — pastikan semuanya mem-dispatch `components:all-loaded` setelah `component-loader.js` selesai memuat seluruh slot.
2. [ ] Tambahkan blok `MotionEngine.init()` sesuai pola Bagian 2.1 ke setiap page controller yang belum punya.
3. [ ] Migrasi 9 komponen di tabel Bagian 2.2 dari class `reveal-up` manual ke `data-motion`.
4. [ ] Update `GUIDELINES.md` Section 6.2 sesuai Bagian 3.
5. [ ] Draft bagian baru **Script Loading Order** di `MODULAR_COMPONENTS_SPECIFICATION.md` v3.
6. [ ] Draft bagian baru **Page Controller Pattern** di `MODULAR_COMPONENTS_SPECIFICATION.md` v3.
7. [ ] Draft bagian baru **Z-Index Hierarchy** di `MODULAR_COMPONENTS_SPECIFICATION.md` v3.
8. [ ] Konfirmasi keberadaan/isi "Section 13" yang dirujuk `GUIDELINES.md` — tulis jika belum ada.
9. [ ] Setelah Action Items 5–7 selesai, ajukan sebagai `MODULAR_COMPONENTS_SPECIFICATION.md` v3 dengan changelog eksplisit (mengikuti pola Bagian 9 di v2).
