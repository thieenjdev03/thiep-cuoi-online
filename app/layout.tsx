import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
const sans = localFont({
  src: "../public/fonts/BeVietnamPro-Regular.woff2",
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: "../public/fonts/Lora.woff2",
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: "Minh & Ngọc — Mình cưới nhé",
  description:
    "Trân trọng mời bạn cùng chung vui trong ngày cưới của Minh & Ngọc, 20.12.2026.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#24352A" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}

