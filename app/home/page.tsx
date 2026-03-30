import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  unit: string;
  stock: number;
  discount?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Apel Merah Fuji Premium",
    category: "Buah-buahan",
    price: 15000,
    image: "/apple.jpg",
    unit: "kg",
    stock: 12,
  },
  {
    id: 2,
    name: "Susu Segar Murni Full Cream",
    category: "Minuman",
    price: 22500,
    image: "/milk.jpg",
    unit: "L",
    stock: 8,
    discount: 5,
  },
  {
    id: 3,
    name: "Brokoli Segar Hidroponik",
    category: "Sayuran",
    price: 12000,
    image: "/broccoli.jpg",
    unit: "kat",
    stock: 2,
    discount: 10,
  },
  {
    id: 4,
    name: "Cokelat Bar Dark Chocolate Premium",
    category: "Makanan",
    price: 8500,
    image: "/chocolate.jpg",
    unit: "pcs",
    stock: 25,
  },
  {
    id: 5,
    name: "Wortel Organik Segar",
    category: "Sayuran",
    price: 9500,
    image: "/carrot.jpg",
    unit: "kg",
    stock: 15,
  },
  {
    id: 6,
    name: "Jeruk Mandarin Premium",
    category: "Buah-buahan",
    price: 18000,
    image: "/orange.jpg",
    unit: "kg",
    stock: 20,
    discount: 3,
  },
  {
    id: 7,
    name: "Ayam Daging Segar Berkualitas",
    category: "Daging",
    price: 35000,
    image: "/chicken.jpg",
    unit: "kg",
    stock: 5,
  },
  {
    id: 8,
    name: "Telur Ayam Omega 3",
    category: "Telur",
    price: 24000,
    image: "/eggs.jpg",
    unit: "10 butir",
    stock: 30,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Belanja Kebutuhan Sehari-Hari
              </h1>
              <p className="text-gray-600">Produk segar berkualitas, diantar ke rumah Anda</p>
            </div>
          </div>
        </div>

        {/* Search Bar Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari produk..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex-shrink-0 hover:bg-blue-700 transition-colors">
              Semua Produk
            </button>
            {["Buah-buahan", "Sayuran", "Minuman", "Daging"].map((cat) => (
              <button
                key={cat}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm flex-shrink-0 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produk Tersedia</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
