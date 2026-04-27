import { NextResponse } from "next/server";

export function handleAuthRouting(req, token) {
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/home") || pathname.startsWith("/driver")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const roles = token.roles || [];
  const isAdmin = roles.includes("admin");
  const isDriver = roles.includes("driver"); // <-- Deteksi role driver

  // A. Arahkan pengguna setelah login berdasarkan rolenya
  if (pathname === "/" || pathname.startsWith("/login")) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (isDriver) {
      return NextResponse.redirect(new URL("/driver", req.url)); // Driver ke /driver
    } else {
      return NextResponse.redirect(new URL("/home", req.url)); // User biasa ke /home
    }
  }

  // B. Proteksi Halaman Khusus
  // Jika mencoba buka /admin tapi bukan admin -> lempar ke home
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Jika mencoba buka /driver tapi bukan admin DAN bukan driver -> lempar ke home
  if (pathname.startsWith("/driver") && !isAdmin && !isDriver) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/driver/:path*", "/login"],
};
