import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center text-xs text-muted-foreground whitespace-nowrap overflow-x-auto pb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-yellow-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-medium" : ""}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 mx-1.5 opacity-50" />}
          </div>
        );
      })}
    </nav>
  );
}
