"use client";

import { useState } from "react";
import type { GoldPrice } from "@/lib/gold-api";

export function GoldCalculator({ liveData }: { liveData: GoldPrice }) {
  const [purity, setPurity] = useState<"24K" | "22K" | "18K">("22K");
  const [weight, setWeight] = useState<number>(10);
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(10);
  const [gstPercent] = useState<number>(3); // Fixed at 3% for Gold in India

  // Determine base per-gram price
  const basePricePerGram = 
    purity === "24K" ? liveData.price_gram_24k : 
    purity === "22K" ? liveData.price_gram_22k : 
    liveData.price_gram_18k;

  // Calculations
  const baseGoldValue = basePricePerGram * weight;
  const makingChargesCost = baseGoldValue * (makingChargesPercent / 100);
  const totalBeforeGst = baseGoldValue + makingChargesCost;
  const gstCost = totalBeforeGst * (gstPercent / 100);
  const finalTotal = totalBeforeGst + gstCost;

  return (
    <div className="w-full border rounded-lg bg-white dark:bg-gray-950 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Gold Jewellery Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Purity</label>
            <div className="flex gap-2">
              {["24K", "22K", "18K"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPurity(p as any)}
                  className={`flex-1 py-2 text-sm font-medium rounded border transition-colors ${
                    purity === p 
                      ? "bg-yellow-500 text-black border-yellow-500" 
                      : "bg-muted/20 hover:bg-muted/50 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Weight (in Grams)</label>
            <input 
              type="number" 
              min="1"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Making Charges (%)</label>
            <input 
              type="number" 
              min="0"
              value={makingChargesPercent}
              onChange={(e) => setMakingChargesPercent(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">GST (%)</label>
            <input 
              type="number" 
              value={gstPercent}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-800 text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="bg-muted/10 p-4 rounded-lg border flex flex-col justify-center space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Base Gold Value:</span>
            <span className="font-semibold">₹{Math.round(baseGoldValue).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Making Charges ({makingChargesPercent}%):</span>
            <span className="font-semibold">₹{Math.round(makingChargesCost).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">GST ({gstPercent}%):</span>
            <span className="font-semibold">₹{Math.round(gstCost).toLocaleString("en-IN")}</span>
          </div>
          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Final Price:</span>
              <span className="text-2xl font-black text-yellow-600 dark:text-yellow-500">
                ₹{Math.round(finalTotal).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            *This is an estimated calculation. Actual jeweller prices may vary based on design complexity.
          </p>
        </div>
      </div>
    </div>
  );
}
