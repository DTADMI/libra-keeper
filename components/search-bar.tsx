"use client";

import { SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";

function sanitizeHeadline(html: string): string {
  return html.replace(/<(?! {4}[/]?b\b)[^>]*>/gi, "");
}

export function SearchBar() {
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: results = [], isLoading } = useSearch(query);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setOpen(value.length >= 2);
  }

  return (
    <div className="relative w-full max-w-md" ref={ref}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.length >= 2) {setOpen(true);}
          }}
          className="pl-9 pr-8"
          aria-label={t("searchLabel")}
          role="searchbox"
          aria-expanded={open}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label={t("clearSearch")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-background shadow-lg">
          {isLoading && (
            <p className="p-4 text-sm text-muted-foreground">{t("searching")}</p>
          )}
          {!isLoading && results.length === 0 && query.length >= 2 && (
            <p className="p-4 text-sm text-muted-foreground">{t("noResults")}</p>
          )}
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm line-clamp-2">
                  {item.headline ? (
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHeadline(item.headline) }} />
                  ) : (
                    item.title
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.type}</span>
                  {item.author && (
                    <span className="text-xs text-muted-foreground">{t("by", { author: item.author })}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {item._count.likes > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {t("likes", { count: item._count.likes })}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
