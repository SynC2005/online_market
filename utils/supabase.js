const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Gunakan Service Role Key jika ada (di server), jika tidak gunakan Anon Key (di client)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)