import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missingEnv = [];

  if (!supabaseUrl) missingEnv.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) missingEnv.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missingEnv.length > 0) {
    return {
      client: null,
      error: `Missing webhook environment variables: ${missingEnv.join(', ')}`,
    };
  }

  return {
    client: createClient(supabaseUrl, serviceRoleKey),
    error: null,
  };
}

export async function POST(request) {
  try {
    const { client: supabaseAdmin, error: configError } = getSupabaseAdmin();

    if (configError) {
      console.error(configError);
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap" }, { status: 500 });
    }

    const body = await request.json();
    const { order_id, transaction_status } = body;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      
      // Gunakan supabaseAdmin, bukan supabase biasa
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'COMPLETED' }) 
        .eq('order_id', order_id);

      if (error) {
        console.error("Gagal update database:", error);
        return NextResponse.json({ message: "Gagal update database" }, { status: 500 });
      }
    } 
    else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'CANCELLED' })
        .eq('order_id', order_id);
    }

    return NextResponse.json({ message: "Webhook berhasil diterima" }, { status: 200 });

  } catch (error) {
    console.error("Error pada Webhook:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
