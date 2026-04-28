"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ShoppingCart, User } from 'lucide-react';

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-[9999]">
      <nav className="bg-white flex justify-around items-center pt-3 pb-4 px-2 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] w-full">
        
        {/* Tombol Dashboard */}
        <Link 
          href="/admin" 
          className={`flex flex-col items-center flex-1 cursor-pointer transition-colors ${pathname === '/admin' ? 'text-azure-primary' : 'text-slate-400'}`}
        >
          <div className={`flex items-center justify-center transition-all ${pathname === '/admin' ? 'bg-blue-50 px-4 py-1.5 rounded-2xl' : ''}`}>
            <LayoutGrid size={20} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.5px] mt-1">DASHBOARD</span>
        </Link>

        {/* Tombol Kelola Produk */}
        <Link 
          href="/admin/products" 
          className={`flex flex-col items-center flex-1 cursor-pointer transition-colors ${pathname?.includes('/admin/products') ? 'text-azure-primary' : 'text-slate-400'}`}
        >
          <div className={`flex items-center justify-center transition-all ${pathname?.includes('/admin/products') ? 'bg-blue-50 px-4 py-1.5 rounded-2xl' : ''}`}>
            <Package size={20} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.5px] mt-1">PRODUK</span>
        </Link>

        {/* Tombol Pesanan */}
        <Link 
          href="/admin/orders" 
          className={`flex flex-col items-center flex-1 cursor-pointer transition-colors ${pathname === '/admin/orders' ? 'text-azure-primary' : 'text-slate-400'}`}
        >
          <div className={`flex items-center justify-center transition-all ${pathname === '/admin/orders' ? 'bg-blue-50 px-4 py-1.5 rounded-2xl' : ''}`}>
            <ShoppingCart size={20} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.5px] mt-1">PESANAN</span>
        </Link>

        {/* Tombol Profil */}
        <Link 
          href="/admin/profile" 
          className={`flex flex-col items-center flex-1 cursor-pointer transition-colors ${pathname === '/admin/profile' ? 'text-azure-primary' : 'text-slate-400'}`}
        >
          <div className={`flex items-center justify-center transition-all ${pathname === '/admin/profile' ? 'bg-blue-50 px-4 py-1.5 rounded-2xl' : ''}`}>
            <User size={20} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.5px] mt-1">PROFIL</span>
        </Link>

      </nav>
    </div>
  );
}