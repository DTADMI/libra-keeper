"use client";

import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFeatureFlag } from "@/hooks/use-feature-flags";
import { apiClient } from "@/lib/api-client";

interface ParsedRow {
  title: string;
  type: string;
  author: string;
  publisher: string;
  isbn: string;
  description: string;
  coverImage: string;
}

const ITEM_TYPES = ["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"] as const;
const COMMON_HEADERS: Record<string, string> = {
  title: "title",
  name: "title",
  item: "title",
  type: "type",
  category: "type",
  format: "type",
  author: "author",
  creator: "author",
  artist: "author",
  writer: "author",
  publisher: "publisher",
  isbn: "isbn",
  barcode: "isbn",
  upc: "isbn",
  description: "description",
  notes: "description",
  summary: "description",
  cover: "coverImage",
  image: "coverImage",
  cover_url: "coverImage",
  image_url: "coverImage",
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      current += "\n";
    } else if (ch === "\n" && !inQuotes) {
      rows.push(current.split("\n"));
      current = "";
    } else if (ch === "\r") {
      // skip
    } else {
      current += ch;
    }
  }
  if (current) {
    rows.push(current.split("\n"));
  }
  return rows;
}

function detectHeaders(headers: string[]): Partial<Record<string, number>> {
  const mapping: Partial<Record<string, number>> = {};
  headers.forEach((h, idx) => {
    const normalized = h.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");
    const key = COMMON_HEADERS[normalized] || normalized;
    if (["title", "type", "author", "publisher", "isbn", "description", "coverImage"].includes(key)) {
      mapping[key] = idx;
    }
  });
  return mapping;
}

export function BulkImport() {
  const t = useTranslations("Items");
  const tc = useTranslations("Common");
  const { enabled } = useFeatureFlag("bulk_import");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Partial<Record<string, number>>>({});
  const [defaultType, setDefaultType] = useState<string>("BOOK");
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[]>([]);

  const handleFile = useCallback((selected: File) => {
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length < 2) {
        toast.error(t("csvNeedHeaders"));
        setFile(null);
        return;
      }
      const hdrs = parsed[0];
      const dataRows = parsed.slice(1).filter((r) => r.some((c) => c.trim()));
      setHeaders(hdrs);
      setRows(dataRows);
      const autoMapping = detectHeaders(hdrs);
      setMapping(autoMapping);

      const previewRows: ParsedRow[] = dataRows.slice(0, 5).map((row) => {
        const mapValue = (key: string) => {
          const idx = autoMapping[key];
          return idx !== undefined && idx < row.length ? row[idx].trim() : "";
        };
        return {
          title: mapValue("title"),
          type: mapValue("type") || "BOOK",
          author: mapValue("author"),
          publisher: mapValue("publisher"),
          isbn: mapValue("isbn"),
          description: mapValue("description"),
          coverImage: mapValue("coverImage"),
        };
      });
      setPreview(previewRows);
    };
    reader.readAsText(selected);
  }, [t]);

  if (!enabled) {return null;}

  const handleImport = async () => {
    if (rows.length === 0) {return;}
    setImporting(true);
    try {
      const items = rows.map((row) => {
        const item: Record<string, unknown> = { type: defaultType };
        for (const [key, idx] of Object.entries(mapping)) {
          if (idx !== undefined && idx < row.length && row[idx].trim()) {
            item[key] = row[idx].trim();
          }
        }
        if (!item.title) {item.title = "Untitled";}
        if (!item.type) {item.type = defaultType;}
        return item;
      });

      const batchSize = 50;
      let imported = 0;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const res = await apiClient<{ count: number; errors: string[] }>("/api/items/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: batch }),
        });
        imported += res.count;
      }

      toast.success(t("importSuccess", { count: imported }));
      setOpen(false);
      setFile(null);
      setHeaders([]);
      setRows([]);
      setMapping({});
      setPreview([]);
    } catch {
      toast.error(tc("error"));
    } finally {
      setImporting(false);
    }
  };

  const columnMapping = headers.map((h, idx) => {
    const mapped = Object.entries(mapping).find(([, v]) => v === idx);
    return { header: h, field: mapped?.[0] };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          {t("bulkImport") || "Bulk Import"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("bulkImportTitle") || "Bulk Import Items"}</DialogTitle>
          <DialogDescription>
            {t("bulkImportDescription") || "Upload a CSV file to import multiple items at once"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!file && (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                {t("dragDrop") || "Drag and drop a CSV file, or click to browse"}
              </p>
              <input
                type="file"
                accept=".csv,.tsv,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {handleFile(f);}
                }}
                style={{ position: "relative", display: "inline-block", width: "auto", height: "auto", opacity: 1 }}
              />
            </div>
          )}

          {file && rows.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("rowsDetected", { count: rows.length }) || `${rows.length} rows detected`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setHeaders([]);
                    setRows([]);
                    setMapping({});
                    setPreview([]);
                  }}
                >
                  <X className="mr-1 h-4 w-4" />
                  {tc("cancel")}
                </Button>
              </div>

              <div>
                <Label className="mb-1 block">{t("defaultType") || "Default Type"}</Label>
                <Select value={defaultType} onValueChange={setDefaultType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEM_TYPES.map((v) => (
                      <SelectItem key={v} value={v}>{t(`types.${v}`) || v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{t("preview") || "Preview"}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-64">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {columnMapping.map((col) => (
                            <TableHead key={col.header} className="text-xs whitespace-nowrap">
                              {col.header}
                              {col.field && (
                                <span className="block text-[10px] text-muted-foreground font-normal">
                                  → {col.field}
                                </span>
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.map((row, ri) => (
                          <TableRow key={ri}>
                            {Object.values(row).map((val, vi) => (
                              <TableCell key={vi} className="text-xs max-w-[150px] truncate">
                                {val || "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {tc("cancel")}
          </Button>
          <Button onClick={handleImport} disabled={importing || rows.length === 0}>
            {importing
              ? (t("importing") || "Importing...")
              : `${t("importLabel") || "Import"} ${rows.length} ${t("items") || "items"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
