import React from "react";
import { Heart, Plus } from "lucide-react";

export default function ProductCard({
  id,
  image,
  category,
  name,
  price,
  description,
  onAddToCart,
}) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price, image, category });
    }
  };

  return (
    <div className="product-card">
      {/* Gambar Asli */}
      <img src={image} alt={name} className="product-image-real" />

      <button className="fav-btn">
        <Heart size={16} />
      </button>

      <div className="product-info">
        <span className="product-cat">{category}</span>
        <h4 className="product-name">{name}</h4>

        {/* Menampilkan deskripsi singkat */}
        <p className="product-desc">{description}</p>

        <div className="product-bottom">
          <span className="product-price">{price}</span>
          <button className="add-btn" onClick={handleAddToCart}>
            <Plus size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
