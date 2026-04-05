"use client";

import React, { useEffect, useState } from 'react';
import { 
  Menu, ShoppingCart, Search, Flame, Leaf, 
  Egg, Apple, Croissant, Fish, Wine, IceCream, Brush, MoreHorizontal, 
  Filter, Truck 
} from 'lucide-react';

import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/utils/supabase'; // Import instance supabase Anda

export default function FluidMarket() {
  const [products, setProducts] = useState([]); // State untuk menyimpan data produk
  const [loading, setLoading] = useState(true); // State untuk loading

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mengambil data dari tabel 'products' di Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* ... (Header & Search Bar tetap sama) ... */}

      {/* Popular Products Section */}
      <section className="section">
        <div className="section-header">
          <h2>Popular Products</h2>
          <button className="filter-btn"><Filter size={16} /></button>
        </div>
        
        <div className="product-grid">
          {loading ? (
            <p>Memuat produk...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                image={product.image}
                category={product.category}
                name={product.name}
                price={product.price}
                description={product.description}
              />
            ))
          ) : (
            <p>Tidak ada produk tersedia.</p>
          )}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}