import type { Metadata } from "next";

// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline. Reconnect to continue using LibraKeeper.",
  robots: { index: false, follow: false },
};

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
