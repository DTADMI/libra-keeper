// src/app/(protected)/admin/settings/page.tsx
"use client";

import { useI18n } from "@/lib/i18n";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { FeatureFlagManager } from "./feature-flag-manager";
import { NotificationChannelManager } from "./notification-channel-manager";
import { SettingsManager } from "./settings-manager";

export default function AdminSettingsPage() {
  const { t } = useI18n();

  const exportData = (format: "json" | "csv") => {
    window.location.href = `/api/admin/export?format=${format}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">{t("Admin.settings")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingsManager />
        <FeatureFlagManager />
        <NotificationChannelManager />
        <Card>
          <CardHeader>
            <CardTitle>{t("Admin.dataExport")}</CardTitle>
            <CardDescription>
              {t("Admin.exportDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button onClick={() => exportData("json")} variant="outline">
              <Icons.download className="mr-2 h-4 w-4" />
              {t("Admin.exportJson")}
            </Button>
            <Button onClick={() => exportData("csv")} variant="outline">
              <Icons.download className="mr-2 h-4 w-4" />
              {t("Admin.exportCsv")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
