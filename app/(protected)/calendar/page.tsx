"use client";

import { format, isSameDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyLoans } from "@/hooks/use-loans";

export default function CalendarPage() {
  const t = useTranslations("Calendar");
  const { data: loans = [], isLoading } = useMyLoans();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const loansOnSelectedDate = loans.filter(
    (loan) => loan.dueAt && isSameDay(new Date(loan.dueAt), selectedDate || new Date()),
  );

  const dueDates = loans.filter((loan) => loan.dueAt).map((loan) => new Date(loan.dueAt!));

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("calendar")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow"
              modifiers={{
                due: dueDates,
              }}
              modifiersStyles={{
                due: { fontWeight: "bold", color: "red", textDecoration: "underline" },
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedDate ? format(selectedDate, "PPP") : t("selectDate")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loansOnSelectedDate.length > 0 ? (
                <ul className="space-y-4">
                  {loansOnSelectedDate.map((loan) => (
                    <li key={loan.id} className="border-b pb-2 last:border-0">
                      <p className="font-semibold">{loan.item?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("borrowedBy")} {loan.user?.name || t("unknownUser")}
                      </p>
                      <Badge variant="destructive" className="mt-1">
                        {t("due")}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{t("noLoansDue")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
