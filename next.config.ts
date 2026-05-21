import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pengaturan bawaan Anda
  output: 'standalone',

  // 1. Memperbaiki "Server Leaks Information via X-Powered-By" (ZAP: Low)
  poweredByHeader: false,

  // 2. Pengaturan Redirect bawaan Anda
  async redirects() {
    return [
      {
        source: '/',          // Ketika user mengakses root/domain utama
        destination: '/login', // Otomatis diarahkan ke halaman login
        permanent: true,       // true = redirect permanen (301)
      },
    ];
  },

  // 3. Tambahan Security Headers untuk memperbaiki ZAP Report (Medium & Low)
  async headers() {
    return [
      {
        // Menerapkan header ini untuk SEMUA rute aplikasi (/(.*))
        source: '/(.*)',
        headers: [
          {
            // Memperbaiki "Missing Anti-clickjacking Header"
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Memperbaiki "X-Content-Type-Options Header Missing"
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Memperbaiki "Permissions Policy Header Not Set"
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            // Memperbaiki "Cross-Origin-Opener-Policy Header Missing"
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            // Memperbaiki "Cross-Origin-Embedder-Policy Header Missing"
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            // Memperbaiki "Cross-Origin-Resource-Policy Header Missing"
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          {
            // Standar keamanan tambahan yang direkomendasikan
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // Memperbaiki "Content Security Policy (CSP) Header Not Set"
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
          }
        ],
      },
    ];
  },
};

export default nextConfig;