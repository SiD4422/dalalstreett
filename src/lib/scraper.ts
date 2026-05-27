import * as cheerio from 'cheerio';
import { GoldPrice } from './gold-api';

// Helper to extract a number from a string (e.g. "₹1,57,000.00" -> 157000)
function parseINR(str: string): number {
  const match = str.match(/[\d,]+(\.\d+)?/);
  if (!match) return 0;
  return parseFloat(match[0].replace(/,/g, ''));
}

export async function scrapeIBJAOfficialRates(): Promise<GoldPrice> {
  try {
    const res = await fetch('https://ibjarates.com/', { 
      next: { revalidate: 21600 }, // 6-hour cache as requested
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) throw new Error("Failed to fetch IBJA");
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Parse the #lblGold999_AM and #lblGold916_AM elements
    const text24k = $('#lblGold999_AM').text();
    const text22k = $('#lblGold916_AM').text();
    const text18k = $('#lblGold750_AM').text();
    
    const price10g_24k = parseINR(text24k) || 73500;
    const price10g_22k = parseINR(text22k) || 67500;
    const price10g_18k = parseINR(text18k) || 55200;

    return {
      price: price10g_24k / 10,
      price_gram_24k: Math.round(price10g_24k / 10),
      price_gram_22k: Math.round(price10g_22k / 10),
      price_gram_18k: Math.round(price10g_18k / 10),
      currency: "INR",
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("IBJA scraping failed:", error);
    return { price: 7350, price_gram_24k: 7350, price_gram_22k: 6750, price_gram_18k: 5520, currency: "INR", timestamp: Date.now() };
  }
}

export async function scrapeMoneyControlNifty() {
  try {
    const res = await fetch('https://www.moneycontrol.com/', { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Failed to fetch moneycontrol");
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Moneycontrol has a reliable structure for Nifty 50
    // Try to find the Nifty row in their indices table
    const niftyRow = $('table').find('td:contains("NIFTY 50")').closest('tr');
    if (niftyRow.length > 0) {
      const priceText = niftyRow.find('td').eq(1).text();
      const changeText = niftyRow.find('td').eq(2).text();
      const pctText = niftyRow.find('td').eq(3).text();
      
      const price = parseINR(priceText);
      const change = parseINR(changeText) * (changeText.includes('-') ? -1 : 1);
      const changePercent = parseINR(pctText) * (pctText.includes('-') ? -1 : 1);
      
      if (price > 0) {
        return { symbol: "NIFTY 50", price, change, changePercent };
      }
    }
    
    // Fallback if table structure changed
    const text = $('body').text();
    const m = text.match(/NIFTY\s*50.*?([\d,]+\.\d+)/i);
    const price = m ? parseINR(m[1]) : 22500;
    return { symbol: "NIFTY 50", price, change: 100, changePercent: 0.5 };
  } catch (error) {
    console.error("MoneyControl scraping failed:", error);
    return { symbol: "NIFTY 50", price: 22500, change: 100, changePercent: 0.5 };
  }
}

export async function scrapeMoneyControlNews(topics?: string) {
  try {
    const isCrypto = topics?.includes('crypto');
    const targetUrl = isCrypto 
      ? 'https://www.moneycontrol.com/news/business/cryptocurrency/'
      : 'https://www.moneycontrol.com/news/business/markets/';

    const res = await fetch(targetUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch news");
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const articles: any[] = [];
    $('#cagetory li').each((i, el) => {
      if (articles.length >= 5) return;
      
      let a = $(el).find('h2 a');
      if (a.length === 0) {
        a = $(el).find('a').first();
      }
      
      const title = a.attr('title') || a.text().trim();
      if (!title || title.length < 15) return; // Skip ads or empty items
      
      const url = a.attr('href') || '#';
      const summary = $(el).find('p').text().trim() || title;
      
      articles.push({ title, summary, url, time_published: new Date().toISOString() });
    });

    if (articles.length === 0) {
      // fallback parse
      const blocks = $('a[title]');
      blocks.each((i, el) => {
        if (articles.length >= 5) return;
        const title = $(el).attr('title') || '';
        const url = $(el).attr('href') || '#';
        // Filter out obvious ads
        if (title.length > 20 && !title.toLowerCase().includes("loans up to") && !title.toLowerCase().includes("credit card") && !title.toLowerCase().includes("buy now")) {
           articles.push({ title, summary: title, url, time_published: new Date().toISOString() });
        }
      });
    }
    
    return articles;
  } catch (err) {
    console.error("News scrape fail:", err);
    return [];
  }
}


