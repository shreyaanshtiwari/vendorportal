import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/theme.css";
import VendorLayout from "../components/layout/VendorLayout";
import React from "react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "SwadDesh Vendor Portal",
  description: "Manage your business with SwadDesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable}`}>
        <VendorLayout>
          {children}
        </VendorLayout>
      </body>
    </html>
  );
}
