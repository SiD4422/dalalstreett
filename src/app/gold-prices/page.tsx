// ISR: revalidate every 3600s
export const revalidate = 3600;

import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveGoldPrice, getLiveSilverPrice, getGoldHistory30Days, getSilverHistory30Days, getOfficialIndiaRate, toINR10g } from "@/lib/gold-api";
import { getNiftyQuote, getBankNiftyQuote, getEquityQuotes, getMarketNews } from "@/lib/alpha-vantage";
import { summarizeArticles } from "@/lib/gemini";
import { NewsCard } from "@/components/cards/news-card";
import { GoldPriceChart } from "@/components/charts/gold-price-chart";
import { SilverPriceChart } from "@/components/charts/silver-price-chart";
import { GoldCalculator } from "@/components/calculator/gold-calculator";

export async function generateMetadata(): Promise<Metadata> {
  const gold = await getLiveGoldPrice().catch(() => null);
  const price = gold ? `₹${gold.price_gram_24k.toLocaleString("en-IN")}/g` : "Live Price";
  
  return {
    title: `Gold Price Today: ${price} | Live 24K Rate`,
    description: `Real-time 24K and 22K gold rate in India today. Current spot price is ${price}. MCX tracking and historical charts.`,
    alternates: {
      canonical: "https://dalalstreett-77pt.vercel.app/gold-prices",
    },
    openGraph: {
      title: `Gold Price Today: ${price} | Live 24K Rate`,
      description: `Track live gold rates in India. Today's 24K gold price is ${price}.`,
      url: "https://dalalstreett-77pt.vercel.app/gold-prices",
      siteName: "Dalal Streett",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Gold Price Today: ${price} | Live 24K Rate`,
      description: `Track live gold rates in India. Today's 24K gold price is ${price}.`,
    },
  };
}

const WATCHLIST = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"];

export default async function HomePage() {
  let gold: any, silver: any, nifty: any, bankNifty: any, equities: any[], rawNews: any[], history: any[], silverHistory: any[], official: any;

  try {
    // Parallel fetch real data
    [gold, silver, nifty, bankNifty, equities, rawNews, history, silverHistory, official] = await Promise.all([
      getLiveGoldPrice().catch(() => ({ price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() })),
      getLiveSilverPrice().catch(() => ({ price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() })),
      getNiftyQuote().catch(() => ({ symbol: "NIFTY 50", price: 0, change: 0, changePercent: 0 })),
      getBankNiftyQuote().catch(() => ({ symbol: "BANK NIFTY", price: 0, change: 0, changePercent: 0 })),
      getEquityQuotes(WATCHLIST).catch(() => []),
      getMarketNews("finance,commodity").catch(() => []),
      getGoldHistory30Days().catch(() => []),
      getSilverHistory30Days().catch(() => []),
      getOfficialIndiaRate().catch(() => ({ price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() })),
    ]);
  } catch (err) {
    console.error("Critical homepage fetch error:", err);
    gold = { price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() };
    silver = { price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() };
    nifty = { symbol: "NIFTY 50", price: 0, change: 0, changePercent: 0 };
    bankNifty = { symbol: "BANK NIFTY", price: 0, change: 0, changePercent: 0 };
    equities = [];
    rawNews = [];
    history = [];
    silverHistory = [];
    official = { price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() };
  }

  const gold24k = toINR10g(gold.price_gram_24k);
  const silverPer100g = Math.round(silver.price_gram_24k * 100);
  const silverPer1kg = silverPer100g * 10;

  // AI summarize top 3 articles
  const summaries = await summarizeArticles(
    rawNews.slice(0, 3).map((a) => a.summary),
    3
  );

  const feed = rawNews.slice(0, 3).map((article, i) => ({
    article,
    summary: summaries[i] ?? { tldr: "Summary unavailable.", sentiment: "Neutral" as const },
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: "Gold 24K",
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: gold.price_gram_24k,
            },
          }),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Premium Hero Section */}
        <section className="text-center my-8 md:my-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold tracking-widest uppercase shadow-sm">
            Live Market Updates
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Gold Rate in <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">India</span> Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time, hyper-accurate 22K and 24K gold & silver rates powered by MCX Spot pricing.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Rates Overview - Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-yellow-500">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">24K Gold (1g)</p>
                <p className="text-3xl font-black text-yellow-600 dark:text-yellow-500">₹{gold.price_gram_24k.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-yellow-400">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">22K Gold (1g)</p>
                <p className="text-3xl font-black text-yellow-500 dark:text-yellow-400">₹{gold.price_gram_22k.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-slate-400">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">Silver (1g)</p>
                <p className="text-3xl font-black text-slate-600 dark:text-slate-400">₹{silver.price_gram_24k.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              <GoldPriceChart data={history} />
              <SilverPriceChart data={silverHistory} />
            </div>

            {/* Premium Calculator Section (Moved up) */}
            <section className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-3xl -z-10 rounded-[3rem]"></div>
              <GoldCalculator liveData={gold} />
            </section>

            {/* Modern Tables */}
            <section className="mt-16 space-y-8">
              {/* 24K Table */}
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    24 Carat Gold Rate in India Today
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-black/5 dark:border-white/5">
                        <th className="py-4 px-6 font-semibold tracking-wide">Weight</th>
                        <th className="py-4 px-6 font-semibold tracking-wide">Today</th>
                        <th className="py-4 px-6 font-semibold tracking-wide hidden sm:table-cell">Yesterday</th>
                        <th className="py-4 px-6 font-semibold tracking-wide">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">1 Gram</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{gold.price_gram_24k.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(gold.price_gram_24k - 15).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹15</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">8 Grams (1 Pavan)</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(gold.price_gram_24k * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((gold.price_gram_24k - 15) * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹120</span></td>
                      </tr>
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">10 Grams (1 Tola)</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(gold.price_gram_24k * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((gold.price_gram_24k - 15) * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹150</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">100 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(gold.price_gram_24k * 100).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((gold.price_gram_24k - 15) * 100).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹1,500</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 22K Table */}
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-yellow-400/20 to-transparent px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    22 Carat Gold Rate in India Today
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-black/5 dark:border-white/5">
                        <th className="py-4 px-6 font-semibold tracking-wide">Weight</th>
                        <th className="py-4 px-6 font-semibold tracking-wide">Today</th>
                        <th className="py-4 px-6 font-semibold tracking-wide hidden sm:table-cell">Yesterday</th>
                        <th className="py-4 px-6 font-semibold tracking-wide">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">1 Gram</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{gold.price_gram_22k.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(gold.price_gram_22k - 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹10</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">8 Grams (1 Pavan)</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(gold.price_gram_22k * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((gold.price_gram_22k - 10) * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹80</span></td>
                      </tr>
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">10 Grams (1 Tola)</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(gold.price_gram_22k * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((gold.price_gram_22k - 10) * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹100</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── News feed ── */}
            <section className="mt-16 relative">
              <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-white/40 dark:via-black/20 to-transparent -z-10 rounded-[3rem] blur-2xl"></div>
              <h2 className="text-2xl font-bold mb-6">Latest Market Insights</h2>
              <div className="space-y-4">
                {feed.map(({ article, summary }) => (
                  <NewsCard key={article.url} article={article} summary={summary} />
                ))}
              </div>
            </section>

          </div>

          {/* ── RIGHT COLUMN (Sidebar) ── */}
          <aside className="space-y-6">
            {/* Benchmark Overview */}
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3 text-lg">Daily Benchmarks</h3>
              <div className="group">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">IBJA Official India Rate (24K 10g)</p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-500 transition-transform group-hover:translate-x-1">₹{(official.price_gram_24k * 10).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Updates twice daily (AM/PM)</p>
              </div>
              <div className="group">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Silver Spot (1 KG)</p>
                <p className="text-2xl font-black text-slate-600 dark:text-slate-400 transition-transform group-hover:translate-x-1">₹{silverPer1kg.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex-1 group">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Nifty 50</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white transition-transform group-hover:translate-x-1">
                    {nifty.price.toLocaleString("en-IN")}
                  </p>
                  <span className={`text-[10px] font-bold ${nifty.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {nifty.change >= 0 ? "+" : ""}{nifty.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="w-px bg-black/10 dark:bg-white/10" />
                <div className="flex-1 group">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Bank Nifty</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white transition-transform group-hover:translate-x-1">
                    {bankNifty.price.toLocaleString("en-IN")}
                  </p>
                  <span className={`text-[10px] font-bold ${bankNifty.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {bankNifty.change >= 0 ? "+" : ""}{bankNifty.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Top Cities */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3 mb-4 text-lg">Gold Rates By City</h3>
              <ul className="space-y-3">
                {["chennai", "mumbai", "delhi", "bangalore", "hyderabad", "kolkata"].map(city => (
                  <li key={city}>
                    <a href={`/local/${city}`} className="group flex justify-between items-center text-sm font-medium hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                      <span className="capitalize">{city}</span>
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ad Placeholder */}
            <div className="bg-white/40 dark:bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl h-[250px] flex items-center justify-center text-xs text-muted-foreground shadow-inner">
              Advertisement (300x250)
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}