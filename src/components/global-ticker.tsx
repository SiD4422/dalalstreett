import { getNiftyQuote, getBankNiftyQuote, getEquityQuotes } from "@/lib/alpha-vantage";
import { MarketTicker } from "./watchlist/market-ticker";

const WATCHLIST = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS"];

export async function GlobalTicker() {
  const [nifty, bankNifty, equities] = await Promise.all([
    getNiftyQuote().catch(() => ({ symbol: "NIFTY 50", price: 0, change: 0, changePercent: 0 })),
    getBankNiftyQuote().catch(() => ({ symbol: "BANK NIFTY", price: 0, change: 0, changePercent: 0 })),
    getEquityQuotes(WATCHLIST).catch(() => []),
  ]);

  return <MarketTicker nifty={nifty} bankNifty={bankNifty} equities={equities} />;
}
