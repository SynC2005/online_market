import React from 'react';
import { 
  Menu, CircleUser, Banknote, ShoppingBag, UserPlus, 
  TrendingUp, TrendingDown, ChevronDown, ArrowRight, 
  Package, Tag, AlertTriangle, MessageSquare, Briefcase, 
  ChevronRight, Plus 
} from 'lucide-react';

// 1. IMPORT KOMPONEN BOTTOM NAV KITA
import AdminBottomNav from '@/components/AdminBottomNav';

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <button className="icon-btn"><Menu size={24} color="#1e293b" /></button>
        <h1 className="admin-title">Market Admin</h1>
        <button className="icon-btn"><CircleUser size={24} color="#2563eb" /></button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Stat 1: Total Sales */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-box blue-box"><Banknote size={20} color="#2563eb" /></div>
            <span className="trend-badge trend-up"><TrendingUp size={12} /> +12%</span>
          </div>
          <p className="stat-label">Total Sales</p>
          <h3 className="stat-value">$12,450</h3>
        </div>

        {/* Stat 2: Active Orders */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-box blue-box"><ShoppingBag size={20} color="#2563eb" /></div>
            <span className="trend-badge trend-down"><TrendingDown size={12} /> -5%</span>
          </div>
          <p className="stat-label">Active Orders</p>
          <h3 className="stat-value">34</h3>
        </div>

        {/* Stat 3: New Customers */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-box blue-box"><UserPlus size={20} color="#2563eb" /></div>
            <span className="trend-badge trend-up"><TrendingUp size={12} /> +18%</span>
          </div>
          <p className="stat-label">New Customers</p>
          <h3 className="stat-value">150</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="admin-section-card">
        <div className="chart-header">
          <div>
            <h3 className="section-title">Weekly Sales Trend</h3>
            <p className="section-subtitle">Data from June 12 - June 19, 2024</p>
          </div>
          <button className="dropdown-btn">
            Last 7 Days <ChevronDown size={14} />
          </button>
        </div>
        
        {/* Simple CSS Bar Chart */}
        <div className="bar-chart">
          <div className="bar-wrapper"><div className="bar h-30"></div><span>MON</span></div>
          <div className="bar-wrapper"><div className="bar h-60"></div><span>TUE</span></div>
          <div className="bar-wrapper"><div className="bar h-50"></div><span>WED</span></div>
          <div className="bar-wrapper"><div className="bar active h-90"></div><span>THU</span></div>
          <div className="bar-wrapper"><div className="bar h-60"></div><span>FRI</span></div>
          <div className="bar-wrapper"><div className="bar h-80"></div><span>SAT</span></div>
          <div className="bar-wrapper"><div className="bar h-70"></div><span>SUN</span></div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-section-transparent">
        <div className="section-header-flex">
          <h3 className="section-title">Recent Orders</h3>
          <a href="#" className="view-all-link">View All</a>
        </div>
        
        <div className="recent-orders-list">
          {/* Order 1 */}
          <div className="recent-order-card">
            <div className="order-icon-box"><ShoppingBag size={18} color="#2563eb" /></div>
            <div className="order-details">
              <h4>Order #AZ-8812</h4>
              <p>Today, 2:45 PM</p>
            </div>
            <div className="order-price-items">
              <h4>$124.50</h4>
              <p>3 Items</p>
            </div>
            <span className="status-badge bg-green">COMPLETED</span>
          </div>

          {/* Order 2 */}
          <div className="recent-order-card">
            <div className="order-icon-box"><ShoppingBag size={18} color="#2563eb" /></div>
            <div className="order-details">
              <h4>Order #AZ-8811</h4>
              <p>Today, 1:20 PM</p>
            </div>
            <div className="order-price-items">
              <h4>$56.00</h4>
              <p>1 Item</p>
            </div>
            <span className="status-badge bg-blue">PROCESSED</span>
          </div>

          {/* Order 3 */}
          <div className="recent-order-card">
            <div className="order-icon-box"><ShoppingBag size={18} color="#2563eb" /></div>
            <div className="order-details">
              <h4>Order #AZ-8810</h4>
              <p>Yesterday, 9:15 PM</p>
            </div>
            <div className="order-price-items">
              <h4>$210.00</h4>
              <p>5 Items</p>
            </div>
            <span className="status-badge bg-yellow">PENDING</span>
          </div>
        </div>
      </div>

      {/* Action Banners */}
      <div className="action-banners">
        <div className="action-banner">
          <div className="action-icon"><Package size={24} color="#2563eb" /></div>
          <div className="action-text">
            <h3>Kelola Produk</h3>
            <p>Manage inventory & pricing</p>
          </div>
          <ArrowRight size={20} color="white" />
        </div>

        <div className="action-banner">
          <div className="action-icon"><Tag size={24} color="#2563eb" /></div>
          <div className="action-text">
            <h3>Kelola Promo</h3>
            <p>Create & manage active deals</p>
          </div>
          <ArrowRight size={20} color="white" />
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="highlight-section blue-bg">
        <div className="highlight-header text-red">
          <AlertTriangle size={20} color="#dc2626" />
          <h3>Low Stock Alert</h3>
        </div>

        <div className="stock-card">
          <div className="stock-info">
            <span className="stock-name">Organic Milk (2L)</span>
            <span className="stock-left text-red">5 left</span>
          </div>
          <div className="progress-bg"><div className="progress-fill bg-red w-15"></div></div>
          <button className="btn-light-blue">Restock Now</button>
        </div>

        <div className="stock-card">
          <div className="stock-info">
            <span className="stock-name">Artisan Sourdough</span>
            <span className="stock-left text-red">2 left</span>
          </div>
          <div className="progress-bg"><div className="progress-fill bg-red w-5"></div></div>
          <button className="btn-light-blue">Restock Now</button>
        </div>

        <div className="stock-card">
          <div className="stock-info">
            <span className="stock-name">Avocados (Bulk)</span>
            <span className="stock-left text-orange">12 left</span>
          </div>
          <div className="progress-bg"><div className="progress-fill bg-orange w-30"></div></div>
          <button className="btn-light-blue">Restock Now</button>
        </div>
      </div>

      {/* Staff Management */}
      <div className="highlight-section gray-bg">
        <div className="highlight-header">
          <h3 className="text-dark">Staff Management</h3>
        </div>

        <div className="staff-card">
          <div className="staff-icon bg-light-blue"><MessageSquare size={18} color="#2563eb" /></div>
          <div className="staff-info">
            <h4>Messenger</h4>
            <p>3 unread from support</p>
          </div>
          <ChevronRight size={18} color="#94a3b8" />
        </div>

        <div className="staff-card">
          <div className="staff-icon bg-light-purple"><Briefcase size={18} color="#7c3aed" /></div>
          <div className="staff-info">
            <h4>Roster Management</h4>
            <p>12 staff members active</p>
          </div>
          <ChevronRight size={18} color="#94a3b8" />
        </div>

        <button className="btn-solid-blue">
          <Plus size={18} /> Assign New Task
        </button>
      </div>

      {/* 2. PANGGIL ADMIN BOTTOM NAV DI SINI */}
      <AdminBottomNav />

    </div>
  );
}