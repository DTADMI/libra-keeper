// app/(protected)/admin/settings/csv-import.tsx
//
// Import CSV d'ouvrages (feature B6) : parse le fichier cote client puis cree
// les fiches par lot via POST /api/items/bulk (admin).
"use client";

import { useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { parseItemsCsv } from "@/lib/libra-csv";

export function CsvImport() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importFile = async (file: File) => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const items = parseItemsCsv(await file.text());
      if (items.length === 0) {
        setError(t("Admin.csvImportEmpty"));
        return;
      }
      const res = await fetch("/api/items/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        setError(t("Admin.csvImportError"));
        return;
      }
      const data = (await res.json()) as { count?: number };
      setMessage(t("Admin.csvImportSuccess", { count: data.count ?? items.length }));
    } catch {
      setError(t("Admin.csvImportError"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Admin.csvImport")}</CardTitle>
        <CardDescription>{t("Admin.csvImportDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="text/csv,.csv"
          aria-label={t("Admin.chooseCsvFile")}
          title={t("Admin.chooseCsvFile")}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importFile(file);
          }}
        />
        <Button variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
          <Icons.upload className="mr-2 h-4 w-4" />
          {busy ? t("Admin.importing") : t("Admin.chooseCsvFile")}
        </Button>
        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
