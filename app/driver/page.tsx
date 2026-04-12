"use client";

import React from 'react';
import { 
  Bell, Power, Truck, Clock, Star, Map, 
  Calendar, LayoutGrid, Banknote, User 
} from 'lucide-react';
import Link from 'next/link';

export default function DriverDashboard() {
  return (
    <div className="driver-layout">
      {/* TOP HEADER */}
      <header className="driver-header">
        <div className="header-left">
          <div className="profile-pic">
             <User size={24} color="#555" />
          </div>
          <div className="header-text">
            <h1>Driver Portal</h1>
            <p>Azure Market Fleet</p>
          </div>
        </div>
        <div className="header-right">
          <span className="status-badge online">
            <span className="dot"></span> ONLINE
          </span>
          <Bell size={24} className="bell-icon" />
        </div>
      </header>

      <div className="driver-content">
        {/* HERO CARD - EARNINGS */}
        <section className="hero-card">
          <p className="welcome-text">Welcome back, Marcus</p>
          <h2 className="hero-title">Today's Earnings</h2>
          <div className="earnings-amount">
            <span className="amount">$142.50</span>
            <span className="trend">+12% vs yesterday</span>
          </div>
          <Banknote size={80} className="hero-bg-icon" />
        </section>

        {/* AVAILABILITY CARD */}
        <section className="card availability-card">
          <h3>Availability</h3>
          <p>You are currently visible to new orders in your zone.</p>
          <button className="offline-btn">
            <Power size={18} /> Go Offline
          </button>
        </section>

        {/* STATS GRID */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box blue"><Truck size={20} /></div>
              <span className="badge">8 Completed</span>
            </div>
            <p className="stat-label">Total Deliveries</p>
            <p className="stat-value">12 Orders</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box purple"><Clock size={20} /></div>
              <span className="badge">4.2 hrs</span>
            </div>
            <p className="stat-label">Active Shift</p>
            <p className="stat-value">08:30 - 12:45</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box star"><Star size={20} /></div>
              <span className="badge">Top Rated</span>
            </div>
            <p className="stat-label">Driver Rating</p>
            <p className="stat-value">4.98 / 5.0</p>
          </div>
        </section>

        {/* RECENT SHIFTS */}
        <section className="recent-shifts">
          <div className="section-header">
            <h3>Recent Shifts</h3>
            <a href="#">View All History</a>
          </div>
          
          <div className="shift-item">
            <div className="shift-icon"><Calendar size={20} /></div>
            <div className="shift-details">
              <h4>Oct 24, Thursday</h4>
              <p>09:00 AM - 05:30 PM • 14 Deliveries</p>
            </div>
            <div className="shift-earnings">
              <span className="money">$218.40</span>
              <span className="status paid">PAID OUT</span>
            </div>
          </div>

          <div className="shift-item">
            <div className="shift-icon"><Calendar size={20} /></div>
            <div className="shift-details">
              <h4>Oct 23, Wednesday</h4>
              <p>10:15 AM - 04:00 PM • 9 Deliveries</p>
            </div>
            <div className="shift-earnings">
              <span className="money">$156.20</span>
              <span className="status paid">PAID OUT</span>
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM NAV (KHUSUS DRIVER) */}
      <nav className="driver-bottom-nav">
        <Link href="/driver" className="nav-item active">
          <LayoutGrid size={24} />
          <span>Dashboard</span>
        </Link>
        <Link href="/driver/orders" className="nav-item">
          <Truck size={24} />
          <span>Orders</span>
        </Link>
        <Link href="/driver/earnings" className="nav-item">
          <Banknote size={24} />
          <span>Earnings</span>
        </Link>
        <Link href="/driver/profile" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}