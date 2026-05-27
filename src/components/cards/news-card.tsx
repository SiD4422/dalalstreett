import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NewsArticle } from "@/lib/alpha-vantage";
import type { AISummary } from "@/lib/gemini";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  article: NewsArticle;
  summary: AISummary;
}

const sentimentConfig = {
  Bullish: {
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: TrendingUp,
  },
  Bearish: {
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: TrendingDown,
  },
  Neutral: {
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    icon: Minus,
  },
};

function timeAgo(published: string): string {
  // Format: "20240101T120000"
  const d = new Date(
    published.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
      "$1-$2-$3T$4:$5:$6"
    )
  );
  const diff = (Date.now() - d.getTime()) / 1000 / 60;
  if (diff < 60) return `${Math.round(diff)}m ago`;
  if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
  return `${Math.round(diff / 1440)}d ago`;
}

export function NewsCard({ article, summary }: Props) {
  let sentimentStr = summary.sentiment || "Neutral";
  if (sentimentStr.includes("Bull") || sentimentStr.includes("Positive")) sentimentStr = "Bullish";
  else if (sentimentStr.includes("Bear") || sentimentStr.includes("Negative")) sentimentStr = "Bearish";
  else sentimentStr = "Neutral";

  const cfg = sentimentConfig[sentimentStr as keyof typeof sentimentConfig] || sentimentConfig["Neutral"];
  const Icon = cfg.icon;

  return (
    <Card className="overflow-hidden hover:border-yellow-500/40 transition-colors">
      <CardContent className="p-0">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 p-4"
        >
          {/* Thumbnail — fixed size, zero CLS */}
          {article.banner_image ? (
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.banner_image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-md bg-gray-100 dark:bg-gray-800" />
          )}

          {/* Content */}
          <div className="flex flex-col gap-1.5 min-w-0">
            {/* Sentiment badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0 h-5 ${cfg.color}`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {sentimentStr}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {article.source} · {timeAgo(article.time_published)}
              </span>
            </div>

            {/* Headline */}
            <p className="text-sm font-semibold leading-snug line-clamp-2">
              {article.title}
            </p>

            {/* AI TL;DR */}
            <p className="text-xs text-muted-foreground line-clamp-2 italic">
              {summary.tldr}
            </p>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}