import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Mengambil token sesi pengguna
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // --------------------------------------------------------
  // ATURAN 1: JIKA PENGGUNA BELUM LOGIN
  // --------------------------------------------------------
  if (!token) {
    // Jika mencoba masuk ke /admin atau /home, tendang ke halaman login
    if (pathname.startsWith("/admin") || pathname.startsWith("/home")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Izinkan akses ke halaman lain (misalnya /login itu sendiri)
    return NextResponse.next();
  }

  // --------------------------------------------------------
  // ATURAN 2: JIKA PENGGUNA SUDAH LOGIN
  // --------------------------------------------------------
  const roles = token.roles || [];
  const isAdmin = roles.includes("admin");

  // A. Logika Redirect Awal (Traffic Controller)
  // Jika mereka mendarat di "/" (hasil callback login) atau mencoba buka "/login" lagi
  if (pathname === "/" || pathname.startsWith("/login")) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url)); // Admin otomatis ke /admin
    } else {
      return NextResponse.redirect(new URL("/home", req.url));  // User biasa ke /home
    }
  }

  // B. Proteksi Halaman Khusus Admin
  // Jika yang mencoba masuk /admin bukan admin, lempar ke /home
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // C. Bebas Akses (Termasuk Admin yang mau jalan-jalan ke /home)
  // Middleware akan meloloskan permintaan ini
  return NextResponse.next();
}

// Menentukan halaman mana saja yang akan dipantau oleh middleware ini
export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/login"],
};