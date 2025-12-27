// src/app/api/messages/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const messageSchema = z.object({
  content: z.string().min(1),
  receiverId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { content, receiverId } = messageSchema.parse(json)

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
      },
      include: {
        sender: { select: { name: true, image: true } },
        receiver: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const otherUserId = searchParams.get("userId")

    if (otherUserId) {
      // Get conversation between two users
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.user.id },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(messages)
    }

    // Get list of conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by other user and get latest message
    const conversations = new Map()
    messages.forEach((msg) => {
      const otherUser = msg.senderId === session.user.id ? msg.receiver : msg.sender
      if (!conversations.has(otherUser.id)) {
        conversations.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
          unread: !msg.read && msg.receiverId === session.user.id,
        });
      }
    });

    return NextResponse.json(Array.from(conversations.values()))
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}
