import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "espressionist Admin - coffee. canvas. culture.",
  description: "Admin panel for espressionist ecommerce site.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
