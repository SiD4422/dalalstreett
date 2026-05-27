async function testYahoo() {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS`);
    const data = await res.json();
    console.log("RELIANCE:", data.chart.result[0].meta.regularMarketPrice);
    
    const res2 = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/^NSEI`);
    const data2 = await res2.json();
    console.log("NIFTY:", data2.chart.result[0].meta.regularMarketPrice);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
testYahoo();
