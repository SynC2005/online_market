"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
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
    <div className="admin-container bg-light-gray">
      {/* Header */}
      <header className="manage-header">
        <button className="icon-btn-blue" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="manage-title">Tambah Produk Baru</h1>
        <div style={{ width: 24 }}></div>
      </header>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="admin-form-container">
        
        {/* Input URL Gambar */}
        <div className="form-group">
          <label>URL Gambar Produk *</label>
          <div className="image-preview-box">
            {formData.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={formData.image} alt="Preview" className="preview-img" />
            ) : (
              <div className="placeholder-img">
                <ImageIcon size={32} color="#94a3b8" />
                <span>Belum ada gambar</span>
              </div>
            )}
          </div>
          <input 
            type="url" 
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Tempel link gambar di sini (cth: https://...)" 
            className="form-input"
          />
        </div>

        {/* Input Nama Produk */}
        <div className="form-group">
          <label>Nama Produk *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="cth: Apel Fuji Manis" 
            className="form-input"
          />
        </div>

        {/* Input Kategori */}
        <div className="form-group">
          <label>Kategori *</label>
          <input 
            type="text" 
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="cth: SAYURAN, MINUMAN, ALAT TULIS..." 
            className="form-input"
          />
        </div>

        {/* Input Harga - Diubah ke tipe Number */}
        <div className="form-group">
          <label>Harga (Rp) *</label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="cth: 15000 (Tanpa titik)" 
            className="form-input"
            min="0"
          />
        </div>

        {/* Input Stok (Quantity) - Diubah ke tipe Number */}
        <div className="form-group">
          <label>Stok Produk *</label>
          <input 
            type="number" 
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="cth: 50" 
            className="form-input"
            min="0"
          />
        </div>

        {/* Input Deskripsi */}
        <div className="form-group">
          <label>Deskripsi Singkat</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Jelaskan detail produk atau info stok..." 
            className="form-input textarea-input"
            rows="3"
          ></textarea>
        </div>

        {/* Tombol Simpan */}
        <button type="submit" className="btn-save-product" disabled={loading}>
          {loading ? 'Menyimpan...' : (
            <>
              <Save size={18} /> Simpan Produk
            </>
          )}
        </button>

      </form>
    </div>
  );
}