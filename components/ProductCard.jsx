import React from "react";
import { Heart, Plus } from "lucide-react";

export default function ProductCard({
  id, image, category, name, price, description, onAddToCart,
}) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price, image, category });
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-3 relative shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow group">
      
      {/* Gambar Produk */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={image} 
        alt={name} 
        className="w-full h-[120px] object-cover rounded-2xl mb-3 bg-slate-50" 
      />

      {/* Tombol Favorit di atas gambar */}
      <button className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm outline-none">
        <Heart size={16} />
      </button>

      {/* Info Produk (Menggunakan flex-1 agar tombol Plus selalu di bawah) */}
      <div className="flex flex-col flex-1 px-1">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
          {category}
        </span>
        
        {/* line-clamp-1 memotong teks menjadi 1 baris saja */}
        <h4 className="text-[14px] font-bold text-slate-900 mt-1 mb-1.5 line-clamp-1">
          {name}
        </h4>
        
        {/* line-clamp-2 memotong teks menjadi maksimal 2 baris */}
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {description}
        </p>

        {/* Harga & Tombol Add */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-[15px] font-extrabold text-azure-primary">
            Rp {price.toLocaleString("id-ID")}
          </span>
          <button 
            className="bg-azure-primary hover:bg-azure-secondary text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm shadow-blue-500/30 active:scale-90 group-hover:scale-105 outline-none" 
            onClick={handleAddToCart}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}