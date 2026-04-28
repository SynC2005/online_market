"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Truck, LogOut } from 'lucide-react';
import { logoutUser } from '@/app/actions/authActions'; 

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter(); 

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[380px] bg-white flex justify-around p-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.05)] z-[999]">
      
      {/* Home */}
      <Link 
        href="/home" 
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[11px] font-medium transition-all ${pathname === '/home' ? 'text-azure-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      {/* Orders */}
      <Link 
        href="/home/order_list" 
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[11px] font-medium transition-all ${pathname === '/home/order_list' ? 'text-azure-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <FileText size={24} />
        <span>Orders</span>
      </Link>

      {/* Delivery */}
      <Link 
        href="/home/delivery" 
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[11px] font-medium transition-all ${pathname === '/home/delivery' ? 'text-azure-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Truck size={24} />
        <span>Delivery</span>
      </Link>

      {/* Tombol Logout */}
      <button 
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[11px] font-medium text-red-500 hover:bg-red-50 transition-all outline-none"
      >
        <LogOut size={24} /> 
        <span>Logout</span>
      </button>

    </nav>
  );
}