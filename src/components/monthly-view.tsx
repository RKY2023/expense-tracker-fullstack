"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Expense, Category } from "@/lib/supabase"

interface MonthlyViewProps {
  expenses: Expense[]
  categories: Category[]
}

export function MonthlyView({ expenses, categories }: MonthlyViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === selectedDate.getMonth() && expenseDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  // Group expenses by category
  const categoryTotals = categories
    .map((category) => {
      const categoryExpenses = monthlyExpenses.filter((expense) => expense.category_id === category.id)
      const total = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      return {
        name: category.name,
        amount: total,
        color: category.color,
        count: categoryExpenses.length,
      }
    })
    .filter((item) => item.amount > 0)

  // Group expenses by day for daily breakdown
  const dailyBreakdown = Array.from(
    { length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() },
    (_, i) => {
      const day = i + 1
      const dayExpenses = monthlyExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getDate() === day
      })
      const total = dayExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      return {
        day: day.toString(),
        amount: total,
      }
    },
  )

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly View</h1>
          <p className="text-gray-600">Track your monthly expenses</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">
            {selectedDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Total</CardTitle>
            <CardDescription>Total expenses this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${monthlyTotal.toFixed(2)}</div>
            <p className="text-sm text-gray-500">{monthlyExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Average</CardTitle>
            <CardDescription>Average spending per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${(monthlyTotal / new Date().getDate()).toFixed(2)}</div>
            <p className="text-sm text-gray-500">Based on current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Category</CardTitle>
            <CardDescription>Highest spending category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryTotals.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{categoryTotals[0].name}</div>
                <p className="text-sm text-gray-500">${categoryTotals[0].amount.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-gray-500">No expenses this month</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
            <CardDescription>Expenses by day of the month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expenses by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.count} transactions</p>
                    </div>
                  </div>
                  <span className="font-semibold">${category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
