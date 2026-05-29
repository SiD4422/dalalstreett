import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Data Methodology",
  description: "Learn about Dalal Streett's data sources, AI market news summarization methodology, and our commitment to financial data accuracy.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
            About Dalal Streett
          </h1>
          <p className="text-lg text-muted-foreground">
            India's most advanced AI-powered market ticker and financial news aggregator.
          </p>
        </div>

        {/* E-E-A-T Content Sections */}
        <div className="space-y-12">
          
          <section className="glass p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 bg-white dark:bg-black">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-blue-500">⚡</span> Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Dalal Streett was built to solve a critical problem for modern Indian investors: information overload. In today's fast-paced market, reading through dozens of lengthy financial articles is impossible. We use cutting-edge Artificial Intelligence to aggregate, analyze, and summarize the most critical financial news into digestible, real-time insights.
            </p>
          </section>

          <section className="glass p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 bg-white dark:bg-black">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📊</span> Data Methodology & Sources
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe in absolute transparency regarding our data. To ensure highest-grade accuracy (E-E-A-T), we rely exclusively on trusted, institutional-grade data providers:
            </p>
            <ul className="space-y-3 text-muted-foreground list-disc pl-5">
              <li><strong>Live Gold & Silver:</strong> Sourced in real-time from MCX (Multi Commodity Exchange of India) spot pricing indicators, adjusted for local market baselines.</li>
              <li><strong>Equities & Indices:</strong> NIFTY 50, Bank NIFTY, and individual stock tickers are powered by direct integrations with Yahoo Finance APIs.</li>
              <li><strong>Market News:</strong> Sourced from Alpha Vantage's institutional news sentiment feed, aggregating over 50 top-tier financial publishers globally.</li>
            </ul>
          </section>

          <section className="glass p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 bg-white dark:bg-black">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-500">🤖</span> AI Summarization Technology
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our proprietary news summarization engine is powered by Google's state-of-the-art Gemini AI. The AI reads the raw financial articles and generates concise, unbiased "TL;DR" summaries, while also classifying the market sentiment as Bullish, Bearish, or Neutral. This ensures you get the facts without the noise.
            </p>
          </section>
          
          <section className="glass p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 bg-white dark:bg-black">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-green-500">🛡️</span> Disclaimer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dalal Streett is a financial technology and news aggregation platform, not a registered investment advisor. The gold prices, stock quotes, and AI-summarized news provided on this website are for informational and educational purposes only. They do not constitute financial advice. Always consult with a SEBI-registered financial advisor before making any investment decisions.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
