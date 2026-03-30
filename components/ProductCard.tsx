"use client";

import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  unit: string;
  stock: number;
  discount?: number;
  featured?: boolean;
}

export default function ProductCard({
  name,
  price,
  image,
  unit,
  stock,
  discount,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p).replace("Rp", "Rp ");

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100" />}

        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {name}
        </h3>

        <p className="text-xs text-gray-500 mb-2">{unit}</p>

        <div className="mt-auto space-y-2">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(price)}
          </p>
          
          {stock <= 5 && (
            <p className="text-xs text-red-600 font-medium">Stok terbatas: {stock}</p>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors duration-200">
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
