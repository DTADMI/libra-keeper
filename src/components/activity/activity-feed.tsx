"use client"

import { formatDistanceToNow } from "date-fns"
import { BookOpen, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

import { useActivity } from "@/hooks/use-activity"

const ICONS = {
  LOAN: BookOpen,
  COMMENT: MessageCircle,
  REQUEST: Send,
} as const

export function ActivityFeed() {
  const { data: activities = [], isLoading, error } = useActivity()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load activity.</p>
  }

  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity.</p>
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = ICONS[activity.type as keyof typeof ICONS] ?? BookOpen

        return (
          <div key={activity.id} className="flex gap-3 text-sm">
            <div className="mt-0.5 h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">
                {activity.item?.id ? (
                  <Link
                    href={`/items/${activity.item.id}`}
                    className="hover:underline"
                  >
                    {activity.message}
                  </Link>
                ) : (
                  activity.message
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
