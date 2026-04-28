"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addProductBackend } from '@/app/actions/productActions';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    price: '',
    quantity: '', 
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'category' ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.price || !formData.image || !formData.category || !formData.quantity) {
      alert('Nama, Kategori, Harga, Stok, dan URL Gambar wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      const result = await addProductBackend(formData);

      if (result.success) {
        alert('✅ Produk berhasil ditambahkan!');
        router.push('/admin/products'); 
      } else {
        alert('❌ Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-azure-bg pb-20 font-sans text-slate-800 max-w-[420px] mx-auto">
      
      {/* Header Statis */}
      <header className="flex justify-between items-center p-6 bg-azure-bg sticky top-0 z-50">
        <button 
          className="p-2 bg-white rounded-xl shadow-sm text-azure-primary active:scale-90 transition-transform" 
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Tambah Produk</h1>
        <div className="w-10"></div> {/* Spacer balance */}
      </header>

      {/* Container Form */}
      <div className="px-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 space-y-5 border border-slate-100">
          
          {/* Pratinjau Gambar */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pratinjau Gambar</label>
            <div className="w-full h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
              {formData.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300 font-bold">
                  <ImageIcon size={40} />
                  <span className="text-xs">Belum ada gambar</span>
                </div>
              )}
            </div>
          </div>

          {/* URL Gambar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Gambar Produk *</label>
            <input 
              type="url" 
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..." 
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Nama Produk */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="cth: Apel Fuji Manis" 
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Grid Harga & Stok */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori *</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="cth: BUAH" 
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 uppercase font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok *</label>
              <input 
                type="number" 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="50" 
                className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
                min="0"
              />
            </div>
          </div>

          {/* Harga */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Rp) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="15000" 
                className="w-full bg-slate-50 border-none py-4 pl-12 pr-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 font-bold text-azure-primary"
                min="0"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail produk..." 
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 resize-none"
              rows="3"
            ></textarea>
          </div>

          {/* Tombol Simpan */}
          <button 
            type="submit" 
            className="w-full bg-azure-primary hover:bg-azure-secondary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} /> Simpan Produk
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}