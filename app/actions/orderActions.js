// app/actions/orderActions.js
"use server"; // Baris ini wajib ada di paling atas

import { supabase } from "@/utils/supabase";

export async function processCheckoutBackend(userEmail, cartItems) {
  try {
    // 1. Ambil data profil terbaru untuk memastikan alamat sudah ada
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("address, phone, full_name")
      .eq("email", userEmail)
      .single();

    if (profileError || !profile?.address) {
      return { success: false, message: "Profil atau alamat tidak ditemukan." };
    }

    // 2. Logika Keamanan: Hitung total harga di Server
    // Jangan percaya harga yang dikirim dari Frontend! 
    // Di aplikasi nyata, Anda harus mengambil harga asli dari tabel 'products'
    let totalAmount = 0;
    cartItems.forEach((item) => {
      const price = typeof item.price === "string" 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
        : item.price;
      totalAmount += price * item.quantity;
    });

    const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Simpan ke tabel 'orders'
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_email: userEmail,
        total_amount: totalAmount,
        shipping_address: profile.address,
        status: "Pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Di sini Anda bisa menambahkan logika tambahan seperti:
    // - Mengurangi stok barang di tabel 'products'
    // - Menghapus item di tabel 'cart_items' jika ada

    return { 
      success: true, 
      orderId: orderId,
      message: "Pesanan berhasil dibuat secara aman di server." 
    };

  } catch (error) {
    console.error("Server Action Error:", error.message);
    return { success: false, message: "Terjadi kesalahan di server: " + error.message };
  }
}