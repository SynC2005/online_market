"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, User } from 'lucide-react';

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <div className="admin-bottom-nav-wrapper">
      <nav className="admin-bottom-nav">
        {/* Tombol Dashboard */}
        <Link 
          href="/admin" 
          className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}
        >
          <div className={pathname === '/admin' ? 'active-icon-wrapper' : ''}>
            <LayoutGrid size={20} />
          </div>
          <span>DASHBOARD</span>
        </Link>

        {/* Tombol Kelola Produk */}
        <Link 
          href="/admin/products" 
          className={`nav-item ${pathname.includes('/admin/products') ? 'active' : ''}`}
        >
          <div className={pathname.includes('/admin/products') ? 'active-icon-wrapper' : ''}>
            <Package size={20} />
          </div>
          <span>PRODUK</span>
        </Link>

        {/* Tombol Pesanan */}
        <Link 
          href="/admin/orders" 
          className={`nav-item ${pathname === '/admin/orders' ? 'active' : ''}`}
        >
          <div className={pathname === '/admin/orders' ? 'active-icon-wrapper' : ''}>
            <ShoppingCart size={20} />
          </div>
          <span>PESANAN</span>
        </Link>

        {/* Tombol Profil */}
        <Link 
          href="/admin/profile" 
          className={`nav-item ${pathname === '/admin/profile' ? 'active' : ''}`}
        >
          <div className={pathname === '/admin/profile' ? 'active-icon-wrapper' : ''}>
            <User size={20} />
          </div>
          <span>PROFIL</span>
        </Link>
      </nav>
    </div>
  );
}