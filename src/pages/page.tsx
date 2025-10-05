"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { DailyView } from "@/components/daily-view"
import { MonthlyView } from "@/components/monthly-view"
import { YearlyView } from "@/components/yearly-view"
import { CSVUpload } from "@/components/csv-upload"
import { AddExpenseForm } from "@/components/add-expense-form"
import { LocationView } from "@/components/location-view"
import { BankStatementUpload } from "@/components/bank-statement-upload"
import { ExportExpenses } from "@/components/export-expenses"
import { TokenRefresh } from "@/components/token-refresh"
import { useGetCategoriesQuery, useGetExpensesQuery } from "@/store/locationApi"
import type { Expense, Category } from "@/lib/supabase"

export default function ExpenseTracker() {
  const [activeView, setActiveView] = useState("dashboard")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: expensesData, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useGetExpensesQuery()

  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data)
    }
  }, [categoriesData])

  useEffect(() => {
    if (expensesData?.results) {
      setExpenses(expensesData.results)
    }
    setLoading(isLoadingExpenses)
  }, [expensesData, isLoadingExpenses])

  const handleExpenseAdded = () => {
    refetchExpenses()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard expenses={expenses} categories={categories} />
      case "daily":
        return <DailyView expenses={expenses} categories={categories} />
      case "monthly":
        return <MonthlyView expenses={expenses} categories={categories} />
      case "yearly":
        return <YearlyView expenses={expenses} categories={categories} />
      case "upload":
        return <CSVUpload onUploadComplete={handleExpenseAdded} categories={categories} />
      case "add":
        return <AddExpenseForm categories={categories} onExpenseAdded={handleExpenseAdded} />
      case "location":
        return <LocationView />
      case "bank-statement":
        return <BankStatementUpload />
      case "export-excel":
        return <ExportExpenses />
      default:
        return <Dashboard expenses={expenses} categories={categories} />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TokenRefresh />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto">{renderView()}</main>
      </div>
    </ThemeProvider>
  )
}
