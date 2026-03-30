import React from 'react';
import { Menu, ShoppingBag, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav'; // Sesuaikan path

export default function OrderList() {
  return (
    <div className="app-container">
      {/* Header Khusus Halaman Order */}
      <header className="header">
        <button className="icon-btn"><Menu size={24} color="#0d47a1" /></button>
        <h1 className="logo">My Orders</h1>
        <button className="icon-btn"><ShoppingBag size={24} color="#0d47a1" /></button>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tab active">Ongoing</div>
        <div className="tab">History</div>
      </div>

      {/* Order List */}
      <div className="orders-wrapper">
        
        {/* Order 1: In Delivery */}
        <div className="order-card">
          <div className="order-header">
            <div>
              <p className="order-label">ORDER ID <span className="order-id">#ORD-8921</span></p>
              <p className="order-date">Oct 24, 2023 • 14:30 PM</p>
            </div>
            <span className="badge-status in-delivery">IN DELIVERY</span>
          </div>
          
          <div className="order-items">
            <div className="item-images">
              <div className="item-img" style={{backgroundColor: '#e5f3cc', zIndex: 3}}>🥑</div>
              <div className="item-img" style={{backgroundColor: '#e0f2fe', zIndex: 2, marginLeft: '-12px'}}>🥛</div>
              <div className="item-img more-count" style={{zIndex: 1, marginLeft: '-12px'}}>+2</div>
            </div>
            <div className="item-text">
              <h4>Hass Avocado, Whole Milk...</h4>
              <p>4 items total</p>
            </div>
          </div>

          <div className="order-footer">
            <div>
              <p className="total-label">TOTAL AMOUNT</p>
              <p className="total-price">$32.40</p>
            </div>
            <button className="btn-primary">Track Order</button>
          </div>
        </div>

        {/* Order 2: Completed */}
        <div className="order-card">
          <div className="order-header">
            <div>
              <p className="order-label">ORDER ID <span className="order-id">#ORD-8814</span></p>
              <p className="order-date">Oct 21, 2023 • 09:15 AM</p>
            </div>
            <span className="badge-status completed">COMPLETED</span>
          </div>
          
          <div className="order-items">
            <div className="item-images">
              <div className="item-img" style={{backgroundColor: '#fef08a', zIndex: 2}}>🍌</div>
              <div className="item-img" style={{backgroundColor: '#ffedd5', zIndex: 1, marginLeft: '-12px'}}>🍞</div>
            </div>
            <div className="item-text">
              <h4>Organic Bananas, Grocery Bundle</h4>
              <p>2 items total</p>
            </div>
          </div>

          <div className="order-footer">
            <div>
              <p className="total-label">TOTAL AMOUNT</p>
              <p className="total-price">$18.90</p>
            </div>
            <button className="btn-secondary">Reorder</button>
          </div>
        </div>

        {/* Order 3: Cancelled */}
        <div className="order-card cancelled">
          <div className="order-header">
            <div>
              <p className="order-label">ORDER ID <span className="order-id">#ORD-8702</span></p>
              <p className="order-date">Oct 18, 2023 • 18:45 PM</p>
            </div>
            <span className="badge-status cancelled-badge">CANCELLED</span>
          </div>
          
          <div className="order-items">
            <div className="item-images">
              <div className="item-img grayscale" style={{backgroundColor: '#e5e7eb'}}>🍫</div>
            </div>
            <div className="item-text">
              <h4>Dark Artisan Chocolates</h4>
              <p>1 item total</p>
            </div>
          </div>

          <div className="order-footer">
            <div>
              <p className="total-label">TOTAL AMOUNT</p>
              <p className="total-price">$12.00</p>
            </div>
            <button className="btn-text">View Details</button>
          </div>
        </div>

      </div>

      {/* Restock Banner */}
      <section className="restock-banner">
        <span className="routine-badge">WEEKLY ROUTINE</span>
        <h2>Restock your<br/>favorites?</h2>
        <p>Your frequent items are ready for a quick checkout.</p>
        
        <button className="btn-restock">
          Order Fresh Milk & Bread
        </button>

        <div className="restock-image-container">
           <div className="sparkle-icon"><Sparkles size={20} color="#5b21b6" /></div>
           <div className="restock-placeholder-img">🥖🥛</div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}