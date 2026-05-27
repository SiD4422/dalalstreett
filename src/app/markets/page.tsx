import type { Metadata } from "next";
import { getMarketNews, getNiftyQuote, getBankNiftyQuote, getEquityQuotes } from "@/lib/alpha-vantage";
import { summarizeArticles } from "@/lib/gemini";
import { NewsCard } from "@/components/cards/news-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const revalidate = 900; // 15 min ISR

export const metadata: Metadata = {
  title: "Indian Market News & Nifty 50 Updates | Dalal Streett",
  description:
    "Live Nifty 50, top equities, and AI-summarized financial news with Bullish/Bearish sentiment tags. Updated every 15 minutes.",
};

const WATCHLIST = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "WIPRO.NS"];

function ChangeChip({ change, pct }: { change: number; pct: number }) {
  const up = change >= 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-sm font-semibold ${
        up ? "text-green-500" : "text-red-500"
      }`}
    >
      {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
      {up ? "+" : ""}
      {change.toFixed(2)} ({up ? "+" : ""}
      {pct.toFixed(2)}%)
    </span>
  );
}

export default async function MarketsPage() {
  // Parallel fetch — Nifty + Bank Nifty + equities + news
  const [nifty, bankNifty, equities, rawNews] = await Promise.all([
    getNiftyQuote().catch(() => ({ symbol: "NIFTY 50", price: 0, change: 0, changePercent: 0 })),
    getBankNiftyQuote().catch(() => ({ symbol: "BANK NIFTY", price: 0, change: 0, changePercent: 0 })),
    getEquityQuotes(WATCHLIST).catch(() => []),
    getMarketNews("finance,commodity,earnings").catch(() => []),
  ]);

  // AI summarize top 10 articles server-side
  const summaries = await summarizeArticles(
    rawNews.map((a) => a.summary),
    10
  );

  // Zip articles + summaries
  const feed = rawNews.slice(0, 10).map((article, i) => ({
    article,
    summary: (summaries[i] && summaries[i].tldr !== "Summary unavailable.") 
      ? summaries[i] 
      : { tldr: article.summary, sentiment: (article.overall_sentiment_label as "Bullish" | "Bearish" | "Neutral") || "Neutral" },
  }));

  return (
    <>
      {/* ── HERO: Nifty 50 & Bank Nifty ── */}
      <section className="py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Markets — Live
        </p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Nifty 50</p>
              <p className="text-5xl font-black">
                {nifty.price.toLocaleString("en-IN")}
              </p>
            </div>
            <ChangeChip change={nifty.change} pct={nifty.changePercent} />
          </div>

          <div className="hidden md:block w-px bg-black/10 dark:bg-white/10" />

          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Bank Nifty</p>
              <p className="text-5xl font-black">
                {bankNifty.price.toLocaleString("en-IN")}
              </p>
            </div>
            <ChangeChip change={bankNifty.change} pct={bankNifty.changePercent} />
          </div>
        </div>
      </section>

      {/* ── ADSENSE SLOT 1 ── */}
      <AdSlot className="my-4" slotId="markets-top" />

      {/* ── EQUITY WATCHLIST ── */}
      <section className="mt-2">
        <h2 className="text-base font-bold mb-3">Watchlist</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {equities.map((eq) => (
            <Card key={eq.symbol} className="hover:border-yellow-500/40 transition-colors">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {eq.symbol}
                </p>
                <p className="text-lg font-black mt-0.5">
                  ₹{eq.price.toLocaleString("en-IN")}
                </p>
                <ChangeChip change={eq.change} pct={eq.changePercent} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── AI NEWS FEED ── */}
      <section className="mt-8">
        <h2 className="text-lg font-bold mb-4">
          Market News
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            AI-summarized
          </span>
        </h2>

        <div className="space-y-3">
          {feed.map(({ article, summary }, idx) => (
            <div key={article.url}>
              {/* AdSense every 4th card — fixed height, zero CLS */}
              {idx > 0 && idx % 4 === 0 && (
                <AdSlot className="mb-3" slotId={`news-feed-${idx}`} />
              )}
              <NewsCard article={article} summary={summary} />
            </div>
          ))}
        </div>
      </section>

      {/* ── ADSENSE SLOT — end of feed ── */}
      <AdSlot className="mt-6" slotId="markets-bottom" />

      {/* ── SEO COPY — bottom ── */}
      <section className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-10">
        <h2>Indian Stock Market & Commodity News</h2>
        <p>
          Live Nifty 50 index, top NSE equities, and AI-summarized financial
          news updated every 15 minutes. Sentiment tags (Bullish/Bearish)
          generated by Google Gemini from article content.
        </p>
      </section>
    </>
  );
}