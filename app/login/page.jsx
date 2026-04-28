"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Rocket, Tag, Loader2 } from 'lucide-react';
import { loginUser } from '@/app/actions/authActions'; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        if (response.role === 'admin') {
          router.push('/admin/');
        } else {
          router.push('/home'); 
        }
      } else {
        setErrorMsg(response.message);
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Menggunakan Azure Background dan Font Plus Jakarta Sans */
    <div className="min-h-screen bg-azure-bg flex flex-col items-center px-5 pt-10 pb-5 relative max-w-[420px] mx-auto font-sans">
      
      {/* Header & Logo dengan warna Azure Primary */}
      <div className="flex flex-col items-center text-center mt-10 mb-8">
        <div className="w-16 h-16 bg-azure-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
          <Store size={32} color="white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Azure Market</h1>
        <p className="text-[13px] text-slate-500">Your daily fresh essentials, delivered.</p>
      </div>

      {/* White Card Box - Menggunakan Azure Card Style */}
      <div className="bg-white w-full rounded-[32px] px-6 py-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center z-10">
        <h2 className="text-xl text-slate-900 font-bold mb-2">Welcome back!</h2>
        <p className="text-[13px] text-slate-500 mb-8">Please sign in to access your orders and offers.</p>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 w-full p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* Form Login - Fokus pada Azure Primary */}
        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-[15px] outline-none focus:border-azure-primary focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-[15px] outline-none focus:border-azure-primary focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-azure-primary hover:bg-azure-secondary text-white p-3.5 rounded-xl text-[15px] font-bold flex justify-center items-center gap-2 mt-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        {/* Divider Garis */}
        <div className="relative w-full mt-8 mb-6 flex items-center justify-center">
          <div className="absolute w-full h-px bg-slate-200"></div>
          <span className="relative bg-white px-3 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            Azure Market Experience
          </span>
        </div>

        {/* Feature Chips - Menggunakan Azure Blue & Purple */}
        <div className="flex w-full gap-3 mb-8">
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 text-azure-primary text-[11px] font-semibold transition-transform hover:scale-105 cursor-default">
            <Rocket size={18} />
            <span>Express Delivery</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-50 text-azure-tertiary text-[11px] font-semibold transition-transform hover:scale-105 cursor-default">
            <Tag size={18} />
            <span>Points Rewards</span>
          </div>
        </div>

        {/* Terms */}
        <p className="text-[10px] text-slate-400 leading-relaxed w-5/6 mx-auto">
          By signing in, you agree to our <a href="#" className="text-azure-primary font-semibold hover:underline">Terms and Conditions</a> and <a href="#" className="text-azure-primary font-semibold hover:underline">Privacy Policy</a>.
        </p>
      </div>

      {/* Footer Luar */}
      <div className="absolute bottom-6 text-[9px] font-bold text-slate-400 tracking-[1.5px] uppercase">
        Premium Grocery Marketplace
      </div>
    </div>
  );
}