import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { handleAuthRouting } from "@/lib/auth/middleware";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return handleAuthRouting(req, token);
}

export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/login"],
  // Using matcher instead of deprecated runtime config
};
