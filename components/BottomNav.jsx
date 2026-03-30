"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Truck } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {/* Mengarah ke /home sesuai foldermu app/home/page.jsx */}
      <Link 
        href="/home" 
        className={`nav-item ${pathname === '/home' ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      {/* Mengarah ke /home/order_list */}
      <Link 
        href="/home/order_list" 
        className={`nav-item ${pathname === '/home/order_list' ? 'active' : ''}`}
      >
        <FileText size={24} />
        <span>Orders</span>
      </Link>

      {/* Mengarah ke /home/delivery */}
      <Link 
        href="/home/delivery" 
        className={`nav-item ${pathname === '/home/delivery' ? 'active' : ''}`}
      >
        <Truck size={24} />
        <span>Delivery</span>
      </Link>
    </nav>
  );
}