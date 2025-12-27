// src/app/(protected)/admin/suggestions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ItemRequest = {
  id: string;
  title: string;
  author: string | null;
  type: "BORROWED_ITEM" | "SUGGESTION";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED";
  createdAt: string;
  requestedBy: {
    name: string | null;
    email: string;
  };
};

export default function AdminSuggestionsPage() {
  const [requests, setRequests] = useState<ItemRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, []);

  async function fetchRequests() {
    try {
      const response = await fetch("/api/suggestions")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch requests", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(requestId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/suggestions/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests(
          requests.map((r) => (r.id === requestId ? { ...r, status: newStatus as any } : r)),
        )
        toast.success("Status updated")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading requests...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Suggestions & Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{req.title}</p>
                      <p className="text-xs text-muted-foreground">{req.author}</p>
                    </div>
                  </TableCell>
                  <TableCell>{req.requestedBy.name || req.requestedBy.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {req.type === "SUGGESTION" ? "Suggestion" : "Borrowed"}
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
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No requests found.
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
