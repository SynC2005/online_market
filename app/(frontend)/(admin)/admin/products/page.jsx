"use client";

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Plus, Search, Trash2, Pencil 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminBottomNav from '@/frontend/components/ui/AdminBottomNav';
import ProductImage from '@/frontend/components/ui/ProductImage';
import { deleteProduct, getProducts } from '@/frontend/products/service';
import { ALL_CATEGORIES_LABEL, getUniqueProductCategories } from '@/frontend/products/utils';

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES_LABEL);
  const [categories, setCategories] = useState([ALL_CATEGORIES_LABEL]); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ newestFirst: true });
      setProducts(data);
      setCategories(getUniqueProductCategories(data));
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        await deleteProduct(id);
        
        const updatedProducts = products.filter(product => product.id !== id);
        const updatedCategories = getUniqueProductCategories(updatedProducts);

        setProducts(updatedProducts);
        setCategories(updatedCategories);
        
        if (!updatedCategories.includes(activeCategory)) {
          setActiveCategory(ALL_CATEGORIES_LABEL);
        }

        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting product:', error.message);
        if (error.message?.includes('foreign key') || error.code === '23503') {
          alert('Gagal menghapus: Produk ini sudah pernah dipesan oleh pelanggan dan terikat pada riwayat pesanan. Jika ingin menghilangkannya dari etalase, Anda sebaiknya menambahkan fitur "Arsip" atau atur stok menjadi habis.');
        } else {
          alert('Gagal menghapus produk.');
        }
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === ALL_CATEGORIES_LABEL || product.category === activeCategory;
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

      <div className="filter-scroll-container">
        {categories.map((category) => (
          <button 
            key={category}
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
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="admin-product-img"
                />
              </div>

              <div className="admin-product-info">
                <h3 className="admin-product-name">{product.name}</h3>
                <p className="admin-product-stock">
                  Stok: {product.quantity ?? 'Tersedia'}
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
