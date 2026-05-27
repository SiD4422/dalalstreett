import { scrapeIBJAOfficialRates } from './scraper';

// Server-only. Never import in client components.

export interface GoldPrice {
  price?: number;        // per troy oz USD
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_18k: number;
  currency: string;
  timestamp: number;
}

export interface HistoricalPoint {
  date: string;         // "YYYY-MM-DD"
  price_gram_24k: number;
}

export async function getLiveGoldPrice(): Promise<GoldPrice> {
  const [goldRes, fxRes] = await Promise.all([
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d", {
      next: { revalidate: 1800 },
    }),
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDINR%3DX?interval=1d&range=1d", {
      next: { revalidate: 1800 },
    }),
  ]);

  const g = await goldRes.json();
  const f = await fxRes.json();

  const goldUSD = g.chart.result[0].meta.regularMarketPrice;
  const usdInr = f.chart.result[0].meta.regularMarketPrice;
  // Add 14.6% import duty markup to raw spot price to match retail rates
  const RETAIL_MARKUP = 1.146; 
  const pricePerGram = (goldUSD / 31.1035) * usdInr * RETAIL_MARKUP;

  return {
    price_gram_24k: Math.round(pricePerGram),
    price_gram_22k: Math.round(pricePerGram * 0.9167),
    price_gram_18k: Math.round(pricePerGram * 0.75),
    currency: "INR",
    timestamp: Date.now(),
  };
}

export async function getLiveSilverPrice(): Promise<GoldPrice> {
  const [silverRes, fxRes] = await Promise.all([
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/SI%3DF?interval=1d&range=1d", {
      next: { revalidate: 1800 },
    }),
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDINR%3DX?interval=1d&range=1d", {
      next: { revalidate: 1800 },
    }),
  ]);

  const s = await silverRes.json();
  const f = await fxRes.json();

  const silverUSD = s.chart.result[0].meta.regularMarketPrice;
  const usdInr = f.chart.result[0].meta.regularMarketPrice;
  
  const RETAIL_MARKUP = 1.146;
  const pricePerGram = (silverUSD / 31.1035) * usdInr * RETAIL_MARKUP;

  return {
    price_gram_24k: Math.round(pricePerGram),
    price_gram_22k: Math.round(pricePerGram),
    price_gram_18k: Math.round(pricePerGram),
    currency: "INR",
    timestamp: Date.now(),
  };
}

export async function getGoldHistory30Days(): Promise<HistoricalPoint[]> {
  const [goldRes, fxRes] = await Promise.all([
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1mo"),
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDINR%3DX?interval=1d&range=1mo"),
  ]);

  const g = await goldRes.json();
  const f = await fxRes.json();

  const result = g.chart.result[0];
  const fxResult = f.chart.result[0];

  const timestamps: number[] = result.timestamp;
  const closes: number[] = result.indicators.quote[0].close;
  const fxCloses: number[] = fxResult.indicators.quote[0].close;
  
  const RETAIL_MARKUP = 1.146;

  return timestamps.map((ts: number, i: number) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10),
    price_gram_24k: closes[i] && fxCloses[i]
      ? Math.round((closes[i] / 31.1035) * fxCloses[i] * RETAIL_MARKUP)
      : null,
  })).filter((p: any) => p.price_gram_24k !== null) as HistoricalPoint[];
}

export async function getSilverHistory30Days(): Promise<HistoricalPoint[]> {
  const [silverRes, fxRes] = await Promise.all([
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/SI%3DF?interval=1d&range=1mo"),
    fetch("https://query1.finance.yahoo.com/v8/finance/chart/USDINR%3DX?interval=1d&range=1mo"),
  ]);

  const s = await silverRes.json();
  const f = await fxRes.json();

  const result = s.chart.result[0];
  const fxResult = f.chart.result[0];

  const timestamps: number[] = result.timestamp;
  const closes: number[] = result.indicators.quote[0].close;
  const fxCloses: number[] = fxResult.indicators.quote[0].close;
  
  const RETAIL_MARKUP = 1.146;

  return timestamps.map((ts: number, i: number) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10),
    price_gram_24k: closes[i] && fxCloses[i]
      ? Math.round((closes[i] / 31.1035) * fxCloses[i] * RETAIL_MARKUP)
      : null,
  })).filter((p: any) => p.price_gram_24k !== null) as HistoricalPoint[];
}

export function toINR10g(pricePerGram: number): number {
  return Math.round(pricePerGram * 10);
}

export async function getOfficialIndiaRate(): Promise<GoldPrice> {
  return await scrapeIBJAOfficialRates();
}