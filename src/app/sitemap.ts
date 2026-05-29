import { MetadataRoute } from 'next';
import { getLiveGoldPrice } from '@/lib/gold-api';
import cities from '@/data/cities.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dalalstreett-77pt.vercel.app';
  
  // Try to fetch live price to get the most accurate "last modified" timestamp
  const gold = await getLiveGoldPrice().catch(() => null);
  const lastModified = gold ? new Date(gold.timestamp) : new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/gold-prices`,
      lastModified,
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/silver-prices`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/crypto`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mutual-funds`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ipo`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/personal-finance`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.9,
    },
    ...cities.map((c) => ({
      url: `${baseUrl}/local/${c.city}`,
      lastModified,
      changeFrequency: 'always' as const,
      priority: 0.8,
    }))
  ];
}
