"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Tambahkan useRouter di sini
import { Home, FileText, Truck, LogOut } from 'lucide-react';
import { logoutUser } from '@/app/actions/authActions'; // Menggunakan fungsi kustom kita

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter(); // Inisialisasi router untuk pindah halaman

  const handleLogout = async () => {
    // 1. Panggil fungsi logout dari server action (akan menghapus cookies dan sesi supabase)
    await logoutUser();
    
    // 2. Lempar pengguna kembali ke halaman login
    router.push('/login');
  };

  return (
    <nav className="bottom-nav">
      {/* Home */}
      <Link 
        href="/home" 
        className={`nav-item ${pathname === '/home' ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      {/* Orders */}
      <Link 
        href="/home/order_list" 
        className={`nav-item ${pathname === '/home/order_list' ? 'active' : ''}`}
      >
        <FileText size={24} />
        <span>Orders</span>
      </Link>

      {/* Delivery */}
      <Link 
        href="/home/delivery" 
        className={`nav-item ${pathname === '/home/delivery' ? 'active' : ''}`}
      >
        <Truck size={24} />
        <span>Delivery</span>
      </Link>

      {/* Tombol Logout */}
      <button 
        onClick={handleLogout}
        className="nav-item logout-btn"
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px' // Sedikit jarak antara icon dan teks agar rapi
        }}
      >
        <LogOut size={24} color="#ef4444" /> {/* Warna merah agar terlihat sebagai aksi logout */}
        <span style={{ color: '#ef4444', fontSize: '12px' }}>Logout</span>
      </button>
    </nav>
  );
}