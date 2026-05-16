// lib/adapters/email.ts — Vendor-isolated email adapter
//
// Abstracts Resend behind a local interface for testability
// and vendor independence.

export interface EmailClient {
  send(params: SendEmailParams): Promise<EmailResult>;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface EmailResult {
  id: string;
  success: boolean;
}

class ResendEmailAdapter implements EmailClient {
  private apiKey: string;
  private fromDefault: string;

  constructor(apiKey: string, fromDefault?: string) {
    this.apiKey = apiKey;
    this.fromDefault = fromDefault ?? "LibraKeeper <noreply@librakeeper.app>";
  }

  async send(params: SendEmailParams): Promise<EmailResult> {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from ?? this.fromDefault,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", json);
      return { id: "", success: false };
    }

    return { id: (json as { id?: string }).id ?? "", success: true };
  }
}

class MockEmailAdapter implements EmailClient {
  async send(params: SendEmailParams): Promise<EmailResult> {
    console.log("[MockEmail]", params.to, params.subject);
    return { id: "mock-" + Date.now(), success: true };
  }
}

function createEmailClient(): EmailClient {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    return new ResendEmailAdapter(apiKey, process.env.EMAIL_FROM);
  }
  return new MockEmailAdapter();
}

export const emailClient: EmailClient = createEmailClient();
