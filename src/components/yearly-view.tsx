"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { Expense, Category } from "@/lib/supabase"

interface YearlyViewProps {
  expenses: Expense[]
  categories: Category[]
}

export function YearlyView({ expenses, categories }: YearlyViewProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const yearlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getFullYear() === selectedYear
  })

  const yearlyTotal = yearlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  // Monthly breakdown for the year
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = yearlyExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === i
    })
    const total = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
    return {
      month: new Date(selectedYear, i, 1).toLocaleDateString("en-US", { month: "short" }),
      amount: total,
    }
  })

  // Category totals for the year
  const categoryTotals = categories
    .map((category) => {
      const categoryExpenses = yearlyExpenses.filter((expense) => expense.category_id === category.id)
      const total = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
      return {
        name: category.name,
        amount: total,
        color: category.color,
        count: categoryExpenses.length,
      }
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const navigateYear = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedYear(selectedYear + 1)
    }
  }

  const averageMonthly = yearlyTotal / 12
  const highestMonth = monthlyData.reduce((max, month) => (month.amount > max.amount ? month : max), monthlyData[0])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yearly View</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your yearly expenses</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateYear("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">{selectedYear}</div>
          <Button variant="outline" size="icon" onClick={() => navigateYear("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Total</CardTitle>
            <CardDescription>Total expenses for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">₹{yearlyTotal.toFixed(2)}</div>
            <p className="text-sm text-gray-500">{yearlyExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Average</CardTitle>
            <CardDescription>Average spending per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{averageMonthly.toFixed(2)}</div>
            <p className="text-sm text-gray-500">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Month</CardTitle>
            <CardDescription>Month with most spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestMonth?.month || "N/A"}</div>
            <p className="text-sm text-gray-500">₹{highestMonth?.amount.toFixed(2) || "0.00"}</p>
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
                <div className="text-xl font-bold">{categoryTotals[0].name}</div>
                <p className="text-sm text-gray-500">₹{categoryTotals[0].amount.toFixed(2)}</p>
              </>
            ) : (
              <p className="text-gray-500">No expenses this year</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Expenses by month in {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Top spending categories for {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryTotals.slice(0, 6)} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
          <CardDescription>Detailed breakdown by category for {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTotals.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-lg">₹{category.amount.toFixed(2)}</span>
                  <p className="text-sm text-gray-500">
                    {((category.amount / yearlyTotal) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
