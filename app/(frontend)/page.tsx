import React from 'react';
import Header from '@/frontend/components/ui/Header';
import BottomNav from '@/frontend/components/ui/BottomNav';
import { 
  Search, Flame, Leaf, Egg, Apple, Croissant, 
  Fish, Wine, IceCream, Brush, MoreHorizontal, 
  Filter, Heart, Plus, Truck 
} from 'lucide-react';

export default function FluidMarket() {
  return (
    <div className="app-container">
      {/* Panggil Komponen Header di sini */}
      <Header />

      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search fresh groceries..." className="search-input" />
      </div>

      {/* Fresh for You Section */}
      <section className="section">
        <div className="section-header">
          <h2>Fresh for You</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        
        <div className="hero-banner">
          <div className="hero-content">
            <span className="badge">DAILY FRESH</span>
            <h3>Organic Seasonal<br/>Fruit Box</h3>
            <p className="price">$24.99</p>
          </div>
          <div className="hero-image-placeholder">🍓</div>
        </div>

        <div className="sub-banners">
          <div className="card hot-deals">
            <Flame size={20} className="card-icon" />
            <h4>Hot Deals</h4>
            <p>Up to 40% OFF</p>
          </div>
          <div className="card vegan-picks">
            <Leaf size={20} className="card-icon" />
            <h4>Vegan Picks</h4>
            <p>Plant-based diet</p>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="section">
        <h2>Browse Categories</h2>
        <div className="category-grid">
          <div className="category-item"><div className="cat-icon"><Egg size={20}/></div><span>Dairy</span></div>
          <div className="category-item"><div className="cat-icon"><Apple size={20}/></div><span>Veggie</span></div>
          <div className="category-item"><div className="cat-icon"><Croissant size={20}/></div><span>Bakery</span></div>
          <div className="category-item"><div className="cat-icon"><Fish size={20}/></div><span>Seafood</span></div>
          <div className="category-item"><div className="cat-icon"><Wine size={20}/></div><span>Drinks</span></div>
          <div className="category-item"><div className="cat-icon"><IceCream size={20}/></div><span>Snacks</span></div>
          <div className="category-item"><div className="cat-icon"><Brush size={20}/></div><span>Home</span></div>
          <div className="category-item"><div className="cat-icon"><MoreHorizontal size={20}/></div><span>More</span></div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="section">
        <div className="section-header">
          <h2>Popular Products</h2>
          <button className="filter-btn"><Filter size={16} /></button>
        </div>
        
        <div className="product-grid">
          {/* Product 1 */}
          <div className="product-card">
            <div className="product-image" style={{backgroundColor: '#e5f3cc'}}>🥑</div>
            <button className="fav-btn"><Heart size={16} /></button>
            <div className="product-info">
              <span className="product-cat">PRODUCE</span>
              <h4 className="product-name">Hass Avocado (Unit)</h4>
              <div className="product-bottom">
                <span className="product-price">$1.85</span>
                <button className="add-btn"><Plus size={20} color="white" /></button>
              </div>
            </div>
          </div>
          
          {/* Anda bisa menambahkan sisa produk lainnya di sini agar kode tidak terlalu panjang */}
        </div>
      </section>

      {/* Free Delivery Banner */}
      <section className="promo-banner">
        <div className="promo-header">
          <div className="promo-icon"><Truck size={24} color="#0d47a1" /></div>
          <h3>Free Delivery</h3>
        </div>
        <p>Join our membership program and get unlimited free deliveries on orders over $35.</p>
        <button className="join-btn">Join Now</button>
      </section>

      {/* Panggil Komponen BottomNav di sini */}
      <BottomNav />
    </div>
  );
}
