import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportGear - Sewa Peralatan Olahraga",
  description: "Mengakses peralatan olahraga terbaik tanpa harus membeli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}