"use client";

import { cn } from "@/lib/utils";

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export const Skeleton = LoadingSkeleton;

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <LoadingSkeleton className="h-32 w-full" />
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailLoadingSkeleton() {
  return (
    <div className="space-y-6 py-6">
      <LoadingSkeleton className="h-8 w-40" />
      <div className="grid gap-6 md:grid-cols-2">
        <LoadingSkeleton className="h-64 w-full rounded-lg" />
        <div className="space-y-3">
          <LoadingSkeleton className="h-6 w-3/4" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-2/3" />
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

export function ListLoadingSkeleton() {
  return (
    <div className="space-y-4 py-6">
      <LoadingSkeleton className="h-8 w-48" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/3" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
