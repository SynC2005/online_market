"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ArrowLeft, MapPin, Edit3, LogOut, User, Mail, Phone, X, Save } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State untuk menyimpan data dari database
  const [profileData, setProfileData] = useState({
    phone: "",
    address: "",
    location_link: "",
  });

  // State untuk form edit
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    location_link: "",
  });

  useEffect(() => {
    // Jika belum login, tendang ke halaman login
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.email) {
      fetchUserProfile();
    }
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("phone, address, location_link")
        .eq("email", session.user.email)
        .single();

      if (data && !error) {
        setProfileData(data);
        setFormData(data); // Isi form dengan data yang ada
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
      const { error } = await supabase
        .from("profiles")
        .upsert({
          email: session.user.email,
          full_name: session.user.name,
          phone: formData.phone,
          address: formData.address,
          location_link: formData.location_link,
        }, { onConflict: "email" });

      if (error) throw error;

      // Update tampilan dengan data baru
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
    await signOut({ redirect: false });
    const keycloakLogoutUrl = "http://136.119.3.213.sslip.io:8080/realms/online-market/protocol/openid-connect/logout";
    const redirectUri = encodeURIComponent(window.location.origin + "/login");
    window.location.href = `${keycloakLogoutUrl}?client_id=nextjs-app&post_logout_redirect_uri=${redirectUri}`;
  };

  if (status === "loading" || loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Memuat profil...</div>;
  }

  return (
    <div className="app-container profile-container">
      {/* Header */}
      <header className="profile-header">
        <button onClick={() => router.back()} className="fm-icon-btn">
          <ArrowLeft size={24} color="#0b57cf" />
        </button>
        <h1 className="profile-title">Profile</h1>
      </header>

      {/* Avatar & User Info */}
      <section className="profile-avatar-section">
        <div className="profile-avatar-ring">
          {session?.user?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={session.user.image} alt="Profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">
              <User size={48} />
            </div>
          )}
        </div>
        <h2 className="profile-name-text">{session?.user?.name || "User"}</h2>
        <p className="profile-email-text">
          <Mail size={14} /> {session?.user?.email}
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

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Nomor WhatsApp</label>
              <input 
                type="text" required
                value={formData.phone || ""}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Alamat Lengkap</label>
              <textarea 
                required rows="3"
                value={formData.address || ""}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "8px" }}>
              <label className="form-label form-label-icon">
                <MapPin size={14} color="#ef4444" /> Link Google Maps
              </label>
              <input 
                type="url" required
                value={formData.location_link || ""}
                onChange={(e) => setFormData({...formData, location_link: e.target.value})}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel" disabled={saving}>
                Batal
              </button>
              <button type="submit" className="btn-submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        ) : (
          /* --- MODE TAMPILAN (VIEW) --- */
          <>
            <div className="profile-card-header">
              <div className="profile-card-icon"><MapPin size={20} /></div>
              <div>
                <p className="profile-card-label">Primary Delivery Address</p>
                <p className="profile-card-value">Home</p>
              </div>
            </div>

            <p className="profile-address-text">
              {profileData.address || <span style={{ color: "#ef4444", fontStyle: "italic" }}>Alamat belum diatur.</span>}
            </p>

            {profileData.phone && (
              <p className="profile-address-text" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                <Phone size={16} color="#64748b" /> {profileData.phone}
              </p>
            )}

            <button onClick={() => setIsEditing(true)} className="btn-change-address">
              <Edit3 size={18} /> Change Address & Info
            </button>
          </>
        )}
      </section>

      {/* Tombol Logout di Bawah */}
      <div className="profile-signout-wrapper">
        <button onClick={handleLogout} className="btn-signout">
          <LogOut size={20} /> Sign Out
        </button>
      </div>

    </div>
  );
}