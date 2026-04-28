"use client";

import React, { useState, useEffect } from "react";
import { getActiveOrders, completeOrder } from "@/app/actions/orderActions";
import { 
  Bell, 
  ClipboardList, 
  Banknote, 
  UserCheck, 
  Hourglass 
} from "lucide-react";
import OrderCard from "@/components/OrderCard"; 
import AdminBottomNav from "@/components/AdminBottomNav";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const response = await getActiveOrders();

      if (response.success) {
        const formatRupiah = (angka) => 
          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

        const formattedOrders = response.data.map((order) => {
          const orderDate = new Date(order.created_at);
          return {
            id: order.order_id,
            time: orderDate.toLocaleString('id-ID', { 
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            }),
            customer: order.user_email.split('@')[0],
            address: order.shipping_address,
            status: order.status,
            items: order.order_items.map(item => ({
              qty: item.quantity,
              name: item.product_name,
              price: formatRupiah(item.price_at_purchase)
            })),
            total: formatRupiah(order.total_amount),
            rawTotal: order.total_amount
          };
        });
        setOrders(formattedOrders);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const handleSelesaikanOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    const response = await completeOrder(orderId);
    if (!response.success) {
      alert("Gagal menyelesaikan orderan. Halaman akan dimuat ulang.");
      window.location.reload(); 
    }
  };

  const todayRevenue = orders.reduce((acc, curr) => acc + curr.rawTotal, 0);
  const formatRupiah = (angka) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

  return (
    <div className="min-h-screen bg-azure-bg pb-24 font-sans text-slate-800 max-w-[420px] mx-auto">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 bg-azure-bg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Admin" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Active Orders</h1>
        </div>
        <button className="relative p-2 text-azure-primary hover:bg-blue-50 rounded-xl transition-colors">
          <Bell size={24} />
          {orders.length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-azure-bg"></span>
          )}
        </button>
      </header>

      <div className="px-6 space-y-4">
        
        {/* STATISTIC CARDS */}
        <div className="grid grid-cols-1 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-azure-primary transition-all">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{orders.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-azure-primary">
              <ClipboardList size={24} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-azure-tertiary transition-all">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {formatRupiah(todayRevenue).replace(',00', '')}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-azure-tertiary">
              <Banknote size={24} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-indigo-400 transition-all">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Active Packers</p>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">5</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <UserCheck size={24} />
            </div>
          </div>
        </div>

        {/* ORDER LIST SECTION */}
        <section className="pt-4 pb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">Daftar Pesanan</h2>
            {orders.length > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md shadow-blue-200 uppercase tracking-widest">
                {orders.length} Baru
              </span>
            )}
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-[32px] p-12 border border-dashed border-slate-200 flex flex-col items-center text-center">
                <Hourglass size={32} className="text-azure-neutral animate-spin mb-4" />
                <h3 className="text-[15px] font-bold text-slate-800">Memuat data...</h3>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onSelesai={() => handleSelesaikanOrder(order.id)} 
                />
              ))
            ) : (
              <div className="bg-white rounded-[32px] p-12 border border-dashed border-slate-200 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList size={32} className="text-slate-300" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800">Tidak ada pesanan aktif</h3>
                <p className="text-xs text-slate-400 mt-1">Semua pesanan telah diproses.</p>
              </div>
            )}
            
            {!isLoading && orders.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                <Hourglass size={12} className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Monitoring Real-time Aktif</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <AdminBottomNav />
    </div>
  );
}