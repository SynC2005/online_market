import React from 'react';
import { Menu, ShoppingBag, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import OrderCard from '@/components/OrderCard';

export default function OrderList() {
  const orders = [
    {
      id: '#ORD-8921',
      date: 'Oct 24, 2023 • 14:30 PM',
      status: 'IN DELIVERY',
      statusClass: 'in-delivery',
      itemsTitle: 'Hass Avocado, Whole Milk...',
      itemsCount: '4 items total',
      items: [
        { label: '🥑', bg: '#e5f3cc', zIndex: 3 },
        { label: '🥛', bg: '#e0f2fe', zIndex: 2, overlap: true },
        { label: '+2', bg: '#dbeafe', more: true, zIndex: 1, overlap: true },
      ],
      total: '$32.40',
      buttonLabel: 'Track Order',
      buttonClass: 'btn-primary',
    },
    {
      id: '#ORD-8814',
      date: 'Oct 21, 2023 • 09:15 AM',
      status: 'COMPLETED',
      statusClass: 'completed',
      itemsTitle: 'Organic Bananas, Grocery Bundle',
      itemsCount: '2 items total',
      items: [
        { label: '🍌', bg: '#fef08a', zIndex: 2 },
        { label: '🍞', bg: '#ffedd5', zIndex: 1, overlap: true },
      ],
      total: '$18.90',
      buttonLabel: 'Reorder',
      buttonClass: 'btn-secondary',
    },
    {
      id: '#ORD-8702',
      date: 'Oct 18, 2023 • 18:45 PM',
      status: 'CANCELLED',
      statusClass: 'cancelled-badge',
      itemsTitle: 'Dark Artisan Chocolates',
      itemsCount: '1 item total',
      items: [
        { label: '🍫', bg: '#e5e7eb', zIndex: 1 },
      ],
      total: '$12.00',
      buttonLabel: 'View Details',
      buttonClass: 'btn-text',
    },
  ];

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
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <section className="restock-banner">
        <span className="routine-badge">WEEKLY ROUTINE</span>
        <h2>
          Restock your
          <br />
          favorites?
        </h2>
        <p>Your frequent items are ready for a quick checkout.</p>

        <button className="btn-restock">Order Fresh Milk & Bread</button>

        <div className="restock-image-container">
          <div className="sparkle-icon">
            <Sparkles size={20} color="#5b21b6" />
          </div>
          <div className="restock-placeholder-img">🥖🥛</div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

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