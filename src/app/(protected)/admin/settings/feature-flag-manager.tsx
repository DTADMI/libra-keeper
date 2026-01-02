"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface FeatureFlag {
  id?: string;
  name: string;
  description?: string;
  isEnabled: boolean;
}

export function FeatureFlagManager() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [newFlag, setNewFlag] = useState<FeatureFlag>({
    name: "",
    description: "",
    isEnabled: false,
  })
  const [loading, setLoading] = useState(true)

  const fetchFlags = async () => {
    try {
      const res = await fetch("/api/admin/flags")
      if (res.ok) {
        const data = await res.json()
        setFlags(data)
      }
    } catch (error) {
      toast.error("Failed to fetch feature flags")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchFlags()
  }, []);

  const handleSave = async (flag: FeatureFlag) => {
    try {
      const res = await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flag),
      });

      if (res.ok) {
        toast.success("Feature flag saved")
        fetchFlags()
      } else {
        toast.error("Failed to save feature flag")
      }
    } catch (error) {
      toast.error("Error saving feature flag")
    }
  };

  const handleAdd = async () => {
    if (!newFlag.name) {
      return toast.error("Name is required")
    }
    await handleSave(newFlag)
    setNewFlag({ name: "", description: "", isEnabled: false })
  };

  if (loading) {
    return <div>Loading flags...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>Enable or disable specific application features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 items-end border-b pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flag-name">Flag Name</Label>
              <Input
                id="flag-name"
                value={newFlag.name}
                onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                placeholder="e.g. maintenance_mode"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flag-desc">Description</Label>
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
              <Label htmlFor="flag-enabled">Enabled by default</Label>
            </div>
            <Button onClick={handleAdd}>Add Flag</Button>
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
                  onCheckedChange={(checked) => handleSave({ ...flag, isEnabled: checked })}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
