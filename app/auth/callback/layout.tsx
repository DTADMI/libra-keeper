// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

export const metadata = {
  title: "Account - Callback",
  description: "Private surface (Account - Callback).",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
