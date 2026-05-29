export const revalidate = 3600;

import { getMarketNews } from "@/lib/alpha-vantage";
import { MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Latest Market News & Updates | Dalal Streett",
  description: "Read the latest top financial, crypto, and market news instantly.",
};

export default async function AllNewsPage() {
  const news = await getMarketNews("finance,commodity,crypto,earnings,ipo").catch(() => []);

  if (!news || news.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
        <p className="text-xl font-bold text-muted-foreground">Unable to fetch latest news. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-4 border-blue-600 pb-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            All Latest <span className="text-blue-600">News</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Live updates on global markets, economy, and cryptocurrency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, i) => (
            <a 
              key={i} 
              href={article.url} 
              target="_blank" 
              rel="noreferrer"
              className="group flex flex-col bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-[220px] overflow-hidden">
                <span className="absolute top-4 left-4 bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider px-3 py-1 z-10 shadow-md">
                  {article.overall_sentiment_label || "Market"}
                </span>
                <img 
                  src={article.banner_image || `https://picsum.photos/seed/allnews${i + article.title.length}/600/400`}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <span className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-2">
                  {article.source || "Finance"}
                </span>
                <h2 className="font-bold text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed flex-grow">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {new Date((article.time_published || "").replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6") || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {Math.floor(Math.random() * 50) + 2}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
