import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // ==========================================
  // 1. CSP NONCE GENERATOR
  // ==========================================
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://app.sandbox.midtrans.com https://app.midtrans.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.midtrans.com https://app.sandbox.midtrans.com https://app.midtrans.com https://qidxkwuyzdcrjesrczgo.supabase.co;
    frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  // PERBAIKAN: Masukkan CSP dan Nonce ke dalam aliran Request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // Buat instance response dasar yang sudah membawa Request Headers baru
  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Fungsi Helper Response dengan Header Keamanan
  const applySecurityHeaders = (response) => {
    response.headers.set('Content-Security-Policy', cspHeader);
    // x-nonce tidak perlu di set di Response browser, cukup di Request untuk internal Next.js
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  };

  // ==========================================
  // 2. JWT VERIFICATION (Satpam)
  // ==========================================
  const token = request.cookies.get("fluid_market_token")?.value;
  const secretString = process.env.JWT_SECRET_KEY;

  if (!secretString) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
  }
  
  const secretKey = new TextEncoder().encode(secretString);

  // TAMBAHAN LOGIKA: Mencegah user yang sudah login mengakses halaman /login
  if (path === "/login") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secretKey);
        return applySecurityHeaders(NextResponse.redirect(new URL(payload.role === "admin" ? "/admin" : "/home", request.url)));
      } catch {
        // Token kadaluarsa/tidak valid, biarkan tetap di halaman login
        return applySecurityHeaders(nextResponse);
      }
    }
    return applySecurityHeaders(nextResponse);
  }

  // Logika Redirect sesuai path...
  if (path === "/") {
    if (!token) return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      return applySecurityHeaders(NextResponse.redirect(new URL(payload.role === "admin" ? "/admin" : "/home", request.url)));
    } catch {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
  }

  if (path.startsWith("/admin")) {
    if (!token) return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.role !== "admin") return applySecurityHeaders(NextResponse.redirect(new URL("/home", request.url)));
      return applySecurityHeaders(nextResponse); // Menggunakan nextResponse yang membawa headers
    } catch {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
  }

  if (path.startsWith("/home") || path.startsWith("/profile")) {
    if (!token) return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    try {
      await jwtVerify(token, secretKey);
      return applySecurityHeaders(nextResponse); // Menggunakan nextResponse yang membawa headers
    } catch {
      return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
    }
  }

  return applySecurityHeaders(nextResponse);
}

export const config = {
  // PERBAIKAN: Lindungi semua rute halaman KECUALI aset statis dan API internal Next.js
  // Ini memastikan halaman /login juga mendapatkan proteksi CSP
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};