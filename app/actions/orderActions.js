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

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`; 

    // 1. Simpan Header ke tabel 'orders'
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

    // ==========================================
    // 2. LOGIKA BARU: Simpan Detail ke 'order_items'
    // ==========================================
    // Kita siapkan array berisi semua barang dari keranjang belanja
    const orderItemsData = cartItems.map((item) => {
      const price = typeof item.price === "string" 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) 
        : item.price;

      return {
        order_id: orderId,
        product_id: item.id, // ID produk dari tabel products
        product_name: item.name,
        quantity: item.quantity,
        price_at_purchase: price,
        total_price: price * item.quantity,
      };
    });

    // Masukkan semua barang sekaligus ke Supabase
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) throw itemsError;
    // ==========================================

    // 3. LOGIKA MIDTRANS
    let snap = new midtransClient.Snap({
      isProduction: false, 
      serverKey: process.env.MIDTRANS_SERVER_KEY, 
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

    return { 
      success: true, 
      orderId: orderId,
      paymentUrl: transaction.redirect_url, 
    };

  } catch (error) {
    console.error("Gagal proses Midtrans:", error.message);
    return { success: false, message: error.message };
  }
}