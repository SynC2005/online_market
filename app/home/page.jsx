"use client";

import React, { useEffect, useState } from 'react';
import { 
  Menu, ShoppingCart, Search, Flame, Leaf, 
  Egg, Apple, Croissant, Fish, Wine, IceCream, Brush, MoreHorizontal, 
  Filter, Truck, Heart, X
} from 'lucide-react';

import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/utils/supabase';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🛍️' },
  { id: 'fresh', label: 'Fresh', icon: '🥬' },
  { id: 'bakery', label: 'Bakery', icon: '🥐' },
  { id: 'seafood', label: 'Seafood', icon: '🐟' },
  { id: 'beverages', label: 'Drinks', icon: '🍷' },
  { id: 'frozen', label: 'Frozen', icon: '🍦' },
];

export default function FluidMarket() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  const filterProducts = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p =>
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ padding: '16px 16px 0', paddingTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Menu size={24} style={{ cursor: 'pointer', color: '#333' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Fluid Market</h1>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={24} style={{ cursor: 'pointer', color: '#333' }} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '24px',
          padding: '10px 16px',
          marginBottom: '16px',
          gap: '8px'
        }}>
          <Search size={18} style={{ color: '#999' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
              outline: 'none',
              color: '#333'
            }}
          />
          {searchQuery && (
            <X
              size={18}
              style={{ cursor: 'pointer', color: '#999' }}
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
      </header>

      {/* Promo Banner */}
      <section style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '16px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Flash Sale!</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>Get up to 50% off on selected items</p>
        <button style={{
          backgroundColor: 'white',
          color: '#667eea',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Shop Now
        </button>
      </section>

      {/* Category Filter */}
      <section style={{ padding: '0 16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '12px' }}>Categories</h3>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollBehavior: 'smooth'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedCategory === cat.id ? '#0b57cf' : '#f0f0f0',
                color: selectedCategory === cat.id ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section style={{ padding: '0 16px', marginBottom: '80px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            {selectedCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
          </h2>
          <button style={{
            backgroundColor: '#f0f0f0',
            border: 'none',
            padding: '8px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#333'
          }}>
            <Filter size={16} />
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '32px 0' }}>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                category={product.category}
                name={product.name}
                price={product.price}
                description={product.description}
              />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '32px 0' }}>
            No products found for "{searchQuery || selectedCategory}"
          </p>
        )}
      </section>

      <BottomNav />
    </div>
  );
}