import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "mayozoz — Mei Yi Yang",
  description:
    "CS-trained creative technologist. Hand-modeled 3D, games from the ground up, and end-to-end AI production pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f0f7f4] text-[#1a3326]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
