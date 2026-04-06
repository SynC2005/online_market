"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    // Redirect based on auth status and role
    if (!session) {
      router.push("/login");
    } else {
      // Check if user has admin role (default to false if not present)
      const userRoles = (session.user as { roles?: string[] })?.roles ?? [];
      const isAdmin = userRoles.includes("admin");
      router.push(isAdmin ? "/admin" : "/home");
    }
  }, [session, status, router]);

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
      <p>Loading...</p>
    </div>
  );
}
