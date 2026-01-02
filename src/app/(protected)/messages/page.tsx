// src/app/(protected)/messages/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Conversation = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: string;
  createdAt: string;
  unread: boolean;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    name: string | null;
    image: string | null;
  };
};

export default function MessagesPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.user.id)
    }
  }, [selectedUser]);

  async function fetchConversations() {
    try {
      const response = await fetch("/api/messages")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchMessages(userId: string) {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUser || !newMessage.trim()) {
      return
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser.user.id,
        }),
      });

      if (response.ok) {
        const msg = await response.json()
        setMessages([...messages, msg])
        setNewMessage("")
        fetchConversations() // Update conversation list
      }
    } catch (error) {
      toast.error("Failed to send message")
    }
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {isLoading ? (
              <p className="p-4 text-center">Loading...</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No conversations yet.</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setSelectedUser(conv)}
                  className={cn(
                    "w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors text-left border-b",
                    selectedUser?.user.id === conv.user.id && "bg-accent",
                  )}
                >
                  <Avatar>
                    <AvatarImage src={conv.user.image || ""} />
                    <AvatarFallback>{conv.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{conv.user.name || "User"}</p>
                      {conv.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 overflow-hidden flex flex-col h-full">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.user.image || ""} />
                    <AvatarFallback>{selectedUser.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{selectedUser.user.name || "User"}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[80%] rounded-lg p-3",
                      msg.senderId === session?.user.id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-accent",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[10px] opacity-70 mt-1 self-end">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
