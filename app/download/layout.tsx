import type { Metadata } from "next";

// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata: Metadata = {
  title: "Download",
  description: "Download LibraKeeper to manage your personal library and track borrowed items.",
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
