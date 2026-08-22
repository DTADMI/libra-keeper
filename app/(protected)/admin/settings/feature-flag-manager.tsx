"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminFlags, useUpdateFlag } from "@/hooks/use-admin";

interface FeatureFlag {
  name: string;
  description: string;
  isEnabled: boolean;
}

export function FeatureFlagManager() {
  const { t } = useI18n();
  // tc (Common) merged — use t("Common.key")
  const { data: flags = [], isLoading } = useAdminFlags();
  const updateFlag = useUpdateFlag();

  const [newFlag, setNewFlag] = useState<FeatureFlag>({
    name: "",
    description: "",
    isEnabled: false,
  });

  const handleSave = (flag: { name: string; isEnabled: boolean; description?: string }) => {
    updateFlag.mutate(flag, {
      onSuccess: () => toast.success(t("Admin.flagUpdated")),
      onError: () => toast.error(t("Common.error")),
    });
  };

  const handleAdd = () => {
    if (!newFlag.name) {
      return toast.error(t("Admin.nameRequired"));
    }
    handleSave(newFlag);
    setNewFlag({ name: "", description: "", isEnabled: false });
  };

  if (isLoading) {
    return <div>{t("Admin.loading")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Admin.featureFlags")}</CardTitle>
        <CardDescription>{t("Admin.flagsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 items-end border-b pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flag-name">{t("Admin.flagName")}</Label>
              <Input
                id="flag-name"
                value={newFlag.name}
                onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                placeholder="e.g. maintenance_mode"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flag-desc">{t("Admin.description")}</Label>
              <Input
                id="flag-desc"
                value={newFlag.description}
                onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                placeholder="Description"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="flag-enabled"
                checked={newFlag.isEnabled}
                onCheckedChange={(checked) => setNewFlag({ ...newFlag, isEnabled: checked })}
              />
              <Label htmlFor="flag-enabled">{t("Admin.enabledByDefault")}</Label>
            </div>
            <Button onClick={handleAdd}>{t("Admin.addFlag")}</Button>
          </div>
        </div>

        <div className="space-y-4">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="space-y-0.5">
                <div className="font-medium">{flag.name}</div>
                <div className="text-xs text-muted-foreground">{flag.description}</div>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={flag.isEnabled}
                  onCheckedChange={(checked) =>
                    handleSave({ name: flag.name, isEnabled: checked, description: flag.description ?? undefined })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
