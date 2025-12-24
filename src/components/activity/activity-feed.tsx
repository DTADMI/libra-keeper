// src/components/activity/activity-feed.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Icons } from "@/components/icons"

type Activity = {
  id: string
  type: "LOAN" | "COMMENT" | "REQUEST"
  user: string
  item: string
  status?: string
  date: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch("/api/activity")
        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActivity()
  }, [])

  if (isLoading) return <p>Loading activity...</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((act) => (
          <div key={`${act.type}-${act.id}`} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5">
              {act.type === "LOAN" && <Icons.calendar className="h-4 w-4 text-blue-500" />}
              {act.type === "COMMENT" && <Icons.messageSquare className="h-4 w-4 text-green-500" />}
              {act.type === "REQUEST" && <Icons.help className="h-4 w-4 text-yellow-500" />}
            </div>
            <div className="flex-1">
              <p>
                <span className="font-semibold">{act.user}</span>{" "}
                {act.type === "LOAN" && `requested to borrow ${act.item}`}
                {act.type === "COMMENT" && `commented on ${act.item}`}
                {act.type === "REQUEST" && `submitted a request for ${act.item}`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(act.date), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No recent activity.</p>
        )}
      </CardContent>
    </Card>
  )
}
