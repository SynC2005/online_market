"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Apple,
  Brush,
  Croissant,
  Egg,
  Fish,
  Filter,
  Heart,
  IceCream,
  MoreHorizontal,
  Package,
  Plus,
  Truck,
  Wine,
} from "lucide-react";
import BottomNav from "@/frontend/components/ui/BottomNav";
import Header from "@/frontend/components/ui/Header";
import ProductImage from "@/frontend/components/ui/ProductImage";
import { CUSTOMER_CATEGORIES } from "@/frontend/constants/market";
import { getProducts } from "@/frontend/products/service";
import { formatProductPrice } from "@/frontend/products/utils";

const CATEGORY_ICONS = {
  Apple,
  Brush,
  Croissant,
  Egg,
  Fish,
  IceCream,
  MoreHorizontal,
  Wine,
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setProducts(await getProducts());
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const totalCartItems = Object.values(cart).reduce((total, count) => total + count, 0);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(query));
  }, [products, search]);

  const addToCart = (id) => {
    setCart((currentCart) => ({
      ...currentCart,
      [id]: (currentCart[id] || 0) + 1,
    }));
  };

  const toggleFavorite = (id) => {
    setFavorites((currentFavorites) => ({
      ...currentFavorites,
      [id]: !currentFavorites[id],
    }));
  };

  return (
    <div className="app-container">
      <Header cartCount={totalCartItems} />

      <div className="search-container">
        <input
          type="text"
          placeholder="Search fresh groceries..."
          className="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Fresh for You</h2>
          <a href="#" className="view-all">View All</a>
        </div>

        <div className="hero-banner">
          <div className="hero-content">
            <span className="badge">DAILY FRESH</span>
            <h3>Organic Seasonal<br />Fruit Box</h3>
            <p className="price">$24.99</p>
          </div>
          <div className="hero-image-placeholder">
            <Apple size={56} />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Browse Categories</h2>
        <div className="category-grid">
          {CUSTOMER_CATEGORIES.map((category) => {
            const CategoryIcon = CATEGORY_ICONS[category.icon] ?? MoreHorizontal;

            return (
              <div className="category-item" key={category.label}>
                <div className="cat-icon">
                  <CategoryIcon size={20} />
                </div>
                <span>{category.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Popular Products</h2>
          <button className="filter-btn" type="button" aria-label="Filter products">
            <Filter size={16} />
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Memuat produk...</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="product-image-real"
                    fallback={<Package size={40} color="#0b57cf" />}
                  />
                </div>

                <button
                  className="fav-btn"
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={`Favorite ${product.name}`}
                >
                  <Heart
                    size={16}
                    fill={favorites[product.id] ? "currentColor" : "none"}
                  />
                </button>

                <div className="product-info">
                  <span className="product-cat">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-bottom">
                    <span className="product-price">
                      {formatProductPrice(product.price)}
                    </span>
                    <button
                      className="add-btn"
                      type="button"
                      onClick={() => addToCart(product.id)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus size={20} color="white" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="empty-state">No products found for &quot;{search}&quot;</p>
        )}
      </section>

      <section className="promo-banner">
        <div className="promo-header">
          <div className="promo-icon">
            <Truck size={24} color="#0d47a1" />
          </div>
          <h3>Free Delivery</h3>
        </div>
        <p>Join our membership program and get unlimited free deliveries on orders over $35.</p>
        <button className="join-btn" type="button">Join Now</button>
      </section>

      <BottomNav />
    </div>
  );
}
