import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarComp from "@/components/Navbar/NavbarComp";
import Footer from "@/components/Footer/Footer";
import { Toaster } from 'react-hot-toast';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OMARIDAS",
  description: "Generated omaridas store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Acme&family=Bungee&family=Karantina:wght@300;400;700&family=Katibeh&family=Mada:wght@200..900&family=Marhey:wght@300..700&family=Orbitron:wght@400..900&family=Playpen+Sans+Arabic:wght@100..800&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
