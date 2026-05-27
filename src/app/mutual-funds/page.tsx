import type { Metadata } from "next";
import { getMarketNews, getEquityQuotes } from "@/lib/alpha-vantage";
import { summarizeArticles } from "@/lib/gemini";
import { NewsCard } from "@/components/cards/news-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const revalidate = 900; // 15 min ISR

export const metadata: Metadata = {
  title: "Mutual Funds News & NAV Watchlist | Dalal Streett",
  description:
    "Daily NAV updates for top Indian Mutual Funds and AI-summarized Mutual Fund news. Stay informed with sentiment tags and latest reports.",
};

// SBI Bluechip, HDFC Top 100, ICICI Pru Bluechip
const WATCHLIST = ["0P0000XVZF.BO", "0P0000YWL1.BO", "0P0000XVNH.BO"];

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

export default async function MutualFundsPage() {
  const [equities, rawNews] = await Promise.all([
    getEquityQuotes(WATCHLIST).catch(() => []),
    getMarketNews("finance,earnings").catch(() => []),
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
          Mutual Funds — Live NAV
        </p>
      </section>

      <AdSlot className="my-4" slotId="mf-top" />

      <section className="mt-2">
        <h2 className="text-base font-bold mb-3">Mutual Fund Watchlist</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {equities.map((eq) => {
            // Prettify ticker symbol for UI
            let name = eq.symbol;
            if (eq.symbol.includes("XVZF")) name = "SBI Bluechip";
            if (eq.symbol.includes("YWL1")) name = "Parag Parikh Flexi Cap";
            if (eq.symbol.includes("XVNH")) name = "ICICI Pru Bluechip";

            return (
              <Card key={eq.symbol} className="hover:border-blue-500/40 transition-colors">
                <CardContent className="p-3">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {name}
                  </p>
                  <p className="text-lg font-black mt-0.5">
                    ₹{eq.price.toLocaleString("en-IN")}
                  </p>
                  <ChangeChip change={eq.change} pct={eq.changePercent} />
                  <p className="text-[10px] text-muted-foreground mt-2 font-semibold tracking-wide uppercase">NAV · Updated daily</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold mb-4">
          Mutual Fund News
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
                  <AdSlot className="mb-3" slotId={`mf-feed-${idx}`} />
                )}
                <NewsCard article={article} summary={summary} />
              </div>
            ))}
          </div>
        )}
      </section>

      <AdSlot className="mt-6" slotId="mf-bottom" />

      <section className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-10">
        <h2>Mutual Funds News and NAV Updates</h2>
        <p>
          Stay updated with the latest news on Mutual Funds, SIPs, NFOs, and fund manager strategies. AI-summarized financial news with Bullish/Bearish sentiment tags, updated every 15 minutes.
        </p>
      </section>
    </>
  );
}
