import { getToken } from "next-auth/jwt";
import { handleAuthRouting } from "@/backend/auth/routing";

export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return handleAuthRouting(req, token);
}

export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/login"],
};
