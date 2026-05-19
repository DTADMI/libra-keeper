// src/app/(protected)/suggestions/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/hooks/use-session";
import { useCreateSuggestion, useSuggestions } from "@/hooks/use-suggestions";

const suggestionSchema = z.object({
  type: z.enum(["SUGGESTION", "BORROWED_ITEM"]),
  title: z.string().min(1),
  author: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function SuggestionsPage() {
  const t = useTranslations("Suggestions");
  const tc = useTranslations("Common");
  const { data: session } = useSession();
  const { data: requests = [], isLoading: listLoading, error: listError } = useSuggestions();
  const createSuggestion = useCreateSuggestion();

  const form = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      type: "SUGGESTION",
      title: "",
      author: "",
      isbn: "",
      description: "",
    },
  });

  function handleSubmit(values: SuggestionFormData) {
    createSuggestion.mutate(
      {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        type: values.type,
        author: values.author?.trim() || undefined,
        isbn: values.isbn?.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("submitted"));
          form.reset();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : t("submitFailed")
          );
        },
      },
    );
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isAdmin ? t("manageTitle") : t("submitTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdmin && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("type")}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v as SuggestionFormData["type"])}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SUGGESTION">{t("types.SUGGESTION")}</SelectItem>
                          <SelectItem value="BORROWED_ITEM">{t("types.BORROWED_ITEM")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("titleField")}</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("authorField")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("isbnField")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("descriptionField")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createSuggestion.isPending}>
                  {createSuggestion.isPending ? t("submitting") : t("submitButton")}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {listLoading && <p className="text-muted-foreground">{tc("loading")}</p>}
      {listError && <p className="text-destructive">{t("loadingFailed")}</p>}

      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{req.title}</h3>
                  {req.author && <p className="text-sm text-muted-foreground">by {req.author}</p>}
                  {req.description && <p className="text-sm mt-1">{req.description}</p>}
                </div>
                <Badge className={statusColors[req.status] ?? ""}>
                  {t(`statuses.${req.status as keyof typeof statusColors}`)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {!listLoading && requests.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t("noSuggestions")}</p>
        )}
      </div>
    </div>
  );
}
