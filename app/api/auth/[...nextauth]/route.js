import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
// 1. Import koneksi Supabase Anda
import { supabase } from "@/utils/supabase"; 

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          prompt: "select_account", // Memaksa pilih akun Google
          kc_idp_hint: "google",    // Langsung tembus ke Google
        },
      },
    }),
  ],
  callbacks: {
    // 2. Tambahkan Callback signIn di sini
    async signIn({ user, profile }) {
      try {
        // Ambil role dari profil Keycloak (Defaultnya 'user' jika tidak ada)
        const roles = profile?.realm_access?.roles || [];
        let userRole = "user";
        if (roles.includes("admin")) userRole = "admin";
        else if (roles.includes("driver")) userRole = "driver";

        // 3. Simpan atau Update data ke Supabase (Upsert)
        // Upsert akan mengecek: Jika email sudah ada, update datanya. Jika belum, buat baru.
        const { error } = await supabase
          .from("profiles") // Ganti dengan nama tabel Anda jika berbeda (misal: "users")
          .upsert(
            {
              email: user.email,
              name: user.name,
              image: user.image,
              role: userRole,
              // Anda bisa menambahkan kolom lain jika ada di tabel Supabase
            },
            { onConflict: "email" } // Pastikan kolom email disetting UNIQUE di Supabase
          );

        if (error) {
          console.error("Gagal menyimpan ke Supabase:", error.message);
        } else {
          console.log("Data user berhasil disinkronisasi ke Supabase!");
        }

        // Return true agar proses login NextAuth diizinkan lanjut
        return true;
      } catch (error) {
        console.error("Terjadi kesalahan sistem saat sinkronisasi:", error);
        // Tetap return true agar user tidak terblokir login meskipun database sedang down
        return true; 
      }
    },

    // (Biarkan jwt dan session callback Anda yang sudah ada sebelumnya di bawah ini)
    async jwt({ token, profile }) {
      if (profile) {
        token.roles = profile.realm_access?.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.roles = token.roles;
      }
      return session;
    }
  },
});

export { handler as GET, handler as POST };