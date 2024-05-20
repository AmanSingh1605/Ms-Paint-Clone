import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainContextWrapper } from "@/Contexts/mainContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web-Paint",
  description: "Created By AmAn, Next.js project",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MainContextWrapper>
        <body className={inter.className}>{children}</body>
      </MainContextWrapper>
    </html>
  );
}
