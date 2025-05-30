"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Expense, Category } from "@/lib/supabase"

interface DailyViewProps {
  expenses: Expense[]
  categories: Category[]
}

export function DailyView({ expenses, categories }: DailyViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const dailyExpenses = expenses.filter((expense) => expense.date === formatDate(selectedDate))

  const dailyTotal = dailyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily View</h1>
          <p className="text-gray-600">Track your daily expenses</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Total</CardTitle>
          <CardDescription>Total expenses for {selectedDate.toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">${dailyTotal.toFixed(2)}</div>
          <p className="text-sm text-gray-500">{dailyExpenses.length} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>All expenses for this day</CardDescription>
        </CardHeader>
        <CardContent>
          {dailyExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses recorded for this day</p>
          ) : (
            <div className="space-y-4">
              {dailyExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: expense.categories?.color || "#6B7280" }}
                    />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.categories?.name}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-lg">${Number(expense.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
