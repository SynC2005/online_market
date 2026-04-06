import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase menggunakan Service Role (Hanya jalan di Server!)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    // 1. Dijalankan sesaat setelah user berhasil login dari Keycloak/Google
    async signIn({ user, profile }) {
      try {
        // Ambil role dari Keycloak (default ke 'user' jika kosong)
        const userRole = profile.realm_access?.roles?.includes('admin') ? 'admin' : 'user';

        // Masukkan atau perbarui data user ke tabel profiles di Supabase
        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert({ 
            id: user.id, // ID dari Keycloak
            email: user.email, 
            full_name: user.name,
            role: userRole
          }, { onConflict: 'email' });

        if (error) throw error;
        return true; // Lanjut ke proses login NextAuth
      } catch (error) {
        console.error("Gagal sinkronisasi ke Supabase:", error);
        return false; // Batalkan login jika gagal simpan ke DB
      }
    },

    // 2. Memasukkan role ke dalam token JWT NextAuth
    async jwt({ token, profile }) {
      if (profile) {
        token.roles = profile.realm_access?.roles || [];
        token.id = profile.sub; // Simpan ID Keycloak ke token
      }
      return token;
    },

    // 3. Melemparkan data dari token ke Session agar bisa dibaca di React (Frontend)
    async session({ session, token }) {
      if (token) {
        session.user.roles = token.roles;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Jika Anda punya halaman login custom
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };