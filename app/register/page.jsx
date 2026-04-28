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
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo-box">
          <Store size={32} color="white" />
        </div>
        <h1 className="login-title">Fluid Market</h1>
        <p className="login-subtitle">Join us for fresh essentials delivered to your door.</p>
      </div>

      <div className="login-card">
        <Link href="/login" className="back-link">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        
        <h2>Create Account</h2>
        <p className="welcome-desc">Fill in the details below to get started.</p>

        {msg.text && (
          <div className={`alert-msg ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            required
            className="form-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="form-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 characters)"
            required
            minLength={6}
            className="form-input"
          />
          
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch-text terms-text">
          Already have an account? <Link href="/login" className="auth-link">Sign In</Link>
        </p>

        {/* Memberikan sedikit jarak ekstra menggunakan inline style khusus layout atau Anda bisa membuat class margin */}
        <div className="login-divider" style={{ marginTop: '24px' }}>
          <span>FLUID MARKET EXPERIENCE</span>
        </div>

        <div className="features-row">
          <div className="feature-chip express-chip">
            <Rocket size={16} />
            <span>Express Delivery</span>
          </div>
          <div className="feature-chip points-chip">
            <Tag size={16} />
            <span>Points Rewards</span>
          </div>
        </div>
      </div>

      <div className="login-footer">
        PREMIUM GROCERY MARKETPLACE
      </div>
    </div>
  );
}