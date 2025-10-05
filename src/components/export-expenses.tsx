"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useExportExpensesExcelMutation, useExportExpensesCsvMutation } from "@/store/locationApi"
import { FileDown, FileSpreadsheet, FileText, Download } from "lucide-react"

export function ExportExpenses() {
  const [exportExcel, { isLoading: isLoadingExcel }] = useExportExpensesExcelMutation()
  const [exportCsv, { isLoading: isLoadingCsv }] = useExportExpensesCsvMutation()

  const handleExportExcel = async () => {
    try {
      const result = await exportExcel().unwrap()

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = url
      link.download = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export Excel failed:", err)
    }
  }

  const handleExportCsv = async () => {
    try {
      const result = await exportCsv().unwrap()

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = url
      link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export CSV failed:", err)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Export Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Download your expense data in Excel or CSV format</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Export Excel Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Export as Excel
              </CardTitle>
              <CardDescription>Download expenses in Excel format (.xlsx)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perfect for detailed analysis and data manipulation in Microsoft Excel or Google Sheets.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 list-disc list-inside">
                  <li>Formatted spreadsheet with headers</li>
                  <li>All expense fields included</li>
                  <li>Compatible with Excel, Google Sheets, and more</li>
                </ul>
              </div>
              <Button
                onClick={handleExportExcel}
                disabled={isLoadingExcel}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoadingExcel ? "Exporting..." : "Download Excel"}
              </Button>
            </CardContent>
          </Card>

          {/* Export CSV Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Export as CSV
              </CardTitle>
              <CardDescription>Download expenses in CSV format (.csv)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lightweight format compatible with most applications and programming tools.
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1 list-disc list-inside">
                  <li>Comma-separated values format</li>
                  <li>All expense fields included</li>
                  <li>Universal compatibility</li>
                </ul>
              </div>
              <Button
                onClick={handleExportCsv}
                disabled={isLoadingCsv}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoadingCsv ? "Exporting..." : "Download CSV"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Export Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>Exports include all your expense records from the database</li>
              <li>Files are named with the current date for easy organization</li>
              <li>Excel format (.xlsx) is recommended for advanced features like formulas and charts</li>
              <li>CSV format is ideal for importing into other applications or databases</li>
              <li>Your data remains private and is downloaded directly to your device</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
