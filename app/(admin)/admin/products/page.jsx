"use client";

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Plus, Search, Trash2, Pencil 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminBottomNav from '@/components/ui/AdminBottomNav'; 

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // State baru untuk menyimpan daftar kategori yang dinamis
  const [categories, setCategories] = useState(['Semua']); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setProducts(data);
        
        // --- LOGIKA UNTUK MENGEKSTRAK KATEGORI UNIK ---
        // 1. Ambil semua nilai 'category' dari data produk
        const allCategories = data.map(product => product.category);
        
        // 2. Gunakan Set untuk membuang duplikat (misal ada 5 produk 'DAIRY', jadikan 1 saja)
        const uniqueCategories = [...new Set(allCategories)];
        
        // 3. Gabungkan 'Semua' dengan kategori unik yang ditemukan
        setCategories(['Semua', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Update products state
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        
        // (Opsional) Update kategori juga jika produk yang dihapus adalah produk terakhir di kategorinya
        const remainingCategories = [...new Set(updatedProducts.map(p => p.category))];
        setCategories(['Semua', ...remainingCategories]);
        
        // Jika kategori aktif terhapus, kembalikan filter ke 'Semua'
        if (!remainingCategories.includes(activeCategory) && activeCategory !== 'Semua') {
          setActiveCategory('Semua');
        }

        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting product:', error.message);
        alert('Gagal menghapus produk.');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-container bg-light-gray">
      <header className="manage-header">
        <button className="icon-btn-blue" onClick={() => router.back()}><ArrowLeft size={20} /></button>
        <h1 className="manage-title">Kelola Produk</h1>
        <button 
          className="icon-btn-blue" 
          onClick={() => router.push('/admin/products/add')}
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="search-wrapper">
        <Search size={18} className="search-icon-inside" />
        <input 
          type="text" 
          placeholder="Cari nama produk atau SKU..." 
          className="search-input-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Chips - Sekarang menggunakan data dinamis (categories) */}
      <div className="filter-scroll-container">
        {categories.map((category, index) => (
          <button 
            key={index}
            className={`filter-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="admin-product-list">
        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Memuat data...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="admin-product-card">
              <div className="admin-product-img-wrapper">
                <span className="category-badge" style={{ backgroundColor: '#c7b8ea' }}>
                  {product.category}
                </span>
                <img src={product.image} alt={product.name} className="admin-product-img" />
              </div>

              <div className="admin-product-info">
                <h3 className="admin-product-name">{product.name}</h3>
                <p className="admin-product-stock">
                  Stok: Tersedia
                </p>
                
                <div className="admin-product-footer">
                  <span className="admin-product-price">{product.price}</span>
                  <div className="admin-action-buttons">
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => alert(`Edit fitur untuk ID: ${product.id} belum dibuat`)}
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Tidak ada produk ditemukan.</p>
        )}
      </div>

      <AdminBottomNav />
      
    </div>
  );
}