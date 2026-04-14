import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Membuat client Supabase KHUSUS ADMIN (Bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Gunakan Service Role Key!
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { order_id, transaction_status } = body;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      
      // Gunakan supabaseAdmin, bukan supabase biasa
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'Lunas' }) 
        .eq('order_id', order_id);

      if (error) {
        console.error("Gagal update database:", error);
        return NextResponse.json({ message: "Gagal update database" }, { status: 500 });
      }
    } 
    else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'Dibatalkan' })
        .eq('order_id', order_id);
    }

    return NextResponse.json({ message: "Webhook berhasil diterima" }, { status: 200 });

  } catch (error) {
    console.error("Error pada Webhook:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}