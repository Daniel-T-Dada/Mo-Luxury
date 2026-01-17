import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ThemeProvider } from "@/context/theme-provider";
import { FavoriteProvider } from "@/context/favorite-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mo - Luxury Wears",
  description: "Mo is a luxury wear brand that offers high-quality and stylish clothing for all genders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AnnouncementBar />
            <FavoriteProvider>
            <TopNav />
            <main className="min-h-screen bg-background pb-20 md:pb-8">
              {children}
            </main>
            <Toaster />
              <BottomNav />
            </FavoriteProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
