# Ilustrasi Struktur Project

Dokumen ini menjelaskan fungsi tiap komponen utama dalam project `online_market`.

## Gambaran Besar

```flowchart TB
  %% ===== USER LAYER =====
  User["User / Admin"]

  %% ===== PROXY =====
  Proxy["proxy.js<br/>proteksi route"]

  %% ===== APP CORE =====
  App["app/<br/>Next.js App Router"]

  %% ===== FRONTEND =====
  subgraph FrontendLayer["Frontend"]
    Pages["app/(frontend)<br/>halaman aplikasi"]
    Frontend["frontend/<br/>komponen UI & client logic"]
    SupabaseClient["frontend/supabase/client.js<br/>Supabase client (public)"]
    ProductService["frontend/products/service.js<br/>CRUD produk"]
  end

  %% ===== BACKEND =====
  subgraph BackendLayer["Backend"]
    Api["app/api<br/>API Routes"]
    Backend["backend/<br/>server logic & auth"]
    SupabaseAdmin["backend/supabase/admin.js<br/>service role"]
    NextAuth["backend/auth/nextauth.js<br/>NextAuth"]
  end

  %% ===== EXTERNAL SERVICES =====
  subgraph External["External Services"]
    Supabase["Supabase<br/>Database"]
    Keycloak["Keycloak<br/>Auth & Roles"]
  end

  %% ===== INFRA =====
  subgraph InfraLayer["Infrastructure"]
    Infra["infra/docker<br/>Docker"]
    Config["config/<br/>Tooling"]
    Scripts["scripts/<br/>Setup"]
  end

  %% ===== FLOW =====
  User --> Proxy
  Proxy --> App
  Proxy --> Backend

  App --> Pages
  App --> Api
  App --> Layout["layout.tsx + globals.css"]

  Pages --> Frontend
  Frontend --> SupabaseClient
  Frontend --> ProductService

  Api --> Backend
  Backend --> SupabaseAdmin
  Backend --> NextAuth

  SupabaseClient --> Supabase
  SupabaseAdmin --> Supabase

  NextAuth --> Keycloak

  Infra --> App
  Config --> App
  Scripts --> Infra
```

## Alur Request

```sequenceDiagram
  %% ===== PARTICIPANTS =====
  participant U as User
  participant P as proxy.js
  participant A as Next.js App
  participant F as Frontend (UI)
  participant B as Backend (API/Auth)
  participant S as Supabase (DB)
  participant K as Keycloak (Auth)

  %% ===== ROUTE ACCESS =====
  U->>P: Akses /home /admin /login
  P->>B: Validasi token & role
  B-->>P: OK / Redirect
  P->>A: Forward request

  %% ===== RENDERING =====
  A->>F: Render halaman
  F->>S: Fetch data (produk/order)
  S-->>F: Return data
  F-->>U: Tampilkan UI

  %% ===== LOGIN FLOW =====
  U->>A: Request login (/api/auth)
  A->>B: Jalankan NextAuth
  B->>K: Validasi kredensial
  K-->>B: Token / user info
  B->>S: Sync user profile & role
  B-->>A: Session dibuat
  A-->>U: Login sukses
```

## Fungsi Folder Utama

| Lokasi            | Fungsi                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `app/`            | Entry routing Next.js. Folder ini menentukan URL aplikasi seperti `/`, `/login`, `/home`, `/admin`, dan `/api/auth`. |
| `app/(frontend)/` | Route group untuk halaman frontend. Nama `(frontend)` tidak muncul di URL, hanya untuk merapikan struktur.           |
| `app/api/`        | API route yang harus tetap berada di dalam `app` agar dikenali Next.js.                                              |
| `frontend/`       | Kode yang dipakai tampilan: komponen UI, constants, product service, dan Supabase client public.                     |
| `backend/`        | Kode server-side: konfigurasi NextAuth, routing auth, dan Supabase admin client.                                     |
| `public/`         | Asset statis yang bisa diakses browser.                                                                              |
| `docs/`           | Dokumentasi project, deployment, arsitektur, threat modeling, dan ringkasan implementasi.                            |
| `infra/docker/`   | File Docker untuk build dan menjalankan aplikasi dengan Docker Compose.                                              |
| `config/`         | Konfigurasi tooling seperti ESLint.                                                                                  |
| `scripts/`        | Script bantuan, misalnya instalasi Docker di WSL.                                                                    |
| `.github/`        | Workflow CI/CD GitHub Actions.                                                                                       |

## Detail Komponen Routing

| Route/File                                           | URL                    | Fungsi                                               |
| ---------------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| `app/layout.tsx`                                     | Semua halaman          | Root layout, font, dan wrapper HTML utama.           |
| `app/globals.css`                                    | Semua halaman          | Style global aplikasi.                               |
| `app/(frontend)/page.tsx`                            | `/`                    | Halaman root aplikasi.                               |
| `app/(frontend)/(auth)/login/page.jsx`               | `/login`               | Halaman login pengguna.                              |
| `app/(frontend)/(user)/home/page.jsx`                | `/home`                | Halaman belanja utama user.                          |
| `app/(frontend)/(user)/home/order_list/page.jsx`     | `/home/order_list`     | Daftar pesanan user.                                 |
| `app/(frontend)/(user)/home/delivery/page.jsx`       | `/home/delivery`       | Tracking pengiriman.                                 |
| `app/(frontend)/(admin)/admin/page.jsx`              | `/admin`               | Dashboard admin.                                     |
| `app/(frontend)/(admin)/admin/products/page.jsx`     | `/admin/products`      | Kelola produk.                                       |
| `app/(frontend)/(admin)/admin/products/add/page.jsx` | `/admin/products/add`  | Tambah produk baru.                                  |
| `app/api/auth/[...nextauth]/route.js`                | `/api/auth/*`          | Entry API NextAuth untuk login/logout/session.       |
| `proxy.js`                                           | Sebelum route tertentu | Cek akses user/admin dan redirect jika belum sesuai. |

## Detail Frontend

| Lokasi                         | Fungsi                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `frontend/components/ui/`      | Komponen tampilan yang dipakai ulang seperti header, nav bawah, kartu order, dan gambar produk. |
| `frontend/constants/`          | Data statis untuk kategori market, order dummy, dan delivery dummy.                             |
| `frontend/products/service.js` | Fungsi akses produk: `getProducts`, `createProduct`, dan `deleteProduct`.                       |
| `frontend/products/utils.js`   | Helper produk seperti format harga dan validasi payload form.                                   |
| `frontend/supabase/client.js`  | Supabase client dengan anon key untuk operasi dari sisi client.                                 |

## Detail Backend

| Lokasi                      | Fungsi                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `backend/auth/nextauth.js`  | Konfigurasi NextAuth, provider Keycloak, callback JWT/session, dan sinkron profil ke Supabase. |
| `backend/auth/routing.js`   | Logic proteksi route berdasarkan token dan role admin/user.                                    |
| `backend/supabase/admin.js` | Supabase admin client memakai service role key. Hanya dipakai server-side.                     |

## File Root Yang Tetap Di Luar Folder

Beberapa file sengaja tetap di root karena dicari otomatis oleh tool:

| File                 | Alasan tetap di root                    |
| -------------------- | --------------------------------------- |
| `package.json`       | Dibaca npm untuk script dan dependency. |
| `package-lock.json`  | Lock dependency npm.                    |
| `next.config.ts`     | Konfigurasi Next.js.                    |
| `tsconfig.json`      | Konfigurasi TypeScript dan path alias.  |
| `postcss.config.mjs` | Konfigurasi PostCSS/Tailwind.           |
| `next-env.d.ts`      | Type declaration otomatis Next.js.      |
| `proxy.js`           | File proxy/middleware Next.js.          |
| `.env.local`         | Environment lokal yang dibaca Next.js.  |
| `.gitignore`         | Aturan file yang diabaikan Git.         |
| `AGENTS.md`          | Instruksi kerja agent di project ini.   |
| `README.md`          | Ringkasan utama repo.                   |

## Mental Model Singkat

- `app/` adalah pintu masuk URL.
- `frontend/` adalah isi tampilan dan interaksi pengguna.
- `backend/` adalah logic server yang tidak boleh terekspos langsung ke browser.
- `infra/`, `config/`, dan `scripts/` adalah alat bantu untuk build, deploy, dan development.
- File root adalah konfigurasi inti agar tool seperti Next.js, npm, Git, dan TypeScript bisa menemukan project dengan benar.
