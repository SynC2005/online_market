import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // ==========================================
  // 1. CSP NONCE GENERATOR
  // ==========================================
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // CSP yang ketat: Tidak mengizinkan inline script kecuali dengan nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.midtrans.com https://qidxkwuyzdcrjesrczgo.supabase.co;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  // ==========================================
  // 2. JWT VERIFICATION (Satpam)
  // ==========================================
  const token = request.cookies.get("fluid_market_token")?.value;
  const secretString = process.env.JWT_SECRET_KEY;

  if (!secretString) return NextResponse.redirect(new URL("/login", request.url));
  const secretKey = new TextEncoder().encode(secretString);

  // Fungsi Helper Response dengan Header Keamanan
  const applySecurityHeaders = (response) => {
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce); 
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
  };

  // Logika Redirect sesuai path...
  if (path === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      return NextResponse.redirect(new URL(payload.role === "admin" ? "/admin" : "/home", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (path.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.role !== "admin") return NextResponse.redirect(new URL("/home", request.url));
      return applySecurityHeaders(NextResponse.next());
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (path.startsWith("/home") || path.startsWith("/profile")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      await jwtVerify(token, secretKey);
      return applySecurityHeaders(NextResponse.next());
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/", "/admin/:path*", "/home/:path*", "/profile/:path*"],
};