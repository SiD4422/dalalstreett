// Reusable fixed-height AdSense placeholder — zero CLS guaranteed
interface Props {
  className?: string;
  slotId?: string; // future: real AdSense data-ad-slot
}

export function AdSlot({ className = "", slotId }: Props) {
  return (
    <div
      className={`h-[90px] w-full rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${className}`}
      data-ad-slot={slotId}
      aria-label="Advertisement"
    >
      {/* 
        Production: replace inner content with:
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        <ins className="adsbygoogle" style={{display:"block"}} data-ad-client="ca-pub-XXXX" data-ad-slot={slotId} />
      */}
      <span className="text-xs text-muted-foreground/40 select-none">
        Advertisement
      </span>
    </div>
  );
}