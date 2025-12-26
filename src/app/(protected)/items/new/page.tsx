"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { BarcodeScanner } from "@/components/items/barcode-scanner"

const itemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "OTHER"]),
    coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    author: z.string().optional(),
    publisher: z.string().optional(),
    isbn: z.string().optional(),
  collectionId: z.string().optional().or(z.literal("")),
})

export default function NewItemPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
  const [collections, setCollections] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch("/api/collections")
      if (response.ok) {
        const data = await response.json()
        setCollections(data)
      }
    }
    fetchCollections()
  }, [])

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "BOOK",
            coverImage: "",
            author: "",
            publisher: "",
            isbn: "",
          collectionId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof itemSchema>) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Failed to create item")
            }

            toast.success("Item created successfully")
            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

  async function handleScan(isbn: string) {
    form.setValue("isbn", isbn)
    toast.info(`Scanned ISBN: ${isbn}. Fetching details...`)

    try {
      // Try Open Library API first
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
      const data = await response.json()
      const bookKey = `ISBN:${isbn}`

      if (data[bookKey]) {
        const bookData = data[bookKey]
        form.setValue("title", bookData.title || "")
        form.setValue("author", bookData.authors?.[0]?.name || "")
        form.setValue("publisher", bookData.publishers?.[0]?.name || "")
        if (bookData.cover?.large) {
          form.setValue("coverImage", bookData.cover.large)
        }
        toast.success("Details fetched successfully")
      } else {
        toast.error("Book details not found, but ISBN was captured")
      }
    } catch (error) {
      console.error("Error fetching book details:", error)
      toast.error("Failed to fetch book details")
    }
  }

    return (
        <div className="container mx-auto max-w-2xl py-10">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Add New Item</h1>
            <BarcodeScanner onScan={handleScan} />
          </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="The Great Gatsby" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BOOK">Book</SelectItem>
                                            <SelectItem value="MUSIC">Music</SelectItem>
                                            <SelectItem value="MOVIE">Movie</SelectItem>
                                            <SelectItem value="GAME">Game</SelectItem>
                                            <SelectItem value="TOY">Toy</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input placeholder="F. Scott Fitzgerald" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Add a description of the item..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Link to a hosted image for the item cover.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="isbn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ISBN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="978-0743273565" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="publisher"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Publisher</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Scribner" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                      <FormField
                        control={form.control}
                        name="collectionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collection</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a collection" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">No Collection</SelectItem>
                                {collections.map((collection) => (
                                  <SelectItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Item"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
