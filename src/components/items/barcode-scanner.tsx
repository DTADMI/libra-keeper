"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { ScanLine } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isOpen) {
      scannerRef.current = new Html5QrcodeScanner(
        "barcode-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.777778,
        },
        /* verbose= */ false,
      );

      scannerRef.current.render(
        (decodedText) => {
          onScan(decodedText)
          setIsOpen(false)
          if (scannerRef.current) {
            scannerRef.current.clear()
          }
        },
        (error) => {
          // console.warn(error);
        },
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear scanner", error)
        });
      }
    };
  }, [isOpen, onScan]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="flex items-center gap-2">
          <ScanLine className="h-4 w-4" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan ISBN Barcode</DialogTitle>
        </DialogHeader>
        <div id="barcode-reader" className="overflow-hidden rounded-md border" />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Position the barcode within the frame to scan
        </div>
      </DialogContent>
    </Dialog>
  );
}
