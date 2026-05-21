"use server"; 

import { supabase } from "@/utils/supabase";
import midtransClient from "midtrans-client"; 
import { revalidatePath } from "next/cache"; 

/**
 * ─── MODUL MANAJEMEN ORDER & CHECKOUT ───
 * Mitigasi T-01: Validasi Harga & Kuantitas di Sisi Server
 */
export async function processCheckoutBackend(userEmail, cartItems) {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Keranjang belanja kosong." };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("address, phone, full_name, location_link")
      .eq("email", userEmail)
      .single();

    if (profileError || !profile?.address) {
      return { success: false, message: "Profil atau alamat tidak ditemukan." };
    }

    // A. Ambil daftar ID produk dari payload client
    const productIds = cartItems.map((item) => item.id);

    // B. Ambil data harga dan quantity (stok) asli langsung dari database server
    const { data: realProducts, error: dbError } = await supabase
      .from("products")
      .select("id, name, price, quantity") // Sesuai dengan kolom 'quantity' pada struktur DB Anda
      .in("id", productIds);

    if (dbError || !realProducts) {
      return { success: false, message: "Gagal memvalidasi data produk ke server." };
    }

    let totalAmount = 0;
    const validatedOrderItems = [];
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`; 

    // C. Lakukan perhitungan ulang secara aman di sisi server
    for (const item of cartItems) {
      const realProduct = realProducts.find((p) => p.id === item.id);

      if (!realProduct) {
        return { success: false, message: `Produk ID ${item.id} tidak valid.` };
      }

      // Mencegah manipulasi kuantitas minus, nol, atau melebihi stok quantity di DB
      if (item.quantity <= 0 || item.quantity > realProduct.quantity) {
        return { 
          success: false, 
          message: `Kuantitas tidak valid atau stok habis untuk: ${realProduct.name}` 
        };
      }

      // Menggunakan HARGA ASLI DATABASE
      const subtotal = realProduct.price * item.quantity;
      totalAmount += subtotal;

      validatedOrderItems.push({
        order_id: orderId,
        product_id: realProduct.id,
        product_name: realProduct.name,
        quantity: item.quantity,
        price_at_purchase: realProduct.price, 
        total_price: subtotal,
      });
    }

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

    // 2. Simpan Detail ke 'order_items'
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(validatedOrderItems);

    if (itemsError) throw itemsError;

    // 3. Integrasi Pembayaran Midtrans Snap
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

/**
 * Mitigasi E-02 & E-03: Validasi Sesi dan Peran (Role) secara Server-Side
 */
async function verifyAdminOtorisasi() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized: Silakan login terlebih dahulu.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    throw new Error("Forbidden: Anda tidak memiliki akses halaman ini.");
  }
}

// Mengambil Data Pesanan Aktif untuk Admin
export async function getActiveOrders() {
  try {
    // Jalankan validasi satpam server
    await verifyAdminOtorisasi();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        order_id, created_at, user_email, shipping_address, status, total_amount,
        order_items ( product_name, quantity, price_at_purchase )
      `)
      .neq('status', 'Lunas') 
      .neq('status', 'Cancelled')
      .order('created_at', { ascending: true }); 

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Gagal mengambil orders:", error.message);
    return { success: false, message: error.message };
  }
}

// Menyelesaikan Pesanan oleh Admin (Mitigasi E-05)
export async function completeOrder(orderId) {
  try {
    // Jalankan validasi satpam server
    await verifyAdminOtorisasi();

    const { error } = await supabase
      .from('orders')
      .update({ status: 'Lunas' }) 
      .eq('order_id', orderId);

    if (error) throw error;

    revalidatePath('/admin/orders'); 
    revalidatePath('/admin'); 

    return { success: true };
  } catch (error) {
    console.error("Gagal menyelesaikan order:", error.message);
    return { success: false, message: error.message };
  }
}