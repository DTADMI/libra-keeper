// src/app/(protected)/items/[id]/edit/edit-item-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateItem } from "@/hooks/use-items";

const ITEM_TYPES = ["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"] as const;
type ItemType = (typeof ITEM_TYPES)[number];

const STATUS_VALUES = ["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"] as const;

const CONDITION_VALUES = ["New", "Like New", "Good", "Fair", "Poor"] as const;

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

interface EditItemFormProps {
  item: Item
}

export function EditItemForm({ item }: EditItemFormProps) {
  const router = useRouter();
  const t = useTranslations("Items");
  const tc = useTranslations("Common");

  const updateItem = useUpdateItem(item.id);

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

  const watchedType = (useWatch({ control: form.control, name: "type" }) as ItemType) || "BOOK";

  function onSubmit(values: z.infer<typeof itemSchema>) {
    updateItem.mutate(values, {
      onSuccess: () => {
        toast.success(t("itemUpdated"));
      },
      onError: () => {
        toast.error(tc("error"));
      },
    });
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
              <FormLabel>{t("titleLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("titlePlaceholder")} {...field} />
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
                <FormLabel>{t("type")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ITEM_TYPES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`types.${value}`)}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`statuses.${value}`)}
                      </SelectItem>
                    ))}
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
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("descriptionPlaceholder")} {...field} value={field.value ?? ""} />
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
                <FormLabel>{t(`creators.${watchedType}`)}</FormLabel>
                <FormControl>
                  <Input placeholder={t(`creatorPlaceholders.${watchedType}`)} {...field} value={field.value ?? ""} />
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
                <FormLabel>{t("coverImage")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("coverImagePlaceholder")} {...field} value={field.value ?? ""} />
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
                  <FormLabel>{t(`identifiers.${watchedType}`)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(`identifierPlaceholders.${watchedType}`)} {...field} value={field.value ?? ""} />
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
                  <FormLabel>{t(`makers.${watchedType}`)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(`makerPlaceholders.${watchedType}`)} {...field} value={field.value ?? ""} />
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
              {t(`types.${watchedType}`)} {t("details")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {["TOY", "CLOTHES"].includes(watchedType) && (
                <>
                  <FormField control={form.control} name="metadata.brand" render={({ field }) => (
                    <FormItem><FormLabel>{t("brand")}</FormLabel><FormControl><Input placeholder={t("brandPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.material" render={({ field }) => (
                    <FormItem><FormLabel>{t("material")}</FormLabel><FormControl><Input placeholder={t("materialPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.condition" render={({ field }) => (
                    <FormItem><FormLabel>{t("condition")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t("selectCondition")} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {CONDITION_VALUES.map((value) => (
                            <SelectItem key={value} value={value}>
                              {t(`conditions.${value.replace(/ /g, "")}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage /></FormItem>
                  )} />
                </>
              )}
              {watchedType === "TOY" && (
                <FormField control={form.control} name="metadata.ageRange" render={({ field }) => (
                  <FormItem><FormLabel>{t("ageRange")}</FormLabel><FormControl><Input placeholder={t("ageRangePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {watchedType === "CLOTHES" && (
                <FormField control={form.control} name="metadata.size" render={({ field }) => (
                  <FormItem><FormLabel>{t("size")}</FormLabel><FormControl><Input placeholder={t("sizePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {["MUSIC", "MOVIE"].includes(watchedType) && (
                <>
                  <FormField control={form.control} name="metadata.genre" render={({ field }) => (
                    <FormItem><FormLabel>{t("genre")}</FormLabel><FormControl><Input placeholder={t("genrePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.duration" render={({ field }) => (
                    <FormItem><FormLabel>{t("duration")}</FormLabel><FormControl><Input placeholder={t("durationPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
              {watchedType === "GAME" && (
                <FormField control={form.control} name="metadata.platform" render={({ field }) => (
                  <FormItem><FormLabel>{t("platform")}</FormLabel><FormControl><Input placeholder={t("platformPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={updateItem.isPending}>
            {updateItem.isPending ? t("saving") : t("saveChanges")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateItem.isPending}>
            {tc("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
