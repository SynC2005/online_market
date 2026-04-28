"use client";

import React, { useEffect, useState } from 'react';
import { 
  Menu, Banknote, ShoppingBag, User, 
  TrendingUp, Sparkles, Droplet,
  Users, BarChart2
} from 'lucide-react';
import AdminBottomNav from '@/components/AdminBottomNav';
import { getDashboardStats } from '@/app/actions/adminActions'; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    topProducts: [],
    topCustomers: [],
    lowStock: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
      setIsLoading(false);
    }
    loadStats();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-azure-bg text-slate-500 font-sans">
        Memuat Analytics...
      </div>
    );
  }

  return (
    <div className="bg-azure-bg min-h-screen pb-24 font-sans text-slate-800 max-w-[420px] mx-auto">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 pb-2 sticky top-0 bg-azure-bg z-50">
        <div className="flex items-center gap-3">
          <Menu size={24} className="text-slate-700" />
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Market Admin</h1>
        </div>
        <div className="w-10 h-10 bg-teal-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
          <User size={20} color="white" />
        </div>
      </header>

      <div className="px-6 pt-4">
        <h2 className="text-[34px] font-extrabold text-slate-900 leading-[1.1]">Performance<br/>Overview</h2>
        <p className="text-[13px] text-slate-500 mt-2">Azure Market real-time analytics and store management dashboard.</p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-indigo-50 text-indigo-600 py-3.5 px-4 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ShoppingBag size={18} /> Kelola Produk
          </button>
          <button className="flex-1 bg-azure-primary text-white py-3.5 px-4 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
            <BarChart2 size={18} /> Kelola Promo
          </button>
        </div>

        {/* REVENUE CARD */}
        <div className="bg-white rounded-[32px] p-6 mt-8 shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                <Banknote size={24} className="text-slate-600" />
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                <TrendingUp size={12} /> 12.5%
              </div>
            </div>
            <p className="text-slate-500 text-[13px] mt-4 font-bold uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(stats.totalRevenue).replace(',00', '')}
            </h3>
            
            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-azure-primary w-3/4 h-full rounded-full transition-all duration-1000"></div>
              </div>
              <span className="text-[11px] text-slate-500 font-bold">75% of target</span>
            </div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* TOTAL ORDERS CARD */}
        <div className="bg-white rounded-[32px] p-6 mt-4 shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
              <ShoppingBag size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">Total Orders</p>
            <h3 className="text-4xl font-extrabold text-slate-900 mt-1">{stats.totalOrders.toLocaleString('id-ID')}</h3>
            <p className="text-[11px] font-extrabold text-azure-primary mt-2 tracking-widest uppercase">+84 FROM YESTERDAY</p>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* ACTIVE CUSTOMERS CARD */}
        <div className="bg-azure-tertiary rounded-[32px] p-6 mt-4 shadow-xl shadow-purple-500/20 relative overflow-hidden group">
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start">
              <Sparkles size={28} className="text-purple-200" />
              <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-lg font-extrabold tracking-widest uppercase">PREMIUM</span>
            </div>
            <p className="text-purple-100 text-[13px] font-bold mt-6 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-4xl font-extrabold mt-1 tracking-tight">{stats.totalCustomers}</h3>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
        </div>

        {/* RECENT SALES BREAKDOWN */}
        <div className="bg-white rounded-[32px] p-6 mt-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-[15px]">Recent Sales Breakdown</h3>
            <span className="text-[12px] text-azure-primary font-bold cursor-pointer hover:underline">View All</span>
          </div>

          <div className="flex flex-col gap-5">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <Droplet size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Produk Terlaris</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-900 text-sm">--</h4>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">{product.units} units</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && <p className="text-sm text-slate-400 text-center py-4 italic">Belum ada data penjualan.</p>}
          </div>
        </div>

        {/* TOP CUSTOMER ANALYTICS */}
        <div className="bg-blue-50 rounded-[32px] p-6 mt-6 mb-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-[15px]">Top Customer Analytics</h3>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-azure-primary">
              <Users size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {stats.topCustomers.map((customer, idx) => {
              const colors = ['bg-blue-400', 'bg-purple-400', 'bg-indigo-400'];
              const bgColor = colors[idx % colors.length];

              return (
                <div key={idx} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm`}>
                      {getInitials(customer.user_email)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm truncate w-24 sm:w-32">{customer.user_email.split('@')[0]}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loyal Customer</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">Orders</p>
                      <p className="font-extrabold text-slate-900 text-[13px]">{customer.order_count}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase">Spent</p>
                      <p className="font-extrabold text-slate-900 text-[13px]">{formatRupiah(customer.total_spent).replace('Rp', '').split(',')[0]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {stats.topCustomers.length === 0 && <p className="text-sm text-slate-400 text-center bg-white p-4 rounded-2xl italic">Belum ada pelanggan.</p>}
          </div>
        </div>

        {/* STOCK INVENTORY ALERTS */}
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Stock Inventory<br/>Alerts</h3>
            <span className="bg-red-50 text-red-600 text-[11px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {stats.lowStock.length} items low
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {stats.lowStock.map((item, idx) => (
              <div key={idx} className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 transition-all hover:scale-[1.02] ${item.quantity < 5 ? 'border-red-500' : 'border-azure-primary'}`}>
                <p className="text-[11px] text-slate-400 font-bold uppercase truncate mb-1">{item.name}</p>
                <h4 className="font-extrabold text-slate-900 text-lg">{item.quantity} <span className="text-[10px] text-slate-400">units</span></h4>
              </div>
            ))}
            {stats.lowStock.length === 0 && <p className="col-span-2 text-sm text-slate-500 text-center py-6 bg-white rounded-3xl border border-dashed border-slate-200">Semua stok aman terjaga ✅</p>}
          </div>
        </div>

      </div>

      <AdminBottomNav />
    </div>
  );
}