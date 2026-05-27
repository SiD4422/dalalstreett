"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, TrendingUp, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-t-4 border-t-blue-600 shadow-sm flex flex-col">
      
      {/* ── Top Bar (Utility & Search) ── */}
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Link href="#" className="hover:text-blue-600 transition-colors">Login</Link>
          <span className="text-gray-300">|</span>
          <Link href="#" className="hover:text-blue-600 transition-colors hidden sm:block">Site Map</Link>
          <span className="text-gray-300 hidden sm:block">|</span>
          <Link href="#" className="hover:text-blue-600 transition-colors hidden sm:block">Help</Link>
          <span className="text-gray-300 hidden sm:block">|</span>
          <Link href="#" className="hover:text-blue-600 transition-colors">FAQs</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-3 pr-8 py-1 text-xs border rounded-sm focus:outline-none focus:border-blue-500 w-[200px]"
            />
            <Search className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm border-none hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-6 px-1.5 rounded-sm border-none hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-0.5 font-bold" aria-label="Change Language">
              <span className="text-[14px]">अ</span>
              <span className="text-[10px] mt-1">A</span>
            </Button>
          </div>
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-sm border-none"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>

      {/* ── Brand / Logo Area ── */}
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-full p-2">
            <TrendingUp className="h-6 w-6" />
          </div>
          <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
            Dalal<span className="text-blue-600">Streett</span>
          </span>
        </Link>
      </div>

      {/* ── Main Navigation (Dark Bar) ── */}
      <div className="bg-[#2c2c2c] w-full">
        <nav className="mx-auto flex h-12 max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <Link 
            href="/" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Home
          </Link>
          <Link 
            href="/news" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/news") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            News
          </Link>
          <Link 
            href="/crypto" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/crypto") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Crypto
          </Link>
          <Link 
            href="/markets" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/markets") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Markets
          </Link>
          <Link 
            href="/gold-prices" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/gold-prices") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Gold Prices
          </Link>
          <Link 
            href="/mutual-funds" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/mutual-funds") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Mutual Funds
          </Link>
          <Link 
            href="/ipo" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/ipo") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            IPO
          </Link>
          <Link 
            href="/silver-prices" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/silver-prices") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Silver
          </Link>
          <Link 
            href="/personal-finance" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/personal-finance") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Personal Finance
          </Link>
          <Link 
            href="/local/mumbai" 
            className={`px-4 h-full flex items-center whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-colors ${isActive("/local") ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-black hover:text-white"}`}
          >
            Cities
          </Link>
        </nav>
      </div>

    </header>
  );
}