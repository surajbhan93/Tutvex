import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: any;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export default function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {showHome && (
        <>
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {items.length > 0 && (
            <ChevronRight size={16} className="text-slate-400" />
          )}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {Icon && <Icon size={16} />}
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              </Link>
            ) : (
              <span
                className={`flex items-center gap-1.5 ${
                  isLast
                    ? "text-slate-900 font-semibold"
                    : "text-slate-600"
                }`}
              >
                {Icon && <Icon size={16} />}
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              </span>
            )}

            {!isLast && <ChevronRight size={16} className="text-slate-400" />}
          </div>
        );
      })}
    </nav>
  );
}
