import React from 'react';
import { Menu, ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <button className="icon-btn">
        <Menu size={24} />
      </button>
      <h1 className="logo">Fluid Market</h1>
      <div className="cart-container">
        <ShoppingCart size={24} />
        <span className="cart-badge">3</span>
      </div>
    </header>
  );
}