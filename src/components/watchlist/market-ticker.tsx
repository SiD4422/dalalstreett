"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { QuoteData } from "@/lib/alpha-vantage";

export function MarketTicker({ nifty, bankNifty, equities }: { nifty: QuoteData, bankNifty?: QuoteData, equities: QuoteData[] }) {
  const items = bankNifty ? [nifty, bankNifty, ...equities] : [nifty, ...equities];
  
  if (!items.length) return null;

  return (
    <div className="w-full bg-white/40 dark:bg-black/30 backdrop-blur-md border-y border-white/20 shadow-sm overflow-hidden py-2 mb-6">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Double the array for seamless marquee scrolling */}
        {[...items, ...items, ...items].map((item, idx) => {
          const up = item.change >= 0;
          return (
            <div key={`${item.symbol}-${idx}`} className="flex items-center gap-2 mx-6">
              <span className="font-semibold text-sm">{item.symbol}</span>
              <span className="text-sm font-bold">₹{item.price.toLocaleString("en-IN")}</span>
              <span className={`flex items-center text-xs font-medium ${up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {up ? "+" : ""}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
