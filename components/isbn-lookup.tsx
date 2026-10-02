"use client";

import { Loader2, ScanLine, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBarcodeDetector, normalizeScannedIsbn } from "@/lib/barcode";
import { useI18n } from "@/lib/i18n";

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

interface GoogleBooksVolume {
  volumeInfo?: {
    title?: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    imageLinks?: { thumbnail?: string }
  }
}

interface GoogleBooksResponse {
  items?: GoogleBooksVolume[]
}

export function ISBNLookup({ onFill }: ISBNLookupProps) {
  const { t } = useI18n();
  const [isbn, setIsbn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const lookupIsbn = useCallback(
    async (value: string) => {
      const clean = value.replace(/[-\s]/g, "");
      if (!clean) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(clean)}`,
        );
        if (!res.ok) throw new Error("Lookup failed");

        const data = (await res.json()) as GoogleBooksResponse;
        if (!data.items?.length) {
          toast.error(t("ISBN.notFound"));
          return;
        }

        const info = data.items[0]?.volumeInfo ?? {};
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
      } catch {
        toast.error(t("ISBN.lookupFailed"));
      } finally {
        setIsLoading(false);
      }
    },
    [onFill, t],
  );

  const handleLookup = () => {
    void lookupIsbn(isbn);
  };

  const stopScan = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => stopScan, [stopScan]);

  const startScan = async () => {
    const Detector = getBarcodeDetector();
    if (!Detector) {
      toast.error(t("ISBN.scanUnsupported"));
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error(t("ISBN.scanUnsupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsScanning(true);

      // Le <video> n'existe qu'une fois l'etat scanning rendu.
      requestAnimationFrame(async () => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const detector = new Detector({ formats: ["ean_13", "ean_8"] });
        const tick = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const clean = normalizeScannedIsbn(String(codes[0]?.rawValue ?? ""));
            if (clean) {
              stopScan();
              setIsbn(clean);
              void lookupIsbn(clean);
              return;
            }
          } catch {
            // Frame illisible : on continue.
          }
          if (streamRef.current) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    } catch {
      toast.error(t("ISBN.scanError"));
      stopScan();
    }
  };

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
            if (e.key === "Enter") handleLookup();
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
        <Button
          type="button"
          variant="outline"
          onClick={isScanning ? stopScan : startScan}
          disabled={isLoading}
          aria-label={isScanning ? t("ISBN.scanStop") : t("ISBN.scan")}
          title={isScanning ? t("ISBN.scanStop") : t("ISBN.scan")}
        >
          <ScanLine className={`h-4 w-4 ${isScanning ? "text-primary" : ""}`} />
        </Button>
      </div>
      {isScanning && (
        <video
          ref={videoRef}
          className="mt-2 w-full max-w-xs rounded-lg border"
          muted
          playsInline
          aria-label={t("ISBN.scanning")}
        />
      )}
    </div>
  );
}
