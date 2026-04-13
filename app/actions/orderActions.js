"use server"; 

import { supabase } from "@/utils/supabase";
import midtransClient from "midtrans-client"; 

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

    // PENTING: Format ID Midtrans tidak boleh ada tanda pagar (#)
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`; 

    // Simpan ke database Supabase dengan status Pending
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        user_email: userEmail,
        total_amount: totalAmount,
        shipping_address: profile.address,
        status: "Pending", 
      });

    if (orderError) throw orderError;

    // --- LOGIKA MIDTRANS ---
    // Pastikan process.env.MIDTRANS_SERVER_KEY sudah Anda isi di Vercel / .env.local
    let snap = new midtransClient.Snap({
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SERVER_KEY_ANDA_KOSONG",
    });

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount, 
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
      }
    };

    const transaction = await snap.createTransaction(parameter);

    // Kembalikan URL pembayaran Midtrans ke Frontend
    return { 
      success: true, 
      orderId: orderId,
      paymentUrl: transaction.redirect_url, // Ini yang akan melempar user ke Midtrans
    };

  } catch (error) {
    console.error("Gagal proses Midtrans:", error.message);
    return { success: false, message: error.message };
  }
}