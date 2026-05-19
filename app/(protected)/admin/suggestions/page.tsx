// src/app/(protected)/admin/suggestions/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSuggestions } from "@/hooks/use-suggestions";

type ItemRequestStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED";

export default function AdminSuggestionsPage() {
  const t = useTranslations("Admin");
  const { data: requests = [], isLoading } = useSuggestions();

  async function updateStatus(requestId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/suggestions/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(t("statusUpdated"));
      } else {
        toast.error(t("statusFailed"));
      }
    } catch {
      toast.error(t("statusFailed"));
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("suggestions")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("suggestions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("user")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("submitted")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{req.title}</p>
                      {req.author && <p className="text-xs text-muted-foreground">{req.author}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(req as { requestedBy?: { name?: string | null; email?: string } }).requestedBy?.name ||
                     (req as { requestedBy?: { name?: string | null; email?: string } }).requestedBy?.email ||
                     t("nA")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {req.type === "SUGGESTION" ? t("suggestion") : t("borrowed")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={req.status}
                      onValueChange={(value) => updateStatus(req.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">{t("pending")}</SelectItem>
                        <SelectItem value="PROCESSING">{t("processing")}</SelectItem>
                        <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
                        <SelectItem value="REJECTED">{t("rejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {t("noRequests")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
