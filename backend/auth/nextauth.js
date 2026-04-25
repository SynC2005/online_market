import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { supabaseAdmin } from "@/backend/supabase/admin";

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const userRole = profile.realm_access?.roles?.includes("admin") ? "admin" : "user";

        const { error } = await supabaseAdmin
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email,
              full_name: user.name,
              role: userRole,
            },
            { onConflict: "email" }
          );

        if (error) throw error;
        return true;
      } catch (error) {
        console.error("Gagal sinkronisasi ke Supabase:", error);
        return false;
      }
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.roles = profile.realm_access?.roles || [];
        token.id = profile.sub;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.roles = token.roles;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
