import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 1. PINTU DEPAN (Client Biasa)
// Gunakan ini untuk 90% aktivitas aplikasi. Aman dan tunduk pada aturan RLS.
export const supabase = createClient(supabaseUrl, anonKey)

// 2. JALUR BELAKANG (Admin Client)
// HANYA gunakan ini di dalam Server Actions / Route API untuk tugas yang butuh hak akses penuh
// (seperti insert profil baru, update webhook midtrans, dll).
// Kita gunakan peringatan error agar Anda tahu jika lupa memasukkan key-nya di .env
export const supabaseAdmin = serviceKey 
  ? createClient(supabaseUrl, serviceKey) 
  : null;