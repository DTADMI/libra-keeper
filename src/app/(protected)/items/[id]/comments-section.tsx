// src/app/(protected)/items/[id]/comments-section.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
}

interface CommentsSectionProps {
  itemId: string;
}

export function CommentsSection({ itemId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/items/${itemId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => {
      })
  }, [itemId])

  async function onSubmit() {
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${itemId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      const data = await response.json()
      setComments([data, ...comments])
      setNewComment("")
      toast.success("Comment posted")
    } catch (error: any) {
      toast.error("Failed to post comment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold">Comments</h3>

      <div className="space-y-4">
        <Textarea
          placeholder="Leave a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={onSubmit} disabled={isLoading || !newComment.trim()}>
          Post Comment
        </Button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.user.image} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-muted-foreground text-center py-10">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
