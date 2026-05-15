"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search } from "lucide-react"

interface BookMetadata {
  title: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  isbn: string
  coverImage: string | null
}

interface ISBNLookupProps {
  onFill: (data: Partial<BookMetadata>) => void
}

export function ISBNLookup({ onFill }: ISBNLookupProps) {
  const [isbn, setIsbn] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleLookup() {
    const clean = isbn.replace(/[-\s]/g, "")
    if (!clean) return

    setIsLoading(true)
    try {
      // Try Google Books API first (no API key needed for basic queries)
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(clean)}`,
      )
      if (!res.ok) throw new Error("Lookup failed")

      const data = await res.json()
      if (!data.items?.length) {
        toast.error("No book found for this ISBN")
        return
      }

      const info = data.items[0].volumeInfo
      const metadata: Partial<BookMetadata> = {
        title: info.title,
        authors: info.authors ?? [],
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        description: info.description,
        isbn: clean,
        coverImage: info.imageLinks?.thumbnail?.replace("http:", "https:") ?? null,
      }

      onFill(metadata)
      toast.success(`Found: ${metadata.title}`)
    } catch (error) {
      toast.error("Failed to look up ISBN. Try entering details manually.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="isbn-lookup">ISBN Lookup</Label>
      <div className="flex gap-2">
        <Input
          id="isbn-lookup"
          placeholder="Enter ISBN..."
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLookup()
          }}
          aria-label="Look up book by ISBN"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleLookup}
          disabled={isLoading || !isbn.trim()}
          aria-label="Search ISBN"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
