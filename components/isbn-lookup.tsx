"use client";

import { Loader2, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookMetadata {
  title: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  isbn: string
  coverImage: string | null
}

interface ISBNLookupProps {
  onFill: (data: Partial<BookMetadata>) => void
}

export function ISBNLookup({ onFill }: ISBNLookupProps) {
  const { t } = useI18n();
  const [isbn, setIsbn] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLookup() {
    const clean = isbn.replace(/[-\s]/g, "");
    if (!clean) {return;}

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(clean)}`,
      );
      if (!res.ok) {throw new Error("Lookup failed");}

      const data = await res.json();
      if (!data.items?.length) {
        toast.error(t("ISBN.notFound"));
        return;
      }

      const info = data.items[0].volumeInfo;
      const metadata: Partial<BookMetadata> = {
        title: info.title,
        authors: info.authors ?? [],
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        description: info.description,
        isbn: clean,
        coverImage: info.imageLinks?.thumbnail?.replace("http:", "https:") ?? null,
      };

      onFill(metadata);
      toast.success(t("ISBN.found", { title: metadata.title ?? "" }));
    } catch (error) {
      toast.error(t("ISBN.lookupFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="isbn-lookup">{t("ISBN.lookupLabel")}</Label>
      <div className="flex gap-2">
        <Input
          id="isbn-lookup"
          placeholder={t("ISBN.lookupPlaceholder")}
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {handleLookup();}
          }}
          aria-label={t("ISBN.searchLabel")}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleLookup}
          disabled={isLoading || !isbn.trim()}
          aria-label={t("ISBN.searchButton")}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
