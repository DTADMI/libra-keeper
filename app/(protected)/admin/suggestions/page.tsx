// src/app/(protected)/admin/suggestions/page.tsx
"use client";

import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSuggestions } from "@/hooks/use-suggestions";

type ItemRequestStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED";

export default function AdminSuggestionsPage() {
  const { t } = useI18n();
  const { data: requests = [], isLoading } = useSuggestions();

  async function updateStatus(requestId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/suggestions/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(t("Admin.statusUpdated"));
      } else {
        toast.error(t("Admin.statusFailed"));
      }
    } catch {
      toast.error(t("Admin.statusFailed"));
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">{t("Admin.loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("Admin.suggestions")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("Admin.suggestions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Admin.title")}</TableHead>
                <TableHead>{t("Admin.user")}</TableHead>
                <TableHead>{t("Admin.type")}</TableHead>
                <TableHead>{t("Admin.status")}</TableHead>
                <TableHead>{t("Admin.submitted")}</TableHead>
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
                     t("Admin.nA")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {req.type === "SUGGESTION" ? t("Admin.suggestion") : t("Admin.borrowed")}
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
                        <SelectItem value="PENDING">{t("Admin.pending")}</SelectItem>
                        <SelectItem value="PROCESSING">{t("Admin.processing")}</SelectItem>
                        <SelectItem value="COMPLETED">{t("Admin.completed")}</SelectItem>
                        <SelectItem value="REJECTED">{t("Admin.rejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {t("Admin.noRequests")}
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
