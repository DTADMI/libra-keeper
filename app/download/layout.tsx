import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download",
  description: "Download LibraKeeper to manage your personal library and track borrowed items.",
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
