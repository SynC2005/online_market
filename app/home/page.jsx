"use client";

import React, { useState, useEffect } from "react";
import { 
  Menu, ShoppingCart, Search, User, MapPin, LogOut, X, Plus, Minus 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import kustom kita
import { getUserSession, logoutUser } from "@/app/actions/authActions";
import { processCheckoutBackend } from "@/app/actions/orderActions";
import { supabase } from "@/utils/supabase";

// Komponen Pendukung
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";

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
  
  const [userSession, setUserSession] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "", location_link: "" });

  useEffect(() => {
    async function initSession() {
      const payload = await getUserSession();
      if (!payload) {
        router.push("/login");
        return;
      }
      setUserSession(payload);
      const { data } = await supabase.from("profiles").select("full_name").eq("email", payload.email).single();
      if (data) setProfileName(data.full_name);
    }
    initSession();
    fetchProducts();
  }, [router]);

  useEffect(() => {
    let filtered = products;
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) setCartItems(prev => prev.filter(i => i.id !== id));
    else setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckoutClick = async () => {
    setIsLoadingCheckout(true);
    const { data: profile } = await supabase.from("profiles").select("*").eq("email", userSession.email).single();
    if (!profile || !profile.address || !profile.phone) setShowProfileForm(true);
    else processOrder(profile);
    setIsLoadingCheckout(false);
  };

  const saveProfileAndCheckout = async (e) => {
    e.preventDefault();
    setIsLoadingCheckout(true);
    const { error } = await supabase.from("profiles").upsert({
      email: userSession.email, phone: formData.phone, address: formData.address,
      location_link: formData.location_link, full_name: profileName || "User", role: userSession.role 
    }, { onConflict: "email" });
    if (!error) {
      setShowProfileForm(false);
      processOrder({ ...formData, email: userSession.email });
    }
    setIsLoadingCheckout(false);
  };

  const processOrder = async (profile) => {
    setIsLoadingCheckout(true);
    const result = await processCheckoutBackend(userSession.email, cartItems);
    if (result.success && result.paymentUrl) window.location.href = result.paymentUrl;
    setIsLoadingCheckout(false);
  };

  return (
    <div className="min-h-screen bg-azure-bg pb-24 max-w-[420px] mx-auto font-sans relative">
      
      {/* Header & Sidebar Logic */}
      <header className="p-5 bg-azure-bg sticky top-0 z-40">
        <div className="flex justify-between items-center mb-5">
          <button onClick={() => setShowMenu(true)} className="p-2 hover:bg-white rounded-xl transition-colors">
            <Menu size={24} className="text-slate-800" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Azure Market</h1>
          <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-white rounded-xl transition-colors">
            <ShoppingCart size={24} className="text-slate-800" />
            {cartItems.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-azure-bg">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-azure-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search groceries..." 
            className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto px-5 mb-6 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all shadow-sm ${selectedCategory === cat.id ? 'bg-azure-primary text-white scale-105' : 'bg-white text-slate-500'}`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <main className="px-5 grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-20 text-slate-400 text-sm">Loading items...</div>
        ) : filteredProducts.map(p => (
          <ProductCard key={p.id} {...p} onAddToCart={addToCart} />
        ))}
      </main>

      {/* Sidebar Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-[300px] bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-azure-primary rounded-full flex items-center justify-center text-white font-bold">{profileName?.[0] || 'U'}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{profileName || "User"}</p>
                  <p className="text-[10px] text-slate-400">{userSession?.email}</p>
                </div>
              </div>
              <X size={20} className="text-slate-400" onClick={() => setShowMenu(false)} />
            </div>
            <nav className="flex flex-col gap-2">
              <button onClick={() => router.push('/home/profile')} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors"><User size={18} /> My Profile</button>
              <button onClick={() => router.push('/home/order_list')} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors"><ShoppingCart size={18} /> My Orders</button>
              <div className="h-px bg-slate-100 my-4" />
              <button onClick={handleLogout} className="flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"><LogOut size={18} /> Logout</button>
            </nav>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 bottom-0 w-full bg-white rounded-t-[40px] p-8 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-2 bg-slate-100 rounded-full"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 no-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">{item.name}</h4>
                    <p className="text-xs text-azure-primary font-bold">Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 text-slate-400 hover:text-red-500"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 text-slate-400 hover:text-azure-primary"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400 font-bold">Total Amount</span>
                <span className="text-2xl font-black text-slate-900">Rp {cartTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckoutClick}
                disabled={isLoadingCheckout}
                className="w-full bg-azure-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoadingCheckout ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profile Form */}
      {showProfileForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <div className="relative bg-white w-full rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-2">Delivery Details</h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Please complete your info for accurate delivery.</p>
            <form onSubmit={saveProfileAndCheckout} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Phone</label>
                <input type="text" required placeholder="0812..." className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                <textarea required rows="3" placeholder="Jl. Raya..." className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={12} className="text-red-500" /> Google Maps Link</label>
                <input type="url" required placeholder="https://maps..." className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" value={formData.location_link} onChange={e => setFormData({...formData, location_link: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowProfileForm(false)} className="flex-1 py-4 text-slate-400 font-bold text-sm">Cancel</button>
                <button type="submit" className="flex-[2] bg-azure-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Save & Pay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}