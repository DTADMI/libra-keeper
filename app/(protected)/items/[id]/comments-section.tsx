// src/app/(protected)/items/[id]/comments-section.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment, useComments } from "@/hooks/use-items";

interface CommentsSectionProps {
  itemId: string;
}

export function CommentsSection({ itemId }: CommentsSectionProps) {
  const t = useTranslations("Items");
  const { data: comments = [], isLoading } = useComments(itemId);
  const addComment = useAddComment(itemId);
  const [newComment, setNewComment] = useState("");

  function onSubmit() {
    if (!newComment.trim()) {return;}

    addComment.mutate(newComment, {
      onSuccess: () => {
        setNewComment("");
        toast.success(t("commentPosted"));
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("commentFailed")
        );
      },
    });
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-10">{t("loadingComments")}</p>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold">{t("comments")}</h3>

      <div className="space-y-4">
        <Textarea
          placeholder={t("leaveComment")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={addComment.isPending}
        />
        <Button onClick={onSubmit} disabled={addComment.isPending || !newComment.trim()}>
          {t("postComment")}
        </Button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.user.image ?? undefined} />
              <AvatarFallback>{comment.user.name?.[0] ?? "?"}</AvatarFallback>
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
          <p className="text-muted-foreground text-center py-10">{t("noComments")}</p>
        )}
      </div>
    </div>
  );
}
