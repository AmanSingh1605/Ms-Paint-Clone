import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PaintProvider } from "@/state";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web-Paint",
  description: "A Windows 7 MS Paint clone built with Next.js",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PaintProvider>{children}</PaintProvider>
      </body>
    </html>
  );
}
