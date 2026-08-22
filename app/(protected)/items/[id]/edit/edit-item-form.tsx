// src/app/(protected)/items/[id]/edit/edit-item-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
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
  description: z.string().nullable().optional(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  status: z.enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"]),
  author: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  isbn: z.string().nullable().optional(),
  coverImage: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  metadata: z
    .object({
      brand: z.string().nullable().optional(),
      size: z.string().nullable().optional(),
      material: z.string().nullable().optional(),
      condition: z.string().nullable().optional(),
      ageRange: z.string().nullable().optional(),
      genre: z.string().nullable().optional(),
      platform: z.string().nullable().optional(),
      artist: z.string().nullable().optional(),
      director: z.string().nullable().optional(),
      duration: z.string().nullable().optional(),
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
  const { t } = useI18n();
  // tc (Common) merged — use t("Common.key")

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
        toast.success(t("Items.itemUpdated"));
      },
      onError: () => {
        toast.error(t("Common.error"));
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
              <FormLabel>{t("Items.titleLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Items.titlePlaceholder")} {...field} />
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
                <FormLabel>{t("Items.type")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Items.selectType")} />
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
                <FormLabel>{t("Items.status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Items.selectStatus")} />
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
              <FormLabel>{t("Items.description")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("Items.descriptionPlaceholder")} {...field} value={field.value ?? ""} />
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
                <FormLabel>{t("Items.coverImage")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Items.coverImagePlaceholder")} {...field} value={field.value ?? ""} />
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
              {t(`types.${watchedType}`)} {t("Items.details")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {["TOY", "CLOTHES"].includes(watchedType) && (
                <>
                  <FormField control={form.control} name="metadata.brand" render={({ field }) => (
                    <FormItem><FormLabel>{t("Items.brand")}</FormLabel><FormControl><Input placeholder={t("Items.brandPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.material" render={({ field }) => (
                    <FormItem><FormLabel>{t("Items.material")}</FormLabel><FormControl><Input placeholder={t("Items.materialPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.condition" render={({ field }) => (
                    <FormItem><FormLabel>{t("Items.condition")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t("Items.selectCondition")} /></SelectTrigger></FormControl>
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
                  <FormItem><FormLabel>{t("Items.ageRange")}</FormLabel><FormControl><Input placeholder={t("Items.ageRangePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {watchedType === "CLOTHES" && (
                <FormField control={form.control} name="metadata.size" render={({ field }) => (
                  <FormItem><FormLabel>{t("Items.size")}</FormLabel><FormControl><Input placeholder={t("Items.sizePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              {["MUSIC", "MOVIE"].includes(watchedType) && (
                <>
                  <FormField control={form.control} name="metadata.genre" render={({ field }) => (
                    <FormItem><FormLabel>{t("Items.genre")}</FormLabel><FormControl><Input placeholder={t("Items.genrePlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="metadata.duration" render={({ field }) => (
                    <FormItem><FormLabel>{t("Items.duration")}</FormLabel><FormControl><Input placeholder={t("Items.durationPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
              {watchedType === "GAME" && (
                <FormField control={form.control} name="metadata.platform" render={({ field }) => (
                  <FormItem><FormLabel>{t("Items.platform")}</FormLabel><FormControl><Input placeholder={t("Items.platformPlaceholder")} {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                )} />
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={updateItem.isPending}>
            {updateItem.isPending ? t("Items.saving") : t("Items.saveChanges")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={updateItem.isPending}>
            {t("Common.cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
