import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CafeFlow — Modern Cafe Operating System",
  description: "The operating system for your cafe. QR ordering, inventory tracking, and business intelligence.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B4532A",
};

import { AuthProvider } from "@/components/auth/auth-provider";
import { ToasterProvider } from "@/components/shared/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable} h-full`}>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background text-text-primary antialiased"><ToasterProvider><AuthProvider>{children}</AuthProvider></ToasterProvider></body>
    </html>
  );
}
