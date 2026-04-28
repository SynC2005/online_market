"use client";

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Plus, Search, Trash2, Pencil, PackageOpen, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import AdminBottomNav from '@/components/AdminBottomNav'; 

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [categories, setCategories] = useState(['Semua']); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setProducts(data);
        const allCategories = data.map(product => product.category);
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(['Semua', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        
        const remainingCategories = [...new Set(updatedProducts.map(p => p.category))];
        setCategories(['Semua', ...remainingCategories]);
        
        if (!remainingCategories.includes(activeCategory) && activeCategory !== 'Semua') {
          setActiveCategory('Semua');
        }
        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting product:', error.message);
        alert('Gagal menghapus produk.');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-azure-bg pb-24 font-sans text-slate-800 max-w-[420px] mx-auto relative">
      
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 bg-azure-bg sticky top-0 z-50">
        <button 
          className="p-2 bg-white rounded-xl shadow-sm text-azure-primary active:scale-90 transition-transform" 
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">Kelola Produk</h1>
        <button 
          className="p-2 bg-azure-primary text-white rounded-xl shadow-lg shadow-blue-500/30 active:scale-90 transition-transform" 
          onClick={() => router.push('/admin/products/add')}
        >
          <Plus size={20} />
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-azure-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama produk..." 
            className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* DYNAMIC FILTER CHIPS */}
      <div className="flex gap-3 overflow-x-auto px-6 mb-8 no-scrollbar">
        {categories.map((category, index) => (
          <button 
            key={index}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm border ${
              activeCategory === category 
              ? 'bg-azure-primary text-white border-azure-primary scale-105' 
              : 'bg-white text-slate-500 border-transparent hover:border-slate-200'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={32} className="animate-spin mb-4" />
            <p className="text-sm font-bold">Sinkronisasi Data...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-[28px] p-3 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
              
              {/* Image Preview with Badge */}
              <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-50">
                <span className="absolute top-1.5 left-1.5 bg-azure-tertiary/90 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  {product.category}
                </span>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Info & Actions */}
              <div className="flex flex-col justify-between flex-1 py-1 pr-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      In Stock
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[15px] font-black text-azure-primary">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-azure-secondary hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => alert(`Edit fitur untuk ID: ${product.id} segera hadir`)}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <PackageOpen size={48} className="text-slate-200 mb-4" />
            <p className="text-sm font-bold text-slate-400">Tidak ada produk ditemukan.</p>
          </div>
        )}
      </div>

      <AdminBottomNav />
    </div>
  );
}