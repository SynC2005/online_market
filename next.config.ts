import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',          // Ketika user mengakses root/domain utama
        destination: '/login', // Otomatis diarahkan ke halaman login
        permanent: true,       // true = redirect permanen (301)
      },
    ];
  },
};

export default nextConfig;