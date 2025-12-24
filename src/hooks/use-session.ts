// src/hooks/use-session.ts
"use client"

import { Session } from "next-auth"
import { useSession as useNextAuthSession } from "next-auth/react"

export function useSession() {
    const { data: session, status, update } = useNextAuthSession()

    return {
        user: session?.user,
        status,
        update,
    }
}