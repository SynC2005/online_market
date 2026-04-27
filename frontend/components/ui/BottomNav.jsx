"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Truck, LogOut } from 'lucide-react'; // Tambah LogOut
import { signOut } from 'next-auth/react'; // Tambah signOut

export default function BottomNav() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Menghapus sesi dan mengarahkan kembali ke halaman login
    signOut({ callbackUrl: '/login' });
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
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <LogOut size={24} color="#ef4444" /> {/* Warna merah agar terlihat sebagai aksi logout */}
        <span style={{ color: '#ef4444' }}>Logout</span>
      </button>
    </nav>
  );
}
