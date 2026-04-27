import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Gunakan Service Role Key jika ada (di server), jika tidak gunakan Anon Key (di client)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export supabase agar bisa dipakai di route.js dan tempat lain
export const supabase = createClient(supabaseUrl, supabaseKey);
