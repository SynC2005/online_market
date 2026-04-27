# Product Requirements Document (PRD) - Fluid Market

## 1. Product Overview
**Nama Produk**: Fluid Market  
**Deskripsi**: Fluid Market adalah platform e-commerce (pasar online) tingkat *enterprise* yang berfokus pada penjualan produk segar. Platform ini memfasilitasi transaksi antara penjual (sistem admin), pembeli (pengguna akhir), dan kurir (driver) dalam satu ekosistem yang terintegrasi, aman, dan dapat diskalakan.

**Tujuan Dokumen**: Dokumen ini mendefinisikan fungsionalitas, kapabilitas sistem, target pengguna, dan spesifikasi teknis dari proyek Fluid Market versi 1.0.0.

---

## 2. Target Pengguna (User Personas)
Platform ini membagi pengguna ke dalam tiga peran (Role-Based Access Control):
1. **User (Pembeli)**: Pelanggan yang mencari, melihat, memilih, dan membeli produk segar melalui platform.
2. **Admin (Pengelola Toko)**: Staf/pemilik platform yang mengelola inventori produk, memantau pesanan, dan mengatur operasional sistem.
3. **Driver (Kurir)**: Petugas pengiriman yang melihat jadwal dan rute pengiriman, serta memperbarui status pengantaran pesanan.

---

## 3. Fitur Utama & Functional Requirements

### 3.1. Autentikasi & Otorisasi
- **Login/Register**: Sistem harus menyediakan layanan pendaftaran dan masuk (login) yang aman menggunakan protokol OpenID Connect (OIDC) melalui **Keycloak OIDC** & **NextAuth.js**.
- **Role-Based Access Control (RBAC)**: Sistem harus membatasi akses URL dan data berdasarkan peran (Admin, Driver, User).

### 3.2. Fitur User (Pembeli)
- **Katalog Produk**: User dapat melihat daftar produk segar beserta detailnya (harga, stok, deskripsi).
- **Keranjang Belanja (Shopping Cart)**: User dapat menambahkan produk ke keranjang, merubah kuantitas, dan menghapus item.
- **Checkout**: User dapat melakukan proses checkout dengan memilih kurir pengiriman dan metode pembayaran.
- **Integrasi Pembayaran**: Sistem harus mendukung metode pembayaran yang aman secara langsung menggunakan *payment gateway* **Midtrans**.
- **Lacak Pesanan (Order Tracking)**: User dapat melacak status pesanan mereka secara langsung (misal: Menunggu Pembayaran, Diproses, Sedang Dikirim, Selesai).

### 3.3. Fitur Admin
- **Manajemen Produk (CRUD)**: Admin dapat menambahkan produk baru, memperbarui informasi (harga, gambar, stok), dan menghapus produk.
- **Manajemen Pesanan**: Admin dapat melihat dan mengelola semua transaksi/pesanan dari sisi toko.
- **Admin Dashboard**: Tampilan analitik dan ringkasan operasional untuk keperluan pemantauan toko secara real-time.

### 3.4. Fitur Driver
- **Driver Dashboard**: Tampilan khusus untuk driver untuk melihat daftar pesanan yang harus dikirim.
- **Update Status Pengiriman**: Driver dapat merubah status pesanan setelah pengantaran berhasil diselesaikan.

---

## 4. Non-Functional Requirements (NFR)

### 4.1. Keamanan (Security)
*Target Security Score: 7.5/10 (Iterasi 1.0.0), 9/10 (Q3 2026).*
- **Data Protection & Privasi**: Menerapkan Row-Level Security (RLS) di PostgreSQL dan meminimalkan eksploitasi data (GDPR compliant).
- **Pencegahan Ancaman**: Harus terlindungi dari kerentanan OWASP Top 10, termasuk Session Hijacking, SQL Injection (dengan Supabase client), XSS (via Next.js), CSRF, dan DDoS (via Vercel CDN Node).
- **HTTPS Enforced**: Semua komunikasi client-server dan API harus dilindungi enkripsi TLS/SSL standar industri.

### 4.2. Performa & Skalabilitas
- **Responsivitas**: Response Time (p95) maksimum 150ms.
- **Page Load Metrics**: First Contentful Paint (FCP) < 1.5 detik, Largest Contentful Paint (LCP) < 2.5 detik.
- **Availability**: Sistem diharapkan memiliki Uptime Rate sebesar 99.5% untuk app dan 99.99% untuk database.

### 4.3. Skema Deploy & CI/CD
- **Otomatisasi Pipeline**: Terdapat 7 stage GitHub Actions CI/CD meliputi kode *linting*, pemindaian keamanan (npm audit, SAST), *type checking*, kompilasi *build*, Docker image creation, dan otomatisasi deployment.
- **Containerization**: Menggunakan Docker dengan dukungan *Multi-stage builds* agar *image build* sangat minimal (~180MB).

---

## 5. Technology Stack & Infrastructure

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Keycloak OIDC + NextAuth.js
- **Payment Gateway**: Midtrans
- **Hosting & CDN**: Vercel (Production CDN & Serverless API)
- **Container**: Docker
- **Pipeline & Automation**: GitHub Actions

---

## 6. Project Milestones & Roadmap (Next Steps)

1. **Short-Term (Fase Staging & Testing)**
   - Implementasi pada *environment* Staging (Docker/Vercel).
   - Validasi penuh setiap fitur E2E dan *health checks*.
   - Testing Payment Gateway Mode Sandbox (Midtrans).

2. **Medium-Term (Produksi Bulan Pertama)**
   - Rilis di Vercel (*Production Environment*).
   - Memonitor *analytics* (Vercel Speed Insights).
   - Mengumpulkan masukan dari pembeli dan pengelolaan toko.

3. **Long-Term (Q2-Q3 2026)**
   - Integrasi Rate Limiting di Gateway atau Middleware.
   - Pembangunana sistem Audit Logging.
   - Target peningkatan *Security Score* secara komprehensif ke level 9/10.

---
*Dokumen ini merupakan ringkasan PRD. Detail arsitektur teknis lebih lanjut dapat dilihat pada `SYSTEM_ARCHITECTURE.md` dan detail penanganan ancaman keamanan pada `THREAT_MODELING.md`.*
