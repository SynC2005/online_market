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
  featured,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (p: number) =>
    p.toLocaleString("id-ID").replace(/,/g, ".");

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-gray-100 overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          Stok: {stock}
        </div>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-3 left-3 bg-amber-400 text-gray-800 px-2.5 py-1 rounded-full text-xs font-bold">
            Unggulan
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Category */}
        <p className="text-xs text-gray-500 font-medium">{name.split(" ")[0]}</p>

        {/* Product Name */}
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.25rem]">
          {name}
        </p>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-base font-bold text-gray-900 leading-tight">
            Rp {formatPrice(price)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">/{unit}</p>
        </div>

        {/* Add Button */}
        <button className="w-full mt-3 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-gray-800 font-semibold text-sm py-2.5 rounded-xl transition-all duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah
        </button>
      </div>
    </div>
  );
}
