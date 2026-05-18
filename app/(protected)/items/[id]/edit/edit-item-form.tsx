// src/app/(protected)/items/[id]/edit/edit-item-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  status: z.enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"]),
  author: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  coverImage: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  metadata: z
    .object({
      brand: z.string().optional().nullable(),
      size: z.string().optional().nullable(),
      material: z.string().optional().nullable(),
      condition: z.string().optional().nullable(),
      ageRange: z.string().optional().nullable(),
      genre: z.string().optional().nullable(),
      platform: z.string().optional().nullable(),
      artist: z.string().optional().nullable(),
      director: z.string().optional().nullable(),
      duration: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type Item = z.infer<typeof itemSchema> & { id: string }

type ItemType = z.infer<typeof itemSchema>["type"]

const CREATOR_LABELS: Record<ItemType, string> = {
  BOOK: "Author", MUSIC: "Artist", MOVIE: "Director", GAME: "Developer",
  TOY: "Brand", CLOTHES: "Brand", OTHER: "Creator",
};

const IDENTIFIER_LABELS: Record<ItemType, string> = {
  BOOK: "ISBN", MUSIC: "UPC", MOVIE: "UPC", GAME: "UPC",
  TOY: "Barcode / EAN", CLOTHES: "SKU / EAN", OTHER: "Identifier",
};

const MAKER_LABELS: Record<ItemType, string> = {
  BOOK: "Publisher", MUSIC: "Label", MOVIE: "Studio", GAME: "Publisher",
  TOY: "Manufacturer", CLOTHES: "Manufacturer", OTHER: "Maker",
};

interface EditItemFormProps {
  item: Item
}

export function EditItemForm({ item }: EditItemFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const meta = (item as Record<string, unknown>).metadata as Record<string, unknown> | undefined;

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: item.title,
      description: item.description || "",
      type: item.type as ItemType,
      status: item.status as z.infer<typeof itemSchema>["status"],
      author: item.author || "",
      publisher: item.publisher || "",
      isbn: item.isbn || "",
      coverImage: item.coverImage || "",
      metadata: {
        brand: (meta?.brand as string) || "",
        size: (meta?.size as string) || "",
        material: (meta?.material as string) || "",
        condition: (meta?.condition as string) || "",
        ageRange: (meta?.ageRange as string) || "",
        genre: (meta?.genre as string) || "",
        platform: (meta?.platform as string) || "",
        artist: (meta?.artist as string) || "",
        director: (meta?.director as string) || "",
        duration: (meta?.duration as string) || "",
      },
    },
  });

  const watchedType = useWatch({ control: form.control, name: "type" }) as ItemType;

  async function onSubmit(values: z.infer<typeof itemSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {throw new Error("Failed to update item");}
      toast.success("Item updated successfully");
      router.push(`/items/${item.id}`);
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update item");
    } finally {
      setIsLoading(false);
    }
  }

  const showISBNLike = watchedType !== "OTHER";
  const showMetadataFields = ["TOY", "CLOTHES", "GAME", "MUSIC", "MOVIE"].includes(watchedType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Item title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
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
                    <SelectItem value="CLOTHES">Clothing</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="BORROWED">Borrowed</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                    <SelectItem value="GIVEN_AWAY">Given Away</SelectItem>
                    <SelectItem value="LOST">Lost</SelectItem>
                  </SelectContent>
                </Select>
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
                <Textarea placeholder="Item description" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{CREATOR_LABELS[watchedType]}</FormLabel>
                <FormControl>
                  <Input placeholder={CREATOR_LABELS[watchedType]} {...field} value={field.value ?? ""} />
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
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {showISBNLike && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{IDENTIFIER_LABELS[watchedType]}</FormLabel>
                  <FormControl>
                    <Input placeholder={IDENTIFIER_LABELS[watchedType]} {...field} value={field.value ?? ""} />
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
                    <Input placeholder={MAKER_LABELS[watchedType]} {...field} value={field.value ?? ""} />
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
                  <FormField control={form.control} name="metadata.brand" render={({ field }) => (
                    <FormItem><FormLabel>Brand</FormLabel><FormControl><Input placeholder="Brand" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.material" render={({ field }) => (
                    <FormItem><FormLabel>Material</FormLabel><FormControl><Input placeholder="Material" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.condition" render={({ field }) => (
                    <FormItem><FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage /></FormItem>
                  )} />
                </>
              )}
              {watchedType === "TOY" && (
                <FormField control={form.control} name="metadata.ageRange" render={({ field }) => (
                  <FormItem><FormLabel>Age Range</FormLabel><FormControl><Input placeholder="e.g. 3-6 years" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {watchedType === "CLOTHES" && (
                <FormField control={form.control} name="metadata.size" render={({ field }) => (
                  <FormItem><FormLabel>Size</FormLabel><FormControl><Input placeholder="e.g. M, 42" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {["MUSIC", "MOVIE"].includes(watchedType) && (
                <>
                  <FormField control={form.control} name="metadata.genre" render={({ field }) => (
                    <FormItem><FormLabel>Genre</FormLabel><FormControl><Input placeholder="Genre" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.duration" render={({ field }) => (
                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 120 min" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
              {watchedType === "GAME" && (
                <FormField control={form.control} name="metadata.platform" render={({ field }) => (
                  <FormItem><FormLabel>Platform</FormLabel><FormControl><Input placeholder="e.g. PS5, PC" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
