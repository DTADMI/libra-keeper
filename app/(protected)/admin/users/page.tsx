// src/app/(protected)/admin/users/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminUsers, useChangeUserRole } from "@/hooks/use-admin";

type UserRole = "ADMIN" | "USER";

export default function UsersPage() {
  const t = useTranslations("Admin");
  const { data: users = [], isLoading } = useAdminUsers();
  const changeRole = useChangeUserRole();

  function updateRole(userId: string, newRole: UserRole) {
    changeRole.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => toast.success(t("roleChanged")),
        onError: () => toast.error(t("roleFailed")),
      },
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("users")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("allUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead>{t("joined")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || t("nA")}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value: UserRole) => updateRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">{t("userRole")}</SelectItem>
                        <SelectItem value="ADMIN">{t("adminRole")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
