"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { NewsArticle } from '@/lib/alpha-vantage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NewsSlider({ articles }: { articles: NewsArticle[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!articles.length) return null;

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-2xl h-[420px] w-full bg-slate-900 border border-black/5 dark:border-white/5">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {articles.map((article, index) => (
            <a 
              href={article.url} 
              target="_blank" 
              rel="noreferrer"
              className="flex-[0_0_100%] min-w-0 relative h-full group/slider block" 
              key={article.url || index}
            >
              {/* Fallback deterministic image from picsum */}
              <img 
                src={article.banner_image || `https://picsum.photos/seed/${index + article.title.length}/800/420`}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 transition-opacity">
                <span className="bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 w-fit">
                  {article.overall_sentiment_label || "Breaking News"}
                </span>
                <h2 className="text-white text-3xl md:text-4xl font-black leading-tight mb-2 group-hover/slider:text-blue-400 transition-colors">
                  {article.title}
                </h2>
                <div className="flex items-center text-sm text-gray-300 font-medium gap-3">
                  <span>{article.source}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                  <span>
                    {article.time_published 
                      ? new Date(article.time_published.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3T$4:$5:$6")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/20"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-white/20"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {articles.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-white w-6" : "bg-white/50"}`}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Scroll to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
