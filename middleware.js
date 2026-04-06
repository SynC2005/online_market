import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Jika BELUM login
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/home")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 2. Jika SUDAH login
  const isAdmin = token.roles?.includes("admin");

  // Logika Redirect dari halaman utama "/"
  if (pathname === "/") {
    return isAdmin
      ? NextResponse.redirect(new URL("/admin", req.url))
      : NextResponse.redirect(new URL("/home", req.url));
  }

  // Proteksi Halaman Admin
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/login"],
  // Using matcher instead of deprecated runtime config
};
