// src/app/(protected)/suggestions/page.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "@/hooks/use-session"
import { useSuggestions, useCreateSuggestion } from "@/hooks/use-suggestions"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

export default function SuggestionsPage() {
  const { data: session } = useSession()
  const { data: requests = [], isLoading: listLoading, error: listError } = useSuggestions()
  const createSuggestion = useCreateSuggestion()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"BORROWED_ITEM" | "SUGGESTION">("SUGGESTION")
  const [author, setAuthor] = useState("")
  const [isbn, setIsbn] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    createSuggestion.mutate(
      { title: title.trim(), description: description.trim() || undefined, type, author: author.trim() || undefined, isbn: isbn.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Suggestion submitted")
          setTitle("")
          setDescription("")
          setAuthor("")
          setIsbn("")
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to submit suggestion")
        },
      },
    )
  }

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Item Suggestions</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isAdmin ? "Manage Requests" : "Submit a Suggestion"}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUGGESTION">Suggestion to acquire</SelectItem>
                    <SelectItem value="BORROWED_ITEM">I have this item</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author / Creator</Label>
                <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN / Identifier</Label>
                <Input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <Button type="submit" disabled={createSuggestion.isPending || !title.trim()}>
                {createSuggestion.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {listLoading && <p className="text-muted-foreground">Loading suggestions...</p>}
      {listError && <p className="text-destructive">Failed to load suggestions.</p>}

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{req.title}</h3>
                  {req.author && <p className="text-sm text-muted-foreground">by {req.author}</p>}
                  {req.description && <p className="text-sm mt-1">{req.description}</p>}
                </div>
                <Badge className={statusColors[req.status] ?? ""}>{req.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {!listLoading && requests.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No suggestions yet.</p>
        )}
      </div>
    </div>
  )
}
