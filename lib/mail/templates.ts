// lib/mail/templates.ts — Email templates for LibraKeeper
// Uses plain HTML with inline styles for maximum email client compatibility.

const domain = process.env.NEXT_PUBLIC_APP_URL ?? "https://librakeeper.app";

const baseTemplate = (title: string, content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 32px 40px 24px; border-bottom: 1px solid #e4e4e7;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #18181b;">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 32px; color: #3f3f46; font-size: 15px; line-height: 1.6;">
        ${content}
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 40px 24px; border-top: 1px solid #e4e4e7; color: #a1a1aa; font-size: 12px; text-align: center;">
        <p style="margin: 0 0 4px;">
          <a href="${domain}" style="color: #a1a1aa; text-decoration: none;">LibraKeeper</a> &mdash; Your Personal Library Manager
        </p>
        <p style="margin: 0; font-size: 11px;">
          You received this email because you have an account on LibraKeeper.
          ${domain}/profile
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const button = (text: string, href: string): string => `
<a href="${href}" style="display: inline-block; padding: 10px 24px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; margin-top: 8px;">${text}</a>
`;

export function loanRequestTemplate(params: {
  adminName: string;
  borrowerName: string;
  itemTitle: string;
}): { subject: string; html: string } {
  const subject = `New Loan Request: ${params.itemTitle}`;
  const content = `
    <p>Hello ${escape(params.adminName)},</p>
    <p><strong>${escape(params.borrowerName)}</strong> has requested to borrow <strong>${escape(params.itemTitle)}</strong>.</p>
    <p>Please review this request in your admin dashboard.</p>
    ${button("View Request", `${domain}/admin/requests`)}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

export function loanStatusTemplate(params: {
  userName: string;
  itemTitle: string;
  status: "APPROVED" | "REJECTED";
}): { subject: string; html: string } {
  const statusLabel = params.status === "APPROVED" ? "approved" : "rejected";
  const subject = `Loan Request ${statusLabel}: ${params.itemTitle}`;
  const statusColor = params.status === "APPROVED" ? "#16a34a" : "#dc2626";
  const content = `
    <p>Hello ${escape(params.userName)},</p>
    <p>Your request to borrow <strong>${escape(params.itemTitle)}</strong> has been
    <span style="color: ${statusColor}; font-weight: 700;">${statusLabel}</span>.</p>
    ${params.status === "APPROVED" ? button("View My Loans", `${domain}/loans`) : ""}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

export function dueReminderTemplate(params: {
  userName: string;
  itemTitle: string;
  dueDate: string;
  daysRemaining: number;
}): { subject: string; html: string } {
  const urgency = params.daysRemaining <= 1 ? "Tomorrow" : `in ${params.daysRemaining} days`;
  const subject = `Reminder: "${params.itemTitle}" is due ${urgency}`;
  const content = `
    <p>Hello ${escape(params.userName)},</p>
    <p>This is a friendly reminder that <strong>${escape(params.itemTitle)}</strong> is due on <strong>${params.dueDate}</strong> (${urgency}).</p>
    <p>Please return the item on time to avoid being marked overdue.</p>
    ${button("View My Loans", `${domain}/loans`)}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

export function overdueReminderTemplate(params: {
  userName: string;
  itemTitle: string;
  dueDate: string;
  daysOverdue: number;
}): { subject: string; html: string } {
  const daysLabel = params.daysOverdue === 1 ? "1 day" : `${params.daysOverdue} days`;
  const subject = `Overdue: "${params.itemTitle}" is ${daysLabel} overdue`;
  const content = `
    <p>Hello ${escape(params.userName)},</p>
    <p><strong>${escape(params.itemTitle)}</strong> was due on <strong>${params.dueDate}</strong> and is now <span style="color: #dc2626; font-weight: 700;">${daysLabel} overdue</span>.</p>
    <p>Please return this item as soon as possible.</p>
    ${button("View My Loans", `${domain}/loans`)}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

export function welcomeTemplate(params: {
  userName: string;
  verifyUrl?: string;
}): { subject: string; html: string } {
  const subject = "Welcome to LibraKeeper!";
  const content = `
    <p>Hello ${escape(params.userName)},</p>
    <p>Welcome to <strong>LibraKeeper</strong> — your personal library management tool.</p>
    <p>Start by adding items to your collection, tracking loans, and organizing your library.</p>
    ${button("Go to Dashboard", `${domain}/dashboard`)}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

export function returnConfirmationTemplate(params: {
  userName: string;
  itemTitle: string;
}): { subject: string; html: string } {
  const subject = `Return Confirmed: ${params.itemTitle}`;
  const content = `
    <p>Hello ${escape(params.userName)},</p>
    <p>The return of <strong>${escape(params.itemTitle)}</strong> has been confirmed.</p>
    <p>Thank you for returning the item on time!</p>
    ${button("Browse Library", `${domain}/dashboard`)}
  `;
  return { subject, html: baseTemplate(subject, content) };
}

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
