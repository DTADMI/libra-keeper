"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SettingType = "STRING" | "BOOLEAN" | "NUMBER" | "JSON"

interface Setting {
  id?: string;
  key: string;
  value: string;
  type: SettingType;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [newSetting, setNewSetting] = useState<Setting>({ key: "", value: "", type: "STRING" })
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      toast.error("Failed to fetch settings")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSettings()
  }, []);

  const handleSave = async (setting: Setting) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setting),
      });

      if (res.ok) {
        toast.success("Setting saved")
        fetchSettings()
      } else {
        toast.error("Failed to save setting")
      }
    } catch (error) {
      toast.error("Error saving setting")
    }
  };

  const handleAdd = async () => {
    if (!newSetting.key) {
      return toast.error("Key is required")
    }
    await handleSave(newSetting)
    setNewSetting({ key: "", value: "", type: "STRING" })
  };

  if (loading) {
    return <div>Loading settings...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>Configure global application parameters.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4 items-end border-b pb-4">
          <div className="space-y-2">
            <Label htmlFor="new-key">Key</Label>
            <Input
              id="new-key"
              value={newSetting.key}
              onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
              placeholder="e.g. library_name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-value">Value</Label>
            <Input
              id="new-value"
              value={newSetting.value}
              onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
              placeholder="Value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-type">Type</Label>
            <Select
              value={newSetting.type}
              onValueChange={(v: SettingType) => setNewSetting({ ...newSetting, type: v as SettingType })}
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
          <Button onClick={handleAdd}>Add Setting</Button>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="grid grid-cols-4 gap-4 items-end">
              <div className="font-mono text-sm">{setting.key}</div>
              <Input
                value={setting.value}
                onChange={(e) => {
                  const newSettings = settings.map((s) =>
                    s.key === setting.key ? { ...s, value: e.target.value } : s,
                  );
                  setSettings(newSettings)
                }}
              />
              <div className="text-xs uppercase text-muted-foreground">{setting.type}</div>
              <Button variant="secondary" onClick={() => handleSave(setting)}>
                Update
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
