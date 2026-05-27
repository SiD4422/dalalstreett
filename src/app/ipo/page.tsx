import type { Metadata } from "next";
import { getMarketNews, getEquityQuotes } from "@/lib/alpha-vantage";
import { summarizeArticles } from "@/lib/gemini";
import { NewsCard } from "@/components/cards/news-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const revalidate = 1800; // 30 min ISR

export const metadata: Metadata = {
  title: "Latest IPO News & Watchlist | Dalal Streett",
  description:
    "Live tracking of recent major IPOs and AI-summarized IPO news. Stay ahead of market debuts with real-time sentiment tags.",
};

const WATCHLIST = ["IREDA.NS", "PAYTM.NS", "NYKAA.NS", "LICI.NS"];

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

export default async function IPOPage() {
  const [equities, rawNews] = await Promise.all([
    getEquityQuotes(WATCHLIST).catch(() => []),
    getMarketNews("ipo,earnings").catch(() => []),
  ]);

  const summaries = await summarizeArticles(
    rawNews.map((a) => a.summary),
    5
  );

  const feed = rawNews.slice(0, 5).map((article, i) => ({
    article,
    summary: (summaries[i] && summaries[i].tldr !== "Summary unavailable.") 
      ? summaries[i] 
      : { tldr: article.summary, sentiment: (article.overall_sentiment_label as "Bullish" | "Bearish" | "Neutral") || "Neutral" },
  }));

  return (
    <>
      <section className="py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          IPO — Market Debuts
        </p>
      </section>

      <AdSlot className="my-4" slotId="ipo-top" />

      <section className="mt-2">
        <h2 className="text-base font-bold mb-3">Recent Mega IPOs</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {equities.map((eq) => (
            <Card key={eq.symbol} className="hover:border-blue-500/40 transition-colors">
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

      <section className="mt-8">
        <h2 className="text-lg font-bold mb-4">
          IPO News
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            AI-summarized
          </span>
        </h2>

        {feed.length === 0 ? (
          <div className="p-8 text-center border rounded-lg bg-white/5 dark:bg-black/20">
            <p className="text-muted-foreground">No news available at the moment.</p>
            <p className="text-xs text-muted-foreground mt-2">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feed.map(({ article, summary }, idx) => (
              <div key={article.url}>
                {idx > 0 && idx % 3 === 0 && (
                  <AdSlot className="mb-3" slotId={`ipo-feed-${idx}`} />
                )}
                <NewsCard article={article} summary={summary} />
              </div>
            ))}
          </div>
        )}
      </section>

      <AdSlot className="mt-6" slotId="ipo-bottom" />

      <section className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-10">
        <h2>Initial Public Offerings (IPO) News</h2>
        <p>
          Track the latest IPO filings, grey market premiums, and listing day performances. AI-summarized news with Bullish/Bearish sentiment tags, updated every 30 minutes.
        </p>
      </section>
    </>
  );
}
