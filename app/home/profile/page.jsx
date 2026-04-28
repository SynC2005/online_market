"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Edit3, LogOut, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { getUserSession, logoutUser } from "@/app/actions/authActions"; // Gunakan fungsi kustom kita

export default function ProfilePage() {
  const router = useRouter();
  
  // State untuk menyimpan JWT Payload
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State untuk data dari database (ditambah full_name karena NextAuth sudah tidak ada)
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    address: "",
    location_link: "",
  });

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    location_link: "",
  });

  useEffect(() => {
    async function initProfile() {
      // 1. Ambil sesi JWT
      const payload = await getUserSession();
      
      // 2. Tendang ke login jika tidak ada token
      if (!payload) {
        router.push("/login");
        return;
      }

      setUserSession(payload);
      fetchUserProfile(payload.email);
    }

    initProfile();
  }, [router]);

  const fetchUserProfile = async (email) => {
    try {
      setLoading(true);
      // Ambil juga full_name dari database
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address, location_link")
        .eq("email", email)
        .single();

      if (data && !error) {
        setProfileData(data);
        setFormData(data); 
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Gunakan UPDATE, karena data profil pasti sudah terbuat saat Register
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          location_link: formData.location_link,
        })
        .eq("email", userSession.email); // Kunci pembaruan berdasarkan email

      if (error) throw error;

      setProfileData(formData);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Gagal menyimpan perubahan: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    // Gunakan fungsi logout kustom (Tanpa Keycloak!)
    await logoutUser();
    router.push('/login');
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Memuat profil...</div>;
  }

  return (
    <div className="app-container profile-container">
      {/* Header */}
      <header className="profile-header">
        <button onClick={() => router.back()} className="fm-icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#0b57cf" />
        </button>
        <h1 className="profile-title">Profile</h1>
      </header>

      {/* Avatar & User Info */}
      <section className="profile-avatar-section">
        <div className="profile-avatar-ring">
          <div className="profile-avatar-placeholder">
            <User size={48} />
          </div>
        </div>
        {/* Mengambil nama dari database, bukan dari session */}
        <h2 className="profile-name-text">{profileData.full_name || "Pengguna Fluid"}</h2>
        <p className="profile-email-text">
          <Mail size={14} /> {userSession?.email}
        </p>
      </section>

      {/* Alamat & Kontak Card */}
      <section className="profile-card">
        {isEditing ? (
          /* --- MODE EDIT --- */
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="profile-card-header" style={{ marginBottom: "8px" }}>
              <div className="profile-card-icon"><Edit3 size={20} /></div>
              <div>
                <p className="profile-card-label">Mode Edit</p>
                <p className="profile-card-value">Perbarui Data Anda</p>
              </div>
            </div>

            {/* Tambahan Form untuk Nama Lengkap */}
            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label">Nama Lengkap</label>
              <input 
                type="text" required
                value={formData.full_name || ""}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label">Nomor WhatsApp</label>
              <input 
                type="text" required
                value={formData.phone || ""}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "12px" }}>
              <label className="form-label">Alamat Lengkap</label>
              <textarea 
                required rows="3"
                value={formData.address || ""}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label form-label-icon" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#ef4444" /> Link Google Maps
              </label>
              <input 
                type="url" required
                value={formData.location_link || ""}
                onChange={(e) => setFormData({...formData, location_link: e.target.value})}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="form-actions" style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel" disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
                Batal
              </button>
              <button type="submit" className="btn-submit" disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: '#0b57cf', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        ) : (
          /* --- MODE TAMPILAN (VIEW) --- */
          <>
            <div className="profile-card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="profile-card-icon" style={{ padding: '8px', background: '#eff6ff', borderRadius: '50%', color: '#0b57cf' }}>
                <MapPin size={20} />
              </div>
              <div>
                <p className="profile-card-label" style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Primary Delivery Address</p>
                <p className="profile-card-value" style={{ fontWeight: 'bold', margin: 0 }}>Home</p>
              </div>
            </div>

            <p className="profile-address-text" style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
              {profileData.address || <span style={{ color: "#ef4444", fontStyle: "italic" }}>Alamat belum diatur.</span>}
            </p>

            {profileData.phone && (
              <p className="profile-address-text" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", fontSize: '14px' }}>
                <Phone size={16} color="#64748b" /> {profileData.phone}
              </p>
            )}

            <button onClick={() => setIsEditing(true)} className="btn-change-address" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}>
              <Edit3 size={18} /> Ubah Profil & Alamat
            </button>
          </>
        )}
      </section>

      {/* Tombol Logout di Bawah */}
      <div className="profile-signout-wrapper" style={{ marginTop: '24px', padding: '0 20px' }}>
        <button onClick={handleLogout} className="btn-signout" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
}