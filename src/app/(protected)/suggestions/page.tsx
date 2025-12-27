// src/app/(protected)/suggestions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ItemRequest = {
  id: string;
  title: string;
  author: string | null;
  type: "BORROWED_ITEM" | "SUGGESTION";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED";
  createdAt: string;
};

export default function SuggestionsPage() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<ItemRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"BORROWED_ITEM" | "SUGGESTION">("SUGGESTION")

  useEffect(() => {
    fetchRequests()
  }, []);

  async function fetchRequests() {
    try {
      const response = await fetch("/api/suggestions")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch requests", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, description, type }),
      });

      if (response.ok) {
        const newRequest = await response.json()
        setRequests([newRequest, ...requests])
        setTitle("")
        setAuthor("")
        setDescription("")
        toast.success("Request submitted")
      }
    } catch (error) {
      toast.error("Failed to submit request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Suggestions & Item Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUGGESTION">Suggestion (Item to acquire)</SelectItem>
                    <SelectItem value="BORROWED_ITEM">
                      Borrowed Item (Item you have but not in catalog)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author/Creator</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description/Notes</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Recent Requests</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground">No requests yet.</p>
          ) : (
            requests.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{req.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.type === "SUGGESTION" ? "Suggestion" : "Borrowed Item"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      req.status === "COMPLETED"
                        ? "default"
                        : req.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {req.status}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
