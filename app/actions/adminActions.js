"use server";

import { supabase } from "@/utils/supabase";

export async function getDashboardStats() {
  try {
    // 1. Tarik Data Laporan Keuangan
    const { data: reports } = await supabase.from('financial_reports').select('*');
    
    let totalRevenue = 0;
    let totalOrders = 0;
    let productSales = {}; // Untuk menggabungkan JSONB breakdown produk

    reports?.forEach(report => {
      totalRevenue += Number(report.total_revenue || 0);
      totalOrders += Number(report.total_orders || 0);
      
      // Membongkar JSONB product_sales_breakdown
      const breakdown = report.product_sales_breakdown || {};
      for (const [productName, qty] of Object.entries(breakdown)) {
        productSales[productName] = (productSales[productName] || 0) + Number(qty);
      }
    });

    // Ubah format breakdown produk menjadi array dan ambil 3 yang paling laris
    const topProducts = Object.entries(productSales)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);

    // 2. Tarik Data Pelanggan Terbaik (Customer Analytics)
    const { data: topCustomers } = await supabase
      .from('customer_analytics')
      .select('*')
      .order('total_spent', { ascending: false })
      .limit(3);

    // 3. Tarik Total Pelanggan
    const { count: totalCustomersCount } = await supabase
      .from('customer_analytics')
      .select('*', { count: 'exact', head: true });

    // 4. Tarik Peringatan Stok Rendah (Low Stock) dari tabel products
    const { data: lowStock } = await supabase
      .from('products')
      .select('name, quantity')
      .order('quantity', { ascending: true })
      .limit(6);

    return { 
      success: true, 
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers: totalCustomersCount || 0,
        topProducts,
        topCustomers: topCustomers || [],
        lowStock: lowStock || []
      }
    };
  } catch (error) {
    console.error("Gagal mengambil data dashboard:", error.message);
    return { success: false, message: error.message };
  }
}