// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata = {
  title: "Items - New",
  description: "Private surface (Items - New).",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
