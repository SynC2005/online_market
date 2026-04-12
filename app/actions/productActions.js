// app/actions/productActions.js
"use server"; 

import { supabase } from "@/utils/supabase";

export async function addProductBackend(productData) {
  try {
    // KEAMANAN TAMBAHAN (Opsional tapi disarankan):
    // Di sini Anda idealnya mengecek sesi user untuk memastikan dia adalah "admin".
    
    // 1. Siapkan data yang akan dimasukkan
    const insertPayload = {
      name: productData.name,
      category: productData.category,
      price: productData.price,
      quantity: parseInt(productData.quantity, 10), // Ubah ke angka dengan aman di server
      description: productData.description,
      image: productData.image
    };

    // 2. Tembak ke Supabase menggunakan server rahasia
    // Karena ini di server, Supabase akan menggunakan SERVICE_ROLE_KEY jika Anda sudah men-settingnya
    const { error } = await supabase
      .from('products')
      .insert([insertPayload]);

    if (error) throw error;

    return { success: true, message: "Produk berhasil ditambahkan ke database." };

  } catch (error) {
    console.error("Gagal menambah produk di server:", error.message);
    return { success: false, message: error.message };
  }
}