export const revalidate = 3600;

import { Suspense } from "react";
import { getMarketNews, getNiftyQuote, getBankNiftyQuote, getEquityQuotes } from "@/lib/alpha-vantage";
import { summarizeArticles } from "@/lib/gemini";
import { NewsSlider } from "@/components/news-slider";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function NewsPortalPage() {
  const [rawNews, nifty, bankNifty, equities] = await Promise.all([
    getMarketNews("finance,commodity,crypto,earnings,ipo").catch(() => []),
    getNiftyQuote().catch(() => ({ symbol: "NIFTY 50", price: 0, change: 0, changePercent: 0 })),
    getBankNiftyQuote().catch(() => ({ symbol: "BANK NIFTY", price: 0, change: 0, changePercent: 0 })),
    getEquityQuotes(["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"]).catch(() => [])
  ]);
  
  if (!rawNews || rawNews.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-xl font-bold text-muted-foreground">Unable to fetch latest news. Please try again later.</p>
      </div>
    );
  }

  // Splitting news for layout
  const breakingNews = rawNews.slice(0, 5); // Goes into slider
  const gridNews = rawNews.slice(5, 9);     // 2x2 grid below slider
  const latestNews = rawNews.slice(9, 14);  // Vertical list below grid
  const popularNews = rawNews.slice(14, 19);// Right sidebar

  // AI summarize "Latest News" specifically to provide good descriptions
  const latestSummaries = await summarizeArticles(
    latestNews.map((a) => a.summary),
    5
  ).catch(() => []);

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-screen pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── LEFT COLUMN (Main Content) - 8 cols ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Category Tag overlaying the slider container */}
            <div className="relative">
              <span className="absolute top-0 left-0 bg-[#2c2c2c] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 z-10 -translate-y-1/2 ml-4">
                Top Stories
              </span>
              <NewsSlider articles={breakingNews} />
            </div>

            {/* 2x2 Grid of News */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {gridNews.map((article, i) => (
                <a key={i} href={article.url} target="_blank" rel="noreferrer" className="group cursor-pointer block">
                  <div className="relative w-full h-[240px] overflow-hidden rounded-sm mb-4">
                    <span className="absolute top-0 left-0 bg-white dark:bg-black text-xs font-bold uppercase px-3 py-1 z-10 border-b border-r">
                      {article.overall_sentiment_label || "Market"}
                    </span>
                    <img 
                      src={article.banner_image || `https://picsum.photos/seed/${i + article.title.length}/600/400`}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-bold text-xl leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground font-medium gap-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {new Date((article.time_published || "").replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6") || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {Math.floor(Math.random() * 50) + 5}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* SEO Internal Link Banner */}
            <Link href="/gold-prices" className="mt-8 block w-full bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center hover:bg-yellow-500/20 transition-colors group cursor-pointer">
              <span className="text-yellow-600 dark:text-yellow-500 font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Check Live 24K Gold & Silver Rates in India Today
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>

            {/* Latest News List */}
            <div className="pt-6">
              <h2 className="text-2xl font-black mb-6 border-b pb-2 text-gray-900 dark:text-white">Latest News</h2>
              <div className="space-y-6">
                {latestNews.map((article, i) => {
                  const summary = (latestSummaries[i] && latestSummaries[i].tldr !== "Summary unavailable.") 
                    ? latestSummaries[i].tldr 
                    : (article.summary || "Click to read the full story.");
                  return (
                    <a key={i} href={article.url} target="_blank" rel="noreferrer" className="flex flex-col sm:flex-row gap-6 group cursor-pointer border-b border-black/5 dark:border-white/5 pb-6 last:border-0 block">
                      <div className="sm:w-1/3 relative h-[180px] sm:h-auto overflow-hidden rounded-sm flex-shrink-0">
                        <img 
                          src={article.banner_image || `https://picsum.photos/seed/latest${i + article.title.length}/400/300`}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="sm:w-2/3 flex flex-col justify-center">
                        <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase px-2 py-0.5 w-fit mb-3">
                          {article.source || "Finance"}
                        </span>
                        <h3 className="font-bold text-xl leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                          {summary}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground font-medium gap-3 mt-auto">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {new Date((article.time_published || "").replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6") || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {Math.floor(Math.random() * 20) + 1}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (Sidebar) - 4 cols ── */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* Popular Section */}
            <div>
              <h2 className="text-2xl font-black mb-6 border-b pb-2 text-gray-900 dark:text-white">Popular</h2>
              <div className="space-y-5">
                {popularNews.map((article, i) => (
                  <a key={i} href={article.url} target="_blank" rel="noreferrer" className="flex gap-4 group cursor-pointer block">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
                      <img 
                        src={article.banner_image || `https://picsum.photos/seed/pop${i}/200/200`}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        {article.source}
                      </span>
                      <h4 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-[10px] text-muted-foreground mt-2 gap-2">
                        <span>{new Date((article.time_published || "").replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6") || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-2 h-2" />
                          {Math.floor(Math.random() * 50) + 15}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Simulated ZEMEZ Tall Sidebar Banners */}
            <div className="space-y-6">
              <div className="relative w-full h-[400px] bg-slate-900 overflow-hidden group cursor-pointer">
                <img src="https://picsum.photos/seed/banner1/400/800" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col p-6 pointer-events-none">
                  <span className="bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 w-fit mb-auto">Economy</span>
                  <div className="mt-auto">
                    <h3 className="text-white font-black text-xl mb-2 pointer-events-auto hover:underline">Global Markets Rebound After Sharp Tech Sell-off</h3>
                    <p className="text-gray-300 text-xs line-clamp-4">Investors rallied back into large cap technology stocks driving indices higher before the holiday weekend...</p>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-[300px] bg-slate-900 overflow-hidden group cursor-pointer">
                <img src="https://picsum.photos/seed/banner2/400/600" alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col p-6 pointer-events-none">
                  <span className="bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 w-fit mb-auto">Crypto</span>
                  <div className="mt-auto">
                    <h3 className="text-white font-black text-lg mb-2 pointer-events-auto hover:underline">Bitcoin Surges Past Institutional Resistance Levels</h3>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}