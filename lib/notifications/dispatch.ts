import "server-only";

import { emailClient } from "@/lib/adapters/email";
import { logger } from "@/lib/logger";

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
  attempts: number;
}

interface DeadLetterEntry {
  id: string;
  channel: NotificationChannel;
  error: string;
  attempts: number;
  payload: NotificationPayload;
  failedAt: string;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

function calculateBackoff(attempt: number): number {
  return INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEFAULT_CONFIG: ChannelConfig = {
  pushEnabled: false,
  emailEnabled: true,
  pushWebhookUrl: null,
  pushWebhookSecret: null,
};

let cachedConfig: ChannelConfig | null = null;

async function getChannelConfig(): Promise<ChannelConfig> {
  if (cachedConfig) {return cachedConfig;}

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

async function persistDeadLetter(
  entry: DeadLetterEntry,
): Promise<void> {
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.notification.create({
      data: {
        userId: entry.payload.userId,
        type: `DEAD_LETTER:${entry.channel}`,
        title: entry.payload.title,
        body: JSON.stringify({
          error: entry.error,
          attempts: entry.attempts,
          originalPayload: entry.payload,
          failedAt: entry.failedAt,
        }),
        isRead: false,
      },
    });
  } catch (err) {
    logger.error("Failed to persist dead letter notification", err);
  }
}

async function retryWithBackoff<T>(
  fn: () => Promise<T | null>,
  channel: NotificationChannel,
  payload: NotificationPayload,
  maxRetries: number = MAX_RETRIES,
): Promise<{ result: T | null; attempts: number; lastError?: string }> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      if (result) {
        return { result, attempts: attempt };
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    if (attempt < maxRetries) {
      const delay = calculateBackoff(attempt);
      logger.warn(
        `Notification retry ${attempt}/${maxRetries} for ${channel} channel, waiting ${delay}ms`,
      );
      await sleep(delay);
    }
  }

  const deadEntry: DeadLetterEntry = {
    id: crypto.randomUUID(),
    channel,
    error: lastError ?? "Unknown error",
    attempts: maxRetries,
    payload,
    failedAt: new Date().toISOString(),
  };
  await persistDeadLetter(deadEntry);
  logger.error(
    `Notification to ${channel} failed after ${maxRetries} attempts, moved to dead letter queue`,
  );

  return { result: null, attempts: maxRetries, lastError };
}

async function dispatchToEmail(
  userId: string,
  payload: NotificationPayload,
): Promise<DispatchResult | null> {
  const config = await getChannelConfig();
  if (!config.emailEnabled) {return null;}

  const { result, attempts, lastError } = await retryWithBackoff(
    async () => {
      const { prisma } = await import("@/lib/db");
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user?.email) {
        return null;
      }

      const res = await emailClient.send({
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

      if (!res.success) {
        throw new Error("Email send returned unsuccessful result");
      }

      return { channel: "email" as const, success: true, attempts: 1 };
    },
    "email",
    payload,
  );

  if (!result) {
    return { channel: "email", success: false, error: lastError, attempts };
  }
  return result;
}

async function dispatchToPush(
  userId: string,
  payload: NotificationPayload,
): Promise<DispatchResult | null> {
  const config = await getChannelConfig();
  if (!config.pushEnabled || !config.pushWebhookUrl) {return null;}

  const { result, attempts, lastError } = await retryWithBackoff(
    async () => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (config.pushWebhookSecret) {
        headers["Authorization"] = `Bearer ${config.pushWebhookSecret}`;
      }

      const res = await fetch(config.pushWebhookUrl!, {
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
        throw new Error(`Push webhook returned ${res.status}: ${await res.text()}`);
      }

      return { channel: "push" as const, success: true, attempts: 1 };
    },
    "push",
    payload,
  );

  if (!result) {
    return { channel: "push", success: false, error: lastError, attempts };
  }
  return result;
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

    return { channel: "in_app", success: true, attempts: 1 };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    const deadEntry: DeadLetterEntry = {
      id: crypto.randomUUID(),
      channel: "in_app",
      error: errMsg,
      attempts: 1,
      payload,
      failedAt: new Date().toISOString(),
    };
    await persistDeadLetter(deadEntry);

    return { channel: "in_app", success: false, error: errMsg, attempts: 1 };
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
    if (result) {results.push(result);}
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

export async function reprocessDeadLetters(): Promise<{ processed: number; failed: number }> {
  try {
    const { prisma } = await import("@/lib/db");
    const deadLetters = await prisma.notification.findMany({
      where: {
        type: { startsWith: "DEAD_LETTER:" },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      take: 100,
    });

    let processed = 0;
    let failed = 0;

    for (const dl of deadLetters) {
      try {
        const parsed = JSON.parse(dl.body);
        const entry = parsed as DeadLetterEntry;
        const results = await dispatch(entry.payload);
        const allSuccess = results.every((r) => r.success);

        if (allSuccess) {
          await prisma.notification.delete({ where: { id: dl.id } });
          processed++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { processed, failed };
  } catch {
    return { processed: 0, failed: 0 };
  }
}
