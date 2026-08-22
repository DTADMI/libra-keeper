// src/app/(protected)/admin/users/page.tsx
"use client";

import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminUsers, useChangeUserRole } from "@/hooks/use-admin";

type UserRole = "ADMIN" | "USER";

export default function UsersPage() {
  const { t } = useI18n();
  const { data: users = [], isLoading } = useAdminUsers();
  const changeRole = useChangeUserRole();

  function updateRole(userId: string, newRole: UserRole) {
    changeRole.mutate(
      { userId, role: newRole },
      {
        onSuccess: () => toast.success(t("Admin.roleChanged")),
        onError: () => toast.error(t("Admin.roleFailed")),
      },
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center">{t("Admin.loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("Admin.users")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("Admin.allUsers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Admin.name")}</TableHead>
                <TableHead>{t("Admin.email")}</TableHead>
                <TableHead>{t("Admin.role")}</TableHead>
                <TableHead>{t("Admin.joined")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || t("Admin.nA")}</TableCell>
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
                        <SelectItem value="USER">{t("Admin.userRole")}</SelectItem>
                        <SelectItem value="ADMIN">{t("Admin.adminRole")}</SelectItem>
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
