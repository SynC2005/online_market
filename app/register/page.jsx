"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Rocket, Tag, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/authActions';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData(e.target);
    const result = await registerUser(formData);

    if (result.success) {
      setMsg({ type: 'success', text: result.message });
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setMsg({ type: 'error', text: result.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-azure-bg flex flex-col items-center px-5 pt-10 pb-5 relative max-w-[420px] mx-auto font-sans">
      
      {/* Header & Logo */}
      <div className="flex flex-col items-center text-center mt-10 mb-8">
        <div className="w-16 h-16 bg-azure-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
          <Store size={32} color="white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Azure Market</h1>
        <p className="text-[13px] text-slate-500 px-4">Join us for fresh essentials delivered to your door.</p>
      </div>

      {/* Register Card */}
      <div className="bg-white w-full rounded-[32px] px-6 py-8 shadow-xl shadow-slate-200/50 flex flex-col z-10">
        
        <Link 
          href="/login" 
          className="flex items-center gap-2 text-azure-primary text-[13px] font-bold mb-6 hover:translate-x-[-4px] transition-transform w-fit"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
        
        <h2 className="text-xl text-slate-900 font-bold mb-1">Create Account</h2>
        <p className="text-[13px] text-slate-500 mb-8">Fill in the details below to get started.</p>

        {/* Notifikasi Alert */}
        {msg.text && (
          <div className={`w-full p-4 rounded-xl mb-6 text-sm font-medium border text-center transition-all ${
            msg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Form Registration */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-[15px] outline-none focus:border-azure-primary focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 text-[15px] outline-none focus:border-azure-primary focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 characters)"
            required
            minLength={6}
            className="w-full p-3.5 rounded-xl border border-slate-200 text-[15px] outline-none focus:border-azure-primary focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
          />
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-azure-primary hover:bg-azure-secondary text-white p-3.5 rounded-xl text-[15px] font-bold flex justify-center items-center gap-2 mt-4 transition-all active:scale-[0.98] disabled:opacity-70 shadow-md shadow-blue-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[13px] text-slate-500 mt-6 font-medium">
          Already have an account? <Link href="/login" className="text-azure-primary font-bold hover:underline">Sign In</Link>
        </p>

        {/* Divider Azure Experience */}
        <div className="relative w-full mt-8 mb-6 flex items-center justify-center">
          <div className="absolute w-full h-px bg-slate-200"></div>
          <span className="relative bg-white px-3 text-[9px] font-bold text-slate-400 tracking-widest uppercase">
            Azure Market Experience
          </span>
        </div>

        {/* Feature Chips */}
        <div className="flex w-full gap-3 mb-4">
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 text-azure-primary text-[11px] font-semibold transition-transform hover:scale-105 cursor-default">
            <Rocket size={18} />
            <span>Express Delivery</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-50 text-azure-tertiary text-[11px] font-semibold transition-transform hover:scale-105 cursor-default">
            <Tag size={18} />
            <span>Points Rewards</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-[9px] font-bold text-slate-400 tracking-[1.5px] uppercase">
        Premium Grocery Marketplace
      </div>
    </div>
  );
}