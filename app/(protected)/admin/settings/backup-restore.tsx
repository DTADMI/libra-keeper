// src/app/(protected)/admin/settings/backup-restore.tsx
//
// Restauration d'une sauvegarde JSON LibraKeeper (feature B8, volet UI).
// L'export existait deja (GET /api/admin/export) ; ce composant ajoute le
// chemin inverse en envoyant le fichier choisi a POST /api/admin/import.
"use client";

import { useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface RestoreResponse {
  created?: number;
  updated?: number;
  skipped?: number;
  errors?: string[];
}

export function BackupRestore() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restore = async (file: File) => {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const text = await file.text();
      let payload: unknown;
      try {
        payload = JSON.parse(text);
      } catch {
        setError(t("Admin.restoreInvalidFile"));
        return;
      }

      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as RestoreResponse | null;
        setError(body?.errors?.join(", ") || t("Admin.restoreError"));
        return;
      }
      const data = (await res.json()) as RestoreResponse;
      setMessage(
        t("Admin.restoreSuccess", {
          created: data.created ?? 0,
          updated: data.updated ?? 0,
          skipped: data.skipped ?? 0,
        }),
      );
    } catch {
      setError(t("Admin.restoreError"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Admin.restoreData")}</CardTitle>
        <CardDescription>{t("Admin.restoreDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          aria-label={t("Admin.chooseBackupFile")}
          title={t("Admin.chooseBackupFile")}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void restore(file);
          }}
        />
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <Icons.upload className="mr-2 h-4 w-4" />
          {busy ? t("Admin.restoring") : t("Admin.chooseBackupFile")}
        </Button>
        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
