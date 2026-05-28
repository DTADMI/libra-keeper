import "server-only";

import { emailClient } from "@/lib/adapters/email";

export type NotificationChannel = "in_app" | "email" | "push";

export interface NotificationPayload {
  userId: string;
  type?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface ChannelConfig {
  pushEnabled: boolean;
  emailEnabled: boolean;
  pushWebhookUrl: string | null;
  pushWebhookSecret: string | null;
}

interface DispatchResult {
  channel: NotificationChannel;
  success: boolean;
  error?: string;
}

const DEFAULT_CONFIG: ChannelConfig = {
  pushEnabled: false,
  emailEnabled: true,
  pushWebhookUrl: null,
  pushWebhookSecret: null,
};

let cachedConfig: ChannelConfig | null = null;

async function getChannelConfig(): Promise<ChannelConfig> {
  if (cachedConfig) return cachedConfig;

  try {
    const { redis } = await import("@/lib/redis");
    const stored = await redis.get("notifications:channel_config");
    if (stored && typeof stored === "object") {
      cachedConfig = { ...DEFAULT_CONFIG, ...(stored as Partial<ChannelConfig>) };
      return cachedConfig;
    }
  } catch {
    // Redis unavailable, fall through to env-based defaults
  }

  cachedConfig = {
    pushEnabled: process.env.PUSH_NOTIFICATIONS_ENABLED === "true",
    emailEnabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== "false",
    pushWebhookUrl: process.env.PUSH_WEBHOOK_URL || null,
    pushWebhookSecret: process.env.PUSH_WEBHOOK_SECRET || null,
  };

  return cachedConfig;
}

export async function invalidateChannelConfig(): Promise<void> {
  cachedConfig = null;
  try {
    const { redis } = await import("@/lib/redis");
    await redis.del("notifications:channel_config");
  } catch {
    // silent
  }
}

export async function updateChannelConfig(config: Partial<ChannelConfig>): Promise<void> {
  try {
    const { redis } = await import("@/lib/redis");
    const current = await getChannelConfig();
    const merged = { ...current, ...config };
    await redis.set("notifications:channel_config", JSON.stringify(merged));
    cachedConfig = merged;
  } catch {
    // silent
  }
}

async function dispatchToEmail(
  userId: string,
  payload: NotificationPayload,
): Promise<DispatchResult | null> {
  const config = await getChannelConfig();
  if (!config.emailEnabled) return null;

  try {
    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      return { channel: "email", success: false, error: "User email not found" };
    }

    const result = await emailClient.send({
      to: user.email,
      subject: payload.title,
      html: `<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>${payload.title}</h2>
        <p>${payload.body}</p>
        ${payload.data ? `<pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; font-size: 12px;">${JSON.stringify(payload.data, null, 2)}</pre>` : ""}
        <hr />
        <p style="color: #888; font-size: 12px;">Sent by LibraKeeper</p>
      </div>`,
    });

    return { channel: "email", success: result.success };
  } catch (error) {
    return {
      channel: "email",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function dispatchToPush(
  userId: string,
  payload: NotificationPayload,
): Promise<DispatchResult | null> {
  const config = await getChannelConfig();
  if (!config.pushEnabled || !config.pushWebhookUrl) return null;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.pushWebhookSecret) {
      headers["Authorization"] = `Bearer ${config.pushWebhookSecret}`;
    }

    const res = await fetch(config.pushWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return {
        channel: "push",
        success: false,
        error: `Push webhook returned ${res.status}: ${await res.text()}`,
      };
    }

    return { channel: "push", success: true };
  } catch (error) {
    return {
      channel: "push",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function dispatchToInApp(
  userId: string,
  payload: NotificationPayload,
): Promise<DispatchResult | null> {
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.notification.create({
      data: {
        userId,
        type: payload.type ?? "GENERAL",
        title: payload.title,
        body: payload.body,
        isRead: false,
      },
    });

    return { channel: "in_app", success: true };
  } catch (error) {
    return {
      channel: "in_app",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function dispatch(
  payload: NotificationPayload,
): Promise<DispatchResult[]> {
  const channels = payload.channels ?? ["in_app", "email"];
  const results: DispatchResult[] = [];

  const tasks = channels.map(async (channel) => {
    switch (channel) {
      case "in_app":
        return dispatchToInApp(payload.userId, payload);
      case "email":
        return dispatchToEmail(payload.userId, payload);
      case "push":
        return dispatchToPush(payload.userId, payload);
    }
  });

  const settled = await Promise.all(tasks);
  for (const result of settled) {
    if (result) results.push(result);
  }

  return results;
}

export async function sendLoanRequestNotification(
  userId: string,
  itemTitle: string,
  borrowerName: string,
): Promise<DispatchResult[]> {
  return dispatch({
    userId,
    title: "New Loan Request",
    body: `${borrowerName} wants to borrow "${itemTitle}".`,
    data: { type: "loan_request", itemTitle, borrowerName },
    channels: ["in_app", "email"],
  });
}

export async function sendLoanStatusNotification(
  userId: string,
  itemTitle: string,
  status: "APPROVED" | "REJECTED",
): Promise<DispatchResult[]> {
  const statusLabel = status === "APPROVED" ? "approved" : "rejected";
  return dispatch({
    userId,
    title: `Loan Request ${statusLabel}`,
    body: `Your request for "${itemTitle}" has been ${statusLabel}.`,
    data: { type: "loan_status", itemTitle, status },
    channels: ["in_app", "email"],
  });
}
