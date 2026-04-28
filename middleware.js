import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // 1. Ambil Tiket JWT
  const token = request.cookies.get("fluid_market_token")?.value;
  const secretString = process.env.JWT_SECRET_KEY;

  // Jika server tidak punya kunci pembuka, tendang semua (Demi Keamanan)
  if (!secretString) return NextResponse.redirect(new URL("/login", request.url));

  const secretKey = new TextEncoder().encode(secretString);

  // ==========================================
  // ATURAN 1: ROOT PATH ( / )
  // Saat web pertama kali dibuka, langsung arahkan ke tempat yang benar
  // ==========================================
  if (path === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      // Admin dilempar ke /admin, Customer dilempar ke /home
      return NextResponse.redirect(new URL(payload.role === "admin" ? "/admin" : "/home", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ==========================================
  // ATURAN 2: HALAMAN ADMIN ( /admin/... )
  // ==========================================
  if (path.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      
      // Jika rolenya BUKAN admin (misal: customer), tendang kembali ke /home
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/home", request.url));
      }
      
      // Jika Admin, persilakan masuk
      return NextResponse.next(); 
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ==========================================
  // ATURAN 3: HALAMAN HOME & PROFILE ( /home/... )
  // ==========================================
  if (path.startsWith("/home") || path.startsWith("/profile")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      // Kita HANYA mengecek apakah tokennya asli. 
      // Kita TIDAK mengecek role di sini.
      // Artinya: ADMIN maupun CUSTOMER dipersilakan masuk!
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Untuk file statis (gambar, css, dll), biarkan lewat
  return NextResponse.next();
}

// Daftarkan rute mana saja yang HARUS dijaga oleh Satpam Middleware ini
export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/home/:path*",
    "/profile/:path*"
  ],
};