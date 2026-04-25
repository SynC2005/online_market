import { Menu, ShoppingBag, Sparkles } from 'lucide-react';
import BottomNav from '@/frontend/components/ui/BottomNav';
import OrderCard from '@/frontend/components/ui/OrderCard';
import { ORDERS } from '@/frontend/constants/orders';

export default function OrderList() {
  return (
    <div className="app-container">
      <header className="header">
        <button className="icon-btn"><Menu size={24} color="#0d47a1" /></button>
        <h1 className="logo">My Orders</h1>
        <button className="icon-btn"><ShoppingBag size={24} color="#0d47a1" /></button>
      </header>

      <div className="tabs-container">
        <div className="tab active">Ongoing</div>
        <div className="tab">History</div>
      </div>

      <div className="orders-wrapper">
        {ORDERS.map((order) => (
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
          <div className="restock-placeholder-img">Milk</div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
