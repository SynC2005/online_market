"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  ShoppingCart,
  Search,
  Flame,
  Leaf,
  Egg,
  Apple,
  Croissant,
  Fish,
  Wine,
  IceCream,
  Brush,
  MoreHorizontal,
  Filter,
  Truck,
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
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
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

  const filterProducts = () => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredProducts(filtered);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
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
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = typeof item.price === "string" 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
      : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ padding: "16px 16px 0", paddingTop: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Menu size={24} style={{ color: "#333" }} />
          </button>

          {/* User Menu Dropdown */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                left: "0",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                minWidth: "250px",
                overflow: "hidden",
              }}
            >
              {/* User Info */}
              {session && (
                <div
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="User"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#0b57cf",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "20px",
                        }}
                      >
                        <User size={24} />
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          fontWeight: "bold",
                          color: "#333",
                          margin: "0 0 4px 0",
                          fontSize: "14px",
                        }}
                      >
                        {session.user?.name || "User"}
                      </p>
                      <p
                        style={{
                          color: "#999",
                          margin: "0",
                          fontSize: "12px",
                        }}
                      >
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div style={{ padding: "8px 0" }}>
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <ShoppingCart size={18} />
                  My Orders
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <Heart size={18} />
                  Favorites
                </button>

                <div
                  style={{
                    borderTop: "1px solid #e0e0e0",
                    margin: "8px 0",
                  }}
                />

                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#ff6b6b",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#fff0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Close menu when clicking outside */}
          {showMenu && (
            <div
              onClick={() => setShowMenu(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
            />
          )}

          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            Fluid Market
          </h1>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCart(!showCart)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCart
                size={24}
                style={{ cursor: "pointer", color: "#333" }}
              />
            </button>
            {cartItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "24px",
            padding: "10px 16px",
            marginBottom: "16px",
            gap: "8px",
          }}
        >
          <Search size={18} style={{ color: "#999" }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
              outline: "none",
              color: "#333",
            }}
          />
          {searchQuery && (
            <X
              size={18}
              style={{ cursor: "pointer", color: "#999" }}
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </header>

      {/* Promo Banner */}
      <section
        style={{
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "24px 16px",
          margin: "16px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Flash Sale!
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "12px" }}>
          Get up to 50% off on selected items
        </p>
        <button
          style={{
            backgroundColor: "white",
            color: "#667eea",
            border: "none",
            padding: "10px 24px",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Shop Now
        </button>
      </section>

      {/* Category Filter */}
      <section style={{ padding: "0 16px", marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#666",
            marginBottom: "12px",
          }}
        >
          Categories
        </h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollBehavior: "smooth",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                backgroundColor:
                  selectedCategory === cat.id ? "#0b57cf" : "#f0f0f0",
                color: selectedCategory === cat.id ? "white" : "#333",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                transition: "all 0.3s ease",
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section style={{ padding: "0 16px", marginBottom: "80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            {selectedCategory === "all"
              ? "All Products"
              : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </h2>
          <button
            style={{
              backgroundColor: "#f0f0f0",
              border: "none",
              padding: "8px 8px",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            <Filter size={16} />
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#999", padding: "32px 0" }}>
            Loading products...
          </p>
        ) : filteredProducts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
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
          <p style={{ textAlign: "center", color: "#999", padding: "32px 0" }}>
            No products found for "{searchQuery || selectedCategory}"
          </p>
        )}
      </section>

      {/* Cart Modal */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1001,
            }}
          />

          {/* Cart Sidebar */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "100%",
              maxWidth: "400px",
              height: "100vh",
              backgroundColor: "white",
              boxShadow: "-2px 0 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1002,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Cart Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#333",
                  margin: 0,
                }}
              >
                Shopping Cart
              </h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
              }}
            >
              {cartItems.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cartItems.map((item) => {
                    const price = typeof item.price === "string" 
                      ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
                      : item.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "12px",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Product Info */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                            {item.name}
                          </h4>
                          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                            {item.price}
                          </p>

                          {/* Quantity Controls */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              style={{
                                background: "#f0f0f0",
                                border: "none",
                                width: "28px",
                                height: "28px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: "14px", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              style={{
                                background: "#f0f0f0",
                                border: "none",
                                width: "28px",
                                height: "28px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              +
                            </button>
                            <span style={{ marginLeft: "auto", fontSize: "12px", fontWeight: "bold", color: "#0b57cf" }}>
                              Rp {itemTotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ff6b6b",
                            cursor: "pointer",
                            fontSize: "18px",
                            padding: "0",
                            height: "fit-content",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "32px 16px", color: "#999" }}>
                  <p style={{ fontSize: "14px", marginBottom: "8px" }}>Your cart is empty</p>
                  <p style={{ fontSize: "12px", opacity: 0.8 }}>Add products to get started</p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: "16px",
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#666" }}>Subtotal:</span>
                  <span style={{ fontWeight: "bold", color: "#333" }}>
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#666" }}>Shipping:</span>
                  <span style={{ fontWeight: "bold", color: "#333" }}>Free</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "bold",
                    paddingTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <span style={{ color: "#333" }}>Total:</span>
                  <span style={{ color: "#0b57cf" }}>
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  style={{
                    backgroundColor: "#0b57cf",
                    color: "white",
                    border: "none",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
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
