"use server";

import { supabase } from "@/utils/supabase";

export async function getDashboardStats() {
  try {
    // MITIGASI E-03 & I-03: VALIDASI OTORISASI SERVER ACTION
    
    // 1. Cek Sesi User (Apakah ada yang login?)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { 
        success: false, 
        message: "Unauthorized: Silakan login terlebih dahulu." 
      };
    }

    // 2. Cek Role ASLI dari database (Jangan percaya data dari client)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // 3. Blokir mutlak jika bukan admin
    if (profileError || !profile || profile.role !== "admin") {
      console.error(`[SECURITY ALERT] Upaya akses ilegal ke data finansial oleh User ID: ${user.id}`);
      return { 
        success: false, 
        message: "Forbidden: Anda tidak memiliki hak akses Admin." 
      };
    }
    // ====================================================================

    // 1. Tarik Data Laporan Keuangan
    const { data: reports, error: reportError } = await supabase.from('financial_reports').select('*');
    if (reportError) console.error("Error Laporan:", reportError.message);
    
    let totalRevenue = 0;
    let totalOrders = 0;
    let productSales = {}; 

    reports?.forEach(report => {
      totalRevenue += Number(report.total_revenue || 0);
      totalOrders += Number(report.total_orders || 0);
      
      const breakdown = report.product_sales_breakdown || {};
      for (const [productName, qty] of Object.entries(breakdown)) {
        productSales[productName] = (productSales[productName] || 0) + Number(qty);
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);

    // 2. Tarik Data Pelanggan Terbaik
    const { data: topCustomers, error: custError } = await supabase
      .from('customer_analytics')
      .select('*')
      .order('total_spent', { ascending: false })
      .limit(3);
    if (custError) console.error("Error Customers:", custError.message);

    // 3. Tarik Total Pelanggan
    const { count: totalCustomersCount, error: countError } = await supabase
      .from('customer_analytics')
      .select('*', { count: 'exact', head: true });
    if (countError) console.error("Error Count:", countError.message);

    // 4. Tarik Peringatan Stok Rendah
    const { data: lowStock, error: stockError } = await supabase
      .from('products')
      .select('name, quantity')
      .order('quantity', { ascending: true })
      .limit(6);
    if (stockError) console.error("Error Stock:", stockError.message);

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