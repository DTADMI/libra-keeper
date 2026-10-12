// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata = {
  title: "Messages",
  description: "Private surface (Messages).",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
