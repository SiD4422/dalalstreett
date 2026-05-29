// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return {
    title: {
      template: "%s | Dalal Streett India",
      default: `Live Gold & Silver Prices India Today (${currentMonth} ${currentYear}) | AI Market News | Dalal Streett`,
    },
    description: "Real-time gold rate, silver price, Nifty 50 updates and AI-summarized market news for India.",
    metadataBase: new URL("https://dalalstreett-77pt.vercel.app"),
    openGraph: { type: "website", locale: "en_IN" },
  };
}

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
          <footer className="border-t border-black/10 dark:border-white/10 mt-12 py-8 bg-black/5 dark:bg-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm font-semibold mb-4">Local Gold Rates</p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                  <a href="/local/mumbai" className="hover:text-yellow-500 transition-colors">Mumbai</a>
                  <a href="/local/delhi" className="hover:text-yellow-500 transition-colors">Delhi</a>
                  <a href="/local/chennai" className="hover:text-yellow-500 transition-colors">Chennai</a>
                  <a href="/local/bangalore" className="hover:text-yellow-500 transition-colors">Bangalore</a>
                  <a href="/local/hyderabad" className="hover:text-yellow-500 transition-colors">Hyderabad</a>
                  <a href="/local/kolkata" className="hover:text-yellow-500 transition-colors">Kolkata</a>
                  <a href="/local/pune" className="hover:text-yellow-500 transition-colors">Pune</a>
                  <a href="/local/ahmedabad" className="hover:text-yellow-500 transition-colors">Ahmedabad</a>
                </div>
                <div className="flex justify-center mt-4 gap-4">
                  <a href="/about" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">About Us & Methodology</a>
                  <a href="/privacy" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">Privacy Policy</a>
                  <a href="/disclaimer" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">Disclaimer</a>
                </div>
                <p className="mt-8 text-xs text-muted-foreground opacity-60">© {new Date().getFullYear()} Dalal Streett. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}