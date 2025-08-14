import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MLSA MIET Chapter",
  description: "Official website for the Microsoft Learn Student Ambassadors community at MIET.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
