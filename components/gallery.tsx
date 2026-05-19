"use client";

import { ChevronLeft, ChevronRight, Star,Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useItemImages, useUploadImage } from "@/hooks/use-item-images";

interface ItemGalleryProps {
  itemId: string
  isAdmin?: boolean
}

export function ItemGallery({ itemId, isAdmin }: ItemGalleryProps) {
  const t = useTranslations("Items");
  const { data: images = [], isLoading } = useItemImages(itemId);
  const uploadImage = useUploadImage(itemId);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) {return;}

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("notAnImage"));
        continue;
      }
      uploadImage.mutate(file);
    }
    e.target.value = "";
  }

  if (isLoading) {
    return <div className="h-48 bg-muted rounded-lg animate-pulse" />;
  }

  const activeImage = activeIndex !== null && activeIndex < images.length ? images[activeIndex] : null;
  const idx = activeIndex ?? 0;

  return (
    <div className="space-y-3">
      {activeImage && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <img
            src={activeImage.url}
            alt={activeImage.caption ?? ""}
            className="w-full max-h-96 object-contain mx-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
            onClick={() => setActiveIndex(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setActiveIndex((idx - 1 + images.length) % images.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-12 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setActiveIndex((idx + 1) % images.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className={`relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
              activeIndex === i ? "border-primary" : "border-transparent hover:border-muted-foreground"
            }`}
          >
            <img src={img.url} alt={img.caption ?? ""} className="w-full h-full object-cover" />
            {img.isPrimary && (
              <Star className="absolute top-0.5 right-0.5 h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
          </button>
        ))}
        {isAdmin && (
          <label className="shrink-0 w-20 h-20 rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploadImage.isPending}
            />
          </label>
        )}
      </div>
    </div>
  );
}
