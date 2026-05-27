import cities from "@/data/cities.json";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dalalstreett.in";

  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "hourly" },
    { url: "/gold-prices", priority: "0.9", changefreq: "hourly" },
    { url: "/markets", priority: "0.8", changefreq: "hourly" },
  ];

  const cityRoutes = cities.map((c) => ({
    url: `/local/${c.city}`,
    priority: "0.7",
    changefreq: "daily",
  }));

  const allRoutes = [...staticRoutes, ...cityRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${base}${r.url}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
