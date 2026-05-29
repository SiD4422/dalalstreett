// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    template: "%s | Dalal Streett India",
    default: "Live Gold & Silver Prices India | Dalal Streett",
  },
  description:
    "Real-time gold rate, silver price, Nifty 50 updates and AI-summarized market news for India.",
  metadataBase: new URL("https://dalalstreett.in"),
  openGraph: { type: "website", locale: "en_IN" },
};

import { GlobalTicker } from "@/components/global-ticker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://query1.finance.yahoo.com" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <GlobalTicker />
          <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}