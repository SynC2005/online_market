"use client";

import React, { useState, useEffect } from "react";
// 1. IMPORT SERVER ACTIONS (Bukan Supabase lagi)
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

  // 2. FETCH DATA MENGGUNAKAN SERVER ACTION
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      
      // Panggil fungsi backend
      const response = await getActiveOrders();

      if (response.success) {
        // Format datanya agar cantik untuk ditampilkan
        const formattedOrders = response.data.map((order) => {
          const orderDate = new Date(order.created_at);
          const formatRupiah = (angka) => 
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

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
      } else {
        console.error("Gagal load data dari server:", response.message);
      }
      
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  // 3. SELESAIKAN ORDER MENGGUNAKAN SERVER ACTION
  const handleSelesaikanOrder = async (orderId) => {
    // Optimistic UI: Langsung hapus dari layar agar terasa instan
    setOrders(prev => prev.filter(o => o.id !== orderId));
    
    // Panggil fungsi backend di balik layar
    const response = await completeOrder(orderId);
    
    // Jika ternyata gagal di database, kita kembalikan (reload) datanya
    if (!response.success) {
      alert("Gagal menyelesaikan orderan di server. Halaman akan dimuat ulang.");
      window.location.reload(); 
    }
  };

  const todayRevenue = orders.reduce((acc, curr) => acc + curr.rawTotal, 0);
  const formatRupiah = (angka) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

  return (
    <div className="admin-container">
      
      {/* --- HEADER --- */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="admin-avatar-box">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Admin" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <h1 className="admin-title">Active Orders</h1>
        </div>
        <button className="icon-btn" style={{ position: 'relative', color: '#3b82f6' }}>
          <Bell size={24} />
          {orders.length > 0 && <span className="notification-dot"></span>}
        </button>
      </header>

      {/* --- STATISTIC CARDS --- */}
      <div className="stats-grid">
        <div className="stat-card stat-card-flex">
          <div>
            <p className="stat-label">Pending Orders</p>
            <h2 className="stat-value">{orders.length}</h2>
          </div>
          <div className="stat-icon-box blue-box">
            <ClipboardList size={24} color="#2563eb" />
          </div>
        </div>

        <div className="stat-card stat-card-flex">
          <div>
            <p className="stat-label">Today's Revenue</p>
            <h2 className="stat-value">{formatRupiah(todayRevenue)}</h2>
          </div>
          <div className="stat-icon-box stat-icon-purple">
            <Banknote size={24} />
          </div>
        </div>

        <div className="stat-card stat-card-flex">
          <div>
            <p className="stat-label">Active Packers</p>
            <h2 className="stat-value">5</h2>
          </div>
          <div className="stat-icon-box stat-icon-indigo">
            <UserCheck size={24} />
          </div>
        </div>
      </div>

      {/* --- ORDER LIST SECTION --- */}
      <div style={{ paddingBottom: '40px' }}>
        <div className="ao-section-header">
          <h2 className="section-title">Daftar Pesanan</h2>
          {orders.length > 0 && (
            <span className="ao-badge-new">{orders.length} Baru</span>
          )}
        </div>

        <div className="ao-list">
          {isLoading ? (
            <div className="ao-empty-state">
              <Hourglass size={32} color="#94a3b8" className="animate-spin" />
              <h3 className="ao-empty-text">Memuat data...</h3>
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
            <div className="ao-empty-state">
              <ClipboardList size={32} color="#94a3b8" />
              <h3 className="ao-empty-text">Tidak ada pesanan aktif</h3>
              <p className="ao-empty-subtext">Semua pesanan telah diproses.</p>
            </div>
          )}
          
          {!isLoading && orders.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '16px', color: '#94a3b8' }}>
               <Hourglass size={16} style={{ display: 'inline-block', marginRight: '8px' }} />
               <span style={{ fontSize: '11px' }}>Monitoring Real-time Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM NAVIGATION --- */}
      <AdminBottomNav />

    </div>
  );
}