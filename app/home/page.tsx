import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/Bottomnav";

interface Product {
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

const products: Product[] = [
  {
    id: 1,
    name: "Apel Merah Fuji",
    category: "Buah",
    price: 15000,
    image: "/apple.jpg",
    unit: "kg",
    stock: 12,
  },
  {
    id: 2,
    name: "Susu Segar Murni",
    category: "Minuman",
    price: 22500,
    image: "/milk.jpg",
    unit: "lt",
    stock: 8,
  },
  {
    id: 3,
    name: "Brokoli Hidroponik",
    category: "Sayur",
    price: 12000,
    image: "/broccoli.jpg",
    unit: "kat",
    stock: 2,
    discount: 2,
  },
  {
    id: 4,
    name: "Cokelat Bar Premium",
    category: "Snack",
    price: 8500,
    image: "/chocolate.jpg",
    unit: "pcs",
    stock: 25,
    featured: true,
  },
  {
    id: 5,
    name: "Wortel Organik Segar",
    category: "Sayur",
    price: 9500,
    image: "/carrot.jpg",
    unit: "kg",
    stock: 15,
  },
  {
    id: 6,
    name: "Jeruk Mandarin Premium",
    category: "Buah",
    price: 18000,
    image: "/orange.jpg",
    unit: "kg",
    stock: 20,
    featured: true,
  },
];

const categories = [
  { id: 1, name: "Semua", icon: "grid" },
  { id: 2, name: "Sayur", icon: "leaf" },
  { id: 3, name: "Buah", icon: "apple" },
  { id: 4, name: "Minuman", icon: "glass" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdf9ec] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full bg-[#fdf9ec] pb-24 px-4">
        {/* Header Section */}
        <div className="pt-6 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Selamat Pagi, Kak!</h1>
          <p className="text-gray-600 text-sm mt-1">Mau belanja apa hari ini?</p>
        </div>

        {/* Search Bar */}
        <div className="pb-5">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari produk segar..."
              className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="pb-6 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-medium text-sm flex-shrink-0 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Produk Pilihan</h2>
          <a href="#" className="text-amber-500 hover:text-amber-600 text-sm font-semibold">
            Lihat Semua
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
