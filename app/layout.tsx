import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers"; // <-- 1. IMPORT HEADERS DARI NEXT.JS
import "./globals.css";

// IMPORT SPEED INSIGHTS DI SINI
import { SpeedInsights } from "@vercel/speed-insights/next"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fluid Market",
  description: "Online marketplace for fresh products",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. TANGKAP NONCE YANG DIKIRIM OLEH MIDDLEWARE
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") || undefined;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        
        {/* LETAKKAN KOMPONENNYA DI BAWAH CHILDREN */}
        {/* SpeedInsights akan otomatis mendeteksi konfigurasi CSP Next.js */}
        <SpeedInsights />
        <script 
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          nonce={nonce} 
        ></script>
        {/* 💡 CONTOH PENGGUNAAN MASA DEPAN: */}
        {/* Jika suatu saat Anda memasang Google Analytics atau script global lainnya di sini, */}
        {/* Anda WAJIB menambahkan atribut nonce seperti di bawah ini: */}
        {/* <script nonce={nonce} src="https://contoh-script-luar.com/script.js"></script> */}
        
      </body>
    </html>
  );
}