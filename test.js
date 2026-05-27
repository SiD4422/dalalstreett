const cheerio = require('cheerio');

async function testUrl(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const articles = [];
  $('#cagetory li').each((i, el) => {
    if (articles.length >= 5) return;
    
    let a = $(el).find('h2 a');
    if (a.length === 0) {
      a = $(el).find('a').first();
    }
    
    const title = a.attr('title') || a.text().trim();
    if (!title || title.length < 15) return; 
    
    articles.push(title);
  });
  console.log(`\n--- ${url} ---`);
  console.log(`Found ${articles.length} articles:`, articles);
}

async function run() {
  await testUrl('https://www.moneycontrol.com/news/business/mutual-funds/');
  await testUrl('https://www.moneycontrol.com/news/business/ipo/');
  await testUrl('https://www.moneycontrol.com/news/business/personal-finance/');
}

run();
