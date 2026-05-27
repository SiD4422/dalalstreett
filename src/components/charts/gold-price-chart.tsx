"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoricalPoint } from "@/lib/gold-api";

export function GoldPriceChart({ data }: { data: HistoricalPoint[] }) {
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "6M">("1M");

  // Filter data based on selected timeframe
  // Since we only have 30 days of mock data right now, "1M" shows all, "1W" shows last 7.
  const filteredData = data.slice(timeframe === "1W" ? -7 : 0);

  const minPrice = Math.min(...filteredData.map(d => d.price_gram_24k));
  const maxPrice = Math.max(...filteredData.map(d => d.price_gram_24k));

  return (
    <div className="w-full border rounded-xl glass-card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">Monthly Graph of Gold Price in India</h2>
        
        {/* Timeframe Controls */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button 
            onClick={() => setTimeframe("1W")}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-300 ${timeframe === "1W" ? "bg-yellow-500 text-black border-yellow-500 shadow-md" : "bg-muted/30 hover:bg-muted/60"}`}
          >
            1W
          </button>
          <button 
            onClick={() => setTimeframe("1M")}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-300 ${timeframe === "1M" ? "bg-yellow-500 text-black border-yellow-500 shadow-md" : "bg-muted/30 hover:bg-muted/60"}`}
          >
            1M
          </button>
          <button 
            onClick={() => setTimeframe("6M")}
            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-300 ${timeframe === "6M" ? "bg-yellow-500 text-black border-yellow-500" : "bg-muted/30 hover:bg-muted/60"} opacity-50 cursor-not-allowed`}
            title="Premium Feature"
          >
            6M
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => {
                const d = new Date(val);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
              tick={{ fontSize: 12, fill: "#888" }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              width={80}
              domain={[minPrice - 50, maxPrice + 50]}
              tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`}
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Price (24K/g)"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
            />
            <Area 
              type="monotone" 
              dataKey="price_gram_24k" 
              stroke="#eab308" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}