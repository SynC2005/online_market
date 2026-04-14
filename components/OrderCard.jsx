import React from "react";

// Terima prop 'onSelesai' yang dilempar dari komponen induk
export default function OrderCard({ order, onSelesai }) {
  return (
    <div className="ao-card">
      <div className="ao-card-header">
        <span className="ao-id">{order.id}</span>
        <span className="ao-time">{order.time}</span>
      </div>

      <h3 className="ao-customer">{order.customer}</h3>
      <p className="ao-address">{order.address}</p>

      <div className="ao-items-box">
        <p className="ao-items-title">ITEM BELANJA</p>
        <div>
          {order.items.map((item, idx) => (
            <div key={idx} className="ao-item-row">
              <span className="ao-item-name">{item.qty}× {item.name}</span>
              <span className="ao-item-price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="ao-total-label">Total Pembayaran</p>
        <h2 className="ao-total-value">{order.total}</h2>
      </div>
      
      {/* 4. HUBUNGKAN TOMBOL DENGAN FUNGSI */}
      <button 
        className="btn-solid-blue" 
        style={{ marginTop: 0 }}
        onClick={onSelesai} // <-- Tambahkan onClick di sini
      >
        Selesaikan Orderan
      </button>
    </div>
  );
}