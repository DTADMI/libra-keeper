"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationChannelConfig {
  pushEnabled: boolean;
  emailEnabled: boolean;
  pushWebhookUrl: string;
  pushWebhookSecret: string;
}

async function fetchChannelConfig(): Promise<NotificationChannelConfig> {
  try {
    const res = await fetch("/api/admin/notifications/channels");
    if (res.ok) {
      const data = await res.json();
      return {
        pushEnabled: data.pushEnabled ?? false,
        emailEnabled: data.emailEnabled ?? true,
        pushWebhookUrl: data.pushWebhookUrl ?? "",
        pushWebhookSecret: data.pushWebhookSecret ?? "",
      };
    }
  } catch {
    // Use defaults
  }
  return {
    pushEnabled: false,
    emailEnabled: true,
    pushWebhookUrl: "",
    pushWebhookSecret: "",
  };
}

export function NotificationChannelManager() {
  const { t } = useI18n();
  // tc (Common) merged — use t("Common.key")
  const [config, setConfig] = useState<NotificationChannelConfig>({
    pushEnabled: false,
    emailEnabled: true,
    pushWebhookUrl: "",
    pushWebhookSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchChannelConfig().then((data) => {
      setConfig(data);
      setLoaded(true);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success(t("Admin.settingUpdated"));
      } else {
        toast.error(t("Common.error"));
      }
    } catch {
      toast.error(t("Common.error"));
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Admin.notificationChannels") || "Notification Channels"}</CardTitle>
        <CardDescription>
          {t("Admin.notificationChannelsDescription") || "Configure how notifications are delivered to users"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("Admin.emailNotifications") || "Email Notifications"}</Label>
            <p className="text-sm text-muted-foreground">
              {t("Admin.emailNotificationsDesc") || "Send transactional emails via Resend"}
            </p>
          </div>
          <Switch
            checked={config.emailEnabled}
            onCheckedChange={(v) => setConfig({ ...config, emailEnabled: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t("Admin.pushNotifications") || "Push Notifications"}</Label>
            <p className="text-sm text-muted-foreground">
              {t("Admin.pushNotificationsDesc") || "Forward notifications to a webhook endpoint for push delivery"}
            </p>
          </div>
          <Switch
            checked={config.pushEnabled}
            onCheckedChange={(v) => setConfig({ ...config, pushEnabled: v })}
          />
        </div>

        {config.pushEnabled && (
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            <div className="space-y-2">
              <Label htmlFor="push-webhook-url">{t("Admin.pushWebhookUrl") || "Webhook URL"}</Label>
              <Input
                id="push-webhook-url"
                value={config.pushWebhookUrl}
                onChange={(e) => setConfig({ ...config, pushWebhookUrl: e.target.value })}
                placeholder="https://push.example.com/api/notify"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="push-webhook-secret">
                {t("Admin.pushWebhookSecret") || "Webhook Secret"}
              </Label>
              <Input
                id="push-webhook-secret"
                type="password"
                value={config.pushWebhookSecret}
                onChange={(e) => setConfig({ ...config, pushWebhookSecret: e.target.value })}
                placeholder="Bearer token or shared secret"
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave} disabled={loading}>
          {loading ? t("Common.saving") || "Saving..." : t("Common.save") || "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
