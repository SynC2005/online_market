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
  MapPin,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/utils/supabase";
import { processCheckoutBackend } from "@/app/actions/orderActions";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "all", label: "All", icon: "🛍️" },
  { id: "fresh", label: "Fresh", icon: "🥬" },
  { id: "bakery", label: "Bakery", icon: "🥐" },
  { id: "seafood", label: "Seafood", icon: "🐟" },
  { id: "beverages", label: "Drinks", icon: "🍷" },
  { id: "frozen", label: "Frozen", icon: "🍦" },
];

export default function FluidMarket() {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // State untuk Checkout & Profil
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    location_link: "",
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
    await signOut({ redirect: false });
    const keycloakLogoutUrl = "http://136.119.3.213.sslip.io:8080/realms/online-market/protocol/openid-connect/logout";
    const redirectUri = encodeURIComponent(window.location.origin + "/login");
    const clientId = "nextjs-app";
    window.location.href = `${keycloakLogoutUrl}?client_id=${clientId}&post_logout_redirect_uri=${redirectUri}`;
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
    const price = typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price;
    return total + price * item.quantity;
  }, 0);

  const handleCheckoutClick = async () => {
    if (!session?.user?.email) {
      alert("Silakan login terlebih dahulu!");
      return;
    }
    setIsLoadingCheckout(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (error || !profile || !profile.address || !profile.phone || !profile.location_link) {
        setShowProfileForm(true);
      } else {
        processOrder(profile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const saveProfileAndCheckout = async (e) => {
    e.preventDefault();
    setIsLoadingCheckout(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          email: session.user.email,
          full_name: session.user.name,
          phone: formData.phone,
          address: formData.address,
          location_link: formData.location_link,
          role: "user",
        }, { onConflict: "email" });

      if (error) throw error;
      setShowProfileForm(false);
      processOrder({ ...formData, email: session.user.email });
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
      setIsLoadingCheckout(false);
    }
  };

  
  // --- LOGIKA PEMROSESAN PESANAN DI SERVER ---
  const processOrder = async (userProfile) => {
    setIsLoadingCheckout(true);
    
    // Panggil fungsi Backend
    const result = await processCheckoutBackend(session.user.email, cartItems);

    if (result.success && result.paymentUrl) {
      // 1. Kosongkan keranjang di layar
      setCartItems([]);
      setShowCart(false);
      
      // 2. OTOMATIS PINDAH KE HALAMAN MIDTRANS
      window.location.href = result.paymentUrl;
      
    } else if (result.success && !result.paymentUrl) {
      alert("Pesanan masuk ke database, tapi Link Midtrans gagal dibuat. Cek Server Key Midtrans Anda.");
    } else {
      alert(`❌ Gagal memproses pesanan: ${result.message}`);
    }
    
    setIsLoadingCheckout(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="fm-header">
        <div className="fm-header-top">
          <button onClick={() => setShowMenu(!showMenu)} className="fm-icon-btn">
            <Menu size={24} color="#333" />
          </button>

          {showMenu && (
            <div className="fm-user-menu">
              {session && (
                <div className="fm-user-info">
                  <div className="fm-user-info-flex">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="fm-avatar" />
                    ) : (
                      <div className="fm-avatar-placeholder"><User size={24} /></div>
                    )}
                    <div>
                      <p className="fm-user-name">{session.user?.name || "User"}</p>
                      <p className="fm-user-email">{session.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="fm-menu-items-container">
                <button 
  onClick={() => {
    setShowMenu(false);
    router.push('/home/profile'); // Menuju ke halaman profil
  }} 
  className="fm-menu-btn"
>
  <User size={18} /> My Profile
</button>
                <button onClick={() => setShowMenu(false)} className="fm-menu-btn"><ShoppingCart size={18} /> My Orders</button>
                <button onClick={() => setShowMenu(false)} className="fm-menu-btn"><Heart size={18} /> Favorites</button>
                <div className="fm-menu-divider" />
                <button onClick={handleLogout} className="fm-logout-btn"><LogOut size={18} /> Logout</button>
              </div>
            </div>
          )}
          {showMenu && <div onClick={() => setShowMenu(false)} className="fm-menu-backdrop" />}
          <h1 className="fm-logo">Fluid Market</h1>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowCart(!showCart)} className="fm-icon-btn"><ShoppingCart size={24} color="#333" /></button>
            {cartItems.length > 0 && <span className="fm-cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>}
          </div>
        </div>

        <div className="fm-search-container">
          <Search size={18} color="#999" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="fm-search-input" />
        </div>
      </header>

      {/* Konten Utama */}
      <section className="fm-promo-banner">
        <h2 className="fm-promo-title">Flash Sale!</h2>
        <button className="fm-promo-btn">Shop Now</button>
      </section>

      {/* Daftar Produk */}
      <section className="fm-products-section">
        <div className="fm-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div onClick={() => setShowCart(false)} className="cart-backdrop" />
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2 className="cart-title">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="cart-close-btn">✕</button>
            </div>
            <div className="cart-body">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                    <p>{item.name} x {item.quantity}</p>
                </div>
              ))}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <p>Total: Rp {cartTotal.toLocaleString("id-ID")}</p>
                <button onClick={handleCheckoutClick} disabled={isLoadingCheckout} className="cart-checkout-btn">
                  {isLoadingCheckout ? "Memproses Keamanan..." : "Proceed to Checkout"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* MODAL FORM PROFIL + GMAPS */}
      {showProfileForm && (
        <div className="cart-backdrop profile-modal-overlay">
          <div className="profile-modal-box">
            <h3 className="profile-modal-title">Lengkapi Data Pengiriman</h3>
            <p className="profile-modal-desc">
              Driver membutuhkan lokasi akurat agar barang cepat sampai.
            </p>
            
            <form onSubmit={saveProfileAndCheckout}>
              
              {/* Input Nomor HP */}
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <input 
                  type="text" 
                  required 
                  placeholder="0812..." 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="form-input"
                />
              </div>

              {/* Input Alamat */}
              <div className="form-group">
                <label className="form-label">Alamat Lengkap</label>
                <textarea 
                  required 
                  rows="3"
                  placeholder="Jl. Raya No. 1..." 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="form-input"
                />
              </div>

              {/* Input Link GMaps */}
              <div className="form-group-last">
                <label className="form-label form-label-icon">
                  <MapPin size={14} color="#ef4444" /> Link Lokasi Google Maps
                </label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://maps.google.com/..." 
                  value={formData.location_link}
                  onChange={(e) => setFormData({...formData, location_link: e.target.value})}
                  className="form-input"
                />
                <small className="form-hint">
                  Buka Google Maps, cari lokasi Anda, lalu klik "Share" dan salin linknya.
                </small>
              </div>

              {/* Buttons */}
              <div className="form-actions">
                <button 
                  type="button" 
                  disabled={isLoadingCheckout} 
                  onClick={() => setShowProfileForm(false)} 
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isLoadingCheckout} 
                  className="btn-submit"
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