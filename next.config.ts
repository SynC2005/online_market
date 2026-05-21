// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    // 1. Kebijakan CSP (Dinamis: Longgar di Dev, Ketat di Prod)
    // 'unsafe-eval' hanya dimasukkan saat development untuk Turbopack
    const cspDev = "default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    const cspProd = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://qidxkwuyzdcrjesrczgo.supabase.co;";

    return [
      {
        source: '/(.*)',
        headers: [
          { 
            key: 'Content-Security-Policy', 
            value: isDev ? cspDev : cspProd 
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;