// src/lib/mail.ts — Email helpers using vendor adapter
import { emailClient } from "@/lib/adapters/email";
import {
  loanRequestTemplate,
  loanStatusTemplate,
} from "@/lib/mail/templates";

export const sendLoanRequestEmail = async (
  adminEmail: string,
  adminName: string,
  borrowerName: string,
  itemTitle: string,
) => {
  const { subject, html } = loanRequestTemplate({
    adminName,
    borrowerName,
    itemTitle,
  });
  await emailClient.send({ to: adminEmail, subject, html });
};

export const sendLoanStatusEmail = async (
  userEmail: string,
  userName: string,
  itemTitle: string,
  status: "APPROVED" | "REJECTED",
) => {
  const { subject, html } = loanStatusTemplate({
    userName,
    itemTitle,
    status,
  });
  await emailClient.send({ to: userEmail, subject, html });
};
