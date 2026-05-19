"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminSettings, useUpdateSetting } from "@/hooks/use-admin";

type SettingType = "STRING" | "BOOLEAN" | "NUMBER" | "JSON"

interface Setting {
  key: string;
  value: string;
  type: SettingType;
}

export function SettingsManager() {
  const t = useTranslations("Admin");
  const tc = useTranslations("Common");
  const { data: settings = [], isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();

  const [newSetting, setNewSetting] = useState<Setting>({ key: "", value: "", type: "STRING" });
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  const handleSave = (setting: { key: string; value: string; type: string }) => {
    updateSetting.mutate(setting, {
      onSuccess: () => toast.success(t("settingUpdated")),
      onError: () => toast.error(tc("error")),
    });
  };

  const handleAdd = () => {
    if (!newSetting.key) {
      return toast.error(t("keyRequired"));
    }
    handleSave(newSetting);
    setNewSetting({ key: "", value: "", type: "STRING" });
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("appSettings")}</CardTitle>
        <CardDescription>{t("settingsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4 items-end border-b pb-4">
          <div className="space-y-2">
            <Label htmlFor="new-key">{t("key")}</Label>
            <Input
              id="new-key"
              value={newSetting.key}
              onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              placeholder="e.g. library_name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-value">{t("value")}</Label>
            <Input
              id="new-value"
              value={newSetting.value}
              onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              placeholder="Value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-type">{t("type")}</Label>
            <Select
              value={newSetting.type}
              onValueChange={(v: SettingType) => setNewSetting({ ...newSetting, type: v })}
            >
              <SelectTrigger id="new-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STRING">String</SelectItem>
                <SelectItem value="BOOLEAN">Boolean</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="JSON">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd}>{t("addSetting")}</Button>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="grid grid-cols-4 gap-4 items-end">
              <div className="font-mono text-sm">{setting.key}</div>
              <Input
                value={editingValues[setting.key] ?? setting.value}
                onChange={(e) =>
                  setEditingValues({ ...editingValues, [setting.key]: e.target.value })
                }
              />
              <div className="text-xs uppercase text-muted-foreground">{setting.type}</div>
              <Button
                variant="secondary"
                onClick={() =>
                  handleSave({
                    key: setting.key,
                    value: editingValues[setting.key] ?? setting.value,
                    type: setting.type,
                  })
                }
              >
                {t("update")}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
