import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimization ──
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.alphavantage.co",
      },
      {
        protocol: "https",
        hostname: "**.businesswire.com",
      },
      {
        protocol: "https",
        hostname: "**.reuters.com",
      },
      {
        protocol: "https",
        hostname: "**.economictimes.com",
      },
      {
        protocol: "https",
        hostname: "**.moneycontrol.com",
      },
      {
        protocol: "https",
        hostname: "**.livemint.com",
      },
      {
        protocol: "https",
        hostname: "**.ndtvprofit.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h — news thumbnails don't change
  },

  // ── Security headers ──
  async headers() {
    const securityHeaders = [
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        // CSP: allow AdSense + Google APIs + self
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self'",
          "connect-src 'self' https://www.goldapi.io https://www.alphavantage.co https://generativelanguage.googleapis.com",
          "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ];

    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // ── Compiler ──
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ── ISR fallback behavior ──
  experimental: {
    staleTimes: {
      dynamic: 30,   // 30s stale-while-revalidate for dynamic routes
      static: 180,   // 3min for static
    },
  },
};

export default nextConfig;