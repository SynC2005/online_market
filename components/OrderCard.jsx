import React from "react";

export default function OrderCard({ order, onSelesai }) {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 mb-4 hover:shadow-md transition-shadow">
      
      {/* Header Card: ID & Waktu */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-blue-50 text-azure-primary font-bold py-1 px-3 rounded-lg text-[12px]">
          {order.id}
        </span>
        <span className="text-[11px] font-medium text-slate-400">{order.time}</span>
      </div>

      {/* Info Pelanggan */}
      <h3 className="text-[16px] font-bold text-slate-900 mb-1">{order.customer}</h3>
      <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">{order.address}</p>

      {/* Rincian Item (Dalam kotak abu-abu) */}
      <div className="bg-slate-50 p-4 rounded-2xl mb-5 border border-slate-100">
        <p className="text-[10px] font-extrabold text-slate-400 mb-3 tracking-widest uppercase">
          Item Belanja
        </p>
        <div className="flex flex-col gap-2.5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[13px]">
              <span className="text-slate-600 font-medium">{item.qty}× {item.name}</span>
              <span className="text-slate-900 font-bold">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Tombol */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Total Pembayaran</p>
        <h2 className="text-[22px] font-extrabold text-slate-900 mb-5">{order.total}</h2>
      </div>
      
      <button 
        className="w-full bg-azure-primary hover:bg-azure-secondary text-white py-3.5 rounded-xl text-[14px] font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] outline-none" 
        onClick={onSelesai}
      >
        Selesaikan Orderan
      </button>
    </div>
  );
}