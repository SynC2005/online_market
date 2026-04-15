"use client";

import React, { useEffect, useState } from 'react';
import { Heart, Plus, Menu, ShoppingCart, Search, Filter } from 'lucide-react';
import BottomNav from '@/components/ui/BottomNav';
import { supabase } from '@/lib/supabase/client';

const categories = [
  { icon: "🥚", label: "Dairy" },
  { icon: "🥦", label: "Veggie" },
  { icon: "🥐", label: "Bakery" },
  { icon: "🐟", label: "Seafood" },
  { icon: "🥤", label: "Drinks" },
  { icon: "🍦", label: "Snacks" },
  { icon: "🧹", label: "Home" },
  { icon: "⋯", label: "More" },
];

export default function FluidMarket() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCartItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const toggleFav = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "#f4f6fb",
      color: "#172f50",
      minHeight: "100vh",
      paddingBottom: "120px",
      maxWidth: "430px",
      margin: "0 auto",
      position: "relative",
    }}>
      {/* Top App Bar */}
      <header style={{
        background: "rgba(244,246,255,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid rgba(151,174,214,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 22,
            color: "#172f50", lineHeight: 1,
          }}>☰</button>
          <h1 style={{
            fontSize: 20, fontWeight: 800, color: "#172f50",
            letterSpacing: "-0.5px", margin: 0,
          }}>Fluid Market</h1>
        </div>
        <div style={{ position: "relative" }}>
          <button style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 22,
            color: "#172f50",
          }}>🛒</button>
          {totalCartItems > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -6, background: "#005f99",
              color: "#ecf3ff", fontSize: 10, fontWeight: 700, borderRadius: "9999px",
              padding: "2px 6px", lineHeight: 1.4,
            }}>{totalCartItems}</span>
          )}
        </div>
      </header>

      <main style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 36 }}>
        {/* Search Bar */}
        <section>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 18, color: "#61789d",
            }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fresh groceries..."
              style={{
                width: "100%", background: "#fff", border: "none", borderRadius: 14,
                padding: "14px 16px 14px 44px", fontSize: 14, color: "#172f50",
                boxShadow: "0 12px 32px -4px rgba(23,47,80,0.08)", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </section>

        {/* Hero / Featured */}
        <section>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16,
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
              Fresh for You
            </h2>
            <button style={{
              background: "none", border: "none", color: "#005f99", fontWeight: 600,
              fontSize: 13, cursor: "pointer",
            }}>View All</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Hero Card */}
            <div style={{
              gridColumn: "1 / -1", borderRadius: 18,
              background: "linear-gradient(135deg, #005f99 0%, #5eb1fc 100%)",
              padding: "28px 24px", color: "#ecf3ff", minHeight: 180,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{
                  background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                  fontSize: 9, letterSpacing: "0.12em", fontWeight: 700, textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 999, display: "inline-block", marginBottom: 8,
                }}>Daily Fresh</span>
                <h3 style={{
                  fontSize: 22, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2,
                }}>Organic Seasonal<br />Fruit Box</h3>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.85, fontWeight: 500 }}>$24.99</p>
              </div>
            </div>

            {/* Hot Deals */}
            <div style={{
              borderRadius: 16, background: "#bda1ff", padding: 18, minHeight: 130,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 28 }}>🔥</span>
              <div>
                <h4 style={{
                  margin: "0 0 4px", fontWeight: 700, color: "#1f0052", fontSize: 14,
                }}>Hot Deals</h4>
                <p style={{
                  margin: 0, fontSize: 11, color: "rgba(31,0,82,0.65)",
                }}>Up to 40% OFF</p>
              </div>
            </div>

            {/* Vegan Picks */}
            <div style={{
              borderRadius: 16, background: "#d5e3ff", padding: 18, minHeight: 130,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 28 }}>🌿</span>
              <div>
                <h4 style={{
                  margin: "0 0 4px", fontWeight: 700, color: "#002e4e", fontSize: 14,
                }}>Vegan Picks</h4>
                <p style={{
                  margin: 0, fontSize: 11, color: "rgba(0,46,78,0.65)",
                }}>Plant-based diet</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 style={{
            fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 22,
          }}>Browse Categories</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {categories.map((cat) => (
              <div key={cat.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
                <button style={{
                  width: 62, height: 62, borderRadius: "50%", background: "#ebf1ff",
                  border: "none", cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 22,
                  boxShadow: "0 2px 8px rgba(23,47,80,0.06)", transition: "transform 0.15s",
                }}>
                  {cat.icon}
                </button>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#465c80",
                }}>{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22,
          }}>
            <h2 style={{
              fontSize: 20, fontWeight: 800, letterSpacing: "-0.4px", margin: 0,
            }}>Popular Products</h2>
            <button style={{
              width: 34, height: 34, borderRadius: "50%", background: "#ebf1ff",
              border: "none", cursor: "pointer", fontSize: 16, color: "#005f99",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>⚙</button>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#61789d", padding: "24px 0" }}>
              Loading products...
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px" }}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Image Box */}
                  <div style={{
                    aspectRatio: "1/1", background: "#ebf1ff", borderRadius: 16,
                    position: "relative", display: "flex", alignItems: "center",
                    justifyContent: "center", padding: 16, overflow: "hidden",
                  }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%", height: "100%", objectFit: "contain",
                          transition: "transform 0.3s",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 32 }}>📦</span>
                    )}
                    <button
                      onClick={() => toggleFav(product.id)}
                      style={{
                        position: "absolute", top: 10, right: 10, width: 32, height: 32,
                        borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                        border: "none", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 16,
                        boxShadow: "0 2px 8px rgba(23,47,80,0.1)", transition: "transform 0.15s",
                      }}
                    >
                      {favorites[product.id] ? "❤️" : "🤍"}
                    </button>
                    {cart[product.id] > 0 && (
                      <span style={{
                        position: "absolute", bottom: 10, left: 10, background: "#005f99",
                        color: "#ecf3ff", fontSize: 10, fontWeight: 700, borderRadius: 999,
                        padding: "2px 8px",
                      }}>×{cart[product.id]}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <p style={{
                      fontSize: 9, color: "#005f99", fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.1em", margin: "0 0 3px",
                    }}>{product.category}</p>
                    <h3 style={{
                      fontSize: 13, fontWeight: 700, color: "#172f50", margin: "0 0 8px", lineHeight: 1.3,
                    }}>{product.name}</h3>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{
                        fontSize: 16, fontWeight: 800, color: "#005f99",
                      }}>${product.price?.toFixed(2) || "0.00"}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        style={{
                          width: 32, height: 32, borderRadius: "50%", background: "#005f99",
                          border: "none", cursor: "pointer", color: "#ecf3ff", fontSize: 20,
                          fontWeight: 300, display: "flex", alignItems: "center",
                          justifyContent: "center", transition: "transform 0.15s, background 0.15s",
                          lineHeight: 1,
                        }}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <p style={{
              textAlign: "center", color: "#61789d", padding: "24px 0", fontSize: 14,
            }}>No products found for "{search}"</p>
          )}
        </section>

        {/* Promo Card */}
        <section style={{ paddingBottom: 24 }}>
          <div style={{
            background: "#ccdeff", borderRadius: 20, padding: 24,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "#5eb1fc", borderRadius: 10, width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>🚚</div>
              <h3 style={{
                margin: 0, fontWeight: 700, fontSize: 15, color: "#172f50",
              }}>Free Delivery</h3>
            </div>
            <p style={{
              margin: 0, fontSize: 13, color: "#465c80", lineHeight: 1.6,
            }}>Join our membership program and get unlimited free deliveries on orders over $35.</p>
            <button style={{
              background: "#fff", color: "#005f99", fontWeight: 700, border: "none",
              borderRadius: 14, padding: "12px 0", fontSize: 13, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(23,47,80,0.08)", transition: "transform 0.15s",
            }}>Join Now</button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}