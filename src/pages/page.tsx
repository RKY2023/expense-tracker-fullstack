"use client"

import { useState, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
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
import { supabase, type Expense, type Category } from "@/lib/supabase"

export default function ExpenseTracker() {
  const [activeView, setActiveView] = useState("dashboard")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [expensesResult, categoriesResult] = await Promise.all([
        supabase
          .from("expenses")
          .select(`
            *,
            categories (
              id,
              name,
              color
            )
          `)
          .order("date", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ])

      if (expensesResult.data) setExpenses(expensesResult.data)
      if (categoriesResult.data) setCategories(categoriesResult.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseAdded = () => {
    fetchData()
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
      default:
        return <Dashboard expenses={expenses} categories={categories} />
    }
  }

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 overflow-auto">{renderView()}</main>
        </div>
      </ThemeProvider>
    </Provider>
  )
}
