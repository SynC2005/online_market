"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/utils/supabase";

// ==========================================
// 1. FUNGSI LOGIN
// ==========================================
export async function loginUser(email, password) {
  try {
    // Pengecekan Keamanan Kunci Server
    if (!process.env.JWT_SECRET_KEY) {
      console.error("❌ ERROR: JWT_SECRET_KEY tidak ditemukan di .env.local!");
      return { success: false, message: "Kesalahan Server: Konfigurasi JWT hilang." };
    }
    if (!supabaseAdmin) {
      console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local!");
      return { success: false, message: "Kesalahan Server: Kunci Admin hilang." };
    }

    // Langkah 1: Verifikasi email & password ke Supabase Auth (Pintu Depan)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError || !authData.user) {
      console.error("Login Ditolak Supabase:", authError?.message);
      return { success: false, message: "Email atau password salah." };
    }

    const user = authData.user;

    // Langkah 2: Ambil Role dari tabel profiles (Jalur Belakang / Bypass RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("Gagal Ambil Profil:", profileError);
      return { success: false, message: "Gagal memuat profil pengguna." };
    }

    // Langkah 3: Cetak JWT (Kartu Identitas)
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const token = await new SignJWT({ 
        userId: user.id, 
        email: user.email, 
        role: profile.role 
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token berlaku 24 jam
      .sign(secretKey);

    // Langkah 4: Simpan JWT ke Cookies Browser dengan aman (VERSI NEXT.JS 15)
    const cookieStore = await cookies(); // <-- Tambahkan 'await' di sini
    
    cookieStore.set("fluid_market_token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, 
      path: '/',
    });

    return { success: true, role: profile.role };

  } catch (error) {
    console.error("Fatal Error di loginUser:", error);
    return { success: false, message: "Terjadi kesalahan internal pada server." };
  }
}

// ==========================================
// 2. FUNGSI REGISTER
// ==========================================
export async function registerUser(formData) {
  try {
    // Pengecekan Keamanan Kunci Server
    if (!supabaseAdmin) {
      console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local!");
      return { success: false, message: "Kesalahan Server: Kunci Admin hilang." };
    }

    // Ambil data dari form HTML
    const email = formData.get('email');
    const password = formData.get('password');
    const fullName = formData.get('fullName');

    // Langkah 1: Buat akun di brankas rahasia Supabase Auth (Pintu Depan)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Gagal SignUp Auth:", authError.message);
      return { success: false, message: authError.message };
    }

    const userId = authData.user?.id;

    // Langkah 2: Buat baris profil di tabel 'profiles' (Jalur Belakang / Bypass RLS)
    if (userId) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { 
            id: userId, 
            email: email, 
            full_name: fullName, 
            role: 'customer' // Role otomatis diset customer untuk pendaftar baru
          }
        ]);

      if (profileError) {
        console.error("Gagal Insert Profil:", profileError.message);
        // Idealnya jika profil gagal, akun di auth juga dihapus agar bersih (opsional)
        return { success: false, message: "Gagal menyimpan data profil pengguna." };
      }
    }

    return { success: true, message: "Pendaftaran berhasil! Silakan login." };
    
  } catch (error) {
    console.error("Fatal Error di registerUser:", error);
    return { success: false, message: "Terjadi kesalahan internal pada server." };
  }
}

// ==========================================
// 3. FUNGSI LOGOUT
// ==========================================
export async function logoutUser() {
  try {
    // 1. Hapus JWT dari Cookies (VERSI NEXT.JS 15)
    const cookieStore = await cookies(); // <-- Tambahkan 'await'
    cookieStore.delete("fluid_market_token");
    
    // 2. Akhiri sesi bawaan di Supabase
    await supabase.auth.signOut();
    
    return { success: true };
  } catch (error) {
    console.error("Gagal Logout:", error);
    return { success: false };
  }
}

// ==========================================
// 4. FUNGSI AMBIL SESI (PENGGANTI useSession)
// ==========================================
export async function getUserSession() {
  try {
    console.log("=== DIAGNOSA getUserSession ===");
    
    // 1. Cek Cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("fluid_market_token")?.value;
    
    if (!token) {
      console.log("❌ HASIL: Token JWT TIDAK DITEMUKAN di browser!");
      return null;
    }
    console.log("✅ HASIL: Token ditemukan di browser.");

    // 2. Cek Kunci Rahasia
    const secretString = process.env.JWT_SECRET_KEY;
    if (!secretString) {
      console.log("❌ HASIL: Kunci JWT_SECRET_KEY tidak terbaca oleh Server Action!");
      return null;
    }
    console.log("✅ HASIL: Kunci rahasia tersedia.");

    // 3. Verifikasi
    const secretKey = new TextEncoder().encode(secretString);
    const { payload } = await jwtVerify(token, secretKey);
    
    console.log("✅ HASIL: Verifikasi Sukses! Role pengguna:", payload.role);
    console.log("===============================");
    
    return payload;

  } catch (error) {
    console.log("❌ HASIL: Error saat memverifikasi token:", error.message);
    return null;
  }
}