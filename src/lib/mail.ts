// src/lib/mail.ts
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'LibraKeeper <noreply@librakeeper.com>', // You might need to verify this domain in Resend
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
    }

    return data;
  } catch (error) {
    console.error("Email error:", error);
  }
};

export const sendLoanRequestEmail = async (adminEmail: string, borrowerName: string, itemTitle: string) => {
  await sendEmail({
    to: adminEmail,
    subject: "New Loan Request",
    html: `
      <h1>New Loan Request</h1>
      <p><strong>${borrowerName}</strong> wants to borrow <strong>${itemTitle}</strong>.</p>
      <p>Please review the request in your <a href="${domain}/admin/requests">Admin Dashboard</a>.</p>
    `,
  });
};

export const sendLoanStatusEmail = async (userEmail: string, itemTitle: string, status: 'APPROVED' | 'REJECTED') => {
  await sendEmail({
    to: userEmail,
    subject: `Loan Request ${status.toLowerCase()}`,
    html: `
      <h1>Loan Request Update</h1>
      <p>Your request to borrow <strong>${itemTitle}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
      <p>Check your <a href="${domain}/loans">My Loans</a> page for more details.</p>
    `,
  });
};
