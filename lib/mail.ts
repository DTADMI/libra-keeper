// src/lib/mail.ts — Email helpers using vendor adapter
import { emailClient } from "@/lib/adapters/email";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendLoanRequestEmail = async (
  adminEmail: string,
  borrowerName: string,
  itemTitle: string,
) => {
  await emailClient.send({
    to: adminEmail,
    subject: "New Loan Request",
    html: `<h1>New Loan Request</h1><p><strong>${borrowerName}</strong> wants to borrow <strong>${itemTitle}</strong>.</p><p>Review in your <a href="${domain}/admin/requests">Admin Dashboard</a>.</p>`,
  });
};

export const sendLoanStatusEmail = async (
  userEmail: string,
  itemTitle: string,
  status: "APPROVED" | "REJECTED",
) => {
  await emailClient.send({
    to: userEmail,
    subject: `Loan Request ${status.toLowerCase()}`,
    html: `<h1>Loan Request Update</h1><p>Your request for <strong>${itemTitle}</strong> has been <strong>${status.toLowerCase()}</strong>.</p><p>Check your <a href="${domain}/loans">My Loans</a> page.</p>`,
  });
};
