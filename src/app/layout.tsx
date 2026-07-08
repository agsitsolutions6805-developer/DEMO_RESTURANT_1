import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PremiumFinishingTouches from "@/components/PremiumFinishingTouches";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATIKUA | Premium Luxury Fine Dining Restaurant",
  description: "Experience the art of culinary alchemy at ATIKUA. A sensory journey of modern luxury dining, ancestral heritage, and bespoke gastronomy in New York, Paris, and Tokyo.",
  keywords: ["luxury restaurant", "fine dining", "ATIKUA", "gastronomy", "gourmet", "modern restaurant", "michelin star"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-luxury-bg text-luxury-cream font-sans overflow-x-hidden" suppressHydrationWarning>
        <PremiumFinishingTouches />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

