import React from 'react';
import { Menu, ShoppingCart } from 'lucide-react';

export default function Header({ title = 'Fluid Market', cartCount = 0 }) {
  return (
    <header className="header">
      <button className="icon-btn">
        <Menu size={24} />
      </button>
      <h1 className="logo">{title}</h1>
      <div className="cart-container">
        <ShoppingCart size={24} />
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </div>
    </header>
  );
}
