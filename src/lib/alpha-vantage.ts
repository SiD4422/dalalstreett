const BASE = "https://www.alphavantage.co/query";
const KEY = () => process.env.ALPHA_VANTAGE_KEY!;

export interface NewsArticle {
  title: string;
  url: string;
  summary: string;
  banner_image: string;
  source: string;
  time_published: string;
  overall_sentiment_label: string;
}

export interface QuoteData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

import { scrapeMoneyControlNews } from './scraper';

export async function getMarketNews(topics = "finance,commodity,crypto,earnings,ipo"): Promise<NewsArticle[]> {
  try {
    const url = `${BASE}?function=NEWS_SENTIMENT&limit=50&topics=${topics}&apikey=${KEY() || 'demo'}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Alpha Vantage news fetch failed");
    
    const data = await res.json();
    if (data.feed && data.feed.length > 0) {
      return data.feed.map((item: any, index: number) => ({
        title: item.title,
        url: item.url,
        summary: item.summary,
        banner_image: (item.banner_image && item.banner_image.toLowerCase() !== 'null') ? item.banner_image : `https://picsum.photos/seed/${index + item.title.length}/800/420`,
        source: item.source,
        time_published: item.time_published,
        overall_sentiment_label: item.overall_sentiment_label
      }));
    }
    
    // Fallback if API rate limited or no feed
    console.warn(`Alpha Vantage returned no feed or hit rate limit for topics: ${topics}. Using static fallback.`);
    
    // Generate topic-specific mock data
    const isHome = topics === "finance,commodity,crypto,earnings,ipo";
    const isCrypto = topics.includes('crypto') || topics.includes('blockchain');
    const isIPO = topics.includes('ipo');
    const isMF = topics.includes('finance,earnings') && !topics.includes('retail') && !isHome;
    const isPersonalFinance = topics.includes('retail_wholesale');

    const cryptoNews = [
      {
        title: "Bitcoin Surges Past Key Resistance Level Ahead of Halving",
        url: "https://example.com/crypto-1",
        summary: "Cryptocurrency markets experienced a massive influx of volume as Bitcoin broke through major resistance levels, liquidating short sellers.",
        banner_image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
        source: "CoinDesk",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Ethereum Network Upgrade Successfully Deployed on Mainnet",
        url: "https://example.com/crypto-2",
        summary: "The highly anticipated Ethereum network upgrade went live today, dramatically reducing gas fees for Layer 2 transactions.",
        banner_image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800",
        source: "CoinTelegraph",
        time_published: new Date(Date.now() - 3600000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Solana Ecosystem Sees Record NFT Trading Volume",
        url: "https://example.com/crypto-3",
        summary: "The Solana blockchain has overtaken competitors in daily active users as new decentralized applications launch.",
        banner_image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=800",
        source: "Decrypt",
        time_published: new Date(Date.now() - 7200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Regulatory Scrutiny Increases for Stablecoins",
        url: "https://example.com/crypto-4",
        summary: "Global regulators are tightening rules around fiat-backed stablecoins to ensure adequate reserves are maintained.",
        banner_image: "https://images.unsplash.com/photo-1622630998477-20b41cd74c47?auto=format&fit=crop&q=80&w=800",
        source: "Bloomberg Crypto",
        time_published: new Date(Date.now() - 14400000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bearish"
      },
      {
        title: "DeFi Protocols Cross $100 Billion Total Value Locked",
        url: "https://example.com/crypto-5",
        summary: "Decentralized finance continues its meteoric rise as institutional investors begin allocating capital to liquidity pools.",
        banner_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
        source: "The Block",
        time_published: new Date(Date.now() - 28800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      }
    ];

    const ipoNews = [
      {
        title: "Tech Unicorn Files Confidential S-1 for Blockbuster IPO",
        url: "https://example.com/ipo-1",
        summary: "Silicon Valley's most anticipated AI startup has confidentially filed for an IPO, aiming for a valuation north of $50 Billion.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        source: "CNBC",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Recent EV Maker IPO Plunges Below Offering Price",
        url: "https://example.com/ipo-2",
        summary: "Following a hyped public debut, shares of the newest electric vehicle manufacturer have dropped 15% amid production concerns.",
        banner_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
        source: "Bloomberg",
        time_published: new Date(Date.now() - 7200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bearish"
      },
      {
        title: "Swiggy IPO Subscribed 3.5 Times on Final Day",
        url: "https://example.com/ipo-3",
        summary: "The highly anticipated food delivery startup IPO saw massive retail interest, oversubscribing multiple times before closing.",
        banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
        source: "Economic Times",
        time_published: new Date(Date.now() - 86400000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Hyundai India Gears Up For Largest Auto IPO",
        url: "https://example.com/ipo-4",
        summary: "The automaker is preparing to file its DRHP next week, setting the stage for what could be the biggest IPO of the year.",
        banner_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
        source: "LiveMint",
        time_published: new Date(Date.now() - 172800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      },
      {
        title: "SME IPOs Continue to See Record Breaking Listings",
        url: "https://example.com/ipo-5",
        summary: "Small and medium enterprise initial public offerings are listing at massive premiums as retail frenzy continues.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        source: "MoneyControl",
        time_published: new Date(Date.now() - 259200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      }
    ];

    const mfNews = [
      {
        title: "Top 5 Equity Mutual Funds Outperforming the Index",
        url: "https://example.com/mf-1",
        summary: "We analyze the top-performing equity mutual funds this quarter, highlighting fund managers who successfully navigated market volatility.",
        banner_image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800",
        source: "MoneyControl",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Debt Funds See Massive Inflows Amid Rate Cut Speculation",
        url: "https://example.com/mf-2",
        summary: "Investors are aggressively allocating capital to long-duration debt mutual funds, anticipating upcoming central bank rate cuts.",
        banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
        source: "Economic Times",
        time_published: new Date(Date.now() - 10800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "SIP Contributions Hit New All-Time High This Month",
        url: "https://example.com/mf-3",
        summary: "Retail investors continue their disciplined approach as monthly Systematic Investment Plan contributions cross the ₹20,000 crore mark.",
        banner_image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=800",
        source: "LiveMint",
        time_published: new Date(Date.now() - 86400000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Small Cap Funds Temporarily Suspend Lumpsum Investments",
        url: "https://example.com/mf-4",
        summary: "Several asset management companies have stopped accepting one-time investments in their small-cap schemes due to valuation concerns.",
        banner_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
        source: "Business Standard",
        time_published: new Date(Date.now() - 172800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      },
      {
        title: "New Flexi-Cap NFO Garners Massive Investor Interest",
        url: "https://example.com/mf-5",
        summary: "The latest New Fund Offer from a leading AMC has collected over ₹5,000 crores during its subscription period.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        source: "CNBC TV18",
        time_published: new Date(Date.now() - 259200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      }
    ];

    const pfNews = [
      {
        title: "Major Banks Announce Hikes in Fixed Deposit Rates",
        url: "https://example.com/pf-1",
        summary: "Leading private and public sector banks have unexpectedly raised their FD interest rates to attract retail deposits and improve liquidity.",
        banner_image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=800",
        source: "LiveMint",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "New RBI Guidelines on Credit Card Billing Rules Explained",
        url: "https://example.com/pf-2",
        summary: "The central bank has issued strict new mandates regarding how credit card issuers calculate minimum dues and penal interest.",
        banner_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
        source: "Business Standard",
        time_published: new Date(Date.now() - 3600000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      },
      {
        title: "Home Loan Rates Expected to Drop Next Quarter",
        url: "https://example.com/pf-3",
        summary: "With inflation cooling down, experts predict that banks will pass on the benefits to consumers by reducing home loan interest rates.",
        banner_image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        source: "Economic Times",
        time_published: new Date(Date.now() - 86400000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Tax Saving Strategies for the Final Quarter",
        url: "https://example.com/pf-4",
        summary: "As the financial year nears its end, discover the best ELSS funds and tax-saving instruments to maximize your deductions.",
        banner_image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
        source: "MoneyControl",
        time_published: new Date(Date.now() - 172800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      },
      {
        title: "Gold Bonds vs Physical Gold: What Should You Buy?",
        url: "https://example.com/pf-5",
        summary: "A comprehensive comparison of Sovereign Gold Bonds against physical gold ahead of the upcoming festive season.",
        banner_image: "https://images.unsplash.com/photo-1605792657660-596af9037e39?auto=format&fit=crop&q=80&w=800",
        source: "CNBC",
        time_published: new Date(Date.now() - 259200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      }
    ];

    const generalNews = [
      {
        title: "Global Markets Rally as Inflation Cools Faster Than Expected",
        url: "https://example.com/markets-rally",
        summary: "Stock markets worldwide saw significant gains today following reports that inflation is cooling at a much faster rate than economists had predicted.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        source: "MarketWatch",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Commodities Slide: Gold and Silver Face Weekly Losses",
        url: "https://example.com/commodities",
        summary: "Precious metals experienced a sharp sell-off this week as investors rotated back into equities, leaving gold and silver at multi-week lows.",
        banner_image: "https://images.unsplash.com/photo-1605792657660-596af9037e39?auto=format&fit=crop&q=80&w=800",
        source: "Reuters",
        time_published: new Date(Date.now() - 10800000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bearish"
      },
      {
        title: "Tech Giants Announce Record Breaking Q3 Earnings",
        url: "https://example.com/tech-earnings",
        summary: "Major technology companies have crushed Wall Street estimates for the third quarter, driven by strong AI cloud demand and enterprise software sales.",
        banner_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        source: "TechCrunch",
        time_published: new Date(Date.now() - 3600000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      },
      {
        title: "Central Bank Hints at Possible Rate Cuts in Upcoming Meeting",
        url: "https://example.com/rate-cuts",
        summary: "In a surprise statement, central bank officials indicated that interest rate cuts could be on the table as soon as next month due to slowing economic indicators.",
        banner_image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
        source: "Financial Times",
        time_published: new Date(Date.now() - 7200000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Neutral"
      },
      {
        title: "Emerging Markets See Massive Capital Inflows Post-Elections",
        url: "https://example.com/emerging-markets",
        summary: "Following stable election outcomes across several developing nations, foreign institutional investors are pouring billions into emerging market equities.",
        banner_image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800",
        source: "Bloomberg",
        time_published: new Date(Date.now() - 14400000).toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      }
    ];

    if (isHome) {
      // The home page requires at least 20 articles to fully populate its grid and sliders
      // So we merge all our arrays!
      const combined = [...generalNews, ...cryptoNews, ...ipoNews, ...mfNews, ...pfNews];
      // Shuffle slightly or just return as is (25 articles total, perfect for home page)
      return combined;
    }

    if (isCrypto && !isHome) return cryptoNews;
    if (isIPO && !isHome) return ipoNews;
    if (isMF && !isHome) return mfNews;
    if (isPersonalFinance && !isHome) return pfNews;

    // Default general market fallback
    return generalNews;
  } catch (err) {
    console.error("News API failed:", err);
    return [
      {
        title: "Global Markets Rally as Inflation Cools Faster Than Expected",
        url: "https://example.com/markets-rally",
        summary: "Stock markets worldwide saw significant gains today following reports that inflation is cooling at a much faster rate than economists had predicted.",
        banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        source: "MarketWatch",
        time_published: new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
        overall_sentiment_label: "Bullish"
      }
    ];
  }
}

async function fetchYahooQuote(symbol: string): Promise<QuoteData> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Yahoo fetch failed");
    const data = await res.json();
    const result = data.chart.result[0];
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose || price;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      symbol: symbol.replace('.NS', '').replace('^NSEI', 'NIFTY 50'),
      price,
      change,
      changePercent
    };
  } catch (err) {
    console.error(`Yahoo Finance failed for ${symbol}:`, err);
    return { symbol: symbol.replace('.NS', '').replace('^NSEI', 'NIFTY 50'), price: 0, change: 0, changePercent: 0 };
  }
}

export async function getNiftyQuote(): Promise<QuoteData> {
  return await fetchYahooQuote('^NSEI');
}

export async function getBankNiftyQuote(): Promise<QuoteData> {
  return await fetchYahooQuote('^NSEBANK');
}

export async function getEquityQuotes(symbols: string[]): Promise<QuoteData[]> {
  return Promise.all(
    symbols.map(async (sym) => {
      const cleanSym = sym.includes('.NS') || sym.includes('.BO') || sym.includes('-USD') ? sym : `${sym}.NS`;
      return await fetchYahooQuote(cleanSym);
    })
  );
}

export async function getCryptoQuotes(symbols: string[]): Promise<QuoteData[]> {
  return Promise.all(
    symbols.map(async (sym) => {
      return await fetchYahooQuote(sym);
    })
  );
}