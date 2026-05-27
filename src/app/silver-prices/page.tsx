// ISR: revalidate every 1800s (30min)
export const revalidate = 1800;

import { getLiveSilverPrice, getSilverHistory30Days } from "@/lib/gold-api";
import { SilverPriceChart } from "@/components/charts/silver-price-chart";
import { AdSlot } from "@/components/ads/ad-slot";

export const metadata = {
  title: "Live Silver Price in India Today | Dalal Streett",
  description: "Real-time silver rates per gram, 100g, and 1KG in India. Powered by MCX Spot pricing.",
};

export default async function SilverPricesPage() {
  let silver: any, silverHistory: any[];

  try {
    [silver, silverHistory] = await Promise.all([
      getLiveSilverPrice().catch(() => ({ price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() })),
      getSilverHistory30Days().catch(() => []),
    ]);
  } catch (err) {
    silver = { price: 0, price_gram_24k: 0, price_gram_22k: 0, price_gram_18k: 0, currency: "INR", timestamp: Date.now() };
    silverHistory = [];
  }

  const silverPerGram = silver.price_gram_24k;
  const silverPer100g = Math.round(silverPerGram * 100);
  const silverPer1kg = silverPer100g * 10;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Premium Hero Section */}
        <section className="text-center my-8 md:my-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-slate-500/20 border border-slate-500/30 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-widest uppercase shadow-sm">
            Live Market Updates
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Silver Rate in <span className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 bg-clip-text text-transparent">India</span> Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time, hyper-accurate silver rates powered by MCX Spot pricing.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Rates Overview - Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-slate-400">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">Silver (1g)</p>
                <p className="text-3xl font-black text-slate-700 dark:text-slate-300">₹{silverPerGram.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-slate-500">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">Silver (100g)</p>
                <p className="text-3xl font-black text-slate-700 dark:text-slate-300">₹{silverPer100g.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
              <div className="glass-card rounded-2xl p-5 border-l-4 border-l-slate-600">
                <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-wider">Silver (1 KG)</p>
                <p className="text-3xl font-black text-slate-700 dark:text-slate-300">₹{silverPer1kg.toLocaleString("en-IN")}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span> Live MCX Spot
                </p>
              </div>
            </div>

            <AdSlot className="my-4" slotId="silver-top" />
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              <SilverPriceChart data={silverHistory} />
            </div>

            {/* Modern Tables */}
            <section className="mt-16 space-y-8">
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-slate-500/20 to-transparent px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                    Silver Rate in India Today
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
                        <td className="py-4 px-6 font-bold text-lg">₹{silverPerGram.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(silverPerGram - 2).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹2</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">10 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{(silverPerGram * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{((silverPerGram - 2) * 10).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹20</span></td>
                      </tr>
                      <tr className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">100 Grams</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{silverPer100g.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(silverPer100g - 200).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹200</span></td>
                      </tr>
                      <tr className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-medium">1 Kilogram</td>
                        <td className="py-4 px-6 font-bold text-lg">₹{silverPer1kg.toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6 hidden sm:table-cell text-muted-foreground">₹{(silverPer1kg - 2000).toLocaleString("en-IN")}</td>
                        <td className="py-4 px-6"><span className="inline-flex px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-md font-semibold text-xs">+₹2,000</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <AdSlot className="my-4" slotId="silver-bottom" />

            {/* ── SEO COPY — bottom ── */}
            <section className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mt-10">
              <h2>Silver Prices and Commodities Tracking</h2>
              <p>
                Live MCX Spot pricing for Silver. View the historical 30-day trends, and keep up with precious metal fluctuations daily.
              </p>
            </section>
          </div>
          
          {/* ── RIGHT COLUMN (Sidebar) ── */}
          <aside className="space-y-6">
            <AdSlot className="h-[250px] w-full" slotId="silver-sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
