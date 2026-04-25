"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductImage from '@/frontend/components/ui/ProductImage';
import { createProduct } from '@/frontend/products/service';
import { buildProductPayload, isProductFormComplete } from '@/frontend/products/utils';

const INITIAL_FORM_DATA = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  description: '',
  image: '',
};

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'category' ? value.toUpperCase() : value;
    
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!isProductFormComplete(formData)) {
      alert('Nama, Kategori, Harga, Stok, dan URL Gambar wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      await createProduct(buildProductPayload(formData));

      alert('Produk berhasil ditambahkan!');
      router.push('/admin/products'); 
      
    } catch (error) {
      console.error('Error adding product:', error.message);
      alert('Gagal menambahkan produk: ' + error.message);
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
        
        <div className="form-group">
          <label>URL Gambar Produk *</label>
          <div className="image-preview-box">
            {formData.image ? (
              <ProductImage src={formData.image} alt="Preview" className="preview-img" />
            ) : (
              <div className="placeholder-img">
                <ImageIcon size={32} color="#94a3b8" />
                <span>Belum ada gambar</span>
              </div>
            )}
          </div>
          <input 
            type="text" 
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Tempel link gambar di sini (cth: https://...)" 
            className="form-input"
          />
        </div>

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

        <div className="form-group">
          <label>Harga *</label>
          <input 
            type="text" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="cth: Rp 15.000" 
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Stok *</label>
          <input
            type="number"
            min="0"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="cth: 25"
            className="form-input"
          />
        </div>

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
