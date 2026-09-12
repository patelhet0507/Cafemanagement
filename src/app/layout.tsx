import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
  themeColor: "#D97706",
};

import { AuthProvider } from "@/components/auth/auth-provider";
import { ToasterProvider } from "@/components/shared/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full bg-background text-text-primary antialiased"><ToasterProvider><AuthProvider>{children}</AuthProvider></ToasterProvider></body>
    </html>
  );
}
