"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { useCreateItem } from "@/hooks/use-items";
import { apiClient } from "@/lib/api-client";

const ITEM_TYPES = ["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"] as const;
type ItemType = (typeof ITEM_TYPES)[number];

const CONDITION_VALUES = ["New", "Like New", "Good", "Fair", "Poor"] as const;

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

const USES_ISBN_LOOKUP: ItemType[] = ["BOOK"];

export default function NewItemPage() {
  const router = useRouter();
  const t = useTranslations("Items");
  const tc = useTranslations("Common");

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => apiClient<{ id: string; name: string }[]>("/api/collections"),
  });

  const createItem = useCreateItem();

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

  const watchedType = (useWatch({ control: form.control, name: "type" }) as ItemType) || "BOOK";

  function onSubmit(values: z.infer<typeof itemSchema>) {
    createItem.mutate(values, {
      onSuccess: () => {
        toast.success(t("itemCreated"));
        router.push("/dashboard");
      },
      onError: () => {
        toast.error(tc("error"));
      },
    });
  }

  function handleISBNFill(data: { title?: string; authors?: string[]; publisher?: string; coverImage?: string | null }) {
    if (data.title) { form.setValue("title", data.title); }
    if (data.authors?.length) { form.setValue("author", data.authors[0]); }
    if (data.publisher) { form.setValue("publisher", data.publisher); }
    if (data.coverImage) { form.setValue("coverImage", data.coverImage); }
  }

  const showISBNLike = watchedType !== "OTHER";
  const showMetadataFields = ["TOY", "CLOTHES", "GAME", "MUSIC", "MOVIE"].includes(watchedType);

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("addNew")}</h1>
        {USES_ISBN_LOOKUP.includes(watchedType) && <ISBNLookup onFill={handleISBNFill} />}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`creators.${watchedType}`)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(`creatorPlaceholders.${watchedType}`)} {...field} />
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
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionPlaceholder")}
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
                <FormLabel>{t("coverImage")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("coverImagePlaceholder")} {...field} />
                </FormControl>
                <FormDescription>{t("coverImageDescription")}</FormDescription>
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
                    <FormLabel>{t(`identifiers.${watchedType}`)}</FormLabel>
                    <FormControl>
                      <Input placeholder={t(`identifierPlaceholders.${watchedType}`)} {...field} />
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
                      <Input placeholder={t(`makerPlaceholders.${watchedType}`)} {...field} />
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
                    <FormField
                      control={form.control}
                      name="metadata.brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("brand")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("brandPlaceholder")} {...field} />
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
                          <FormLabel>{t("material")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("materialPlaceholder")} {...field} />
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
                          <FormLabel>{t("condition")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectCondition")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONDITION_VALUES.map((value) => (
                                <SelectItem key={value} value={value}>
                                  {t(`conditions.${value.replace(/ /g, "")}`)}
                                </SelectItem>
                              ))}
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
                        <FormLabel>{t("ageRange")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("ageRangePlaceholder")} {...field} />
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
                        <FormLabel>{t("size")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("sizePlaceholder")} {...field} />
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
                          <FormLabel>{t("genre")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("genrePlaceholder")} {...field} />
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
                          <FormLabel>{t("duration")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("durationPlaceholder")} {...field} />
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
                        <FormLabel>{t("artist")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("artistPlaceholder")} {...field} />
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
                        <FormLabel>{t("director")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("directorPlaceholder")} {...field} />
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
                        <FormLabel>{t("platform")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("platformPlaceholder")} {...field} />
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
                <FormLabel>{t("collection")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCollection")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">{t("noCollection")}</SelectItem>
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
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={createItem.isPending}>
              {createItem.isPending ? t("saving") : t("saveItem")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
