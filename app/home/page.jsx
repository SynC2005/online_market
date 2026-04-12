"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  ShoppingCart,
  Search,
  Filter,
  Heart,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/utils/supabase";

const CATEGORIES = [
  { id: "all", label: "All", icon: "🛍️" },
  { id: "fresh", label: "Fresh", icon: "🥬" },
  { id: "bakery", label: "Bakery", icon: "🥐" },
  { id: "seafood", label: "Seafood", icon: "🐟" },
  { id: "beverages", label: "Drinks", icon: "🍷" },
  { id: "frozen", label: "Frozen", icon: "🍦" },
];

export default function FluidMarket() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
        : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="fm-header">
        <div className="fm-header-top">
          <button onClick={() => setShowMenu(!showMenu)} className="fm-icon-btn">
            <Menu size={24} color="#333" />
          </button>

          {/* User Menu Dropdown */}
          {showMenu && (
            <div className="fm-user-menu">
              {/* User Info */}
              {session && (
                <div className="fm-user-info">
                  <div className="fm-user-info-flex">
                    {session.user?.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={session.user.image}
                        alt="User"
                        className="fm-avatar"
                      />
                    ) : (
                      <div className="fm-avatar-placeholder">
                        <User size={24} />
                      </div>
                    )}
                    <div>
                      <p className="fm-user-name">
                        {session.user?.name || "User"}
                      </p>
                      <p className="fm-user-email">{session.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="fm-menu-items-container">
                <button onClick={() => setShowMenu(false)} className="fm-menu-btn">
                  <User size={18} /> My Profile
                </button>
                <button onClick={() => setShowMenu(false)} className="fm-menu-btn">
                  <ShoppingCart size={18} /> My Orders
                </button>
                <button onClick={() => setShowMenu(false)} className="fm-menu-btn">
                  <Heart size={18} /> Favorites
                </button>

                <div className="fm-menu-divider" />

                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                  className="fm-logout-btn"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}

          {/* Close menu backdrop */}
          {showMenu && (
            <div onClick={() => setShowMenu(false)} className="fm-menu-backdrop" />
          )}

          <h1 className="fm-logo">Fluid Market</h1>

          <div style={{ position: "relative" }}>
            <button onClick={() => setShowCart(!showCart)} className="fm-icon-btn">
              <ShoppingCart size={24} color="#333" />
            </button>
            {cartItems.length > 0 && (
              <span className="fm-cart-badge">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="fm-search-container">
          <Search size={18} color="#999" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fm-search-input"
          />
          {searchQuery && (
            <X
              size={18}
              color="#999"
              style={{ cursor: "pointer" }}
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </header>

      {/* Promo Banner */}
      <section className="fm-promo-banner">
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
        <h2 className="fm-promo-title">Flash Sale!</h2>
        <p className="fm-promo-desc">Get up to 50% off on selected items</p>
        <button className="fm-promo-btn">Shop Now</button>
      </section>

      {/* Category Filter */}
      <section className="fm-section">
        <h3 className="fm-section-title">Categories</h3>
        <div className="fm-category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`fm-category-btn ${
                selectedCategory === cat.id ? "active" : "inactive"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="fm-products-section">
        <div className="fm-products-header">
          <h2 className="fm-products-title">
            {selectedCategory === "all"
              ? "All Products"
              : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </h2>
          <button className="fm-filter-btn">
            <Filter size={16} />
          </button>
        </div>

        {loading ? (
          <p className="fm-empty-state">Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="fm-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                category={product.category}
                name={product.name}
                price={product.price}
                description={product.description}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <p className="fm-empty-state">
            No products found for {`"${searchQuery || selectedCategory}"`}
          </p>
        )}
      </section>

      {/* Cart Modal */}
      {showCart && (
        <>
          <div onClick={() => setShowCart(false)} className="cart-backdrop" />

          <div className="cart-sidebar">
            <div className="cart-header">
              <h2 className="cart-title">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="cart-close-btn">
                ✕
              </button>
            </div>

            <div className="cart-body">
              {cartItems.length > 0 ? (
                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const price =
                      typeof item.price === "string"
                        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
                        : item.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <div key={item.id} className="cart-item-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img"
                        />

                        <div className="cart-item-info">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <p className="cart-item-price">{item.price}</p>

                          <div className="cart-qty-controls">
                            <button
                              onClick={() =>
                                updateCartItemQuantity(item.id, item.quantity - 1)
                              }
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateCartItemQuantity(item.id, item.quantity + 1)
                              }
                              className="qty-btn"
                            >
                              +
                            </button>
                            <span className="item-total-price">
                              Rp {itemTotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cart-remove-btn"
                        >
                          🗑
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="fm-empty-state">
                  <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                    Your cart is empty
                  </p>
                  <p style={{ fontSize: "12px", opacity: 0.8 }}>
                    Add products to get started
                  </p>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Subtotal:</span>
                  <span className="cart-summary-value">
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Shipping:</span>
                  <span className="cart-summary-value">Free</span>
                </div>
                <div className="cart-total-row">
                  <span style={{ color: "#333" }}>Total:</span>
                  <span style={{ color: "#0b57cf" }}>
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <button className="cart-checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}