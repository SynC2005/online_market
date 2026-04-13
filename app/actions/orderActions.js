"use server"; 

import { supabase } from "@/utils/supabase";
import midtransClient from "midtrans-client"; // Import Midtrans

export async function processCheckoutBackend(userEmail, cartItems) {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("address, phone, full_name, location_link")
      .eq("email", userEmail)
      .single();

    if (profileError || !profile?.address) {
      return { success: false, message: "Profil atau alamat tidak ditemukan." };
    }

    let totalAmount = 0;
    cartItems.forEach((item) => {
      const price = typeof item.price === "string" 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
        : item.price;
      totalAmount += price * item.quantity;
    });

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`; // Format ID Midtrans tidak boleh ada #

    // 1. Simpan ke database dengan status Pending
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_email: userEmail,
        total_amount: totalAmount,
        shipping_address: profile.address,
        status: "Pending", // Status masih pending karena belum bayar
      });

    if (orderError) throw orderError;

    // ==========================================
    // 2. LOGIKA MIDTRANS DIMULAI DI SINI
    // ==========================================

    // Buat konfigurasi Midtrans Snap
    let snap = new midtransClient.Snap({
      isProduction: false, // Ubah ke true jika sudah live!
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Siapkan parameter transaksi
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount, // Total harga yang harus dibayar
      },
      customer_details: {
        first_name: profile.full_name || "Pelanggan",
        email: userEmail,
        phone: profile.phone,
        shipping_address: {
          first_name: profile.full_name || "Pelanggan",
          phone: profile.phone,
          address: profile.address,
        }
      },
      // Opsional: Kirim daftar item agar muncul di invoice Midtrans
      item_details: cartItems.map(item => {
        const price = typeof item.price === "string" ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price;
        return {
          id: item.id,
          price: price,
          quantity: item.quantity,
          name: item.name.substring(0, 50) // Midtrans membatasi nama max 50 karakter
        };
      })
    };

    // Minta token/URL dari Midtrans
    const transaction = await snap.createTransaction(parameter);

    // 3. Kembalikan URL pembayaran ke Frontend
    return { 
      success: true, 
      orderId: orderId,
      paymentUrl: transaction.redirect_url, // <--- INI PENTING!
      token: transaction.token,
      message: "Pesanan dibuat. Silakan selesaikan pembayaran." 
    };

  } catch (error) {
    console.error("Gagal proses Midtrans:", error.message);
    return { success: false, message: error.message };
  }
}