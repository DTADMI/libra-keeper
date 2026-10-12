// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata = {
  title: "Admin - Suggestions",
  description: "Private surface (Admin - Suggestions).",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
