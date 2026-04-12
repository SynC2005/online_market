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

  // State Baru untuk Checkout & Profil
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

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

  const handleLogout = async () => {
    // 1. Hapus sesi lokal di Next.js terlebih dahulu
    await signOut({ redirect: false });

    // 2. Siapkan URL untuk menghapus sesi di server Satpam (Keycloak)
    const keycloakLogoutUrl =
      "http://136.119.3.213.sslip.io:8080/realms/online-market/protocol/openid-connect/logout";

    // 3. Tentukan ke mana Keycloak harus mengembalikan user setelah sukses logout
    const redirectUri = encodeURIComponent(window.location.origin + "/login");
    const clientId = "nextjs-app";

    // 4. Lemparkan browser ke Keycloak untuk pembersihan total
    window.location.href = `${keycloakLogoutUrl}?client_id=${clientId}&post_logout_redirect_uri=${redirectUri}`;
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

  // --- FUNGSI CHECKOUT & PROFILE BARU ---
  const handleCheckoutClick = async () => {
    if (!session?.user?.email) {
      alert("Silakan login terlebih dahulu untuk melakukan checkout!");
      return;
    }

    setIsLoadingCheckout(true);

    try {
      // Cek ke Supabase apakah alamat user sudah ada
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", session.user.email)
        .single();

      // Jika alamat belum ada, tampilkan form
      if (error || !profile || !profile.address || !profile.phone) {
        setShowProfileForm(true);
      } else {
        // Jika sudah lengkap, langsung proses pesanan
        processOrder(profile);
      }
    } catch (err) {
      console.error("Gagal mengecek profil:", err);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const saveProfileAndCheckout = async (e) => {
    e.preventDefault();
    setIsLoadingCheckout(true);

    try {
      // Simpan data diri ke Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            email: session.user.email,
            full_name: session.user.name,
            phone: formData.phone,
            address: formData.address,
            role: "user",
          },
          { onConflict: "email" }
        );

      if (error) throw error;

      alert("Data pengiriman berhasil disimpan!");
      setShowProfileForm(false);

      // Lanjut proses pesanan
      processOrder({ ...formData, email: session.user.email });
    } catch (err) {
      alert("Gagal menyimpan data: " + err.message);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const processOrder = async (userProfile) => {
    // Di sini nantinya Anda bisa menambahkan logika insert ke tabel 'orders'
    alert(
      `Pesanan berhasil dibuat!\n\nEmail: ${userProfile.email}\nDikirim ke: ${userProfile.address}`
    );

    // Kosongkan keranjang setelah berhasil checkout
    setCartItems([]);
    setShowCart(false);
  };
  // --------------------------------------

  return (
    <div className="app-container">
      {/* Header */}
      <header className="fm-header">
        <div className="fm-header-top">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="fm-icon-btn"
          >
            <Menu size={24} color="#333" />
          </button>

          {/* User Menu Dropdown */}
          {showMenu && (
            <div className="fm-user-menu">
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

              <div className="fm-menu-items-container">
                <button
                  onClick={() => setShowMenu(false)}
                  className="fm-menu-btn"
                >
                  <User size={18} /> My Profile
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="fm-menu-btn"
                >
                  <ShoppingCart size={18} /> My Orders
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="fm-menu-btn"
                >
                  <Heart size={18} /> Favorites
                </button>

                <div className="fm-menu-divider" />

                <button onClick={handleLogout} className="fm-logout-btn">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}

          {showMenu && (
            <div
              onClick={() => setShowMenu(false)}
              className="fm-menu-backdrop"
            />
          )}

          <h1 className="fm-logo">Fluid Market</h1>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCart(!showCart)}
              className="fm-icon-btn"
            >
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
              <button
                onClick={() => setShowCart(false)}
                className="cart-close-btn"
              >
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
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
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
                {/* Tombol Checkout yang Diperbarui */}
                <button 
                  onClick={handleCheckoutClick}
                  disabled={isLoadingCheckout}
                  className="cart-checkout-btn"
                >
                  {isLoadingCheckout ? "Memproses..." : "Proceed to Checkout"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal / Pop-Up Form Lengkapi Profil */}
      {showProfileForm && (
        <div
          className="cart-backdrop"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1005, // Harus lebih tinggi dari sidebar keranjang
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>
              Lengkapi Data Pengiriman
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#64748b" }}>
              Kami membutuhkan alamat Anda untuk memproses pengiriman pesanan.
            </p>

            <form onSubmit={saveProfileAndCheckout}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08123456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#475569",
                    marginBottom: "6px",
                  }}
                >
                  Alamat Lengkap
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Nama jalan, gedung, no rumah, kelurahan, dsb."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    color: "#64748b",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoadingCheckout}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0b57cf",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {isLoadingCheckout ? "Menyimpan..." : "Simpan & Checkout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}