"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "@/app/actions/authActions";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndRedirect() {
      // Mengambil data sesi dari JWT kustom kita
      const userPayload = await getUserSession();

      if (!userPayload) {
        // Jika tidak ada token / belum login, lempar ke halaman login
        router.push("/login");
      } else {
        // Cek apakah rolenya adalah admin
        // (Di sistem baru kita, role adalah string tunggal, bukan array)
        const isAdmin = userPayload.role === "admin";
        
        // Lempar ke halaman yang sesuai
        router.push(isAdmin ? "/admin" : "/home");
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: "#666",
      }}
    >
      <p>Mengarahkan...</p>
    </div>
  );
}