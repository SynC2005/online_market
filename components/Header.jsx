import React from 'react';
import { Menu, ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-6 pt-4 px-1">
      <button className="text-slate-800 hover:text-azure-primary transition-colors outline-none">
        <Menu size={24} />
      </button>
      
      <h1 className="text-xl font-extrabold text-slate-900">Azure Market</h1>
      
      <div className="relative">
        <button className="text-slate-800 hover:text-azure-primary transition-colors outline-none">
          <ShoppingCart size={24} />
        </button>
        {/* Badge Notifikasi Keranjang */}
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-azure-bg">
          3
        </span>
      </div>
    </header>
  );
}