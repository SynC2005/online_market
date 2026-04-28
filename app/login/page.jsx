"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Rocket, Tag, Loader2 } from 'lucide-react';
// IMPORT SERVER ACTION KITA
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
      // Panggil fungsi login kustom kita
      const response = await loginUser(email, password);

      if (response.success) {
        // Redirect berdasarkan Role yang didapat dari JWT
        if (response.role === 'admin') {
          router.push('/admin/');
        } else {
          router.push('/home'); // Lempar ke beranda untuk user biasa/customer
        }
      } else {
        // Tampilkan pesan error dari server (misal: password salah)
        setErrorMsg(response.message);
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
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
        <p className="login-subtitle">Your daily fresh essentials, delivered.</p>
      </div>

      <div className="login-card">
        <h2>Welcome back!</h2>
        <p className="welcome-desc">Please sign in to access your orders and offers.</p>

        {/* --- TAMPILAN ERROR JIKA ADA --- */}
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* --- FORM LOGIN EMAIL & PASSWORD --- */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px' }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              border: 'none', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

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

        <p className="terms-text">
          By signing in, you agree to our <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>

      <div className="login-footer">
        PREMIUM GROCERY MARKETPLACE
      </div>
    </div>
  );
}