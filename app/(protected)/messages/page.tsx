// src/app/(protected)/messages/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConversations, useMessages, useSendMessage } from "@/hooks/use-messages";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const t = useTranslations("Messages");
  const tc = useTranslations("Common");
  const { data: session } = useSession();
  const { data: conversations = [], isLoading: conversationsLoading, error: conversationsError } = useConversations();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedUserId);
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = useSendMessage(selectedUserId ?? "");

  const selectedConversation = conversations.find((c) => c.user.id === selectedUserId);

  function handleSend() {
    if (!newMessage.trim() || !selectedUserId) {return;}
    sendMessage.mutate(newMessage, {
      onSuccess: () => setNewMessage(""),
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("sendFailed")
        );
      },
    });
  }

  const currentUserId = session?.user?.id;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t("conversations")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {conversationsLoading && (
              <p className="text-muted-foreground text-sm p-4">{t("loadingConversations")}</p>
            )}
            {conversationsError && (
              <p className="text-destructive text-sm p-4">{t("failedConversations")}</p>
            )}
            {!conversationsLoading && conversations.length === 0 && (
              <p className="text-muted-foreground text-sm p-4">{t("noConversations")}</p>
            )}
            <div className="divide-y">
              {conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setSelectedUserId(conv.user.id)}
                  className={cn(
                    "w-full text-left p-3 hover:bg-accent transition-colors",
                    selectedUserId === conv.user.id && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conv.user.image ?? undefined} />
                      <AvatarFallback>{conv.user.name?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conv.user.name}</p>
                        {conv.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col h-[75vh]">
          {selectedUserId && selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedConversation.user.image ?? undefined} />
                    <AvatarFallback>{selectedConversation.user.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.user.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading && (
                  <p className="text-muted-foreground text-sm text-center">{t("loadingMessages")}</p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%] rounded-lg p-3",
                      msg.senderId === currentUserId
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-accent",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
                <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
              </CardContent>
              <div className="border-t p-4 flex gap-2">
                <Input
                  placeholder={t("typeMessage")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={sendMessage.isPending}
                />
                <Button onClick={handleSend} disabled={sendMessage.isPending || !newMessage.trim()}>
                  {t("send")}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              {t("selectConversation")}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
