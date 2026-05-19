"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { apiClient } from "@/lib/api-client";

const profileSchema = z.object({
  name: z.string().min(1, "Required"),
  image: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { data: session, update } = useSession();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", image: "" },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        image: session.user.image || "",
      });
    }
  }, [session, form]);

  const updateProfile = useMutation({
    mutationFn: (data: ProfileFormData) =>
      apiClient("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: async (_, variables) => {
      await update({ name: variables.name, image: variables.image });
      toast.success(t("updated"));
    },
    onError: () => {
      toast.error(t("updateFailed"));
    },
  });

  function onSubmit(data: ProfileFormData) {
    updateProfile.mutate(data);
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("yourInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" value={session?.user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground">{t("emailDisabled")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Your name"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">{t("profileImage")}</Label>
              <Input
                id="image"
                {...form.register("image")}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? t("updating") : t("updateButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
