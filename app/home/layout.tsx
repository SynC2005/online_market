import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - MiniMart Online",
  description: "Belanja kebutuhan sehari-hari di MiniMart Online",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
