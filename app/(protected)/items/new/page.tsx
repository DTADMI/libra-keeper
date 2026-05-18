"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ISBNLookup } from "@/components/isbn-lookup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  coverImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  author: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  collectionId: z.string().optional().or(z.literal("")),
  metadata: z
    .object({
      brand: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
      condition: z.string().optional(),
      ageRange: z.string().optional(),
      genre: z.string().optional(),
      platform: z.string().optional(),
      artist: z.string().optional(),
      director: z.string().optional(),
      duration: z.string().optional(),
    })
    .optional(),
});

type ItemType = z.infer<typeof itemSchema>["type"]

const TYPE_LABELS: Record<ItemType, string> = {
  BOOK: "Book",
  MUSIC: "Music",
  MOVIE: "Movie",
  GAME: "Game",
  TOY: "Toy",
  CLOTHES: "Clothing",
  OTHER: "Other",
};

const CREATOR_LABELS: Record<ItemType, string> = {
  BOOK: "Author",
  MUSIC: "Artist",
  MOVIE: "Director",
  GAME: "Developer",
  TOY: "Brand",
  CLOTHES: "Brand",
  OTHER: "Creator",
};

const IDENTIFIER_LABELS: Record<ItemType, string> = {
  BOOK: "ISBN",
  MUSIC: "UPC",
  MOVIE: "UPC",
  GAME: "UPC",
  TOY: "Barcode / EAN",
  CLOTHES: "SKU / EAN",
  OTHER: "Identifier",
};

const MAKER_LABELS: Record<ItemType, string> = {
  BOOK: "Publisher",
  MUSIC: "Label",
  MOVIE: "Studio",
  GAME: "Publisher",
  TOY: "Manufacturer",
  CLOTHES: "Manufacturer",
  OTHER: "Maker",
};

const USES_ISBN_LOOKUP: ItemType[] = ["BOOK"];

export default function NewItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then(setCollections)
      .catch(() => {});
  }, []);

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
      metadata: {},
    },
  });

  const watchedType = useWatch({ control: form.control, name: "type" });

  async function onSubmit(values: z.infer<typeof itemSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {throw new Error("Failed to create item");}
      toast.success("Item created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  function handleISBNFill(data: { title?: string; authors?: string[]; publisher?: string; coverImage?: string | null }) {
    if (data.title) {form.setValue("title", data.title);}
    if (data.authors?.length) {form.setValue("author", data.authors[0]);}
    if (data.publisher) {form.setValue("publisher", data.publisher);}
    if (data.coverImage) {form.setValue("coverImage", data.coverImage);}
  }

  const showISBNLike = watchedType !== "OTHER";
  const showBookFields = watchedType === "BOOK";
  const showMetadataFields = ["TOY", "CLOTHES", "GAME", "MUSIC", "MOVIE"].includes(watchedType);

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Item</h1>
        {USES_ISBN_LOOKUP.includes(watchedType) && <ISBNLookup onFill={handleISBNFill} />}
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
                  <Input placeholder="Enter item name" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
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
                  <FormLabel>{CREATOR_LABELS[watchedType]}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${CREATOR_LABELS[watchedType].toLowerCase()}`} {...field} />
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
                    placeholder="Add a description..."
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
                <FormDescription>Link to a hosted image for the item.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {showISBNLike && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{IDENTIFIER_LABELS[watchedType]}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${IDENTIFIER_LABELS[watchedType].toLowerCase()}`} {...field} />
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
                    <FormLabel>{MAKER_LABELS[watchedType]}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${MAKER_LABELS[watchedType].toLowerCase()}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {showMetadataFields && (
            <div className="rounded-md border p-4 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {watchedType} Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {["TOY", "CLOTHES"].includes(watchedType) && (
                  <>
                    <FormField
                      control={form.control}
                      name="metadata.brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. LEGO, Nike" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metadata.material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Plastic, Cotton" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metadata.condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Like New">Like New</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Poor">Poor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {watchedType === "TOY" && (
                  <FormField
                    control={form.control}
                    name="metadata.ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 3-6 years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {watchedType === "CLOTHES" && (
                  <FormField
                    control={form.control}
                    name="metadata.size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. M, 42, 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {["MUSIC", "MOVIE"].includes(watchedType) && (
                  <>
                    <FormField
                      control={form.control}
                      name="metadata.genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Rock, Sci-Fi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metadata.duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 120 min" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {watchedType === "MUSIC" && (
                  <FormField
                    control={form.control}
                    name="metadata.artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. The Beatles" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {watchedType === "MOVIE" && (
                  <FormField
                    control={form.control}
                    name="metadata.director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Christopher Nolan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {watchedType === "GAME" && (
                  <FormField
                    control={form.control}
                    name="metadata.platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. PS5, PC, Board" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="collectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No Collection</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Item"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
