// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata = {
  title: "Admin - Settings",
  description: "Private surface (Admin - Settings).",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
