"use client"

import { formatDistanceToNow } from "date-fns"

import { useActivity } from "@/hooks/use-activity"

export function ActivityFeed() {
  const { data: activities = [], isLoading, error } = useActivity()

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading activity...</p>
  }

  if (error) {
    return <p className="text-destructive text-sm">Failed to load activity.</p>
  }

  if (activities.length === 0) {
    return <p className="text-muted-foreground text-sm">No recent activity.</p>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 text-sm">
          <div className="min-w-0 flex-1">
            <p>{activity.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
