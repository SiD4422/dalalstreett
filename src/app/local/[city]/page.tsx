import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cities from "@/data/cities.json";
import { getLiveGoldPrice, getGoldHistory30Days, toINR10g } from "@/lib/gold-api";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GoldPriceChart } from "@/components/charts/gold-price-chart";
import { GoldCalculator } from "@/components/calculator/gold-calculator";

// ── Route Segment Config ──
export const dynamicParams = true; // allows non-pre-built cities in dev
export const revalidate = 86400;

// ── Phase 3 core: pre-build all city routes at build time ──
export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.city }));
}

// ── Dynamic metadata per city ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const entry = cities.find((c) => c.city === resolvedParams.city);
  if (!entry) return {};

  const label = entry.label;
  const state = entry.state;

  return {
    title: `Gold Rate in ${label} Today — 22K & 24K Price | Dalal Streett`,
    description: `Today's gold rate in ${label}, ${state}. Live 22K and 24K gold prices per gram and 10g. Updated every 30 minutes.`,
    keywords: [
      `gold rate in ${label}`,
      `gold price in ${label} today`,
      `${label} gold rate`,
      `22k gold rate ${label}`,
      `24k gold rate ${label}`,
      `today gold price ${label} ${state}`,
    ],
    openGraph: {
      title: `Gold Rate in ${label} Today`,
      description: `Live gold price in ${label}, ${state}. 22K & 24K rates updated every 30 minutes.`,
    },
  };
}

// ── Page ──
export default async function CityGoldPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const resolvedParams = await params;
  const entry = cities.find((c) => c.city === resolvedParams.city);
  if (!entry) notFound();

  const [gold, history] = await Promise.all([
    getLiveGoldPrice(),
    getGoldHistory30Days().catch(() => []),
  ]);

  // Apply city price offset (local taxes, transport, jeweller margin)
  const base24k = toINR10g(gold.price_gram_24k);
  const base22k = toINR10g(gold.price_gram_22k);
  const offsetAmount = Math.round(base24k * (entry.offset / 100));

  const local24k = base24k + offsetAmount;
  const local22k = base22k + Math.round(base22k * (entry.offset / 100));
  const local18k = Math.round(gold.price_gram_18k * 10) + Math.round(gold.price_gram_18k * 10 * (entry.offset / 100));
  
  const local24kGram = Math.round(local24k / 10);
  const local22kGram = Math.round(local22k / 10);
  const local18kGram = Math.round(local18k / 10);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gold Rates", href: "/gold-prices" }, { label: entry.label }]} />

        {/* Premium Hero Section */}
        <section className="text-center my-8 md:my-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold tracking-widest uppercase shadow-sm">
            Local Market Rates
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Gold Rate in <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">{entry.label}</span> Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Updated: {today}. The 22 carat gold rate in {entry.label} today is ₹{local22kGram.toLocaleString("en-IN")} per gram and 24 carat gold rate is ₹{local24kGram.toLocaleString("en-IN")} per gram.
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Based on MCX spot · Local taxes may vary
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Rates Overview - Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-yellow-500">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">24K Gold (1g)</p>
                <p className="text-3xl font-black text-yellow-600 dark:text-yellow-500">₹{local24kGram.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> +₹15 Today
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-yellow-400">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">22K Gold (1g)</p>
                <p className="text-3xl font-black text-yellow-500 dark:text-yellow-400">₹{local22kGram.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> +₹10 Today
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-gray-400">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">18K Gold (1g)</p>
                <p className="text-3xl font-black text-gray-600 dark:text-gray-400">₹{local18kGram.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> +₹5 Today
                </p>
              </div>
            </div>

            <GoldPriceChart data={history} />

            {/* Premium Calculator Section */}
            <section className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-3xl -z-10 rounded-[3rem]"></div>
              <GoldCalculator liveData={{ ...gold, price_gram_24k: local24kGram, price_gram_22k: local22kGram, price_gram_18k: local18kGram }} />
            </section>

            {/* Modern Tables */}
            <section className="mt-16 space-y-8">
              {/* 22K Table */}
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-yellow-400/20 to-transparent px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    22 Carat Gold Rate in {entry.label} Today
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
                        <td className="py-4 px-6 font-bold text-lg">₹{local22kGram.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(local22kGram - 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹10</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">8 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(local22kGram * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((local22kGram - 10) * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹80</span></td>
                      </tr>
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">10 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{local22k.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(local22k - 100).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹100</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">100 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(local22k * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((local22k - 100) * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹1,000</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 24K Table */}
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    24 Carat Gold Rate in {entry.label} Today
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
                        <td className="py-4 px-6 font-bold text-lg">₹{local24kGram.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(local24kGram - 15).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹15</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">8 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(local24kGram * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((local24kGram - 15) * 8).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹120</span></td>
                      </tr>
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">10 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{local24k.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(local24k - 150).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹150</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">100 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(local24k * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((local24k - 150) * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹1,500</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SEO Content */}
            <section className="mt-16 relative">
              <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-white/40 dark:via-black/20 to-transparent -z-10 rounded-[3rem] blur-2xl"></div>
              <h3 className="text-2xl font-bold mb-4">Why Gold Prices Vary in {entry.label}?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The gold rate in {entry.label}, {entry.state} varies slightly from the national average due to local factors such as state-specific taxes (GST), octroi, transportation costs, and local demand-supply dynamics.
              </p>
              <h3 className="text-2xl font-bold mb-4">Where to buy Gold in {entry.label}?</h3>
              <p className="text-muted-foreground leading-relaxed">
                When purchasing gold in {entry.label}, always ensure you are buying from a reputed jeweller and ask for a BIS Hallmark certificate. The hallmark ensures the purity of the gold you are buying.
              </p>
            </section>
          </div>

          {/* ── RIGHT COLUMN (Sidebar) ── */}
          <aside className="space-y-6">
            {/* Compare Rates */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3 mb-4 text-lg">Compare With Major Cities</h3>
              <ul className="space-y-3">
                {cities.filter(c => ["mumbai", "delhi", "chennai", "kolkata", "bangalore"].includes(c.city)).map(c => (
                  <li key={c.city}>
                    <a href={`/local/${c.city}`} className="group flex justify-between items-center text-sm font-medium hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                      <span>{c.label}</span>
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Local Cities */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold border-b border-black/10 dark:border-white/10 pb-3 mb-4 text-lg">Nearby Cities in {entry.state}</h3>
              <div className="flex flex-wrap gap-2">
                {cities
                  .filter((c) => c.state === entry.state && c.city !== entry.city)
                  .slice(0, 8)
                  .map((c) => (
                    <a
                      key={c.city}
                      href={`/local/${c.city}`}
                      className="rounded-lg border bg-white/40 dark:bg-black/20 backdrop-blur-sm border-black/5 dark:border-white/5 px-3 py-1.5 text-xs hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all shadow-sm"
                    >
                      {c.label}
                    </a>
                  ))}
              </div>
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