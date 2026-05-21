import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 1. PINTU DEPAN (Client Biasa)
export const supabase = createClient(supabaseUrl, anonKey)

// 2. JALUR BELAKANG (Admin Client)
export const supabaseAdmin = serviceKey 
  ? createClient(supabaseUrl, serviceKey) 
  : null;