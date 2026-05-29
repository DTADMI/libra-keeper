"use client";

import Link from "next/link";

import { BulkImport } from "@/components/bulk-import";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function DashboardToolbar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SearchBar />
      {session?.user && session.user.role === "ADMIN" && (
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/items/new">Add New Item</Link>
          </Button>
          <BulkImport />
        </div>
      )}
    </div>
  );
}
