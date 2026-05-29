import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Financial Disclaimer for Dalal Streett.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-black p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
        <h1 className="text-3xl font-black mb-6">Financial Disclaimer</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground">
            Dalal Streett provides financial data and AI-summarized market news for informational and educational purposes only. We are not SEBI-registered advisors.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">No Investment Advice</h2>
          <p>
            The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice, and you should not treat any of the website's content as such. Dalal Streett does not recommend that any cryptocurrency, stock, or commodity should be bought, sold, or held by you. 
          </p>
          <p>
            Please conduct your own due diligence and consult your financial advisor before making any investment decisions.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">Accuracy of Information</h2>
          <p>
            While we strive to ensure that all data (including gold prices, silver prices, and stock quotes) is up-to-date and accurate by sourcing from trusted providers like MCX and Yahoo Finance, we cannot guarantee its absolute accuracy or completeness. Market prices fluctuate rapidly, and the data displayed may be delayed.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-2">AI Summarization</h2>
          <p>
            Our news articles are aggregated from third-party sources and summarized using Artificial Intelligence (Google Gemini). While AI models are highly advanced, they can occasionally misinterpret context or generate errors. Always refer to the original source article for complete context.
          </p>

          <p className="mt-8 text-sm italic">
            By using Dalal Streett, you acknowledge and agree to these terms and assume full responsibility for your own financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
