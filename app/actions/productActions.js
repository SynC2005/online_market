"use server"; 

import { supabase } from "@/utils/supabase";

export async function addProductBackend(productData) {
  try {
    // KEAMANAN TAMBAHAN: Bersihkan input harga dari apapun selain angka
    // Jaga-jaga jika ada user yang mengetik "Rp 15.000" di form, kita ubah jadi 15000 murni
    const cleanPrice = parseInt(productData.price.toString().replace(/[^0-9]/g, ''), 10);

    // 1. Siapkan data yang akan dimasukkan
    const insertPayload = {
      name: productData.name,
      category: productData.category,
      price: cleanPrice, // Sekarang menggunakan Integer murni
      quantity: parseInt(productData.quantity, 10), // Integer untuk stok
      description: productData.description,
      image: productData.image
    };

    // 2. Tembak ke Supabase
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