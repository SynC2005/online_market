import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { supabase } from "@/utils/supabase";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      // 1. TAMBAHAN UNTUK MENGATASI TIMEOUT (Tunggu hingga 10 detik)
      httpOptions: {
        timeout: 10000, 
      },
      authorization: {
        params: {
          prompt: "login",
          kc_idp_hint: "google",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const roles = profile?.realm_access?.roles || [];
        let userRole = "user";
        if (roles.includes("admin")) userRole = "admin";
        else if (roles.includes("driver")) userRole = "driver";

        // 2. PERBAIKAN NAMA KOLOM SUPABASE (Menjadi full_name)
        const { error } = await supabase
          .from("profiles")
          .upsert(
            {
              email: user.email,
              full_name: user.name, // <-- Diperbarui sesuai gambar tabel Anda
              role: userRole,
              // Catatan: Saya menghapus 'image' karena di gambar tabel Anda tidak ada kolom 'image'
            },
            { onConflict: "email" }
          );

        if (error) {
          console.error("Gagal menyimpan ke Supabase:", error.message);
        } else {
          console.log("Data user berhasil disinkronisasi ke Supabase!");
        }

        return true;
      } catch (error) {
        console.error("Terjadi kesalahan sistem saat sinkronisasi:", error);
        return true;
      }
    },

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